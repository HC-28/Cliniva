package com.cliniva.repository;

import com.cliniva.entity.BioPod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BioPodRepository extends JpaRepository<BioPod, Long> {
    List<BioPod> findAllByOrderByPodCodeAsc();
    Optional<BioPod> findByPodCode(String podCode);
    List<BioPod> findByPodStatus(String podStatus);
    List<BioPod> findByWardName(String wardName);
}
