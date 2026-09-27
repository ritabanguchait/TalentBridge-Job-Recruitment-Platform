package com.talentbridge.service;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.RecruiterDashboardStats;
import com.talentbridge.dto.StatusUpdateRequest;
import com.talentbridge.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecruiterService {

    Page<ApplicationResponse> getJobApplications(Long recruiterUserId, Long jobId,
                                                 ApplicationStatus status, Pageable pageable);

    Page<ApplicationResponse> getAllRecruiterApplications(Long recruiterUserId, Pageable pageable);

    ApplicationResponse getApplicationDetails(Long recruiterUserId, Long applicationId);

    ApplicationResponse updateApplicationStatus(Long recruiterUserId, Long applicationId,
                                                StatusUpdateRequest request);

    RecruiterDashboardStats getDashboardStats(Long recruiterUserId);
}
