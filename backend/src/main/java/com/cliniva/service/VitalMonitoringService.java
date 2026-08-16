package com.cliniva.service;

import com.cliniva.dto.VitalSignsDto;
import com.cliniva.entity.VitalRecord;
import com.cliniva.repository.VitalRecordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Cliniva Platform — VitalMonitoringService
 *
 * ═══════════════════════════════════════════════════════════════
 *  HOW TELEMETRY WORKS IN A REAL HOSPITAL
 * ═══════════════════════════════════════════════════════════════
 *  1. Bedside patient monitors (Philips IntelliVue, GE CARESCAPE)
 *     measure vitals every 1–5 seconds.
 *
 *  2. Each monitor sends readings via HL7 v2 messages (MLLP protocol)
 *     or proprietary REST/MQTT APIs to a Clinical Data Gateway.
 *
 *  3. The gateway normalises readings and calls our ingest endpoint:
 *       POST /api/v1/telemetry/vitals/{patientId}/ingest
 *     which stores a VitalRecord in the database.
 *
 *  4. The @Scheduled broadcastLatestVitals() method runs every 2 seconds,
 *     picks up the newest VitalRecord for each monitored patient, and
 *     pushes it to all connected SSE clients (dashboard browsers).
 *
 *  5. When no real devices are connected, the SimulationEngine generates
 *     realistic drifting values — identical flow, just a different data source.
 * ═══════════════════════════════════════════════════════════════
 */
@Service
public class VitalMonitoringService {

    private final VitalRecordRepository vitalRecordRepository;

    // patientId → list of connected SSE emitters (multiple browser tabs)
    private final Map<String, List<SseEmitter>> activeEmitters = new ConcurrentHashMap<>();

    // In-memory simulation state per patient (used when no real device data exists)
    private final Map<String, SimState> simStates = new ConcurrentHashMap<>();

    public VitalMonitoringService(VitalRecordRepository vitalRecordRepository) {
        this.vitalRecordRepository = vitalRecordRepository;
    }

    // ── SSE Subscription Management ──────────────────────────

    /**
     * Registers a new SSE emitter for a patient stream.
     * Called when a dashboard browser tab opens the stream endpoint.
     */
    public SseEmitter subscribe(String patientId) {
        SseEmitter emitter = new SseEmitter(0L); // 0 = no timeout

        activeEmitters.computeIfAbsent(patientId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> removeEmitter(patientId, emitter));
        emitter.onTimeout(()    -> removeEmitter(patientId, emitter));
        emitter.onError(e      -> removeEmitter(patientId, emitter));

        // Send an immediate reading so the client doesn't wait 2s for first data
        try {
            VitalSignsDto snapshot = buildSnapshot(patientId);
            emitter.send(SseEmitter.event().name("vitals").data(snapshot));
        } catch (IOException ignored) {}

        return emitter;
    }

    private void removeEmitter(String patientId, SseEmitter emitter) {
        List<SseEmitter> list = activeEmitters.get(patientId);
        if (list != null) list.remove(emitter);
    }

    // ── Scheduled Broadcast ───────────────────────────────────

    /**
     * Runs every 2 seconds.
     * For every patient with at least one active SSE subscriber:
     *   1. Tries to fetch the latest VitalRecord from the database (real device data).
     *   2. Falls back to the SimulationEngine if no DB record exists.
     *   3. Broadcasts the VitalSignsDto to all connected emitters.
     */
    @Scheduled(fixedRate = 2000)
    public void broadcastLatestVitals() {
        if (activeEmitters.isEmpty()) return;

        activeEmitters.forEach((patientId, emitters) -> {
            if (emitters.isEmpty()) return;

            VitalSignsDto dto = buildSnapshot(patientId);

            List<SseEmitter> dead = new ArrayList<>();
            for (SseEmitter emitter : emitters) {
                try {
                    emitter.send(SseEmitter.event().name("vitals").data(dto));
                } catch (IOException e) {
                    dead.add(emitter);
                }
            }
            emitters.removeAll(dead);
        });
    }

    // ── Telemetry Ingest (called by real devices) ─────────────

