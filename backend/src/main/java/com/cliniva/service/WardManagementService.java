package com.cliniva.service;

import com.cliniva.dto.BedManagementRequest;
import com.cliniva.entity.BioPod;
import com.cliniva.repository.BioPodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Cliniva Platform — WardManagementService
 * Business logic for ward bed/pod lifecycle: occupancy, status transitions, ward queries.
 */
@Service
public class WardManagementService {

    private final BioPodRepository bioPodRepository;

    public WardManagementService(BioPodRepository bioPodRepository) {
        this.bioPodRepository = bioPodRepository;
    }

    public List<BioPod> getAllPods() {
        return bioPodRepository.findAllByOrderByPodCodeAsc();
    }

    public Optional<BioPod> getPodByCode(String podCode) {
        return bioPodRepository.findByPodCode(podCode);
    }

    public List<BioPod> getPodsByStatus(String status) {
        return bioPodRepository.findByPodStatus(status.toUpperCase());
    }

    public List<BioPod> getPodsByWard(String wardName) {
        return bioPodRepository.findByWardName(wardName);
    }

    public BioPod updatePodStatus(String podCode, String newStatus, String severity) {
        BioPod pod = bioPodRepository.findByPodCode(podCode)
                .orElseThrow(() -> new RuntimeException("Pod not found: " + podCode));
        pod.setPodStatus(newStatus.toUpperCase());
        pod.setClinicalSeverity(severity);
        return bioPodRepository.save(pod);
    }

    // ── BED MANAGEMENT OPERATIONS ────────────────────────────────

    /**
     * ADMIT: Assigns a patient to an empty pod.
     * Validates pod is EMPTY before admitting.
     */
    @Transactional
    public BioPod admitPatient(String podCode, BedManagementRequest req) {
        BioPod pod = bioPodRepository.findByPodCode(podCode)
                .orElseThrow(() -> new RuntimeException("Pod not found: " + podCode));

        if (!"EMPTY".equalsIgnoreCase(pod.getPodStatus())) {
            throw new IllegalStateException("Pod " + podCode + " is not available for admission (status: " + pod.getPodStatus() + ")");
        }

        pod.setPodStatus("OCCUPIED");
        pod.setPatientName(req.getPatientName());
        pod.setAttendingPhysician(req.getAttendingPhysician());
        pod.setWardName(req.getWardName() != null ? req.getWardName() : pod.getWardName());
        pod.setClinicalSeverity(req.getClinicalSeverity() != null ? req.getClinicalSeverity() : "stable");
        return bioPodRepository.save(pod);
    }

    /**
     * DISCHARGE: Clears a patient from their pod, marking it EMPTY.
     */
    @Transactional
    public BioPod dischargePatient(String podCode) {
        BioPod pod = bioPodRepository.findByPodCode(podCode)
                .orElseThrow(() -> new RuntimeException("Pod not found: " + podCode));

        if ("EMPTY".equalsIgnoreCase(pod.getPodStatus())) {
            throw new IllegalStateException("Pod " + podCode + " is already empty.");
        }

        pod.setPodStatus("EMPTY");
        pod.setPatientName(null);
        pod.setAttendingPhysician(null);
        pod.setClinicalSeverity(null);
        return bioPodRepository.save(pod);
    }

    /**
     * TRANSFER: Moves a patient from one pod to another empty pod atomically.
     */
    @Transactional
    public BioPod transferPatient(String fromPodCode, String toPodCode) {
        BioPod fromPod = bioPodRepository.findByPodCode(fromPodCode)
                .orElseThrow(() -> new RuntimeException("Source pod not found: " + fromPodCode));
        BioPod toPod = bioPodRepository.findByPodCode(toPodCode)
                .orElseThrow(() -> new RuntimeException("Target pod not found: " + toPodCode));

        if (!"EMPTY".equalsIgnoreCase(toPod.getPodStatus())) {
            throw new IllegalStateException("Target pod " + toPodCode + " is not empty.");
        }
        if ("EMPTY".equalsIgnoreCase(fromPod.getPodStatus())) {
            throw new IllegalStateException("Source pod " + fromPodCode + " has no patient to transfer.");
        }

        // Copy patient to target
        toPod.setPodStatus(fromPod.getPodStatus());
        toPod.setPatientName(fromPod.getPatientName());
        toPod.setAttendingPhysician(fromPod.getAttendingPhysician());
        toPod.setClinicalSeverity(fromPod.getClinicalSeverity());
        // If ward differs, keep target pod's ward (different ward transfer)

        // Clear source
        fromPod.setPodStatus("EMPTY");
        fromPod.setPatientName(null);
        fromPod.setAttendingPhysician(null);
        fromPod.setClinicalSeverity(null);

        bioPodRepository.save(fromPod);
        return bioPodRepository.save(toPod);
    }
}
