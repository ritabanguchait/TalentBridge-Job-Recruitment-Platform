package com.talentbridge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentbridge.dto.JobStatusUpdateRequest;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.dto.UserStatusUpdateRequest;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminControllerTest {

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

    private Long candidateUserId;
    private Long sampleJobId;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        jobApplicationRepository.deleteAll();
        jobRepository.deleteAll();
        recruiterProfileRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Seed Admin
        User admin = User.builder()
                .email("admin@talentbridge.com")
                .password(passwordEncoder.encode("Admin@123"))
                .firstName("Admin")
                .lastName("User")
                .role(Role.ROLE_ADMIN)
                .isActive(true)
                .build();
        userRepository.save(admin);

        // 2. Seed Recruiter
        User recruiter = User.builder()
                .email("recruiter@talentbridge.com")
                .password(passwordEncoder.encode("Recruiter@123"))
                .firstName("Sarah")
                .lastName("Jenkins")
                .role(Role.ROLE_RECRUITER)
                .isActive(true)
                .build();
        User savedRecruiter = userRepository.save(recruiter);

        RecruiterProfile profile = RecruiterProfile.builder()
                .user(savedRecruiter)
                .companyName("TechFlow Solutions")
                .companyLocation("Bangalore")
                .build();
        RecruiterProfile savedProfile = recruiterProfileRepository.save(profile);

        // 3. Seed Candidate
        User candidate = User.builder()
                .email("candidate@talentbridge.com")
                .password(passwordEncoder.encode("Candidate@123"))
                .firstName("Alex")
                .lastName("Morgan")
                .role(Role.ROLE_CANDIDATE)
                .isActive(true)
                .build();
        User savedCandidate = userRepository.save(candidate);
        this.candidateUserId = savedCandidate.getId();

        // 4. Seed Job
        Job job = Job.builder()
                .recruiterProfile(savedProfile)
                .title("Software Engineer")
                .description("Sample job for admin moderation.")
                .location("Bangalore")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                .salaryMin(new BigDecimal("500000"))
                .salaryMax(new BigDecimal("800000"))
                .skillsRequired("Java")
                .status(JobStatus.OPEN)
                .build();
        Job savedJob = jobRepository.save(job);
        this.sampleJobId = savedJob.getId();
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
    @DisplayName("GET /api/admin/stats - Admin should receive platform-wide statistics")
    void shouldReturnPlatformStatsForAdmin() throws Exception {
        String token = obtainToken("admin@talentbridge.com", "Admin@123");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers", is(3)))
                .andExpect(jsonPath("$.totalRecruiters", is(1)))
                .andExpect(jsonPath("$.totalCandidates", is(1)))
                .andExpect(jsonPath("$.activeJobs", is(1)));
    }

    @Test
    @DisplayName("GET /api/admin/users - Admin should filter users by role")
    void shouldFilterUsersByRole() throws Exception {
        String token = obtainToken("admin@talentbridge.com", "Admin@123");

        mockMvc.perform(get("/api/admin/users")
                        .param("role", "ROLE_CANDIDATE")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].email", is("candidate@talentbridge.com")));
    }

    @Test
    @DisplayName("PUT /api/admin/users/{id}/status - Admin deactivates user")
    void shouldDeactivateUser() throws Exception {
        String token = obtainToken("admin@talentbridge.com", "Admin@123");
        UserStatusUpdateRequest request = new UserStatusUpdateRequest(false);

        mockMvc.perform(put("/api/admin/users/" + candidateUserId + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(candidateUserId.intValue())))
                .andExpect(jsonPath("$.active", is(false)));
    }

    @Test
    @DisplayName("PUT /api/admin/jobs/{id}/status - Admin moderates and closes job")
    void shouldModerateJobStatus() throws Exception {
        String token = obtainToken("admin@talentbridge.com", "Admin@123");
        JobStatusUpdateRequest request = new JobStatusUpdateRequest(JobStatus.CLOSED);

        mockMvc.perform(put("/api/admin/jobs/" + sampleJobId + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(sampleJobId.intValue())))
                .andExpect(jsonPath("$.status", is("CLOSED")));
    }

    @Test
    @DisplayName("Candidate and Recruiter are rejected from admin endpoints with 403 Forbidden")
    void shouldDenyNonAdminUsers() throws Exception {
        String candidateToken = obtainToken("candidate@talentbridge.com", "Candidate@123");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", is("Forbidden")));

        String recruiterToken = obtainToken("recruiter@talentbridge.com", "Recruiter@123");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer " + recruiterToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }
}
