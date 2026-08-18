package com.cliniva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing
@EnableScheduling
public class HospitalManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementSystemApplication.class, args);
        System.out.println("\n🏥 Hospital Management System Started Successfully!");
        System.out.println("🌐 Access the application at: http://localhost:8080");
//        System.out.println("👥 Demo Accounts:");
//        System.out.println("   Patient: patient@hms.com / password");
//        System.out.println("   Doctor: doctor@hms.com / password");
//        System.out.println("   Nurse: nurse@hms.com / password");
//        System.out.println("   Admin: admin@hms.com / password");
    }
}