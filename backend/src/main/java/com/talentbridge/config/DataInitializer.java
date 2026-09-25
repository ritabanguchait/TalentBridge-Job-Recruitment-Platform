package com.talentbridge.config;

import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
import com.talentbridge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initializes default seed accounts on application startup.
 * Ensures the platform has ready-to-test Admin, Recruiter, and Candidate users.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUserIfNotFound("admin@talentbridge.com", "Admin@123", "Admin", "User", Role.ROLE_ADMIN);
        seedUserIfNotFound("recruiter@talentbridge.com", "Recruiter@123", "Sarah", "Recruiter", Role.ROLE_RECRUITER);
        seedUserIfNotFound("candidate@talentbridge.com", "Candidate@123", "Alex", "Candidate", Role.ROLE_CANDIDATE);
    }

    private void seedUserIfNotFound(String email, String rawPassword, String firstName, String lastName, Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(role)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            logger.info("Seeded default {} account: {}", role, email);
        }
    }
}
