package com.cliniva.service;

import com.cliniva.entity.ClinicalProcedure;
import com.cliniva.repository.ClinicalProcedureRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Cliniva Platform — ClinicalProcedureService
 * Business logic for procedure scheduling and status management.
 */
@Service
public class ClinicalProcedureService {

    private final ClinicalProcedureRepository procedureRepository;

    public ClinicalProcedureService(ClinicalProcedureRepository procedureRepository) {
        this.procedureRepository = procedureRepository;
    }

    /** Returns all procedures scheduled for today, ordered by time */
    public List<ClinicalProcedure> getTodaySchedule() {
        return procedureRepository.findByScheduledDateOrderByScheduledTimeAsc(LocalDate.now());
    }

    /** Returns today's procedures filtered by status */
    public List<ClinicalProcedure> getTodayScheduleByStatus(String status) {
        return procedureRepository.findByScheduledDateAndProcedureStatusOrderByScheduledTimeAsc(
                LocalDate.now(), status);
    }
}
