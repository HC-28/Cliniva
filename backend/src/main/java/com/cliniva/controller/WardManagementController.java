package com.cliniva.controller;

import com.cliniva.dto.BedManagementRequest;
import com.cliniva.entity.BioPod;
import com.cliniva.service.WardManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Cliniva Platform — WardManagementController
 *
 * Exposes the Ward / Bio-Pod grid to the clinical dashboard.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 *  ENDPOINT REFERENCE
 *  Base: /api/v1/clinical/wards
 *
 *  GET  /pods               → Full pod grid (all 12 beds)
 *  GET  /pods/{podId}       → Single pod detail
 *  GET  /pods?status=OCCUPIED    → Filter by occupancy status
 *  GET  /pods?ward=Neuro         → Filter by ward
 *  PATCH /pods/{podId}/status    → Update pod status (OCCUPIED/EMPTY/STABILIZING)
 * └─────────────────────────────────────────────────────────────┘
 */
@RestController
@RequestMapping("/api/v1/clinical/wards")
public class WardManagementController {

    private final WardManagementService wardManagementService;

    public WardManagementController(WardManagementService wardManagementService) {
        this.wardManagementService = wardManagementService;
    }

    /**
     * GET /api/v1/clinical/wards/pods
     * Returns the complete pod grid. Supports optional ?status= and ?ward= query filters.
     */
    @GetMapping("/pods")
    public ResponseEntity<List<BioPod>> getPods(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String ward) {

        List<BioPod> pods;

        if (status != null && !status.isBlank()) {
            pods = wardManagementService.getPodsByStatus(status);
        } else if (ward != null && !ward.isBlank()) {
            pods = wardManagementService.getPodsByWard(ward);
        } else {
            pods = wardManagementService.getAllPods();
        }

        return ResponseEntity.ok(pods);
    }

    /**
     * GET /api/v1/clinical/wards/pods/{podId}
     * Returns a single pod's full detail by its code (e.g. "A-1").
     */
    @GetMapping("/pods/{podId}")
    public ResponseEntity<BioPod> getPodById(@PathVariable String podId) {
        return wardManagementService.getPodByCode(podId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/v1/clinical/wards/pods/{podId}/status
     * Quick status override (used internally / by admin).
     */
    @PatchMapping("/pods/{podId}/status")
    public ResponseEntity<BioPod> updatePodStatus(
            @PathVariable String podId,
            @RequestBody Map<String, String> body) {
        String status   = body.get("status");
        String severity = body.get("severity");
        if (status == null) return ResponseEntity.badRequest().build();
        BioPod updated = wardManagementService.updatePodStatus(podId, status, severity);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/v1/clinical/wards/pods/{podId}/admit
     * Admits a patient to an empty pod.
     *
     * Body: { patientName, patientClinicalId, attendingPhysician, wardName, clinicalSeverity }
     */
    @PostMapping("/pods/{podId}/admit")
    public ResponseEntity<?> admitPatient(
            @PathVariable String podId,
            @RequestBody BedManagementRequest request) {
        try {
            BioPod pod = wardManagementService.admitPatient(podId, request);
            return ResponseEntity.ok(pod);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/v1/clinical/wards/pods/{podId}/discharge
     * Discharges the patient from a pod, marking it EMPTY.
     */
    @PostMapping("/pods/{podId}/discharge")
    public ResponseEntity<?> dischargePatient(@PathVariable String podId) {
        try {
            BioPod pod = wardManagementService.dischargePatient(podId);
            return ResponseEntity.ok(pod);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/v1/clinical/wards/pods/{podId}/transfer
     * Transfers a patient to another empty pod.
     *
     * Body: { targetPodCode: "B-2" }
     */
    @PostMapping("/pods/{podId}/transfer")
    public ResponseEntity<?> transferPatient(
            @PathVariable String podId,
            @RequestBody BedManagementRequest request) {
        try {
            BioPod pod = wardManagementService.transferPatient(podId, request.getTargetPodCode());
            return ResponseEntity.ok(pod);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
