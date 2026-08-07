package com.cliniva.entity;

import jakarta.persistence.*;

/**
 * Cliniva Platform — BioPod Entity
 * Represents a physical patient monitoring pod (bed unit) within a hospital ward.
 * Data is managed by the Ward Management Service and surfaced via the Clinical API.
 */
@Entity
@Table(name = "bio_pods", schema = "cliniva")
public class BioPod extends BaseEntity {

    @Column(name = "pod_code", nullable = false, unique = true, length = 10)
    private String podCode; // e.g. "A-1", "B-4"

    @Column(name = "pod_status", nullable = false, length = 20)
    private String podStatus; // OCCUPIED | EMPTY | STABILIZING

    @Column(name = "ward_name", length = 50)
    private String wardName; // Neuro, Cardiac, Trauma, Ortho, Pulmo

    @Column(name = "patient_name", length = 120)
    private String patientName;

    @Column(name = "attending_physician", length = 120)
    private String attendingPhysician;

    @Column(name = "clinical_severity", length = 20)
    private String clinicalSeverity; // stable | warning | critical | null

    // ── Getters & Setters ──────────────────────────────────

    public String getPodCode() { return podCode; }
    public void setPodCode(String podCode) { this.podCode = podCode; }

    public String getPodStatus() { return podStatus; }
    public void setPodStatus(String podStatus) { this.podStatus = podStatus; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getAttendingPhysician() { return attendingPhysician; }
    public void setAttendingPhysician(String attendingPhysician) { this.attendingPhysician = attendingPhysician; }

    public String getClinicalSeverity() { return clinicalSeverity; }
    public void setClinicalSeverity(String clinicalSeverity) { this.clinicalSeverity = clinicalSeverity; }
}
