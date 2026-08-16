package com.cliniva.service;

import com.cliniva.entity.Prescription;
import com.cliniva.repository.PrescriptionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {
    
    private static final Logger log = LoggerFactory.getLogger(PrescriptionService.class);
    private final PrescriptionRepository prescriptionRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    
    @Transactional(readOnly = true)
    public Optional<Prescription> findById(Long id) {
        return prescriptionRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<Prescription> findAll() {
        return prescriptionRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<Prescription> getRecentPrescriptionsForPatient(Long patientId, int limit) {
        // Since there's no direct method in repo for this, we use the list and limit
        // Or we could have added findLatestRecordsByPatient like in MedicalRecord
        // Let's just use the pageable for now
        return prescriptionRepository.findPrescriptionsByPatientId(patientId, Pageable.ofSize(limit)).getContent();
    }
    
    @Transactional(readOnly = true)
    public Page<Prescription> getPrescriptionsForPatient(Long patientId, Pageable pageable) {
        return prescriptionRepository.findPrescriptionsByPatientId(patientId, pageable);
    }
    
    @Transactional
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
}
