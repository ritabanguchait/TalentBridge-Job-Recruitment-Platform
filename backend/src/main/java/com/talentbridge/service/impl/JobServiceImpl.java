package com.talentbridge.service.impl;

import com.talentbridge.dto.JobCreateRequest;
import com.talentbridge.dto.JobResponse;
import com.talentbridge.dto.JobUpdateRequest;
import com.talentbridge.dto.RecruiterProfileDto;
import com.talentbridge.entity.*;
import com.talentbridge.exception.BadRequestException;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.mapper.JobMapper;
import com.talentbridge.repository.JobRepository;
import com.talentbridge.repository.RecruiterProfileRepository;
import com.talentbridge.repository.UserRepository;
import com.talentbridge.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service implementation for managing job listings, recruiter ownership,
 * and multi-criteria job search filtering.
 */
@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;

    public JobServiceImpl(JobRepository jobRepository,
                          RecruiterProfileRepository recruiterProfileRepository,
                          UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.recruiterProfileRepository = recruiterProfileRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String keyword, String location, JobType jobType,
                                        ExperienceLevel experienceLevel, Pageable pageable) {
        // Clean empty string parameters to null so JPQL ignores them
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String cleanLocation = (location != null && !location.trim().isEmpty()) ? location.trim() : null;

        Page<Job> jobs = jobRepository.searchJobs(
                JobStatus.OPEN, cleanKeyword, cleanLocation, jobType, experienceLevel, pageable
        );
        return jobs.map(JobMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findByIdWithRecruiter(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));
        return JobMapper.toResponse(job);
    }

    @Override
    @Transactional
    public JobResponse createJob(JobCreateRequest request, Long userId) {
        RecruiterProfile profile = getOrCreateRecruiterProfile(userId);

        Job job = Job.builder()
                .recruiterProfile(profile)
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .location(request.getLocation().trim())
                .jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .skillsRequired(request.getSkillsRequired() != null ? request.getSkillsRequired().trim() : null)
                .status(JobStatus.OPEN)
                .build();

        Job saved = jobRepository.save(job);
        return JobMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long id, JobUpdateRequest request, Long userId) {
        Job job = jobRepository.findByIdWithRecruiter(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        if (!job.getRecruiterProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to update this job posting");
        }

        job.setTitle(request.getTitle().trim());
        job.setDescription(request.getDescription().trim());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setSkillsRequired(request.getSkillsRequired() != null ? request.getSkillsRequired().trim() : null);
        job.setStatus(request.getStatus());

        Job updated = jobRepository.save(job);
        return JobMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteJob(Long id, Long userId) {
        Job job = jobRepository.findByIdWithRecruiter(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", id));

        if (!job.getRecruiterProfile().getUser().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to delete this job posting");
        }

        jobRepository.delete(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getRecruiterJobs(Long userId, Pageable pageable) {
        RecruiterProfile profile = getOrCreateRecruiterProfile(userId);
        return jobRepository.findByRecruiterProfileId(profile.getId(), pageable)
                .map(JobMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileDto getRecruiterProfile(Long userId) {
        RecruiterProfile profile = getOrCreateRecruiterProfile(userId);
        return new RecruiterProfileDto(
                profile.getId(),
                profile.getCompanyName(),
                profile.getCompanyWebsite(),
                profile.getCompanyLocation(),
                profile.getCompanyDescription()
        );
    }

    @Override
    @Transactional
    public RecruiterProfileDto updateRecruiterProfile(Long userId, RecruiterProfileDto dto) {
        RecruiterProfile profile = getOrCreateRecruiterProfile(userId);
        profile.setCompanyName(dto.getCompanyName().trim());
        profile.setCompanyWebsite(dto.getCompanyWebsite() != null ? dto.getCompanyWebsite().trim() : null);
        profile.setCompanyLocation(dto.getCompanyLocation() != null ? dto.getCompanyLocation().trim() : null);
        profile.setCompanyDescription(dto.getCompanyDescription() != null ? dto.getCompanyDescription().trim() : null);

        RecruiterProfile saved = recruiterProfileRepository.save(profile);
        return new RecruiterProfileDto(
                saved.getId(),
                saved.getCompanyName(),
                saved.getCompanyWebsite(),
                saved.getCompanyLocation(),
                saved.getCompanyDescription()
        );
    }

    private RecruiterProfile getOrCreateRecruiterProfile(Long userId) {
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
