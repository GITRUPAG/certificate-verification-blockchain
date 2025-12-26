package com.verification.certificateVerification.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.verification.certificateVerification.model.User;
import com.verification.certificateVerification.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@system.com";

            // Check if admin already exists
            if (userRepository.existsByEmail(adminEmail)) {
                System.out.println("✅ Admin already exists. Skipping creation.");
                return;
            }

            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRoles(Set.of("ROLE_ADMIN"));

            userRepository.save(admin);

            System.out.println("🚀 Default Admin Created");
            System.out.println("Username: admin");
            System.out.println("Password: Admin@123");
        };
    }
}
