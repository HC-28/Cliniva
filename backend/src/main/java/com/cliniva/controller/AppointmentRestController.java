package com.cliniva.controller;

import com.cliniva.dto.AppointmentDto;
import com.cliniva.entity.Appointment;
import com.cliniva.entity.Patient;
import com.cliniva.entity.User;
import com.cliniva.repository.AppointmentRepository;
import com.cliniva.repository.PatientRepository;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.service.AppointmentService;
import com.cliniva.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hms/api/appointments")
public class AppointmentRestController {

    private final AppointmentService appointmentService;
    private final PatientRepository patientRepository;
    private final UserService userService;
    private final AppointmentRepository appointmentRepository;
    private final com.cliniva.service.EmailService emailService;

    public AppointmentRestController(AppointmentService appointmentService,
                                     PatientRepository patientRepository,
                                     UserService userService,
                                     AppointmentRepository appointmentRepository,
                                     com.cliniva.service.EmailService emailService) {
        this.appointmentService = appointmentService;
        this.patientRepository = patientRepository;
        this.userService = userService;
        this.appointmentRepository = appointmentRepository;
        this.emailService = emailService;
    }

    /** GET /hms/api/appointments/doctors — list of active doctors for booking dropdown */
    @GetMapping("/doctors")
    public ResponseEntity<List<Map<String, Object>>> getDoctors() {
        List<Map<String, Object>> doctors = userService.findActiveDoctors().stream()
                .map(d -> Map.<String, Object>of(
                        "id", d.getId(),
                        "name", d.getFullName(),
                        "specialization", d.getSpecialization() != null ? d.getSpecialization() : "",
                        "consultationFee", d.getConsultationFee() != null ? d.getConsultationFee() : 0
                ))
                .toList();
        return ResponseEntity.ok(doctors);
    }

    /** GET /hms/api/appointments — patient's own appointments */
    @GetMapping
    public ResponseEntity<?> getMyAppointments(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        String role = principal.getRole();
        if ("PATIENT".equals(role)) {
            Patient patient = patientRepository.findByUserId(principal.getId());
            if (patient == null) return ResponseEntity.status(404).body(Map.of("error", "Patient profile not found"));
            List<AppointmentDto> list = appointmentService
                    .getRecentAppointmentsForPatient(patient.getId(), 50)
                    .stream().map(AppointmentDto::from).toList();
            return ResponseEntity.ok(list);
        }

        // ADMIN / DOCTOR / NURSE: return all
        List<AppointmentDto> all = appointmentService.findAll()
                .stream().map(AppointmentDto::from).toList();
        return ResponseEntity.ok(all);
    }

    /** POST /hms/api/appointments — book an appointment (PATIENT role) */
    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, Object> body) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        try {
            Patient patient = patientRepository.findByUserId(principal.getId());
            if (patient == null) return ResponseEntity.status(404).body(Map.of("error", "Patient profile not found"));

            Long doctorId = Long.valueOf(body.get("doctorId").toString());
            User doctor = userService.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            LocalDate date = LocalDate.parse(body.get("appointmentDate").toString());
            String time = body.get("appointmentTime").toString();
            String reason = (String) body.getOrDefault("reason", "");
            String notes  = (String) body.getOrDefault("notes", "");

            Appointment booked = appointmentService.bookAppointment(patient, doctor, date, time, reason, notes);

            // Dispatch confirmation email asynchronously with fallback
            if (patient.getUser() != null && patient.getUser().getEmail() != null) {
                emailService.sendAppointmentConfirmation(
                        patient.getUser().getEmail(),
                        patient.getUser().getFullName(),
                        doctor.getFullName(),
                        date.toString(),
                        time,
                        reason
                );
            }

            return ResponseEntity.status(201).body(AppointmentDto.from(booked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** PUT /hms/api/appointments/{id}/cancel */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        try {
            String reason = body != null ? body.getOrDefault("reason", "Cancelled by user") : "Cancelled by user";
            Appointment cancelled = appointmentService.cancelAppointment(id, reason);
            return ResponseEntity.ok(AppointmentDto.from(cancelled));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
