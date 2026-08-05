package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "patient_id", unique = true, length = 20, nullable = false)
    private String patientId;
    
    @Column(name = "blood_group", length = 5)
    private String bloodGroup;
    
    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private MaritalStatus maritalStatus;
    
    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;
    
    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;
    
    @Column(name = "emergency_contact_relation", length = 50)
    private String emergencyContactRelation;
    
    @Column(name = "occupation", length = 100)
    private String occupation;
    
    @Column(name = "medical_history", length = 2000)
    private String medicalHistory;
    
    @Column(name = "allergies", length = 1000)
    private String allergies;
    
    @Column(name = "current_medications", length = 1000)
    private String currentMedications;
    
    @Column(name = "height_cm")
    private Double heightCm;
    
    @Column(name = "weight_kg")
    private Double weightKg;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "primary_doctor_id")
    private User primaryDoctor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Column(name = "admission_date")
    private LocalDateTime admissionDate;
    
    @Column(name = "discharge_date")
    private LocalDateTime dischargeDate;
    
    @Column(name = "follow_up_date")
    private LocalDate followUpDate;
    
    @Column(name = "follow_up_required")
    private Boolean followUpRequired = false;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Appointment> appointments = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<MedicalRecord> medicalRecords = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Prescription> prescriptions = new ArrayList<>();
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Bill> bills = new ArrayList<>();

    public Patient() {}

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public MaritalStatus getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(MaritalStatus maritalStatus) { this.maritalStatus = maritalStatus; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }
    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public String getMedicalHistory() { return medicalHistory; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public String getCurrentMedications() { return currentMedications; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    public Double getHeightCm() { return heightCm; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public Double getWeightKg() { return weightKg; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public User getPrimaryDoctor() { return primaryDoctor; }
    public void setPrimaryDoctor(User primaryDoctor) { this.primaryDoctor = primaryDoctor; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public LocalDateTime getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDateTime admissionDate) { this.admissionDate = admissionDate; }
    public LocalDateTime getDischargeDate() { return dischargeDate; }
    public void setDischargeDate(LocalDateTime dischargeDate) { this.dischargeDate = dischargeDate; }
    public LocalDate getFollowUpDate() { return followUpDate; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
    public Boolean getFollowUpRequired() { return followUpRequired; }
    public void setFollowUpRequired(Boolean followUpRequired) { this.followUpRequired = followUpRequired; }
    public List<Appointment> getAppointments() { return appointments; }
    public void setAppointments(List<Appointment> appointments) { this.appointments = appointments; }
    public List<MedicalRecord> getMedicalRecords() { return medicalRecords; }
    public void setMedicalRecords(List<MedicalRecord> medicalRecords) { this.medicalRecords = medicalRecords; }
    public List<Prescription> getPrescriptions() { return prescriptions; }
    public void setPrescriptions(List<Prescription> prescriptions) { this.prescriptions = prescriptions; }
    public List<Bill> getBills() { return bills; }
    public void setBills(List<Bill> bills) { this.bills = bills; }

    
    public double getBMI() {
        if (heightCm != null && weightKg != null && heightCm > 0) {
            return weightKg / ((heightCm / 100) * (heightCm / 100));
        }
        return 0.0;
    }
    
    public boolean isAdmitted() {
        return admissionDate != null && dischargeDate == null;
    }
    
    public int getAge() {
        if (user != null && user.getDateOfBirth() != null) {
            return Period.between(user.getDateOfBirth(), LocalDate.now()).getYears();
        }
        return 0;
    }
    
    public boolean requiresFollowUp() {
        return (followUpRequired != null && followUpRequired) && followUpDate != null && followUpDate.isAfter(LocalDate.now());
    }
    
    public enum MaritalStatus {
        SINGLE, MARRIED, DIVORCED, WIDOWED, SEPARATED
    }
}
