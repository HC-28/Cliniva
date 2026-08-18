package com.cliniva.controller;

import com.cliniva.dto.PatientDto;
import com.cliniva.entity.Patient;
import com.cliniva.entity.User;
import com.cliniva.repository.PatientRepository;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.service.AuditService;
import com.cliniva.service.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PatientRestController — REST endpoints for patient data with HIPAA audit controls.
 */
@RestController
@RequestMapping("/hms/api/patients")
public class PatientRestController {

    private final PatientRepository patientRepository;
    private final UserService userService;
    private final AuditService auditService;

    public PatientRestController(PatientRepository patientRepository,
                                 UserService userService,
                                 AuditService auditService) {
        this.patientRepository = patientRepository;
        this.userService = userService;
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<PatientDto>> getAllPatients(
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal CustomUserDetails principal) {
        List<Patient> list;
        if (search != null && !search.isBlank()) {
            list = patientRepository.searchPatients(search.trim(), PageRequest.of(0, 50)).getContent();
        } else {
            list = patientRepository.findAll()
                    .stream()
                    .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                    .toList();
        }

        if (principal != null) {
            auditService.logAccess(
                    principal.getId(), principal.getUsername(), principal.getUsername(),
                    principal.getRole(), "PATIENT_DIRECTORY_LOOKUP", null, "Patient", "ALL",
                    "127.0.0.1", "Patient directory query. Filter: " + (search != null ? search : "none")
            );
        }

        return ResponseEntity.ok(list.stream().map(PatientDto::from).toList());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PatientDto>> searchPatients(
            @RequestParam String query,
            @AuthenticationPrincipal CustomUserDetails principal) {
        List<PatientDto> patients = patientRepository.searchPatients(query.trim(), PageRequest.of(0, 30))
                .getContent()
                .stream()
                .map(PatientDto::from)
                .toList();

        if (principal != null) {
            auditService.logAccess(
                    principal.getId(), principal.getUsername(), principal.getUsername(),
                    principal.getRole(), "SEARCH_PATIENT_PHI", null, "Patient", "MULTIPLE",
                    "127.0.0.1", "Searched patient directory for query: " + query
            );
        }

        return ResponseEntity.ok(patients);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        Patient patient = patientRepository.findByUserId(principal.getId());
        if (patient == null) return ResponseEntity.status(404).body(Map.of("error", "Patient profile not found"));
        return ResponseEntity.ok(PatientDto.from(patient));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails principal,
            @RequestBody PatientDto updates) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        Patient patient = patientRepository.findByUserId(principal.getId());
        if (patient == null) return ResponseEntity.status(404).body(Map.of("error", "Patient profile not found"));

        if (updates.getBloodGroup() != null) patient.setBloodGroup(updates.getBloodGroup());
        if (updates.getEmergencyContactName() != null) patient.setEmergencyContactName(updates.getEmergencyContactName());
        if (updates.getEmergencyContactPhone() != null) patient.setEmergencyContactPhone(updates.getEmergencyContactPhone());
        if (updates.getEmergencyContactRelation() != null) patient.setEmergencyContactRelation(updates.getEmergencyContactRelation());
        if (updates.getOccupation() != null) patient.setOccupation(updates.getOccupation());
        if (updates.getAllergies() != null) patient.setAllergies(updates.getAllergies());
        if (updates.getHeightCm() != null) patient.setHeightCm(updates.getHeightCm());
        if (updates.getWeightKg() != null) patient.setWeightKg(updates.getWeightKg());

        User user = patient.getUser();
        if (user != null) {
            if (updates.getPhoneNumber() != null) user.setPhoneNumber(updates.getPhoneNumber());
            userService.updateUser(user);
        }

        patientRepository.save(patient);

        auditService.logAccess(
                principal.getId(), principal.getUsername(), principal.getUsername(),
                principal.getRole(), "UPDATE_PATIENT_PROFILE", patient.getPatientId(), "Patient",
                String.valueOf(patient.getId()), "127.0.0.1", "Self-service patient profile update"
        );

        return ResponseEntity.ok(PatientDto.from(patient));
    }
}
