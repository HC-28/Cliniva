package com.cliniva.controller;

import com.cliniva.dto.VitalSignsDto;
import com.cliniva.entity.VitalRecord;
import com.cliniva.service.VitalMonitoringService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

/**
 * Cliniva Platform — VitalMonitoringController
 *
 * Provides both a polling snapshot and a real-time SSE push stream
 * for patient vital signs. Designed to be compatible with any HL7-capable
 * bedside monitoring device via the /ingest endpoint.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 *  ENDPOINT REFERENCE
 *  Base: /api/v1/telemetry
 *
 *  GET  /vitals/{patientId}/latest    → Latest snapshot (for REST polling)
 *  GET  /vitals/{patientId}/stream    → SSE push stream (text/event-stream)
 *  POST /vitals/{patientId}/ingest    → Device data ingestion endpoint
 *
 *  SSE Event Format:
 *    event: vitals
 *    data: { "patientId": "CLV-00421", "heartRate": 78, "bloodOxygen": 98,
 *            "temperature": 37.1, "gForce": 1.9, "heartData": [...],
 *            "tempData": [...], "recordedAt": "...", "deviceSource": "..." }
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * HOW TELEMETRY REACHES THIS SERVICE:
 * ─────────────────────────────────────────────────────────────────────
 *  Real hospital flow:
 *    Bedside Monitor (Philips IntelliVue / GE CARESCAPE)
 *      → HL7 v2 MLLP messages
 *      → Clinical Data Gateway (normalisation layer)
 *      → POST /api/v1/telemetry/vitals/{patientId}/ingest
 *      → VitalRecord saved to DB
 *      → @Scheduled broadcast picks it up every 2s
 *      → Pushed to all SSE subscribers
 *
 *  Simulation flow (no device connected):
 *    @Scheduled fires every 2s
 *      → VitalMonitoringService.SimulationEngine.drift()
 *      → Pushed to all SSE subscribers
 */
@RestController
@RequestMapping("/api/v1/telemetry")
public class VitalMonitoringController {

    private final VitalMonitoringService vitalMonitoringService;

    public VitalMonitoringController(VitalMonitoringService vitalMonitoringService) {
        this.vitalMonitoringService = vitalMonitoringService;
    }

    /**
     * GET /api/v1/telemetry/vitals/{patientId}/latest
     *
     * Single REST call returning the most recent vital signs snapshot.
     * Use this for initial page load or as a polling fallback.
     */
    @GetMapping("/vitals/{patientId}/latest")
    public ResponseEntity<VitalSignsDto> getLatestVitals(@PathVariable String patientId) {
        VitalSignsDto dto = vitalMonitoringService.buildSnapshot(patientId);
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/v1/telemetry/vitals/{patientId}/stream
     *
     * SSE (Server-Sent Events) push stream. The browser keeps this connection
     * open and receives a new "vitals" event every 2 seconds — no polling needed.
     *
     * Use in JavaScript:
     *   const es = new EventSource('/api/v1/telemetry/vitals/CLV-00421/stream');
     *   es.addEventListener('vitals', e => { const data = JSON.parse(e.data); ... });
     */
    @GetMapping(value = "/vitals/{patientId}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamVitals(@PathVariable String patientId) {
        return vitalMonitoringService.subscribe(patientId);
    }

    /**
     * POST /api/v1/telemetry/vitals/{patientId}/ingest
     *
     * Device ingestion endpoint — called by a Clinical Data Gateway or
     * IoT device adapter after normalising raw HL7/MQTT readings.
     *
     * Request body:
     * {
     *   "heartRateBpm": 82,
     *   "spo2Percent": 97,
     *   "bodyTempCelsius": 37.2,
     *   "gForceReading": 1.7,
     *   "deviceSource": "INTELLIVUE-A1"
     * }
     */
    @PostMapping("/vitals/{patientId}/ingest")
    public ResponseEntity<VitalRecord> ingestVitals(
            @PathVariable String patientId,
            @RequestBody Map<String, Object> payload) {

        int    heartRate    = ((Number) payload.getOrDefault("heartRateBpm",     75)).intValue();
        int    spo2         = ((Number) payload.getOrDefault("spo2Percent",      98)).intValue();
        double temp         = ((Number) payload.getOrDefault("bodyTempCelsius",  37.0)).doubleValue();
        double gForce       = ((Number) payload.getOrDefault("gForceReading",    1.8)).doubleValue();
        String deviceSource = (String)  payload.getOrDefault("deviceSource",     "UNKNOWN");

        VitalRecord saved = vitalMonitoringService.ingestReading(
                patientId, heartRate, spo2, temp, gForce, deviceSource);

        return ResponseEntity.ok(saved);
    }
}
