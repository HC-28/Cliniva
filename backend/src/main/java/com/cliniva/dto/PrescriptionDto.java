package com.cliniva.dto;

import com.cliniva.entity.Prescription;

public class PrescriptionDto {
    private Long id;
    private String patientName;
    private String patientId;
    private String doctorName;
    private String medicationName;
    private String genericName;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String instructions;
    private String sideEffects;
    private String status;
    private String prescriptionDate;
    private String startDate;
    private String endDate;
    private Integer refillsAllowed;
    private Integer refillsUsed;
    private boolean isEmergency;
    private boolean isControlledSubstance;

    public static PrescriptionDto from(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.id = p.getId();
        if (p.getPatient() != null && p.getPatient().getUser() != null) {
            dto.patientName = p.getPatient().getUser().getFullName();
            dto.patientId = p.getPatient().getPatientId();
        }
        if (p.getDoctor() != null) {
            dto.doctorName = p.getDoctor().getFullName();
        }
        dto.medicationName = p.getMedicationName();
        dto.genericName = p.getGenericName();
        dto.dosage = p.getDosage();
        dto.frequency = p.getFrequency();
        dto.durationDays = p.getDurationDays();
        dto.instructions = p.getInstructions();
        dto.sideEffects = p.getSideEffects();
        dto.status = p.getStatus() != null ? p.getStatus().name() : null;
        dto.prescriptionDate = p.getPrescriptionDate() != null ? p.getPrescriptionDate().toString() : null;
        dto.startDate = p.getStartDate() != null ? p.getStartDate().toString() : null;
        dto.endDate = p.getEndDate() != null ? p.getEndDate().toString() : null;
        dto.refillsAllowed = p.getRefillsAllowed();
        dto.refillsUsed = p.getRefillsUsed();
        dto.isEmergency = Boolean.TRUE.equals(p.getIsEmergency());
        dto.isControlledSubstance = Boolean.TRUE.equals(p.getIsControlledSubstance());
        return dto;
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public String getPatientId() { return patientId; }
    public String getDoctorName() { return doctorName; }
    public String getMedicationName() { return medicationName; }
    public String getGenericName() { return genericName; }
    public String getDosage() { return dosage; }
    public String getFrequency() { return frequency; }
    public Integer getDurationDays() { return durationDays; }
    public String getInstructions() { return instructions; }
    public String getSideEffects() { return sideEffects; }
    public String getStatus() { return status; }
    public String getPrescriptionDate() { return prescriptionDate; }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public Integer getRefillsAllowed() { return refillsAllowed; }
    public Integer getRefillsUsed() { return refillsUsed; }
    public boolean isEmergency() { return isEmergency; }
    public boolean isControlledSubstance() { return isControlledSubstance; }
}
