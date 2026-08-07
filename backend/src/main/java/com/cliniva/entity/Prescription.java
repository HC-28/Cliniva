package com.cliniva.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
public class Prescription extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private User doctor;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @Column(name = "prescription_date", nullable = false)
    private LocalDate prescriptionDate;
    
    @Column(name = "medication_name", length = 200, nullable = false)
    private String medicationName;
    
    @Column(name = "generic_name", length = 200)
    private String genericName;
    
    @Column(name = "dosage", length = 100, nullable = false)
    private String dosage;
    
    @Column(name = "frequency", length = 100, nullable = false)
    private String frequency;
    
    @Column(name = "duration_days", nullable = false)
    private Integer durationDays;
    
    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;
    
    @Column(name = "quantity_per_dose")
    private Integer quantityPerDose;
    
    @Column(name = "instructions", length = 1000, nullable = false)
    private String instructions;
    
    @Column(name = "side_effects", length = 1000)
    private String sideEffects;
    
    @Column(name = "contraindications", length = 1000)
    private String contraindications;
    
    @Column(name = "drug_interactions", length = 1000)
    private String drugInteractions;
    
    @Column(name = "refills_allowed", nullable = false)
    private Integer refillsAllowed = 0;
    
    @Column(name = "refills_used", nullable = false)
    private Integer refillsUsed = 0;
    
    @Column(name = "prescribed_quantity", nullable = false)
    private Integer prescribedQuantity;
    
    @Column(name = "dispensed_quantity", nullable = false)
    private Integer dispensedQuantity = 0;
    
    @Column(name = "dispensed_date")
    private LocalDate dispensedDate;
    
    @Column(name = "dispensed_by")
    private String dispensedBy;
    
    @Column(length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    private PrescriptionStatus status;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(name = "stop_reason", length = 500)
    private String stopReason;
    
    @Column(name = "stop_date")
    private LocalDate stopDate;
    
    @Column(name = "pharmacy_name", length = 200)
    private String pharmacyName;
    
    @Column(name = "pharmacy_address", length = 500)
    private String pharmacyAddress;
    
    @Column(name = "pharmacy_phone", length = 20)
    private String pharmacyPhone;
    
    @Column(name = "nurse_remark", length = 1000)
    private String nurseRemark;
    
    @Column(name = "patient_remark", length = 1000)
    private String patientRemark;
    
    @Column(name = "is_emergency", nullable = false)
    private Boolean isEmergency = false;
    
    @Column(name = "is_controlled_substance", nullable = false)
    private Boolean isControlledSubstance = false;
    
    @Column(name = "controlled_substance_class", length = 20)
    private String controlledSubstanceClass;

    public Prescription() {}

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    public LocalDate getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(LocalDate prescriptionDate) { this.prescriptionDate = prescriptionDate; }
    public String getMedicationName() { return medicationName; }
    public void setMedicationName(String medicationName) { this.medicationName = medicationName; }
    public String getGenericName() { return genericName; }
    public void setGenericName(String genericName) { this.genericName = genericName; }
    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public Integer getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(Integer totalQuantity) { this.totalQuantity = totalQuantity; }
    public Integer getQuantityPerDose() { return quantityPerDose; }
    public void setQuantityPerDose(Integer quantityPerDose) { this.quantityPerDose = quantityPerDose; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getSideEffects() { return sideEffects; }
    public void setSideEffects(String sideEffects) { this.sideEffects = sideEffects; }
    public String getContraindications() { return contraindications; }
    public void setContraindications(String contraindications) { this.contraindications = contraindications; }
    public String getDrugInteractions() { return drugInteractions; }
    public void setDrugInteractions(String drugInteractions) { this.drugInteractions = drugInteractions; }
    public Integer getRefillsAllowed() { return refillsAllowed; }
    public void setRefillsAllowed(Integer refillsAllowed) { this.refillsAllowed = refillsAllowed; }
    public Integer getRefillsUsed() { return refillsUsed; }
    public void setRefillsUsed(Integer refillsUsed) { this.refillsUsed = refillsUsed; }
    public Integer getPrescribedQuantity() { return prescribedQuantity; }
    public void setPrescribedQuantity(Integer prescribedQuantity) { this.prescribedQuantity = prescribedQuantity; }
    public Integer getDispensedQuantity() { return dispensedQuantity; }
    public void setDispensedQuantity(Integer dispensedQuantity) { this.dispensedQuantity = dispensedQuantity; }
    public LocalDate getDispensedDate() { return dispensedDate; }
    public void setDispensedDate(LocalDate dispensedDate) { this.dispensedDate = dispensedDate; }
    public String getDispensedBy() { return dispensedBy; }
    public void setDispensedBy(String dispensedBy) { this.dispensedBy = dispensedBy; }
    public PrescriptionStatus getStatus() { return status; }
    public void setStatus(PrescriptionStatus status) { this.status = status; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getStopReason() { return stopReason; }
    public void setStopReason(String stopReason) { this.stopReason = stopReason; }
    public LocalDate getStopDate() { return stopDate; }
    public void setStopDate(LocalDate stopDate) { this.stopDate = stopDate; }
    public String getPharmacyName() { return pharmacyName; }
    public void setPharmacyName(String pharmacyName) { this.pharmacyName = pharmacyName; }
    public String getPharmacyAddress() { return pharmacyAddress; }
    public void setPharmacyAddress(String pharmacyAddress) { this.pharmacyAddress = pharmacyAddress; }
    public String getPharmacyPhone() { return pharmacyPhone; }
    public void setPharmacyPhone(String pharmacyPhone) { this.pharmacyPhone = pharmacyPhone; }
    public String getNurseRemark() { return nurseRemark; }
    public void setNurseRemark(String nurseRemark) { this.nurseRemark = nurseRemark; }
    public String getPatientRemark() { return patientRemark; }
    public void setPatientRemark(String patientRemark) { this.patientRemark = patientRemark; }
    public Boolean getIsEmergency() { return isEmergency; }
    public void setIsEmergency(Boolean isEmergency) { this.isEmergency = isEmergency; }
    public Boolean getIsControlledSubstance() { return isControlledSubstance; }
    public void setIsControlledSubstance(Boolean isControlledSubstance) { this.isControlledSubstance = isControlledSubstance; }
    public String getControlledSubstanceClass() { return controlledSubstanceClass; }
    public void setControlledSubstanceClass(String controlledSubstanceClass) { this.controlledSubstanceClass = controlledSubstanceClass; }
    
    public boolean isActive() {
        return status == PrescriptionStatus.PRESCRIBED || status == PrescriptionStatus.DISPENSED;
    }
    
    public boolean isExpired() {
        return endDate != null && LocalDate.now().isAfter(endDate);
    }
    
    public boolean canRefill() {
        return (refillsAllowed != null && refillsUsed != null) && (refillsAllowed > refillsUsed) && !isExpired();
    }
    
    public boolean isFullCourseCompleted() {
        return (dispensedQuantity != null && prescribedQuantity != null) && (dispensedQuantity >= prescribedQuantity);
    }
    
    public int getRemainingRefills() {
        if (refillsAllowed == null || refillsUsed == null) return 0;
        return refillsAllowed - refillsUsed;
    }
    
    public double getProgressPercentage() {
        if (prescribedQuantity == null || prescribedQuantity == 0 || dispensedQuantity == null) return 0.0;
        return (double) dispensedQuantity / prescribedQuantity * 100;
    }
    
    public enum PrescriptionStatus {
        PRESCRIBED, DISPENSED, DISCONTINUED, COMPLETED, EXPIRED, CANCELLED
    }
}
