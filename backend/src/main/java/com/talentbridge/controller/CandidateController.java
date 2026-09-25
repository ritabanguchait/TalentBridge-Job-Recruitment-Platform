package com.talentbridge.controller;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.ApplyJobRequest;
import com.talentbridge.dto.CandidateDashboardStats;
import com.talentbridge.dto.CandidateProfileDto;
import com.talentbridge.security.UserPrincipal;
import com.talentbridge.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller providing protected endpoints for Candidate profile management,
 * job applications, status history tracking, and candidate dashboard metrics.
 */
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileDto> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CandidateProfileDto profile = candidateService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileDto> updateProfile(
            @Valid @RequestBody CandidateProfileDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CandidateProfileDto updated = candidateService.updateProfile(userPrincipal.getId(), dto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/applications")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @Valid @RequestBody ApplyJobRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = candidateService.applyForJob(userPrincipal.getId(), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/applications")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = candidateService.getMyApplications(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = candidateService.getApplicationDetails(userPrincipal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/applications/{id}/withdraw")
    public ResponseEntity<ApplicationResponse> withdrawApplication(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = candidateService.withdrawApplication(userPrincipal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<CandidateDashboardStats> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        CandidateDashboardStats stats = candidateService.getDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(stats);
    }
}
