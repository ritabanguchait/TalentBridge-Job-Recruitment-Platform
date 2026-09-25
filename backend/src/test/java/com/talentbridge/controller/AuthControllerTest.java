package com.talentbridge.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.dto.RegisterRequest;
import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Seed a known test user for login tests
        User candidate = User.builder()
                .email("test.candidate@talentbridge.com")
                .password(passwordEncoder.encode("Password@123"))
                .firstName("Test")
                .lastName("Candidate")
                .role(Role.ROLE_CANDIDATE)
                .isActive(true)
                .build();
        userRepository.save(candidate);
    }

    @Test
    @DisplayName("POST /api/auth/register - Should register new candidate and return JWT token")
    void shouldRegisterNewCandidate() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "new.candidate@talentbridge.com",
                "Secret@123",
                "New",
                "Candidate",
                Role.ROLE_CANDIDATE
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.email", is("new.candidate@talentbridge.com")))
                .andExpect(jsonPath("$.role", is("ROLE_CANDIDATE")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Should fail when email is already registered")
    void shouldFailRegistrationWhenEmailExists() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "test.candidate@talentbridge.com",
                "Password@123",
                "Duplicate",
                "Candidate",
                Role.ROLE_CANDIDATE
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("already registered")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should authenticate successfully with valid credentials")
    void shouldLoginSuccessfully() throws Exception {
        LoginRequest request = new LoginRequest("test.candidate@talentbridge.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.email", is("test.candidate@talentbridge.com")))
                .andExpect(jsonPath("$.role", is("ROLE_CANDIDATE")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Should fail with 401 when given incorrect password")
    void shouldFailLoginWithWrongPassword() throws Exception {
        LoginRequest request = new LoginRequest("test.candidate@talentbridge.com", "WrongPassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", is("Invalid email or password")));
    }

    @Test
    @DisplayName("GET /api/auth/me - Should return current user when valid Bearer token is provided")
    void shouldReturnCurrentUserWithBearerToken() throws Exception {
        // Step 1: Login to obtain token
        LoginRequest loginRequest = new LoginRequest("test.candidate@talentbridge.com", "Password@123");
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();
        assertThat(token).isNotEmpty();

        // Step 2: Use token to call /api/auth/me
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is("test.candidate@talentbridge.com")))
                .andExpect(jsonPath("$.role", is("ROLE_CANDIDATE")));
    }
}
