package com.talentbridge.service.impl;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.RecruiterDashboardStats;
import com.talentbridge.dto.StatusUpdateRequest;
import com.talentbridge.entity.*;
import com.talentbridge.exception.BadRequestException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.mapper.ApplicationMapper;
import com.talentbridge.repository.*;
import com.talentbridge.service.RecruiterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for recruiter applicant reviews, status transitions,
 * candidate evaluation history, and recruitment pipeline statistics.
 */
@Service
public class RecruiterServiceImpl implements RecruiterService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public RecruiterServiceImpl(JobRepository jobRepository,
                                JobApplicationRepository jobApplicationRepository,
                                RecruiterProfileRepository recruiterProfileRepository,
                                ApplicationStatusHistoryRepository historyRepository,
                                UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getJobApplications(Long recruiterUserId, Long jobId,
                                                        ApplicationStatus status, Pageable pageable) {
        RecruiterProfile profile = getRecruiterProfile(recruiterUserId);

        Job job = jobRepository.findByIdWithRecruiter(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));

        if (!job.getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to view applicants for this job posting");
        }

        Page<JobApplication> applications = jobApplicationRepository.findByJobIdAndOptionalStatus(jobId, status, pageable);
        return applications.map(app -> {
            List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByChangedAtAsc(app.getId());
            return ApplicationMapper.toResponse(app, history);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getAllRecruiterApplications(Long recruiterUserId, Pageable pageable) {
        RecruiterProfile profile = getRecruiterProfile(recruiterUserId);
        Page<JobApplication> applications = jobApplicationRepository.findByRecruiterProfileId(profile.getId(), pageable);
        return applications.map(app -> {
            List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByChangedAtAsc(app.getId());
            return ApplicationMapper.toResponse(app, history);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationDetails(Long recruiterUserId, Long applicationId) {
        RecruiterProfile profile = getRecruiterProfile(recruiterUserId);

        JobApplication app = jobApplicationRepository.findByIdWithDetails(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application", "id", applicationId));

        if (!app.getJob().getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to view this application");
        }

        List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByChangedAtAsc(app.getId());
        return ApplicationMapper.toResponse(app, history);
    }

    @Override
    @Transactional
    public ApplicationResponse updateApplicationStatus(Long recruiterUserId, Long applicationId,
                                                       StatusUpdateRequest request) {
        RecruiterProfile profile = getRecruiterProfile(recruiterUserId);

        JobApplication app = jobApplicationRepository.findByIdWithDetails(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Job Application", "id", applicationId));

        if (!app.getJob().getRecruiterProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("You are not authorized to update this application");
        }

        if (app.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("Cannot update the status of a withdrawn application");
        }

        app.setStatus(request.getStatus());
        JobApplication updated = jobApplicationRepository.save(app);

        String remark = (request.getRemarks() != null && !request.getRemarks().trim().isEmpty())
                ? request.getRemarks().trim()
                : "Status updated to " + request.getStatus();

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(updated)
                .status(request.getStatus())
                .remarks(remark)
                .changedAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        List<ApplicationStatusHistory> fullHistory = historyRepository.findByApplicationIdOrderByChangedAtAsc(updated.getId());
        return ApplicationMapper.toResponse(updated, fullHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardStats getDashboardStats(Long recruiterUserId) {
        RecruiterProfile profile = getRecruiterProfile(recruiterUserId);
        Long profileId = profile.getId();

        long activeJobs = jobRepository.countByRecruiterProfileIdAndStatus(profileId, JobStatus.OPEN);
        long totalJobs = jobRepository.countByRecruiterProfileId(profileId);
        long totalApplicants = jobApplicationRepository.countAllByRecruiterProfileId(profileId);
        long underReview = jobApplicationRepository.countByRecruiterProfileIdAndStatus(profileId, ApplicationStatus.UNDER_REVIEW);
        long shortlisted = jobApplicationRepository.countByRecruiterProfileIdAndStatus(profileId, ApplicationStatus.SHORTLISTED);
        long interview = jobApplicationRepository.countByRecruiterProfileIdAndStatus(profileId, ApplicationStatus.INTERVIEW);
        long selected = jobApplicationRepository.countByRecruiterProfileIdAndStatus(profileId, ApplicationStatus.SELECTED);
        long rejected = jobApplicationRepository.countByRecruiterProfileIdAndStatus(profileId, ApplicationStatus.REJECTED);

        return new RecruiterDashboardStats(
                activeJobs, totalJobs, totalApplicants, underReview, shortlisted, interview, selected, rejected
        );
    }

    private RecruiterProfile getRecruiterProfile(Long userId) {
        return recruiterProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    RecruiterProfile newProfile = RecruiterProfile.builder()
                            .user(user)
                            .companyName("Hiring Team")
                            .companyLocation("Remote / Flexible")
                            .build();
                    return recruiterProfileRepository.save(newProfile);
                });
    }
}
