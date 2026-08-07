package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Cliniva Platform — ClinicalProcedure Entity
 * Represents a scheduled medical procedure (surgery, scan, analysis, etc.)
 * for a given patient on a given date.
 *
 * Table: cliniva.clinical_procedures
 */
@Entity
@Table(name = "clinical_procedures", schema = "cliniva",
       indexes = {
           @Index(name = "idx_procedure_scheduled_date", columnList = "scheduled_date")
       })
public class ClinicalProcedure extends BaseEntity {

    @Column(name = "patient_name", nullable = false, length = 120)
    private String patientName;

    @Column(name = "patient_clinical_id", length = 20)
    private String patientClinicalId; // CLV-XXXXX

    @Column(name = "procedure_name", nullable = false, length = 200)
    private String procedureName;

    @Column(name = "procedure_type", length = 30)
    private String procedureType; // neuro | cardiac | trauma | pulmo | ortho | lab

    @Column(name = "attending_physician", length = 120)
    private String attendingPhysician;

    @Column(name = "pod_code", length = 10)
    private String podCode;

    @Column(name = "scheduled_time", length = 10)
    private String scheduledTime; // "08:30"

    @Column(name = "estimated_duration", length = 20)
    private String estimatedDuration; // "45min"

    @Column(name = "procedure_status", length = 20)
    private String procedureStatus; // in-progress | upcoming | completed | cancelled

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    // ── Getters & Setters ──────────────────────────────────

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientClinicalId() { return patientClinicalId; }
    public void setPatientClinicalId(String patientClinicalId) { this.patientClinicalId = patientClinicalId; }

    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }

    public String getProcedureType() { return procedureType; }
    public void setProcedureType(String procedureType) { this.procedureType = procedureType; }

    public String getAttendingPhysician() { return attendingPhysician; }
    public void setAttendingPhysician(String attendingPhysician) { this.attendingPhysician = attendingPhysician; }

    public String getPodCode() { return podCode; }
    public void setPodCode(String podCode) { this.podCode = podCode; }

    public String getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(String scheduledTime) { this.scheduledTime = scheduledTime; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getProcedureStatus() { return procedureStatus; }
    public void setProcedureStatus(String procedureStatus) { this.procedureStatus = procedureStatus; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
}
