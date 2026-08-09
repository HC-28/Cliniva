package com.cliniva.repository;

import com.cliniva.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(User.UserRole role);
    
    Page<User> findByRole(User.UserRole role, Pageable pageable);
    
    List<User> findByFirstNameAndLastName(String firstName, String lastName);
    
    List<User> findByIsVerifiedAndRole(Boolean isVerified, User.UserRole role);
    
    List<User> findByIsActiveAndRole(Boolean isActive, User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.isActive = true AND u.isDeleted = false")
    List<User> findAllActiveUsers();
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true AND u.isDeleted = false")
    Optional<User> findActiveUserByEmail(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.isActive = true AND u.isDeleted = false")
    List<User> findActiveUsersByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.role = 'DOCTOR' AND (u.specialization = :specialization OR :specialization IS NULL) AND u.isActive = true")
    List<User> findDoctorsBySpecialization(@Param("specialization") String specialization);
    
    @Query("SELECT u FROM User u WHERE u.role = 'NURSE' AND u.isActive = true")
    List<User> findActiveNurses();
    
    @Query("SELECT u FROM User u WHERE u.lastLogin < :cutoffDate AND u.isActive = true")
    List<User> findInactiveUsers(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isActive = true")
    Long countActiveUsersByRole(@Param("role") User.UserRole role);
    
    @Query("SELECT u FROM User u WHERE (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND u.isActive = true")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);
}
