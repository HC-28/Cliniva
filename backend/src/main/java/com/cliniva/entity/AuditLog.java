package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * AuditLog — Enterprise HIPAA Compliance Audit Control (§ 164.312(b)).
 * Immutable record of every Electronic Protected Health Information (ePHI)
 * access, query, update, or export event across Cliniva.
 */
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_actor", columnList = "actor_email"),
    @Index(name = "idx_audit_patient", columnList = "patient_id"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "actor_user_id")
    private Long actorUserId;

    @Column(name = "actor_name", length = 150)
    private String actorName;

    @Column(name = "actor_email", nullable = false, length = 150)
    private String actorEmail;

    @Column(name = "actor_role", nullable = false, length = 50)
    private String actorRole;

    @Column(name = "action_type", nullable = false, length = 100)
    private String actionType; // e.g. "VIEW_MEDICAL_RECORD", "SEARCH_PATIENT_PHI", "EXPORT_REPORT_PDF", "UPDATE_VITAL_SIGNS"

    @Column(name = "patient_id", length = 50)
    private String patientId; // e.g. "CLV-00001"

    @Column(name = "resource_type", length = 100)
    private String resourceType; // e.g. "MedicalRecord", "PatientProfile", "Prescription"

    @Column(name = "resource_id", length = 100)
    private String resourceId;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(length = 20)
    private String status; // "SUCCESS", "DENIED", "FLAGGED"

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "hipaa_compliance_category", length = 100)
    private String hipaaComplianceCategory = "ePHI_ACCESS_LOG";

    public AuditLog() {
        this.timestamp = LocalDateTime.now();
        this.status = "SUCCESS";
    }

    public AuditLog(Long actorUserId, String actorName, String actorEmail, String actorRole,
                    String actionType, String patientId, String resourceType, String resourceId,
                    String ipAddress, String status, String details) {
        this.timestamp = LocalDateTime.now();
        this.actorUserId = actorUserId;
        this.actorName = actorName;
        this.actorEmail = actorEmail;
        this.actorRole = actorRole;
        this.actionType = actionType;
        this.patientId = patientId;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.ipAddress = ipAddress;
        this.status = status != null ? status : "SUCCESS";
        this.details = details;
        this.hipaaComplianceCategory = "ePHI_ACCESS_LOG";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Long getActorUserId() { return actorUserId; }
    public void setActorUserId(Long actorUserId) { this.actorUserId = actorUserId; }

    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }

    public String getActorEmail() { return actorEmail; }
    public void setActorEmail(String actorEmail) { this.actorEmail = actorEmail; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getHipaaComplianceCategory() { return hipaaComplianceCategory; }
    public void setHipaaComplianceCategory(String hipaaComplianceCategory) { this.hipaaComplianceCategory = hipaaComplianceCategory; }
}
