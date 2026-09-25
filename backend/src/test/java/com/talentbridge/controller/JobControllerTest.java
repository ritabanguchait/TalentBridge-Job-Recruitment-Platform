package com.talentbridge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentbridge.dto.JobCreateRequest;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.entity.*;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.RecruiterProfileRepository;
import com.talentbridge.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();
        recruiterProfileRepository.deleteAll();
        userRepository.deleteAll();

        // Seed recruiter
        User recruiter = User.builder()
                .email("recruiter@talentbridge.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .firstName("Sarah")
                .lastName("Jenkins")
                .role(Role.ROLE_RECRUITER)
                .isActive(true)
                .build();
        User savedRecruiter = userRepository.save(recruiter);

        // Seed candidate
        User candidate = User.builder()
                .email("candidate@talentbridge.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .firstName("Alex")
                .lastName("Morgan")
                .role(Role.ROLE_CANDIDATE)
                .isActive(true)
                .build();
        userRepository.save(candidate);

        // Seed recruiter profile
        RecruiterProfile profile = RecruiterProfile.builder()
                .user(savedRecruiter)
                .companyName("TechFlow Solutions")
                .companyWebsite("https://techflow.example.com")
                .companyLocation("Bangalore, India")
                .companyDescription("Software product company")
                .build();
        RecruiterProfile savedProfile = recruiterProfileRepository.save(profile);

        // Seed initial jobs
        Job job1 = Job.builder()
                .recruiterProfile(savedProfile)
                .title("Junior Java Full-Stack Developer")
                .description("Developing enterprise applications using Java 17, Spring Boot, and React.")
                .location("Bangalore")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                .salaryMin(new BigDecimal("500000"))
                .salaryMax(new BigDecimal("800000"))
                .skillsRequired("Java, Spring Boot, MySQL, React")
                .status(JobStatus.OPEN)
                .build();

        Job job2 = Job.builder()
                .recruiterProfile(savedProfile)
                .title("Frontend React Developer")
                .description("Passionate frontend engineer proficient in React.")
                .location("Remote")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.MID_LEVEL)
                .salaryMin(new BigDecimal("700000"))
                .salaryMax(new BigDecimal("1100000"))
                .skillsRequired("React, JavaScript, CSS3")
                .status(JobStatus.OPEN)
                .build();

        jobRepository.save(job1);
        jobRepository.save(job2);
    }

    private String obtainToken(String email, String password) throws Exception {
        LoginRequest request = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        return objectMapper.readTree(json).get("token").asText();
    }

    @Test
    @DisplayName("GET /api/jobs - Public endpoint should return paginated open jobs")
    void shouldReturnPaginatedJobsPublicly() throws Exception {
        mockMvc.perform(get("/api/jobs")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", notNullValue()))
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.totalElements", is(2)));
    }

    @Test
    @DisplayName("GET /api/jobs?keyword=React - Should filter jobs by keyword")
    void shouldFilterJobsByKeyword() throws Exception {
        mockMvc.perform(get("/api/jobs")
                        .param("keyword", "React"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", notNullValue()))
                .andExpect(jsonPath("$.content[0].title", containsStringIgnoringCase("React")));
    }

    @Test
    @DisplayName("POST /api/recruiter/jobs - Should allow authenticated recruiter to post a job")
    void shouldAllowRecruiterToPostJob() throws Exception {
        String token = obtainToken("recruiter@talentbridge.com", "Recruiter@123");

        JobCreateRequest request = new JobCreateRequest(
                "Lead Cloud Architect",
                "Leading architectural design for scalable microservices.",
                "Remote",
                JobType.FULL_TIME,
                ExperienceLevel.SENIOR_LEVEL,
                new BigDecimal("1500000.00"),
                new BigDecimal("2200000.00"),
                "AWS, Kubernetes, Spring Cloud"
        );

        mockMvc.perform(post("/api/recruiter/jobs")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Lead Cloud Architect")))
                .andExpect(jsonPath("$.companyName", is("TechFlow Solutions")));
    }

    @Test
    @DisplayName("POST /api/recruiter/jobs - Should reject candidate with 403 Forbidden")
    void shouldDenyCandidateFromPostingJob() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");

        JobCreateRequest request = new JobCreateRequest(
                "Unauthorized Job",
                "Should fail because role is CANDIDATE.",
                "Bangalore",
                JobType.FULL_TIME,
                ExperienceLevel.ENTRY_LEVEL,
                new BigDecimal("300000"),
                new BigDecimal("400000"),
                "Java"
        );

        mockMvc.perform(post("/api/recruiter/jobs")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }

    @Test
    @DisplayName("POST /api/recruiter/jobs - Should reject unauthenticated user with 401 Unauthorized")
    void shouldDenyUnauthenticatedUser() throws Exception {
        JobCreateRequest request = new JobCreateRequest(
                "Unauthorized Job",
                "Should fail because no token provided.",
                "Bangalore",
                JobType.FULL_TIME,
                ExperienceLevel.ENTRY_LEVEL,
                new BigDecimal("300000"),
                new BigDecimal("400000"),
                "Java"
        );

        mockMvc.perform(post("/api/recruiter/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error", is("Unauthorized")));
    }
}
