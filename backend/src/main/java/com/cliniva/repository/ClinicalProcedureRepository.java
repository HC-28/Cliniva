package com.cliniva.repository;

import com.cliniva.entity.ClinicalProcedure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClinicalProcedureRepository extends JpaRepository<ClinicalProcedure, Long> {
    List<ClinicalProcedure> findByScheduledDateOrderByScheduledTimeAsc(LocalDate date);
    List<ClinicalProcedure> findByScheduledDateAndProcedureStatusOrderByScheduledTimeAsc(LocalDate date, String status);
}
