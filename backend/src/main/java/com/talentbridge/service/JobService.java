package com.talentbridge.service;

import com.talentbridge.dto.JobCreateRequest;
import com.talentbridge.dto.JobResponse;
import com.talentbridge.dto.JobUpdateRequest;
import com.talentbridge.dto.RecruiterProfileDto;
import com.talentbridge.entity.ExperienceLevel;
import com.talentbridge.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobService {

    Page<JobResponse> searchJobs(String keyword, String location, JobType jobType,
                                 ExperienceLevel experienceLevel, Pageable pageable);

    JobResponse getJobById(Long id);

    JobResponse createJob(JobCreateRequest request, Long userId);

    JobResponse updateJob(Long id, JobUpdateRequest request, Long userId);

    void deleteJob(Long id, Long userId);

    Page<JobResponse> getRecruiterJobs(Long userId, Pageable pageable);

    RecruiterProfileDto getRecruiterProfile(Long userId);

    RecruiterProfileDto updateRecruiterProfile(Long userId, RecruiterProfileDto profileDto);
}
