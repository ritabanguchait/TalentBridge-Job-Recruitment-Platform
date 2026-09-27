package com.talentbridge.controller;

import com.talentbridge.dto.ApiResponse;
import com.talentbridge.dto.JobCreateRequest;
import com.talentbridge.dto.JobResponse;
import com.talentbridge.dto.JobUpdateRequest;
import com.talentbridge.dto.RecruiterProfileDto;
import com.talentbridge.security.UserPrincipal;
import com.talentbridge.service.JobService;
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
 * Recruiter-only endpoints for creating, managing, and tracking their job postings.
 */
@RestController
@RequestMapping("/api/recruiter")
public class RecruiterJobController {

    private final JobService jobService;

    public RecruiterJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody JobCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        JobResponse response = jobService.createJob(request, userPrincipal.getId());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobResponse> jobs = jobService.getRecruiterJobs(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(jobs);
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        JobResponse response = jobService.updateJob(id, request, userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<ApiResponse> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        jobService.deleteJob(id, userPrincipal.getId());
        return ResponseEntity.ok(new ApiResponse(true, "Job posting deleted successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> getProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RecruiterProfileDto profile = jobService.getRecruiterProfile(userPrincipal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfileDto> updateProfile(
            @Valid @RequestBody RecruiterProfileDto dto,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        RecruiterProfileDto updated = jobService.updateRecruiterProfile(userPrincipal.getId(), dto);
        return ResponseEntity.ok(updated);
    }
}
