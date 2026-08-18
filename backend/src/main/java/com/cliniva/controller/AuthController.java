package com.cliniva.controller;

import com.cliniva.entity.Patient;
import com.cliniva.entity.User;
import com.cliniva.repository.PatientRepository;
import com.cliniva.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final UserService userService;
    private final PatientRepository patientRepository;

    public AuthController(UserService userService, PatientRepository patientRepository) {
        this.userService = userService;
        this.patientRepository = patientRepository;
    }

    @PostMapping("/register")
    @Transactional
    public String registerUser(@ModelAttribute User user, RedirectAttributes redirectAttributes) {
        try {
            // New patients are verified and active by default for this demo
            user.setIsVerified(true);
            user.setIsActive(true);
            User savedUser = userService.createUser(user);
            
            // If the role is PATIENT, we must create a Patient profile record
            if (user.getRole() == User.UserRole.PATIENT) {
                Patient patient = new Patient();
                patient.setUser(savedUser);
                patient.setPatientId("PAT-" + System.currentTimeMillis() / 1000); // Generate simple ID
                patient.setIsActive(true);
                patientRepository.save(patient);
            }
            
            redirectAttributes.addFlashAttribute("successMessage", "Registration successful! Please login.");
            return "redirect:/hms/login.html?success";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Error: " + e.getMessage());
            return "redirect:/hms/register.html?error";
        }
    }
}

