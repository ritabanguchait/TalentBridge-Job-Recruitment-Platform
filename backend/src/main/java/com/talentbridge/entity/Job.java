package com.talentbridge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Job posting created and managed by recruiters.
 */
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_status", columnList = "status"),
        @Index(name = "idx_job_location", columnList = "location"),
        @Index(name = "idx_job_type", columnList = "job_type"),
        @Index(name = "idx_job_exp", columnList = "experience_level")
})
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private RecruiterProfile recruiterProfile;

    @NotBlank(message = "Job title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank(message = "Job description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Location is required")
    @Column(nullable = false, length = 120)
    private String location;

    @NotNull(message = "Job type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 30)
    private JobType jobType;

    @NotNull(message = "Experience level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", nullable = false, length = 30)
    private ExperienceLevel experienceLevel;

    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "skills_required", length = 300)
    private String skillsRequired;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Job() {
    }

    public Job(Long id, RecruiterProfile recruiterProfile, String title, String description,
               String location, JobType jobType, ExperienceLevel experienceLevel,
               BigDecimal salaryMin, BigDecimal salaryMax, String skillsRequired, JobStatus status) {
        this.id = id;
        this.recruiterProfile = recruiterProfile;
        this.title = title;
        this.description = description;
        this.location = location;
        this.jobType = jobType;
        this.experienceLevel = experienceLevel;
        this.salaryMin = salaryMin;
        this.salaryMax = salaryMax;
        this.skillsRequired = skillsRequired;
        this.status = status != null ? status : JobStatus.OPEN;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = JobStatus.OPEN;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RecruiterProfile getRecruiterProfile() {
        return recruiterProfile;
    }

    public void setRecruiterProfile(RecruiterProfile recruiterProfile) {
        this.recruiterProfile = recruiterProfile;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public ExperienceLevel getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(ExperienceLevel experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public BigDecimal getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(BigDecimal salaryMin) {
        this.salaryMin = salaryMin;
    }

    public BigDecimal getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(BigDecimal salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getSkillsRequired() {
        return skillsRequired;
    }

    public void setSkillsRequired(String skillsRequired) {
        this.skillsRequired = skillsRequired;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private RecruiterProfile recruiterProfile;
        private String title;
        private String description;
        private String location;
        private JobType jobType;
        private ExperienceLevel experienceLevel;
        private BigDecimal salaryMin;
        private BigDecimal salaryMax;
        private String skillsRequired;
        private JobStatus status = JobStatus.OPEN;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder recruiterProfile(RecruiterProfile recruiterProfile) {
            this.recruiterProfile = recruiterProfile;
            return this;
        }

        public Builder title(String title) {
            this.title = title;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder jobType(JobType jobType) {
            this.jobType = jobType;
            return this;
        }

        public Builder experienceLevel(ExperienceLevel experienceLevel) {
            this.experienceLevel = experienceLevel;
            return this;
        }

        public Builder salaryMin(BigDecimal salaryMin) {
            this.salaryMin = salaryMin;
            return this;
        }

        public Builder salaryMax(BigDecimal salaryMax) {
            this.salaryMax = salaryMax;
            return this;
        }

        public Builder skillsRequired(String skillsRequired) {
            this.skillsRequired = skillsRequired;
            return this;
        }

        public Builder status(JobStatus status) {
            this.status = status;
            return this;
        }

        public Job build() {
            return new Job(id, recruiterProfile, title, description, location, jobType, experienceLevel, salaryMin, salaryMax, skillsRequired, status);
        }
    }
}
