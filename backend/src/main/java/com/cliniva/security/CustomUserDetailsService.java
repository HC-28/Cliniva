package com.cliniva.security;

import com.cliniva.entity.User;
import com.cliniva.service.UserService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(CustomUserDetailsService.class);
    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }
    
    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Security verify trigger: attempting to load user identity [{}]", email);
        User user = userService.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Security verify fail: identity [{}] not found in HMS registry", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
        
        log.info("Security verify: identity [{}] verified, granted roles: {}", email, user.getAuthorities());
        return CustomUserDetails.create(user);
    }
    
    public CustomUserDetails loadUserById(Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        
        return CustomUserDetails.create(user);
    }
}
