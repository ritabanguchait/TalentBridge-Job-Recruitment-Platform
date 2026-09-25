package com.talentbridge.controller;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.RecruiterDashboardStats;
import com.talentbridge.dto.StatusUpdateRequest;
import com.talentbridge.entity.ApplicationStatus;
import com.talentbridge.security.UserPrincipal;
import com.talentbridge.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller providing endpoints for Recruiters to review applicants,
 * update application statuses, and track recruitment pipeline performance.
 */
@RestController
@RequestMapping("/api/recruiter")
public class RecruiterApplicationController {

    private final RecruiterService recruiterService;

    public RecruiterApplicationController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<Page<ApplicationResponse>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = recruiterService.getJobApplications(
                userPrincipal.getId(), jobId, status, pageable
        );
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications")
    public ResponseEntity<Page<ApplicationResponse>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = recruiterService.getAllRecruiterApplications(
                userPrincipal.getId(), pageable
        );
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = recruiterService.getApplicationDetails(userPrincipal.getId(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        ApplicationResponse response = recruiterService.updateApplicationStatus(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardStats> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RecruiterDashboardStats stats = recruiterService.getDashboardStats(userPrincipal.getId());
        return ResponseEntity.ok(stats);
    }
}
