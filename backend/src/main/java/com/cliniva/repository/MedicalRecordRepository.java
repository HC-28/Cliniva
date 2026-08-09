package com.cliniva.repository;

import com.cliniva.entity.MedicalRecord;
import com.cliniva.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatient(User patient);
    
    List<MedicalRecord> findByPatient(com.cliniva.entity.Patient patient);
    
    List<MedicalRecord> findByDoctor(User doctor);
    
    Page<MedicalRecord> findByPatient(User patient, Pageable pageable);
    
    List<MedicalRecord> findByRecordDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId ORDER BY mr.recordDate DESC")
    Page<MedicalRecord> findMedicalRecordsByPatientId(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND mr.recordDate >= :date ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findRecentMedicalRecordsByPatientId(@Param("patientId") Long patientId, @Param("date") LocalDate date);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND mr.recordType = :recordType ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findMedicalRecordsByPatientAndType(@Param("patientId") Long patientId, @Param("recordType") MedicalRecord.RecordType recordType);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.isConfidential = true AND mr.patient.id = :patientId")
    List<MedicalRecord> findConfidentialRecordsByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND (LOWER(mr.chiefComplaint) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(mr.assessment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(mr.plan) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MedicalRecord> searchMedicalRecords(@Param("patientId") Long patientId, @Param("search") String search, Pageable pageable);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor.id = :doctorId AND mr.recordDate = :date ORDER BY mr.createdAt")
    List<MedicalRecord> findTodaysRecordsByDoctor(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND mr.recordDate <= :date ORDER BY mr.recordDate DESC LIMIT :limit")
    List<MedicalRecord> findLatestRecordsByPatient(@Param("patientId") Long patientId, @Param("date") LocalDate date, @Param("limit") int limit);
}