    /**
     * Stores a vital record submitted by a real bedside monitor.
     * In production this is called by the Clinical Data Gateway after normalising HL7 messages.
     */
    public VitalRecord ingestReading(String patientId, int heartRateBpm, int spo2Percent,
                                     double bodyTempCelsius, double gForce, String deviceSource) {
        VitalRecord record = new VitalRecord();
        record.setPatientId(patientId);
        record.setHeartRateBpm(heartRateBpm);
        record.setSpo2Percent(spo2Percent);
        record.setBodyTempCelsius(Math.round(bodyTempCelsius * 10.0) / 10.0);
        record.setGForceReading(Math.round(gForce * 100.0) / 100.0);
        record.setRecordedAt(Instant.now());
        record.setDeviceSource(deviceSource);
        return vitalRecordRepository.save(record);
    }

    /** Returns latest VitalSignsDto — from DB if available, sim otherwise */
    public VitalSignsDto buildSnapshot(String patientId) {
        Optional<VitalRecord> latestOpt = vitalRecordRepository
                .findTopByPatientIdOrderByRecordedAtDesc(patientId);

        if (latestOpt.isPresent()) {
            // Real device data path
            List<VitalRecord> history = vitalRecordRepository.findRecentByPatientId(patientId, 14);
            List<Integer> heartHistory = history.stream().map(VitalRecord::getHeartRateBpm).toList();
            List<Double> tempHistory   = history.stream().map(VitalRecord::getBodyTempCelsius).toList();
            return VitalSignsDto.from(latestOpt.get(), heartHistory, tempHistory);
        }

        // Simulation path — no real device connected
        return buildSimulatedSnapshot(patientId);
    }

    // ── Simulation Engine ─────────────────────────────────────

    /** Generates realistic drifting vitals when no physical device is connected */
    private VitalSignsDto buildSimulatedSnapshot(String patientId) {
        SimState state = simStates.computeIfAbsent(patientId, id -> new SimState());
        state.drift();

        VitalSignsDto dto = new VitalSignsDto();
        dto.setPatientId(patientId);
        dto.setHeartRate(state.heartRate);
        dto.setBloodOxygen(state.spo2);
        dto.setTemperature(Math.round(state.temp * 10.0) / 10.0);
        dto.setGForce(Math.round(state.gForce * 100.0) / 100.0);
        dto.setRecordedAt(Instant.now());
        dto.setDeviceSource("SIM-ENGINE");
        dto.setHeartData(new ArrayList<>(state.heartHistory));
        dto.setTempData(new ArrayList<>(state.tempHistory));
        return dto;
    }

    /** Per-patient simulation state with realistic drift */
    private static class SimState {
        private static final Random RNG = new Random();

        int heartRate    = 70 + RNG.nextInt(20);
        int spo2         = 96 + RNG.nextInt(4);
        double temp      = 36.5 + RNG.nextDouble() * 1.0;
        double gForce    = 1.5 + RNG.nextDouble() * 1.5;

        final Deque<Integer> heartHistory = new ArrayDeque<>(14);
        final Deque<Double>  tempHistory  = new ArrayDeque<>(10);

        SimState() {
            for (int i = 0; i < 14; i++) heartHistory.add(heartRate + RNG.nextInt(10) - 5);
            for (int i = 0; i < 10; i++) tempHistory.add(temp + (RNG.nextDouble() - 0.5) * 0.4);
        }

        void drift() {
            heartRate = clamp(heartRate + RNG.nextInt(7) - 3, 48, 130);
            spo2      = clamp(spo2 + (RNG.nextInt(3) - 1), 90, 100);
            temp      = clamp(temp + (RNG.nextDouble() - 0.5) * 0.15, 35.5, 39.5);
            gForce    = clamp(gForce + (RNG.nextDouble() - 0.5) * 0.4, 0.3, 6.0);

            if (heartHistory.size() >= 14) heartHistory.pollFirst();
            heartHistory.addLast(heartRate);

            if (tempHistory.size() >= 10) tempHistory.pollFirst();
            tempHistory.addLast(Math.round(temp * 10.0) / 10.0);
        }

        int    clamp(int v, int lo, int hi)       { return Math.max(lo, Math.min(hi, v)); }
        double clamp(double v, double lo, double hi) { return Math.max(lo, Math.min(hi, v)); }
    }
}
