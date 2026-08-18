package com.cliniva.controller;

import com.cliniva.entity.*;
import com.cliniva.repository.PatientRepository;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.service.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/hms/api/patient")
public class PatientController {
    
    private final UserService userService;
    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;
    private final MedicalRecordService medicalRecordService;
    private final PrescriptionService prescriptionService;
    private final BillService billService;

    public PatientController(UserService userService, PatientRepository patientRepository, 
                            AppointmentService appointmentService, MedicalRecordService medicalRecordService, 
                            PrescriptionService prescriptionService, BillService billService) {
        this.userService = userService;
        this.patientRepository = patientRepository;
        this.appointmentService = appointmentService;
        this.medicalRecordService = medicalRecordService;
        this.prescriptionService = prescriptionService;
        this.billService = billService;
    }
    
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Long patientId = userDetails.getId();
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // Recent appointments
        dashboardData.put("recentAppointments", appointmentService.getRecentAppointmentsForPatient(patientId, 5));
        
        // Recent medical records
        dashboardData.put("recentRecords", medicalRecordService.getRecentMedicalRecordsForPatient(patientId, 5));
        
        // Recent prescriptions
        dashboardData.put("recentPrescriptions", prescriptionService.getRecentPrescriptionsForPatient(patientId, 5));
        
        // Outstanding bill amount
        dashboardData.put("outstandingAmount", billService.getOutstandingAmountForPatient(patientId).orElse(BigDecimal.ZERO));
        
        return ResponseEntity.ok(dashboardData);
    }
    
    @GetMapping("/appointments")
    public ResponseEntity<Page<Appointment>> getAppointments(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDate,desc") String sort) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size, Sort.by(sort.split(",")[0]).descending());
        
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(userDetails.getId(), pageable));
    }
    
    @PostMapping("/appointments/book")
    public ResponseEntity<?> bookAppointment(
            Authentication authentication,
            @RequestBody AppointmentRequest request) {
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        
        User patientUser = userService.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Patient user not found"));
        
        Patient patient = patientRepository.findByUser(patientUser);
        if (patient == null) {
            throw new RuntimeException("Patient record not found");
        }
                
        User doctor = userService.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Appointment appointment = appointmentService.bookAppointment(
                patient,
                doctor,
                request.getAppointmentDate(),
                request.getAppointmentTime(),
                request.getReason(),
                request.getNotes()
        );
        
        return ResponseEntity.ok(appointment);
    }
    
    public static class AppointmentRequest {
        @NotNull private Long doctorId;
        @NotNull private LocalDate appointmentDate;
        @NotBlank private String appointmentTime;
        @NotBlank private String reason;
        private String notes;

        public AppointmentRequest() {}

        public Long getDoctorId() { return doctorId; }
        public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
        public LocalDate getAppointmentDate() { return appointmentDate; }
        public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
        public String getAppointmentTime() { return appointmentTime; }
        public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
}
