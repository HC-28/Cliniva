package com.cliniva.service;

import com.cliniva.entity.MedicalRecord;
import com.cliniva.repository.MedicalRecordRepository;
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
public class MedicalRecordService {
    
    private static final Logger log = LoggerFactory.getLogger(MedicalRecordService.class);
    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }
    
    @Transactional(readOnly = true)
    public Optional<MedicalRecord> findById(Long id) {
        return medicalRecordRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<MedicalRecord> findAll() {
        return medicalRecordRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<MedicalRecord> getRecentMedicalRecordsForPatient(Long patientId, int limit) {
        return medicalRecordRepository.findLatestRecordsByPatient(patientId, LocalDate.now(), limit);
    }
    
    @Transactional(readOnly = true)
    public Page<MedicalRecord> getMedicalRecordsForPatient(Long patientId, Pageable pageable) {
        return medicalRecordRepository.findMedicalRecordsByPatientId(patientId, pageable);
    }
    
    @Transactional
    public MedicalRecord createMedicalRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }
}
