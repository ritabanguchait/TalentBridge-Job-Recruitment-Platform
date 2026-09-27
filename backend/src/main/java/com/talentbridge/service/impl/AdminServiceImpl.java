package com.talentbridge.service.impl;

import com.talentbridge.dto.AdminStatsDto;
import com.talentbridge.dto.JobResponse;
import com.talentbridge.dto.UserSummaryDto;
import com.talentbridge.entity.Job;
import com.talentbridge.entity.JobApplication;
import com.talentbridge.entity.JobStatus;
import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
import com.talentbridge.exception.BadRequestException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.mapper.JobMapper;
import com.talentbridge.repository.ApplicationStatusHistoryRepository;
import com.talentbridge.repository.JobApplicationRepository;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.UserRepository;
import com.talentbridge.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for platform administration, user lifecycle governance,
 * job posting moderation, and system-wide analytics.
 */
@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            JobRepository jobRepository,
                            JobApplicationRepository jobApplicationRepository,
                            ApplicationStatusHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminStatsDto getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalRecruiters = userRepository.countByRole(Role.ROLE_RECRUITER);
        long totalCandidates = userRepository.countByRole(Role.ROLE_CANDIDATE);
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalApplications = jobApplicationRepository.count();
        long activeUsers = userRepository.countByIsActive(true);
        long inactiveUsers = userRepository.countByIsActive(false);

        return new AdminStatsDto(
                totalUsers, totalRecruiters, totalCandidates, totalJobs,
                activeJobs, totalApplications, activeUsers, inactiveUsers
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getAllUsers(Role role, Boolean isActive, String search, Pageable pageable) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        Page<User> users = userRepository.searchUsers(role, isActive, cleanSearch, pageable);

        return users.map(u -> new UserSummaryDto(
                u.getId(),
                u.getEmail(),
                u.getFirstName(),
                u.getLastName(),
                u.getRole(),
                u.isActive(),
                u.getCreatedAt(),
                u.getUpdatedAt()
        ));
    }

    @Override
    @Transactional
    public UserSummaryDto updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (user.getRole() == Role.ROLE_ADMIN && !active) {
            throw new BadRequestException("Primary Administrator account cannot be deactivated");
        }

        user.setActive(active);
        User updated = userRepository.save(user);

        return new UserSummaryDto(
                updated.getId(),
                updated.getEmail(),
                updated.getFirstName(),
                updated.getLastName(),
                updated.getRole(),
                updated.isActive(),
                updated.getCreatedAt(),
                updated.getUpdatedAt()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getAllJobs(JobStatus status, Pageable pageable) {
        Page<Job> jobs = jobRepository.findAllByOptionalStatus(status, pageable);
        return jobs.map(JobMapper::toResponse);
    }

    @Override
    @Transactional
    public JobResponse updateJobStatus(Long jobId, JobStatus status) {
        Job job = jobRepository.findByIdWithRecruiter(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        job.setStatus(status);
        Job updated = jobRepository.save(job);
        return JobMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId) {
        Job job = jobRepository.findByIdWithRecruiter(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        // Clean up child applications and their history first to respect referential integrity
        List<JobApplication> applications = jobApplicationRepository.findByJobId(jobId);
        for (JobApplication app : applications) {
            historyRepository.deleteByApplicationId(app.getId());
            jobApplicationRepository.delete(app);
        }

        jobRepository.delete(job);
    }
}
