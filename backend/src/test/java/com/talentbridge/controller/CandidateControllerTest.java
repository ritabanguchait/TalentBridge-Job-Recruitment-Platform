package com.talentbridge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentbridge.dto.ApplyJobRequest;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.entity.*;
import com.talentbridge.repository.*;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CandidateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository historyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Long testJobId;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        jobApplicationRepository.deleteAll();
        jobRepository.deleteAll();
        recruiterProfileRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        // Seed recruiter and company
        User recruiter = User.builder()
                .email("recruiter@talentbridge.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .firstName("Sarah")
                .lastName("Jenkins")
                .role(Role.ROLE_RECRUITER)
                .isActive(true)
                .build();
        User savedRecruiter = userRepository.save(recruiter);

        RecruiterProfile recruiterProfile = RecruiterProfile.builder()
                .user(savedRecruiter)
                .companyName("TechFlow Solutions")
                .companyLocation("Bangalore")
                .build();
        RecruiterProfile savedProfile = recruiterProfileRepository.save(recruiterProfile);

        // Seed candidate
        User candidate = User.builder()
                .email("candidate@talentbridge.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .firstName("Alex")
                .lastName("Morgan")
                .role(Role.ROLE_CANDIDATE)
                .isActive(true)
                .build();
        User savedCandidate = userRepository.save(candidate);

        CandidateProfile candidateProfile = CandidateProfile.builder()
                .user(savedCandidate)
                .headline("Full Stack Java Enthusiast")
                .skills("Java, Spring Boot, React")
                .build();
        candidateProfileRepository.save(candidateProfile);

        // Seed test job
        Job job = Job.builder()
                .recruiterProfile(savedProfile)
                .title("Full Stack Developer")
                .description("Developing cutting-edge recruitment tech.")
                .location("Bangalore")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                .salaryMin(new BigDecimal("600000"))
                .salaryMax(new BigDecimal("900000"))
                .skillsRequired("Java, React")
                .status(JobStatus.OPEN)
                .build();
        Job savedJob = jobRepository.save(job);
        this.testJobId = savedJob.getId();
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
    @DisplayName("POST /api/candidate/applications - Should submit application and track APPLIED status")
    void shouldSubmitApplicationSuccessfully() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");
        ApplyJobRequest request = new ApplyJobRequest(testJobId, "Excited about this opportunity!");

        mockMvc.perform(post("/api/candidate/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.status", is("APPLIED")))
                .andExpect(jsonPath("$.jobTitle", is("Full Stack Developer")))
                .andExpect(jsonPath("$.timeline", hasSize(1)))
                .andExpect(jsonPath("$.timeline[0].status", is("APPLIED")));
    }

    @Test
    @DisplayName("POST /api/candidate/applications - Should reject duplicate application")
    void shouldPreventDuplicateApplication() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");
        ApplyJobRequest request = new ApplyJobRequest(testJobId, "First application");

        // Submit first application
        mockMvc.perform(post("/api/candidate/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Attempt second application for same job
        mockMvc.perform(post("/api/candidate/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("already applied")));
    }

    @Test
    @DisplayName("PUT /api/candidate/applications/{id}/withdraw - Should withdraw application")
    void shouldWithdrawApplicationSuccessfully() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");
        ApplyJobRequest applyRequest = new ApplyJobRequest(testJobId, "Need to withdraw later");

        MvcResult applyResult = mockMvc.perform(post("/api/candidate/applications")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(applyRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long appId = objectMapper.readTree(applyResult.getResponse().getContentAsString()).get("id").asLong();

        // Withdraw application
        mockMvc.perform(put("/api/candidate/applications/" + appId + "/withdraw")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("WITHDRAWN")))
                .andExpect(jsonPath("$.timeline", hasSize(2)))
                .andExpect(jsonPath("$.timeline[1].status", is("WITHDRAWN")));
    }

    @Test
    @DisplayName("GET /api/candidate/dashboard - Should return candidate statistics")
    void shouldReturnCandidateDashboardStats() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");

        mockMvc.perform(get("/api/candidate/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalApplications", notNullValue()));
    }
}
