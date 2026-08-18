package com.cliniva.controller;

import com.cliniva.dto.PrescriptionDto;
import com.cliniva.entity.Patient;
import com.cliniva.repository.PatientRepository;
import com.cliniva.repository.PrescriptionRepository;
import com.cliniva.security.CustomUserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hms/api/prescriptions")
public class PrescriptionRestController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;

    public PrescriptionRestController(PrescriptionRepository prescriptionRepository,
                                      PatientRepository patientRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public ResponseEntity<?> getPrescriptions(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        String role = principal.getRole();
        if ("PATIENT".equals(role)) {
            Patient patient = patientRepository.findByUserId(principal.getId());
            if (patient == null) return ResponseEntity.ok(List.of());
            List<PrescriptionDto> list = prescriptionRepository
                    .findByPatient(patient).stream()
                    .map(PrescriptionDto::from).toList();
            return ResponseEntity.ok(list);
        }
        // Staff sees all
        List<PrescriptionDto> all = prescriptionRepository.findAll()
                .stream().map(PrescriptionDto::from).toList();
        return ResponseEntity.ok(all);
    }
}
