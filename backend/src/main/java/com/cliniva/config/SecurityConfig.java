package com.cliniva.config;

import com.cliniva.security.CustomUserDetailsService;
import com.cliniva.security.JwtAuthenticationFilter;
import com.cliniva.security.RestAuthenticationEntryPoint;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * SecurityConfig — Stateless JWT security.
 *
 * Auth flow:
 *   React → POST /api/auth/login → JWT returned in body
 *   React stores token in localStorage
 *   Every subsequent request: Authorization: Bearer <token>
 *   JwtAuthenticationFilter validates token and sets SecurityContext
 *
 * Fallback: if JwtAuthenticationFilter finds no/invalid token,
 * the request proceeds unauthenticated → protected routes return 401 JSON
 * (via RestAuthenticationEntryPoint, NOT an HTML redirect).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          RestAuthenticationEntryPoint restAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(restAuthenticationEntryPoint)
            )
            .authorizeHttpRequests(authorize -> authorize
                // Health check (used by frontend to detect if backend is up)
                .requestMatchers("/actuator/health").permitAll()

                // Auth endpoints — public
                .requestMatchers("/api/auth/**").permitAll()

                // Static legacy assets (Thymeleaf HTML pages — keep serving them)
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/css/**", "/js/**", "/images/**",
                        "/fonts/**", "/hms/**").permitAll()

                // Ward management — clinical staff only
                .requestMatchers("/api/v1/clinical/wards/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE")

                // Telemetry — clinical staff only
                .requestMatchers(HttpMethod.GET, "/api/v1/telemetry/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE")
                .requestMatchers(HttpMethod.POST, "/api/v1/telemetry/**/ingest")
                    .hasAnyRole("ADMIN", "DOCTOR")

                // Procedure schedule
                .requestMatchers(HttpMethod.GET, "/api/v1/clinical/procedures/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE")

                // Compliance & Audit Trails — Admin, Doctor, Nurse
                .requestMatchers("/api/v1/compliance/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE")

                // Patient REST API
                .requestMatchers(HttpMethod.GET, "/hms/api/patients/me")
                    .hasRole("PATIENT")
                .requestMatchers(HttpMethod.PUT, "/hms/api/patients/me")
                    .hasRole("PATIENT")
                .requestMatchers("/hms/api/patients/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE")

                // Appointments
                .requestMatchers(HttpMethod.GET, "/hms/api/appointments/doctors")
                    .hasAnyRole("PATIENT", "ADMIN", "DOCTOR", "NURSE")
                .requestMatchers("/hms/api/appointments/**")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE", "PATIENT")

                // Prescriptions
                .requestMatchers(HttpMethod.POST, "/hms/api/prescriptions")
                    .hasRole("DOCTOR")
                .requestMatchers(HttpMethod.GET, "/hms/api/prescriptions")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE", "PATIENT")

                // Medical records
                .requestMatchers(HttpMethod.POST, "/hms/api/medical-records")
                    .hasRole("DOCTOR")
                .requestMatchers(HttpMethod.GET, "/hms/api/medical-records")
                    .hasAnyRole("ADMIN", "DOCTOR", "NURSE", "PATIENT")

                // Staff management — admin only
                .requestMatchers("/hms/api/staff/**").hasRole("ADMIN")

                // Catch-all — require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "Content-Type"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
