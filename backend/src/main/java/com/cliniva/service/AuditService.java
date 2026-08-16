package com.cliniva.service;

import com.cliniva.entity.AuditLog;
import com.cliniva.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public AuditLog logAccess(Long actorUserId, String actorName, String actorEmail, String actorRole,
                              String actionType, String patientId, String resourceType, String resourceId,
                              String ipAddress, String details) {
        try {
            AuditLog entry = new AuditLog(
                    actorUserId, actorName, actorEmail, actorRole,
                    actionType, patientId, resourceType, resourceId,
                    ipAddress, "SUCCESS", details
            );
            AuditLog saved = auditLogRepository.save(entry);
            log.info("[HIPAA AUDIT] {} performed by {} ({}) on patient {} (resource: {})",
                    actionType, actorEmail, actorRole, patientId, resourceType);
            return saved;
        } catch (Exception e) {
            log.error("[HIPAA AUDIT ERROR] Failed to record audit log: {}", e.getMessage());
            return null;
        }
    }

    public List<AuditLog> getRecentAuditLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsForPatient(String patientId) {
        return auditLogRepository.findByPatientIdOrderByTimestampDesc(patientId);
    }
}
