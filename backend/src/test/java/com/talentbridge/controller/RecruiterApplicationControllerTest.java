package com.talentbridge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.dto.StatusUpdateRequest;
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
class RecruiterApplicationControllerTest {

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
    private Long testApplicationId;

    @BeforeEach
    void setUp() {
        historyRepository.deleteAll();
        jobApplicationRepository.deleteAll();
        jobRepository.deleteAll();
        recruiterProfileRepository.deleteAll();
        candidateProfileRepository.deleteAll();
        userRepository.deleteAll();

        // 1. Recruiter setup
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
        RecruiterProfile savedRecruiterProfile = recruiterProfileRepository.save(recruiterProfile);

        // 2. Candidate setup
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
                .headline("Junior Java Developer")
                .skills("Java, Spring Boot, MySQL")
                .phone("+91-9876543210")
                .build();
        CandidateProfile savedCandidateProfile = candidateProfileRepository.save(candidateProfile);

        // 3. Job setup
        Job job = Job.builder()
                .recruiterProfile(savedRecruiterProfile)
                .title("Java Software Engineer")
                .description("Build scalable backend services.")
                .location("Bangalore")
                .jobType(JobType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ENTRY_LEVEL)
                .salaryMin(new BigDecimal("600000"))
                .salaryMax(new BigDecimal("900000"))
                .skillsRequired("Java, Spring")
                .status(JobStatus.OPEN)
                .build();
        Job savedJob = jobRepository.save(job);
        this.testJobId = savedJob.getId();

        // 4. Job Application setup
        JobApplication application = JobApplication.builder()
                .job(savedJob)
                .candidateProfile(savedCandidateProfile)
                .status(ApplicationStatus.APPLIED)
                .coverNote("Very interested in this role!")
                .build();
        JobApplication savedApp = jobApplicationRepository.save(application);
        this.testApplicationId = savedApp.getId();

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(savedApp)
                .status(ApplicationStatus.APPLIED)
                .remarks("Application submitted by candidate")
                .build();
        historyRepository.save(history);
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
    @DisplayName("GET /api/recruiter/jobs/{jobId}/applications - Recruiter should view applicants")
    void shouldReturnApplicantsForJob() throws Exception {
        String token = obtainToken("recruiter@talentbridge.com", "Recruiter@123");

        mockMvc.perform(get("/api/recruiter/jobs/" + testJobId + "/applications")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].candidateName", is("Alex Morgan")))
                .andExpect(jsonPath("$.content[0].status", is("APPLIED")));
    }

    @Test
    @DisplayName("GET /api/recruiter/applications/{id} - Recruiter should view full applicant profile")
    void shouldReturnApplicantDetails() throws Exception {
        String token = obtainToken("recruiter@talentbridge.com", "Recruiter@123");

        mockMvc.perform(get("/api/recruiter/applications/" + testApplicationId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(testApplicationId.intValue())))
                .andExpect(jsonPath("$.candidateHeadline", is("Junior Java Developer")))
                .andExpect(jsonPath("$.candidateSkills", containsString("Java")))
                .andExpect(jsonPath("$.timeline", hasSize(1)));
    }

    @Test
    @DisplayName("PUT /api/recruiter/applications/{id}/status - Recruiter shortlists candidate")
    void shouldShortlistCandidate() throws Exception {
        String token = obtainToken("recruiter@talentbridge.com", "Recruiter@123");
        StatusUpdateRequest request = new StatusUpdateRequest(
                ApplicationStatus.SHORTLISTED,
                "Strong profile in Core Java and Spring Boot"
        );

        mockMvc.perform(put("/api/recruiter/applications/" + testApplicationId + "/status")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("SHORTLISTED")))
                .andExpect(jsonPath("$.timeline", hasSize(2)))
                .andExpect(jsonPath("$.timeline[1].status", is("SHORTLISTED")))
                .andExpect(jsonPath("$.timeline[1].remarks", is("Strong profile in Core Java and Spring Boot")));
    }

    @Test
    @DisplayName("GET /api/recruiter/dashboard - Recruiter should retrieve pipeline statistics")
    void shouldReturnRecruiterDashboardStats() throws Exception {
        String token = obtainToken("recruiter@talentbridge.com", "Recruiter@123");

        mockMvc.perform(get("/api/recruiter/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activeJobsCount", is(1)))
                .andExpect(jsonPath("$.totalApplicantsCount", is(1)));
    }

    @Test
    @DisplayName("Recruiter endpoints reject candidates with 403 Forbidden")
    void shouldRejectCandidateAccess() throws Exception {
        String token = obtainToken("candidate@talentbridge.com", "Candidate@123");

        mockMvc.perform(get("/api/recruiter/dashboard")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error", is("Forbidden")));
    }
}
