package com.cliniva.dto;

import com.cliniva.entity.MedicalRecord;

public class MedicalRecordDto {
    private Long id;
    private String patientName;
    private String patientId;
    private String doctorName;
    private String recordDate;
    private String recordType;
    private String chiefComplaint;
    private String presentIllness;
    private String assessment;
    private String plan;
    private String followUpInstructions;
    private String nextAppointmentDate;
    private Integer heartRate;
    private Double temperature;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double oxygenSaturation;
    private boolean isConfidential;

    public static MedicalRecordDto from(MedicalRecord r) {
        MedicalRecordDto dto = new MedicalRecordDto();
        dto.id = r.getId();
        if (r.getPatient() != null && r.getPatient().getUser() != null) {
            dto.patientName = r.getPatient().getUser().getFullName();
            dto.patientId = r.getPatient().getPatientId();
        }
        if (r.getDoctor() != null) {
            dto.doctorName = r.getDoctor().getFullName();
        }
        dto.recordDate = r.getRecordDate() != null ? r.getRecordDate().toString() : null;
        dto.recordType = r.getRecordType() != null ? r.getRecordType().name() : null;
        dto.chiefComplaint = r.getChiefComplaint();
        dto.presentIllness = r.getPresentIllness();
        dto.assessment = r.getAssessment();
        dto.plan = r.getPlan();
        dto.followUpInstructions = r.getFollowUpInstructions();
        dto.nextAppointmentDate = r.getNextAppointmentDate() != null ? r.getNextAppointmentDate().toString() : null;
        dto.heartRate = r.getHeartRate();
        dto.temperature = r.getTemperature();
        dto.bloodPressureSystolic = r.getBloodPressureSystolic();
        dto.bloodPressureDiastolic = r.getBloodPressureDiastolic();
        dto.oxygenSaturation = r.getOxygenSaturation();
        dto.isConfidential = Boolean.TRUE.equals(r.getIsConfidential());
        return dto;
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public String getPatientId() { return patientId; }
    public String getDoctorName() { return doctorName; }
    public String getRecordDate() { return recordDate; }
    public String getRecordType() { return recordType; }
    public String getChiefComplaint() { return chiefComplaint; }
    public String getPresentIllness() { return presentIllness; }
    public String getAssessment() { return assessment; }
    public String getPlan() { return plan; }
    public String getFollowUpInstructions() { return followUpInstructions; }
    public String getNextAppointmentDate() { return nextAppointmentDate; }
    public Integer getHeartRate() { return heartRate; }
    public Double getTemperature() { return temperature; }
    public Integer getBloodPressureSystolic() { return bloodPressureSystolic; }
    public Integer getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public Double getOxygenSaturation() { return oxygenSaturation; }
    public boolean isConfidential() { return isConfidential; }
}
