package com.cliniva.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collection;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index"; // Resolves to hms/index.html via ThymeleafConfig
    }

    @GetMapping("/hms/index.html")
    public String index() {
        return "index";
    }

    @GetMapping("/hms/login.html")
    public String login() {
        return "login";
    }

    @GetMapping("/hms/register.html")
    public String register() {
        return "register";
    }

    @GetMapping("/dashboard")
    public String dashboardRedirect(Authentication authentication) {
        if (authentication == null) {
            return "redirect:/login";
        }
        
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        for (GrantedAuthority authority : authorities) {
            String role = authority.getAuthority();
            if (role.equals("ROLE_ADMIN")) {
                return "redirect:/hms/dashboard-admin.html";
            } else if (role.equals("ROLE_DOCTOR")) {
                return "redirect:/hms/dashboard-doctor.html";
            } else if (role.equals("ROLE_NURSE")) {
                return "redirect:/hms/dashboard-nurse.html";
            } else if (role.equals("ROLE_PATIENT")) {
                return "redirect:/hms/dashboard-patient.html";
            }
        }
        return "redirect:/";
    }

    // Serve other pages through template engine to process th: fragments
    @GetMapping({"/hms/appointments.html", "/appointments"})
    public String appointments() { return "appointments"; }

    @GetMapping({"/hms/patients.html", "/patients"})
    public String patients() { return "patients"; }

    @GetMapping({"/hms/billing.html", "/billing"})
    public String billing() { return "billing"; }

    @GetMapping({"/hms/medical-records.html", "/medical-records"})
    public String medicalRecords() { return "medical-records"; }

    @GetMapping({"/hms/prescriptions.html", "/prescriptions"})
    public String prescriptions() { return "prescriptions"; }

    @GetMapping({"/hms/admin/users.html", "/admin/users"})
    public String adminUsers() { return "admin-users"; }

    @GetMapping("/hms/dashboard-doctor.html")
    public String doctorDashboard() { return "dashboard-doctor"; }

    @GetMapping("/hms/dashboard-patient.html")
    public String patientDashboard() { return "dashboard-patient"; }

    @GetMapping("/hms/dashboard-admin.html")
    public String adminDashboard() { return "dashboard-admin"; }
    
    @GetMapping("/hms/dashboard-nurse.html")
    public String nurseDashboard() { return "dashboard-nurse"; }
}
