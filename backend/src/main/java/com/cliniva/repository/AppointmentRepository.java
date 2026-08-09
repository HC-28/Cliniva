package com.cliniva.repository;

import com.cliniva.entity.Appointment;
import com.cliniva.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(User patient);
    
    List<Appointment> findByDoctor(User doctor);
    
    List<Appointment> findByNurse(User nurse);
    
    Page<Appointment> findByPatient(User patient, Pageable pageable);
    
    Page<Appointment> findByDoctor(User doctor, Pageable pageable);
    
    List<Appointment> findByAppointmentDateAndDoctor(LocalDate date, User doctor);
    
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.status != 'CANCELLED' ORDER BY a.appointmentDate DESC")
    List<Appointment> findRecentAppointmentsByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date ORDER BY a.appointmentTime")
    List<Appointment> findTodaysAppointments(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate > :date AND a.status IN ('SCHEDULED', 'CONFIRMED')")
    List<Appointment> findUpcomingAppointments(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.status = 'SCHEDULED'")
    List<Appointment> findTodaysScheduledAppointments(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate")
    List<Appointment> findAppointmentsByDoctorAndDateRange(@Param("doctorId") Long doctorId, 
                                                          @Param("startDate") LocalDate startDate, 
                                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate = :date")
    Long countAppointmentsForDoctorOnDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date AND a.appointmentTime BETWEEN :startTime AND :endTime AND a.doctor.id = :doctorId")
    List<Appointment> findConflictingAppointments(@Param("doctorId") Long doctorId, 
                                                  @Param("date") LocalDate date, 
                                                  @Param("startTime") LocalDateTime startTime, 
                                                  @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.appointmentDate >= :date")
    List<Appointment> findFutureAppointmentsByPatient(@Param("patientId") Long patientId, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.appointmentDate < :date")
    List<Appointment> findOverdueAppointments(@Param("status") Appointment.AppointmentStatus status, @Param("date") LocalDate date);
    
    @Query("SELECT a FROM Appointment a WHERE a.isEmergency = true AND a.status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS')")
    List<Appointment> findEmergencyAppointments();
    
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.appointmentDate DESC")
    Page<Appointment> findPatientAppointmentsByPatientId(@Param("patientId") Long patientId, Pageable pageable);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    Page<Appointment> findDoctorAppointmentsByDoctorId(@Param("doctorId") Long doctorId, Pageable pageable);
}
