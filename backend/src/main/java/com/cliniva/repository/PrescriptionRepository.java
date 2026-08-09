package com.cliniva.repository;

import com.cliniva.entity.Prescription;
import com.cliniva.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatient(com.cliniva.entity.Patient patient);

    // Corrected Query: Using JPQL to filter refills available based on refillsAllowed, refillsUsed and expiry date
    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId " +
            "AND p.refillsAllowed > p.refillsUsed " +
            "AND (p.endDate IS NULL OR p.endDate > CURRENT_DATE) " +
            "ORDER BY p.prescriptionDate DESC")
    List<Prescription> findRefillablePrescriptions(@Param("patientId") Long patientId);

    // Other methods...

    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId AND p.endDate <= :date AND p.status = 'PRESCRIBED'")
    List<Prescription> findExpiredPrescriptions(@Param("patientId") Long patientId, @Param("date") LocalDate date);

    // Example of other repository queries that should stay the same:
    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId ORDER BY p.prescriptionDate DESC")
    Page<Prescription> findPrescriptionsByPatientId(@Param("patientId") Long patientId, Pageable pageable);

    @Query("SELECT p FROM Prescription p WHERE p.doctor.id = :doctorId AND p.prescriptionDate = :date")
    List<Prescription> findTodaysPrescriptionsByDoctor(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId AND (LOWER(p.medicationName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.instructions) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY p.prescriptionDate DESC")
    Page<Prescription> searchPrescriptions(@Param("patientId") Long patientId, @Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Prescription p WHERE p.patient.id = :patientId AND p.dispensedDate IS NOT NULL ORDER BY p.dispensedDate DESC")
    List<Prescription> findDispensedPrescriptionsByPatient(@Param("patientId") Long patientId);

    @Query("SELECT p FROM Prescription p WHERE p.isControlledSubstance = true AND p.status = 'PRESCRIBED'")
    List<Prescription> findControlledSubstancePrescriptions();

    @Query("SELECT p FROM Prescription p WHERE p.isEmergency = true AND p.status IN ('PRESCRIBED', 'DISPENSED')")
    List<Prescription> findEmergencyPrescriptions();

}


