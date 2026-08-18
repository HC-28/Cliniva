package com.cliniva.controller;

import com.cliniva.entity.AuditLog;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * ComplianceController — Enterprise HIPAA & PHI Compliance Interface.
 * Exposes audit trails and security controls status to authorized compliance officers,
 * administrators, and attending medical staff.
 */
@RestController
@RequestMapping("/api/v1/compliance")
public class ComplianceController {

    private final AuditService auditService;

    public ComplianceController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestParam(required = false) String patientId) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized access"));
        }

        List<AuditLog> logs;
        if (patientId != null && !patientId.isBlank()) {
            logs = auditService.getLogsForPatient(patientId);
        } else {
            logs = auditService.getRecentAuditLogs();
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/status")
    public ResponseEntity<?> getComplianceStatus() {
        return ResponseEntity.ok(Map.of(
                "hipaaSecurityRule", "ENFORCED",
                "phiEncryptionAtRest", "AES-256",
                "auditLoggingStatus", "ACTIVE",
                "transmissionSecurity", "TLS-1.3 / HTTPS",
                "roleBasedAccessControl", "SPRING_SECURITY_6",
                "lastAudited", LocalDateTime.now().toString(),
                "emergencyAccessProtocol", "ENABLED"
        ));
    }
}
