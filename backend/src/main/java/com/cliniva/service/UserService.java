package com.cliniva.service;

import com.cliniva.entity.User;
import com.cliniva.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<User> findUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }
    
    @Transactional(readOnly = true)
    public Page<User> findUsersByRole(User.UserRole role, Pageable pageable) {
        return userRepository.findByRole(role, pageable);
    }
    
    @Transactional(readOnly = true)
    public List<User> findActiveUsers() {
        return userRepository.findAllActiveUsers();
    }
    
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Transactional(readOnly = true)
    public Page<User> searchUsers(String search, Pageable pageable) {
        return userRepository.searchUsers(search, pageable);
    }
    
    @Transactional
    public User saveUser(User user) {
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
    
    @Transactional
    public User createUser(User user) {
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with email " + user.getEmail() + " already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setIsVerified(false);
        user.setIsActive(true);
        // user.setIsDeleted(false); // BaseEntity sets this by default
        
        return userRepository.save(user);
    }
    
    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsActive(false);
            // user.setIsDeleted(true); // Need to add this to BaseEntity if it exists
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void activateUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsActive(true);
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void deactivateUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsActive(false);
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void verifyUser(Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setIsVerified(true);
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        userRepository.findById(userId).ifPresent(user -> {
            if (passwordEncoder.matches(oldPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                log.info("Password changed successfully for user: {}", user.getEmail());
            } else {
                throw new RuntimeException("Invalid old password");
            }
        });
    }
    
    @Transactional
    public void resetPassword(String email, String newPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetPasswordToken(null);
            user.setResetPasswordExpires(null);
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void updateLastLogin(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLastLogin(LocalDateTime.now());
            user.setLoginAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void incrementLoginAttempts(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            int attempts = (user.getLoginAttempts() != null ? user.getLoginAttempts() : 0) + 1;
            user.setLoginAttempts(attempts);
            
            // Lock account after 5 failed attempts
            if (attempts >= 5) {
                user.setLockedUntil(LocalDateTime.now().plusMinutes(30));
            }
            
            userRepository.save(user);
        });
    }
    
    @Transactional
    public void unlockAccount(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setLoginAttempts(0);
            user.setLockedUntil(null);
            userRepository.save(user);
        });
    }
    
    @Transactional(readOnly = true)
    public List<User> findActiveDoctors() {
        return userRepository.findActiveUsersByRole(User.UserRole.DOCTOR);
    }
    
    @Transactional(readOnly = true)
    public List<User> findActiveNurses() {
        return userRepository.findActiveUsersByRole(User.UserRole.NURSE);
    }
    
    @Transactional(readOnly = true)
    public List<User> findActivePatients() {
        return userRepository.findActiveUsersByRole(User.UserRole.PATIENT);
    }
    
    @Transactional(readOnly = true)
    public List<User> findActiveAdmins() {
        return userRepository.findActiveUsersByRole(User.UserRole.ADMIN);
    }
    
    @Transactional(readOnly = true)
    public List<User> findDoctorsBySpecialization(String specialization) {
        return userRepository.findDoctorsBySpecialization(specialization);
    }
    
    @Transactional(readOnly = true)
    public Long countActiveUsersByRole(User.UserRole role) {
        return userRepository.countActiveUsersByRole(role);
    }
}
