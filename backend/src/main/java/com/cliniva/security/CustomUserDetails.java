package com.cliniva.security;

import com.cliniva.entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    
    @JsonIgnore
    private String password;
    
    private Collection<? extends GrantedAuthority> authorities;
    private boolean isActive;
    private boolean isVerified;
    private User.UserRole role;
    private String specialization;
    private String licenseNumber;
    
    public static CustomUserDetails create(User user) {
        List<GrantedAuthority> authorities = user.getAuthorities().stream()
                .collect(Collectors.toList());
        
        return new CustomUserDetails(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                user.getIsActive() != null ? user.getIsActive() : true,
                user.getIsVerified() != null ? user.getIsVerified() : false,
                user.getRole(),
                user.getSpecialization(),
                user.getLicenseNumber()
        );
    }
    
    public CustomUserDetails(Long id, String firstName, String lastName, String email, String password,
                           Collection<? extends GrantedAuthority> authorities, boolean isActive, 
                           boolean isVerified, User.UserRole role, String specialization, String licenseNumber) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
        this.isVerified = isVerified;
        this.role = role;
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getRole() { return role != null ? role.name() : null; }
    public String getDisplayName() { return getFullName(); }
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }
    
    @Override
    public String getPassword() {
        return password;
    }
    
    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        return isActive && isVerified;
    }
    
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    public boolean isDoctor() {
        return role == User.UserRole.DOCTOR;
    }
    
    public boolean isNurse() {
        return role == User.UserRole.NURSE;
    }
    
    public boolean isPatient() {
        return role == User.UserRole.PATIENT;
    }
    
    public boolean isAdmin() {
        return role == User.UserRole.ADMIN;
    }
}
