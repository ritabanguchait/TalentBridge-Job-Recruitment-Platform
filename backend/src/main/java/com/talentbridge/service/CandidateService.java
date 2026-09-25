package com.talentbridge.service;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.ApplyJobRequest;
import com.talentbridge.dto.CandidateDashboardStats;
import com.talentbridge.dto.CandidateProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CandidateService {

    CandidateProfileDto getProfile(Long userId);

    CandidateProfileDto updateProfile(Long userId, CandidateProfileDto dto);

    ApplicationResponse applyForJob(Long userId, ApplyJobRequest request);

    Page<ApplicationResponse> getMyApplications(Long userId, Pageable pageable);

    ApplicationResponse getApplicationDetails(Long userId, Long applicationId);

    ApplicationResponse withdrawApplication(Long userId, Long applicationId);

    CandidateDashboardStats getDashboardStats(Long userId);
}
