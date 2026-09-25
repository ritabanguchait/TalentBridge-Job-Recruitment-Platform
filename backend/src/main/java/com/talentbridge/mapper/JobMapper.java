package com.talentbridge.mapper;

import com.talentbridge.dto.JobResponse;
import com.talentbridge.entity.Job;
import com.talentbridge.entity.RecruiterProfile;

public class JobMapper {

    public static JobResponse toResponse(Job job) {
        if (job == null) {
            return null;
        }

        RecruiterProfile profile = job.getRecruiterProfile();
        Long recruiterId = profile != null ? profile.getId() : null;
        String companyName = profile != null ? profile.getCompanyName() : "Confidential";
        String companyWebsite = profile != null ? profile.getCompanyWebsite() : null;
        String companyLocation = profile != null ? profile.getCompanyLocation() : null;

        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getJobType(),
                job.getExperienceLevel(),
                job.getSalaryMin(),
                job.getSalaryMax(),
                job.getSkillsRequired(),
                job.getStatus(),
                recruiterId,
                companyName,
                companyWebsite,
                companyLocation,
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }
}
