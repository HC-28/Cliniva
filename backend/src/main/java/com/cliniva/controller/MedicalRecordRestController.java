package com.cliniva.controller;

import com.cliniva.dto.MedicalRecordDto;
import com.cliniva.entity.MedicalRecord;
import com.cliniva.entity.Patient;
import com.cliniva.entity.User;
import com.cliniva.repository.MedicalRecordRepository;
import com.cliniva.repository.PatientRepository;
import com.cliniva.repository.UserRepository;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hms/api/medical-records")
public class MedicalRecordRestController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public MedicalRecordRestController(MedicalRecordRepository medicalRecordRepository,
                                       PatientRepository patientRepository,
                                       UserRepository userRepository,
                                       AuditService auditService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<?> getMedicalRecords(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        String role = principal.getRole();
        if ("PATIENT".equals(role)) {
            Patient patient = patientRepository.findByUserId(principal.getId());
            if (patient == null) return ResponseEntity.ok(List.of());
            List<MedicalRecordDto> list = medicalRecordRepository
                    .findByPatient(patient).stream()
                    .map(MedicalRecordDto::from).toList();

            // HIPAA Audit Log
            auditService.logAccess(principal.getId(), principal.getUsername(), principal.getUsername(),
                    role, "PATIENT_SELF_EHR_VIEW", patient.getPatientId(), "MedicalRecord", "ALL",
                    "127.0.0.1", "Patient reviewed their own EHR history");

            return ResponseEntity.ok(list);
        }

        List<MedicalRecordDto> all = medicalRecordRepository.findAll()
                .stream().map(MedicalRecordDto::from).toList();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/patient/{identifier}")
    public ResponseEntity<?> getRecordsForPatient(
            @PathVariable String identifier,
            @AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        Patient patient = null;
        try {
            Long numericId = Long.parseLong(identifier);
            patient = patientRepository.findById(numericId).orElse(null);
        } catch (NumberFormatException ignored) {}

        if (patient == null) {
            patient = patientRepository.findByPatientId(identifier);
        }

        if (patient == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Patient not found with identifier: " + identifier));
        }

        List<MedicalRecord> records = medicalRecordRepository.findByPatient(patient);
        List<MedicalRecordDto> dtoList = records.stream().map(MedicalRecordDto::from).toList();

        // HIPAA Audit Log
        auditService.logAccess(
                principal.getId(),
                principal.getUsername(),
                principal.getUsername(),
                principal.getRole(),
                "PHYSICIAN_VIEW_EHR",
                patient.getPatientId(),
                "MedicalRecord",
                String.valueOf(patient.getId()),
                "127.0.0.1",
                "Accessed medical records for patient " + patient.getPatientId()
        );

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping
    public ResponseEntity<?> createMedicalRecord(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody Map<String, Object> payload) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        String patientIdent = (String) payload.get("patientId");
        if (patientIdent == null || patientIdent.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "patientId is required"));
        }

        Patient patient = patientRepository.findByPatientId(patientIdent);
        if (patient == null) {
            try {
                Long pId = Long.parseLong(patientIdent);
                patient = patientRepository.findById(pId).orElse(null);
            } catch (Exception ignored) {}
        }
        if (patient == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Patient not found: " + patientIdent));
        }

        User doctor = userRepository.findById(principal.getId()).orElse(null);

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setRecordDate(LocalDate.now());

        String typeStr = (String) payload.getOrDefault("recordType", "CONSULTATION");
        try {
            record.setRecordType(MedicalRecord.RecordType.valueOf(typeStr.toUpperCase()));
        } catch (Exception e) {
            record.setRecordType(MedicalRecord.RecordType.CONSULTATION);
        }

        record.setChiefComplaint((String) payload.getOrDefault("chiefComplaint", "Clinical Consultation"));
        record.setPresentIllness((String) payload.getOrDefault("presentIllness", ""));
        record.setAssessment((String) payload.getOrDefault("assessment", ""));
        record.setPlan((String) payload.getOrDefault("plan", ""));
        record.setFollowUpInstructions((String) payload.getOrDefault("followUpInstructions", ""));

        if (payload.get("heartRate") != null) record.setHeartRate(((Number) payload.get("heartRate")).intValue());
        if (payload.get("temperature") != null) record.setTemperature(((Number) payload.get("temperature")).doubleValue());
        if (payload.get("bloodPressureSystolic") != null) record.setBloodPressureSystolic(((Number) payload.get("bloodPressureSystolic")).intValue());
        if (payload.get("bloodPressureDiastolic") != null) record.setBloodPressureDiastolic(((Number) payload.get("bloodPressureDiastolic")).intValue());
        if (payload.get("oxygenSaturation") != null) record.setOxygenSaturation(((Number) payload.get("oxygenSaturation")).doubleValue());
        if (payload.get("isConfidential") != null) record.setIsConfidential((Boolean) payload.get("isConfidential"));

        MedicalRecord saved = medicalRecordRepository.save(record);

        // HIPAA Audit Log
        auditService.logAccess(
                principal.getId(),
                doctor != null ? doctor.getFullName() : principal.getUsername(),
                principal.getUsername(),
                principal.getRole(),
                "CREATE_MEDICAL_RECORD",
                patient.getPatientId(),
                "MedicalRecord",
                String.valueOf(saved.getId()),
                "127.0.0.1",
                "Created new clinical record: " + record.getChiefComplaint()
        );

        return ResponseEntity.ok(MedicalRecordDto.from(saved));
    }
}
