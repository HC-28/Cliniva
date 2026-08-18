package com.cliniva.controller;

import com.cliniva.entity.ClinicalProcedure;
import com.cliniva.service.ClinicalProcedureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Cliniva Platform — ClinicalProcedureController
 *
 * Exposes today's clinical procedure schedule to the dashboard.
 *
 * ┌───────────────────────────────────────────────────────────────────┐
 *  ENDPOINT REFERENCE
 *  Base: /api/v1/clinical/procedures
 *
 *  GET  /scheduled              → All of today's procedures (any status)
 *  GET  /scheduled?status=upcoming   → Filter to a specific status
 * └───────────────────────────────────────────────────────────────────┘
 */
@RestController
@RequestMapping("/api/v1/clinical/procedures")
public class ClinicalProcedureController {

    private final ClinicalProcedureService clinicalProcedureService;

    public ClinicalProcedureController(ClinicalProcedureService clinicalProcedureService) {
        this.clinicalProcedureService = clinicalProcedureService;
    }

    /**
     * GET /api/v1/clinical/procedures/scheduled
     * Returns today's full procedure schedule ordered by time.
     * Supports optional ?status= filter (in-progress | upcoming | completed | cancelled).
     */
    @GetMapping("/scheduled")
    public ResponseEntity<List<ClinicalProcedure>> getTodaySchedule(
            @RequestParam(required = false) String status) {

        List<ClinicalProcedure> procedures = (status != null && !status.isBlank())
                ? clinicalProcedureService.getTodayScheduleByStatus(status)
                : clinicalProcedureService.getTodaySchedule();

        return ResponseEntity.ok(procedures);
    }
}
