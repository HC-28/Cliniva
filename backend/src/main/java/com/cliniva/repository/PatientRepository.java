package com.cliniva.repository;

import com.cliniva.entity.Patient;
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
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Patient findByUser(User user);
    
    Patient findByPatientId(String patientId);
    
    List<Patient> findByUser_Role(User.UserRole role);
    
    @Query("SELECT p FROM Patient p WHERE p.user.id = :userId")
    Patient findByUserId(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Patient p WHERE p.primaryDoctor.id = :doctorId")
    List<Patient> findByPrimaryDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT p FROM Patient p WHERE p.department.id = :departmentId")
    List<Patient> findByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT p FROM Patient p WHERE p.admissionDate IS NOT NULL AND p.dischargeDate IS NULL")
    List<Patient> findCurrentlyAdmittedPatients();
    
    @Query("SELECT p FROM Patient p WHERE p.admissionDate >= :startDate AND p.admissionDate <= :endDate")
    List<Patient> findPatientsAdmittedInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Patient p WHERE p.dischargeDate >= :startDate AND p.dischargeDate <= :endDate")
    List<Patient> findPatientsDischargedInPeriod(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p FROM Patient p WHERE (LOWER(p.user.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.user.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.patientId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.user.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Patient> searchPatients(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT p FROM Patient p WHERE p.bloodGroup = :bloodGroup AND p.user.isActive = true")
    List<Patient> findPatientsByBloodGroup(@Param("bloodGroup") String bloodGroup);
    
    @Query("SELECT p FROM Patient p WHERE p.followUpRequired = true AND p.followUpDate <= :date")
    List<Patient> findPatientsDueForFollowUp(@Param("date") LocalDate date);
    
    @Query("SELECT p FROM Patient p WHERE p.user.isVerified = true AND p.user.isActive = true")
    List<Patient> findVerifiedActivePatients();
}
