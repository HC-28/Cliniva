package com.cliniva.controller;

import com.cliniva.dto.auth.AuthResponse;
import com.cliniva.dto.auth.LoginRequest;
import com.cliniva.dto.auth.RegisterRequest;
import com.cliniva.entity.Patient;
import com.cliniva.entity.User;
import com.cliniva.repository.PatientRepository;
import com.cliniva.repository.UserRepository;
import com.cliniva.security.CustomUserDetails;
import com.cliniva.security.JwtTokenProvider;
import com.cliniva.service.EmailService;
import com.cliniva.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Auth Controller — Stateless JWT Authentication & Role-Based Onboarding.
 */
@RestController
@RequestMapping("/api/auth")
public class RestAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public RestAuthController(AuthenticationManager authenticationManager,
                              JwtTokenProvider jwtTokenProvider,
                              UserService userService,
                              PatientRepository patientRepository,
                              UserRepository userRepository,
                              EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            String email = request.getEmail().trim().toLowerCase();
            User user = userRepository.findByEmail(email).orElse(null);

            // Check if medical staff account is pending admin verification
            if (user != null && Boolean.FALSE.equals(user.getIsVerified()) &&
               (user.getRole() == User.UserRole.DOCTOR || user.getRole() == User.UserRole.NURSE)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "error", "PENDING_APPROVAL",
                        "message", "Your clinical account is pending credential verification by the Hospital Administrator."
                ));
            }

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            String token = jwtTokenProvider.generateToken(auth);
            CustomUserDetails principal = (CustomUserDetails) auth.getPrincipal();

            // Update last login timestamp
            userService.updateLastLogin(principal.getId());

            return ResponseEntity.ok(buildAuthResponse(token, principal));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication failed. Please try again."));
        }
    }

    /**
     * POST /api/auth/register
     * Allows Patient (instant access) and Doctor/Nurse (requires Admin Approval).
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "An account with this email already exists"));
            }

            User.UserRole targetRole = User.UserRole.PATIENT;
            if (request.getRole() != null) {
                try {
                    targetRole = User.UserRole.valueOf(request.getRole().toUpperCase());
                } catch (Exception ignored) {}
            }

            boolean isStaff = (targetRole == User.UserRole.DOCTOR || targetRole == User.UserRole.NURSE);

            // Build user entity
            User user = new User();
            user.setFirstName(request.getFirstName().trim());
            user.setLastName(request.getLastName().trim());
            user.setEmail(request.getEmail().trim().toLowerCase());
            user.setPassword(request.getPassword());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole(targetRole);
            user.setIsVerified(!isStaff);  // Staff requires admin verification
            user.setIsActive(true);

            if (isStaff) {
                if (request.getSpecialization() != null) user.setSpecialization(request.getSpecialization());
                if (request.getLicenseNumber() != null) {
                    if (targetRole == User.UserRole.DOCTOR) user.setLicenseNumber(request.getLicenseNumber());
                    else user.setNurseLicense(request.getLicenseNumber());
                }
            }

            User saved = userService.createUser(user);

            // If registering as Patient, create profile and auto-login
            if (targetRole == User.UserRole.PATIENT) {
                Patient patient = new Patient();
                patient.setUser(saved);
                patient.setPatientId("CLV-" + String.format("%05d", saved.getId()));
                patient.setIsActive(true);
                patientRepository.save(patient);

                Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
                );
                String token = jwtTokenProvider.generateToken(auth);
                CustomUserDetails principal = (CustomUserDetails) auth.getPrincipal();

                emailService.sendWelcomeEmail(saved.getEmail(), saved.getFullName());
                return ResponseEntity.status(HttpStatus.CREATED).body(buildAuthResponse(token, principal));
            } else {
                // Doctor or Nurse — requires admin verification
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                        "pendingApproval", true,
                        "role", targetRole.name(),
                        "message", "Your registration has been submitted. Clinical credentials will be verified by the Hospital Administrator prior to activation."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/auth/staff/pending — list pending staff applications (Admin only)
     */
    @GetMapping("/staff/pending")
    public ResponseEntity<?> getPendingStaff() {
        List<Map<String, Object>> pending = userRepository.findAll().stream()
                .filter(u -> Boolean.FALSE.equals(u.getIsVerified()) && (u.getRole() == User.UserRole.DOCTOR || u.getRole() == User.UserRole.NURSE))
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "name", u.getFullName(),
                        "email", u.getEmail(),
                        "role", u.getRole().name(),
                        "specialization", u.getSpecialization() != null ? u.getSpecialization() : "General Clinical",
                        "licenseNumber", u.getLicenseNumber() != null ? u.getLicenseNumber() : u.getNurseLicense() != null ? u.getNurseLicense() : "PENDING-REV",
                        "registeredAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : ""
                ))
                .toList();
        return ResponseEntity.ok(pending);
    }

    /**
     * PUT /api/auth/staff/{id}/approve — approve doctor/nurse account
     */
    @PutMapping("/staff/{id}/approve")
    public ResponseEntity<?> approveStaff(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setIsVerified(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Staff account approved and activated."));
    }

    /**
     * PUT /api/auth/staff/{id}/reject — reject/delete pending staff
     */
    @PutMapping("/staff/{id}/reject")
    public ResponseEntity<?> rejectStaff(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "Staff application rejected."));
    }

    /**
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
        String token = jwtTokenProvider.generateToken(principal.getUsername(), principal.getId(), principal.getRole());
        return ResponseEntity.ok(buildAuthResponse(token, principal));
    }

    private AuthResponse buildAuthResponse(String token, CustomUserDetails principal) {
        String role = principal.getRole().toLowerCase();
        String name = principal.getDisplayName();
        String avatar = buildAvatar(name);
        return new AuthResponse(token, principal.getId(), principal.getUsername(), name, role, avatar);
    }

    private String buildAvatar(String fullName) {
        if (fullName == null || fullName.isBlank()) return "?";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
        return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
}
