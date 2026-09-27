package com.talentbridge.service;

import com.talentbridge.dto.AdminStatsDto;
import com.talentbridge.dto.JobResponse;
import com.talentbridge.dto.UserSummaryDto;
import com.talentbridge.entity.JobStatus;
import com.talentbridge.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    AdminStatsDto getPlatformStats();

    Page<UserSummaryDto> getAllUsers(Role role, Boolean isActive, String search, Pageable pageable);

    UserSummaryDto updateUserStatus(Long userId, boolean active);

    Page<JobResponse> getAllJobs(JobStatus status, Pageable pageable);

    JobResponse updateJobStatus(Long jobId, JobStatus status);

    void deleteJob(Long jobId);
}
