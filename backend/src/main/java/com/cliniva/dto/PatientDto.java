package com.cliniva.dto;

import com.cliniva.entity.Patient;

public class PatientDto {
    private Long id;
    private String patientId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String bloodGroup;
    private String maritalStatus;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;
    private String occupation;
    private String medicalHistory;
    private String allergies;
    private String currentMedications;
    private Double heightCm;
    private Double weightKg;
    private int age;
    private String primaryDoctorName;
    private String primaryDoctorSpecialization;
    private boolean admitted;
    private String admissionDate;
    private String followUpDate;
    private boolean followUpRequired;

    public static PatientDto from(Patient p) {
        PatientDto dto = new PatientDto();
        dto.id = p.getId();
        dto.patientId = p.getPatientId();
        if (p.getUser() != null) {
            dto.firstName = p.getUser().getFirstName();
            dto.lastName = p.getUser().getLastName();
            dto.email = p.getUser().getEmail();
            dto.phoneNumber = p.getUser().getPhoneNumber();
            dto.age = p.getAge();
        }
        dto.bloodGroup = p.getBloodGroup();
        dto.maritalStatus = p.getMaritalStatus() != null ? p.getMaritalStatus().name() : null;
        dto.emergencyContactName = p.getEmergencyContactName();
        dto.emergencyContactPhone = p.getEmergencyContactPhone();
        dto.emergencyContactRelation = p.getEmergencyContactRelation();
        dto.occupation = p.getOccupation();
        dto.medicalHistory = p.getMedicalHistory();
        dto.allergies = p.getAllergies();
        dto.currentMedications = p.getCurrentMedications();
        dto.heightCm = p.getHeightCm();
        dto.weightKg = p.getWeightKg();
        dto.admitted = p.isAdmitted();
        dto.admissionDate = p.getAdmissionDate() != null ? p.getAdmissionDate().toString() : null;
        dto.followUpDate = p.getFollowUpDate() != null ? p.getFollowUpDate().toString() : null;
        dto.followUpRequired = p.getFollowUpRequired() != null && p.getFollowUpRequired();
        if (p.getPrimaryDoctor() != null) {
            dto.primaryDoctorName = p.getPrimaryDoctor().getFullName();
            dto.primaryDoctorSpecialization = p.getPrimaryDoctor().getSpecialization();
        }
        return dto;
    }

    // getters
    public Long getId() { return id; }
    public String getPatientId() { return patientId; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getBloodGroup() { return bloodGroup; }
    public String getMaritalStatus() { return maritalStatus; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public String getEmergencyContactRelation() { return emergencyContactRelation; }
    public String getOccupation() { return occupation; }
    public String getMedicalHistory() { return medicalHistory; }
    public String getAllergies() { return allergies; }
    public String getCurrentMedications() { return currentMedications; }
    public Double getHeightCm() { return heightCm; }
    public Double getWeightKg() { return weightKg; }
    public int getAge() { return age; }
    public String getPrimaryDoctorName() { return primaryDoctorName; }
    public String getPrimaryDoctorSpecialization() { return primaryDoctorSpecialization; }
    public boolean isAdmitted() { return admitted; }
    public String getAdmissionDate() { return admissionDate; }
    public String getFollowUpDate() { return followUpDate; }
    public boolean isFollowUpRequired() { return followUpRequired; }
    // setters
    public void setId(Long id) { this.id = id; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public void setEmergencyContactRelation(String emergencyContactRelation) { this.emergencyContactRelation = emergencyContactRelation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }
    public void setMedicalHistory(String medicalHistory) { this.medicalHistory = medicalHistory; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    public void setCurrentMedications(String currentMedications) { this.currentMedications = currentMedications; }
    public void setHeightCm(Double heightCm) { this.heightCm = heightCm; }
    public void setWeightKg(Double weightKg) { this.weightKg = weightKg; }
    public void setPrimaryDoctorName(String primaryDoctorName) { this.primaryDoctorName = primaryDoctorName; }
    public void setPrimaryDoctorSpecialization(String primaryDoctorSpecialization) { this.primaryDoctorSpecialization = primaryDoctorSpecialization; }
    public void setAdmitted(boolean admitted) { this.admitted = admitted; }
    public void setAdmissionDate(String admissionDate) { this.admissionDate = admissionDate; }
    public void setFollowUpDate(String followUpDate) { this.followUpDate = followUpDate; }
    public void setFollowUpRequired(boolean followUpRequired) { this.followUpRequired = followUpRequired; }
}
