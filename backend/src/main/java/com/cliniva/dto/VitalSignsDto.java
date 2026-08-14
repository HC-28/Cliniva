package com.cliniva.dto;

import com.cliniva.entity.VitalRecord;
import java.time.Instant;
import java.util.List;

/**
 * Cliniva Platform — VitalSignsDto
 *
 * Data Transfer Object returned by the Telemetry API.
 * Includes the latest vital snapshot plus historical arrays for sparkline charts.
 *
 * Consumed by: GET /api/v1/telemetry/vitals/{patientId}/latest
 *              SSE  /api/v1/telemetry/vitals/{patientId}/stream
 */
public class VitalSignsDto {

    private String patientId;
    private Integer heartRate;       // bpm
    private Integer bloodOxygen;     // SpO2 %
    private Double temperature;      // °C
    private Double gForce;           // G-Force stabilization
    private Instant recordedAt;
    private String deviceSource;

    /** Last 14 heart rate readings — used by the sparkline chart */
    private List<Integer> heartData;

    /** Last 10 temperature readings — used by the sparkline chart */
    private List<Double> tempData;

    // ── Constructors ───────────────────────────────────────

    public VitalSignsDto() {}

    public static VitalSignsDto from(VitalRecord record,
                                     List<Integer> heartHistory,
                                     List<Double> tempHistory) {
        VitalSignsDto dto = new VitalSignsDto();
        dto.patientId    = record.getPatientId();
        dto.heartRate    = record.getHeartRateBpm();
        dto.bloodOxygen  = record.getSpo2Percent();
        dto.temperature  = record.getBodyTempCelsius();
        dto.gForce       = record.getGForceReading();
        dto.recordedAt   = record.getRecordedAt();
        dto.deviceSource = record.getDeviceSource();
        dto.heartData    = heartHistory;
        dto.tempData     = tempHistory;
        return dto;
    }

    // ── Getters & Setters ──────────────────────────────────

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }

    public Integer getBloodOxygen() { return bloodOxygen; }
    public void setBloodOxygen(Integer bloodOxygen) { this.bloodOxygen = bloodOxygen; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Double getGForce() { return gForce; }
    public void setGForce(Double gForce) { this.gForce = gForce; }

    public Instant getRecordedAt() { return recordedAt; }
    public void setRecordedAt(Instant recordedAt) { this.recordedAt = recordedAt; }

    public String getDeviceSource() { return deviceSource; }
    public void setDeviceSource(String deviceSource) { this.deviceSource = deviceSource; }

    public List<Integer> getHeartData() { return heartData; }
    public void setHeartData(List<Integer> heartData) { this.heartData = heartData; }

    public List<Double> getTempData() { return tempData; }
    public void setTempData(List<Double> tempData) { this.tempData = tempData; }
}
