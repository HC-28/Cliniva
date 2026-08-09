package com.cliniva.repository;

import com.cliniva.entity.VitalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VitalRecordRepository extends JpaRepository<VitalRecord, Long> {

    /** Latest single reading for a patient */
    Optional<VitalRecord> findTopByPatientIdOrderByRecordedAtDesc(String patientId);

    /** Last N readings for trend sparklines */
    @Query("SELECT v FROM VitalRecord v WHERE v.patientId = :patientId ORDER BY v.recordedAt DESC LIMIT :limit")
    List<VitalRecord> findRecentByPatientId(@Param("patientId") String patientId, @Param("limit") int limit);
}
