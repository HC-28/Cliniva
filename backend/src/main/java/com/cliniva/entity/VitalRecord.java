package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Cliniva Platform — VitalRecord Entity
 *
 * Stores a timestamped snapshot of patient vital signs.
 * In a real deployment, records are ingested from bedside monitoring devices
 * (e.g. Philips IntelliVue, GE CARESCAPE) via the telemetry ingest endpoint.
 * The VitalMonitoringService simulates this device feed when no real devices are present.
 *
 * Table: cliniva.vital_records
 */
@Entity
@Table(name = "vital_records", schema = "cliniva",
       indexes = {
           @Index(name = "idx_vital_patient_recorded", columnList = "patient_id, recorded_at DESC")
       })
public class VitalRecord extends BaseEntity {

    /** Patient identifier (CLV-XXXXX format or internal UUID) */
    @Column(name = "patient_id", nullable = false, length = 30)
    private String patientId;

    /** Heart rate in beats per minute */
    @Column(name = "heart_rate_bpm")
    private Integer heartRateBpm;

    /** Peripheral oxygen saturation (SpO₂) percentage */
    @Column(name = "spo2_percent")
    private Integer spo2Percent;

    /** Core body temperature in degrees Celsius */
    @Column(name = "body_temp_celsius")
    private Double bodyTempCelsius;

    /** Pod stabilization G-Force reading */
    @Column(name = "g_force_reading")
    private Double gForceReading;

    /** ISO-8601 timestamp of when the device recorded this reading */
    @Column(name = "recorded_at", nullable = false)
    private Instant recordedAt;

    /** Source device identifier (e.g. "INTELLIVUE-A1", "CARESCAPE-B4", "SIM-ENGINE") */
    @Column(name = "device_source", length = 60)
    private String deviceSource;

    // ── Getters & Setters ──────────────────────────────────

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public Integer getHeartRateBpm() { return heartRateBpm; }
    public void setHeartRateBpm(Integer heartRateBpm) { this.heartRateBpm = heartRateBpm; }

    public Integer getSpo2Percent() { return spo2Percent; }
    public void setSpo2Percent(Integer spo2Percent) { this.spo2Percent = spo2Percent; }

    public Double getBodyTempCelsius() { return bodyTempCelsius; }
    public void setBodyTempCelsius(Double bodyTempCelsius) { this.bodyTempCelsius = bodyTempCelsius; }

    public Double getGForceReading() { return gForceReading; }
    public void setGForceReading(Double gForceReading) { this.gForceReading = gForceReading; }

    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }

    public String getDeviceSource() { return deviceSource; }
    public void setDeviceSource(String deviceSource) { this.deviceSource = deviceSource; }
}
