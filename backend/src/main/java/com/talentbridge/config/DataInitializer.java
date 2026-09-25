package com.talentbridge.config;

import com.talentbridge.entity.*;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.RecruiterProfileRepository;
import com.talentbridge.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Initializes default seed accounts and sample job postings on application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RecruiterProfileRepository recruiterProfileRepository,
                           JobRepository jobRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.jobRepository = jobRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUserIfNotFound("admin@talentbridge.com", "Admin@123", "Admin", "User", Role.ROLE_ADMIN);
        User recruiter = seedUserIfNotFound("recruiter@talentbridge.com", "Recruiter@123", "Sarah", "Jenkins", Role.ROLE_RECRUITER);
        seedUserIfNotFound("candidate@talentbridge.com", "Candidate@123", "Alex", "Morgan", Role.ROLE_CANDIDATE);

        if (recruiter != null) {
            seedRecruiterData(recruiter);
        }
    }

    private User seedUserIfNotFound(String email, String rawPassword, String firstName, String lastName, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(role)
                    .isActive(true)
                    .build();
            User saved = userRepository.save(user);
            logger.info("Seeded default {} account: {}", role, email);
            return saved;
        });
    }

    private void seedRecruiterData(User recruiter) {
        RecruiterProfile profile = recruiterProfileRepository.findByUserId(recruiter.getId()).orElseGet(() -> {
            RecruiterProfile newProfile = RecruiterProfile.builder()
                    .user(recruiter)
                    .companyName("TechFlow Solutions")
                    .companyWebsite("https://techflow.example.com")
                    .companyLocation("Bangalore, India")
                    .companyDescription("Leading software product company specializing in modern cloud platforms.")
                    .build();
            return recruiterProfileRepository.save(newProfile);
        });

        if (jobRepository.countByRecruiterProfileId(profile.getId()) == 0) {
            Job job1 = Job.builder()
                    .recruiterProfile(profile)
                    .title("Junior Java Full-Stack Developer")
                    .description("Join our core engineering team to develop modern enterprise applications using Java 17, Spring Boot, and React.js.")
                    .location("Bangalore / Hybrid")
                    .jobType(JobType.FULL_TIME)
                    .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                    .salaryMin(new BigDecimal("500000.00"))
                    .salaryMax(new BigDecimal("800000.00"))
                    .skillsRequired("Java, Spring Boot, MySQL, React, REST APIs")
                    .status(JobStatus.OPEN)
                    .build();

            Job job2 = Job.builder()
                    .recruiterProfile(profile)
                    .title("Frontend React Developer")
                    .description("Looking for a passionate frontend engineer proficient in React, CSS3 responsive design, and state management.")
                    .location("Remote")
                    .jobType(JobType.FULL_TIME)
                    .experienceLevel(ExperienceLevel.MID_LEVEL)
                    .salaryMin(new BigDecimal("700000.00"))
                    .salaryMax(new BigDecimal("1100000.00"))
                    .skillsRequired("React, JavaScript, HTML5, CSS3, Axios")
                    .status(JobStatus.OPEN)
                    .build();

            Job job3 = Job.builder()
                    .recruiterProfile(profile)
                    .title("Backend Software Intern")
                    .description("Exciting 6-month internship opportunity for recent graduates with strong core Java and relational database fundamentals.")
                    .location("Pune")
                    .jobType(JobType.INTERNSHIP)
                    .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                    .salaryMin(new BigDecimal("240000.00"))
                    .salaryMax(new BigDecimal("360000.00"))
                    .skillsRequired("Java, SQL, Git, Problem Solving")
                    .status(JobStatus.OPEN)
                    .build();

            jobRepository.save(job1);
            jobRepository.save(job2);
            jobRepository.save(job3);
            logger.info("Seeded 3 initial sample job postings for TechFlow Solutions");
        }
    }
}
