package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "medical_records")
public class MedicalRecord extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;
    
    @Column(name = "record_type", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private RecordType recordType;
    
    @Column(name = "chief_complaint", length = 500, nullable = false)
    private String chiefComplaint;
    
    @Column(name = "present_illness", length = 2000)
    private String presentIllness;
    
    @Column(name = "medical_history", length = 2000)
    private String medicalHistory;
    
    @Column(name = "family_history", length = 2000)
    private String familyHistory;
    
    @Column(name = "social_history", length = 1000)
    private String socialHistory;
    
    @Column(name = "allergies", length = 1000)
    private String allergies;
    
    @Column(name = "medications", length = 2000)
    private String medications;
    
    @Column(name = "physical_examination", length = 2000)
    private String physicalExamination;
    
    @Column(name = "vital_signs", length = 1000)
    private String vitalSigns;
    
    @Column(name = "weight")
    private Double weight;
    
    @Column(name = "height")
    private Double height;
    
    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;
    
    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;
    
    @Column(name = "heart_rate")
    private Integer heartRate;
    
    @Column(name = "temperature")
    private Double temperature;
    
    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;
    
    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation;
    
    @Column(name = "laboratory_tests", length = 2000)
    private String laboratoryTests;
    
    @Column(name = "imaging_studies", length = 2000)
    private String imagingStudies;
    
    @Column(name = "procedures", length = 2000)
    private String procedures;
    
    @Column(name = "assessment", length = 2000, nullable = false)
    private String assessment;
    
    @Column(name = "plan", length = 2000, nullable = false)
    private String plan;
    
    @Column(name = "follow_up_instructions", length = 1000)
    private String followUpInstructions;
    
    @Column(name = "next_appointment_date")
    private LocalDate nextAppointmentDate;
    
    @Column(name = "progress_notes", length = 2000)
    private String progressNotes;
    
    @Column(name = "is_confidential", nullable = false)
    private Boolean isConfidential = false;

    public MedicalRecord() {}

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }
    public RecordType getRecordType() { return recordType; }
    public void setRecordType(RecordType recordType) { this.recordType = recordType; }
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    public String getPresentIllness() { return presentIllness; }
    public void setPresentIllness(String presentIllness) { this.presentIllness = presentIllness; }
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public String getFamilyHistory() { return familyHistory; }
    public void setFamilyHistory(String familyHistory) { this.familyHistory = familyHistory; }
    public String getSocialHistory() { return socialHistory; }
    public void setSocialHistory(String socialHistory) { this.socialHistory = socialHistory; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    public String getPhysicalExamination() { return physicalExamination; }
    public void setPhysicalExamination(String physicalExamination) { this.physicalExamination = physicalExamination; }
    public String getVitalSigns() { return vitalSigns; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    public Integer getBloodPressureSystolic() { return bloodPressureSystolic; }
    public void setBloodPressureSystolic(Integer bloodPressureSystolic) { this.bloodPressureSystolic = bloodPressureSystolic; }
    public Integer getBloodPressureDiastolic() { return bloodPressureDiastolic; }
    public void setBloodPressureDiastolic(Integer bloodPressureDiastolic) { this.bloodPressureDiastolic = bloodPressureDiastolic; }
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Integer getRespiratoryRate() { return respiratoryRate; }
    public void setRespiratoryRate(Integer respiratoryRate) { this.respiratoryRate = respiratoryRate; }
    public Double getOxygenSaturation() { return oxygenSaturation; }
    public void setOxygenSaturation(Double oxygenSaturation) { this.oxygenSaturation = oxygenSaturation; }
    public String getLaboratoryTests() { return laboratoryTests; }
    public void setLaboratoryTests(String laboratoryTests) { this.laboratoryTests = laboratoryTests; }
    public String getImagingStudies() { return imagingStudies; }
    public void setImagingStudies(String imagingStudies) { this.imagingStudies = imagingStudies; }
    public String getProcedures() { return procedures; }
    public void setProcedures(String procedures) { this.procedures = procedures; }
    public String getAssessment() { return assessment; }
    public void setAssessment(String assessment) { this.assessment = assessment; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
    public LocalDate getNextAppointmentDate() { return nextAppointmentDate; }
    public void setNextAppointmentDate(LocalDate nextAppointmentDate) { this.nextAppointmentDate = nextAppointmentDate; }
    public String getProgressNotes() { return progressNotes; }
    public void setProgressNotes(String progressNotes) { this.progressNotes = progressNotes; }
    public Boolean getIsConfidential() { return isConfidential; }
    public void setIsConfidential(Boolean isConfidential) { this.isConfidential = isConfidential; }


    public double getBMI() {
        if (height != null && weight != null && height > 0) {
            return weight / ((height / 100) * (height / 100));
        }
        return 0.0;
    }
    
    public String getBloodPressureReading() {
        if (bloodPressureSystolic != null && bloodPressureDiastolic != null) {
            return bloodPressureSystolic + "/" + bloodPressureDiastolic;
        }
        return "Not recorded";
    }
    
    public boolean isUrgent() {
        return (isConfidential != null && isConfidential);
    }
    
    public enum RecordType {
        CONSULTATION, FOLLOW_UP, EMERGENCY, SURGERY, DIAGNOSTIC, PREVENTIVE, TELEMEDICINE
    }
}
