package com.talentbridge.controller;

import com.talentbridge.dto.AuthResponse;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.dto.RegisterRequest;
import com.talentbridge.security.UserPrincipal;
import com.talentbridge.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller providing public authentication endpoints: registration, login,
 * and current user identity verification.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        UserPrincipal userPrincipal = authService.getCurrentUser();
        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", userPrincipal.getId());
        userData.put("email", userPrincipal.getUsername());
        userData.put("firstName", userPrincipal.getFirstName());
        userData.put("lastName", userPrincipal.getLastName());
        userData.put("role", userPrincipal.getRole());
        return ResponseEntity.ok(userData);
    }
}
