package com.cliniva.repository;

import com.cliniva.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop50ByOrderByTimestampDesc();
    List<AuditLog> findByPatientIdOrderByTimestampDesc(String patientId);
    List<AuditLog> findByActorEmailOrderByTimestampDesc(String actorEmail);
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
