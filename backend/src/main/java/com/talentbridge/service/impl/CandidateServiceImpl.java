package com.talentbridge.service.impl;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.ApplyJobRequest;
import com.talentbridge.dto.CandidateDashboardStats;
import com.talentbridge.dto.CandidateProfileDto;
import com.talentbridge.entity.*;
import com.talentbridge.exception.BadRequestException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.mapper.ApplicationMapper;
import com.talentbridge.repository.ApplicationStatusHistoryRepository;
import com.talentbridge.repository.CandidateProfileRepository;
import com.talentbridge.repository.JobApplicationRepository;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.UserRepository;
import com.talentbridge.service.CandidateService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for candidate profile management, job applications,
 * status timeline audits, and candidate dashboard metrics.
 */
@Service
public class CandidateServiceImpl implements CandidateService {

    private final CandidateProfileRepository candidateProfileRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final ApplicationStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;

    public CandidateServiceImpl(CandidateProfileRepository candidateProfileRepository,
                                JobRepository jobRepository,
                                JobApplicationRepository jobApplicationRepository,
                                ApplicationStatusHistoryRepository historyRepository,
                                UserRepository userRepository) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.historyRepository = historyRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateProfileDto getProfile(Long userId) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);
        return new CandidateProfileDto(
                profile.getId(),
                profile.getHeadline(),
                profile.getPhone(),
                profile.getLocation(),
                profile.getSkills(),
                profile.getExperienceYears(),
                profile.getEducation(),
                profile.getResumeUrl(),
                profile.getPortfolioUrl()
        );
    }

    @Override
    @Transactional
    public CandidateProfileDto updateProfile(Long userId, CandidateProfileDto dto) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);
        profile.setHeadline(dto.getHeadline());
        profile.setPhone(dto.getPhone());
        profile.setLocation(dto.getLocation());
        profile.setSkills(dto.getSkills());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setEducation(dto.getEducation());
        profile.setResumeUrl(dto.getResumeUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        return new CandidateProfileDto(
                saved.getId(),
                saved.getHeadline(),
                saved.getPhone(),
                saved.getLocation(),
                saved.getSkills(),
                saved.getExperienceYears(),
                saved.getEducation(),
                saved.getResumeUrl(),
                saved.getPortfolioUrl()
        );
    }

    @Override
    @Transactional
    public ApplicationResponse applyForJob(Long userId, ApplyJobRequest request) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);

        Job job = jobRepository.findByIdWithRecruiter(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (job.getStatus() == JobStatus.CLOSED) {
            throw new BadRequestException("This job posting is closed and no longer accepting applications");
        }

        // Prevent duplicate applications
        if (jobApplicationRepository.existsByJobIdAndCandidateProfileId(job.getId(), profile.getId())) {
            throw new BadRequestException("You have already applied for this job posting");
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .candidateProfile(profile)
                .status(ApplicationStatus.APPLIED)
                .coverNote(request.getCoverNote() != null ? request.getCoverNote().trim() : null)
                .build();

        JobApplication savedApplication = jobApplicationRepository.save(application);

        // Record initial status history event
        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(savedApplication)
                .status(ApplicationStatus.APPLIED)
                .remarks("Application submitted by candidate")
                .changedAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        return ApplicationMapper.toResponse(savedApplication, List.of(history));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getMyApplications(Long userId, Pageable pageable) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);
        Page<JobApplication> applications = jobApplicationRepository.findByCandidateProfileId(profile.getId(), pageable);

        return applications.map(app -> {
            List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByChangedAtAsc(app.getId());
            return ApplicationMapper.toResponse(app, history);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationDetails(Long userId, Long applicationId) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);

        JobApplication app = jobApplicationRepository.findByIdAndCandidateProfileId(applicationId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Application", "id", applicationId));

        List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByChangedAtAsc(app.getId());
        return ApplicationMapper.toResponse(app, history);
    }

    @Override
    @Transactional
    public ApplicationResponse withdrawApplication(Long userId, Long applicationId) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);

        JobApplication app = jobApplicationRepository.findByIdAndCandidateProfileId(applicationId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job Application", "id", applicationId));

        if (app.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new BadRequestException("This application has already been withdrawn");
        }

        if (app.getStatus() == ApplicationStatus.SELECTED || app.getStatus() == ApplicationStatus.REJECTED) {
            throw new BadRequestException("Cannot withdraw an application that has already concluded (" + app.getStatus() + ")");
        }

        app.setStatus(ApplicationStatus.WITHDRAWN);
        JobApplication updated = jobApplicationRepository.save(app);

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(updated)
                .status(ApplicationStatus.WITHDRAWN)
                .remarks("Application withdrawn by candidate")
                .changedAt(LocalDateTime.now())
                .build();
        historyRepository.save(history);

        List<ApplicationStatusHistory> fullHistory = historyRepository.findByApplicationIdOrderByChangedAtAsc(updated.getId());
        return ApplicationMapper.toResponse(updated, fullHistory);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateDashboardStats getDashboardStats(Long userId) {
        CandidateProfile profile = getOrCreateCandidateProfile(userId);
        Long profileId = profile.getId();

        long total = jobApplicationRepository.countByCandidateProfileId(profileId);
        long underReview = jobApplicationRepository.countByCandidateProfileIdAndStatus(profileId, ApplicationStatus.UNDER_REVIEW);
        long shortlisted = jobApplicationRepository.countByCandidateProfileIdAndStatus(profileId, ApplicationStatus.SHORTLISTED);
        long interview = jobApplicationRepository.countByCandidateProfileIdAndStatus(profileId, ApplicationStatus.INTERVIEW);
        long selected = jobApplicationRepository.countByCandidateProfileIdAndStatus(profileId, ApplicationStatus.SELECTED);
        long rejected = jobApplicationRepository.countByCandidateProfileIdAndStatus(profileId, ApplicationStatus.REJECTED);

        return new CandidateDashboardStats(total, underReview, shortlisted, interview, selected, rejected);
    }

    private CandidateProfile getOrCreateCandidateProfile(Long userId) {
        return candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .user(user)
                            .headline("Software Developer")
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });
    }
}
