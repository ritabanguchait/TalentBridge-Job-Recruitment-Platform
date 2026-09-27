package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a job application submitted by a candidate for a specific job.
 * Guaranteed uniqueness per candidate per job.
 */
@Entity
@Table(name = "job_applications",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_job_candidate", columnNames = {"job_id", "candidate_id"})
        },
        indexes = {
                @Index(name = "idx_app_status", columnList = "status"),
                @Index(name = "idx_app_candidate", columnList = "candidate_id"),
                @Index(name = "idx_app_job", columnList = "job_id")
        })
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private CandidateProfile candidateProfile;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "cover_note", columnDefinition = "TEXT")
    private String coverNote;

    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public JobApplication() {
    }

    public JobApplication(Long id, Job job, CandidateProfile candidateProfile,
                          ApplicationStatus status, String coverNote) {
        this.id = id;
        this.job = job;
        this.candidateProfile = candidateProfile;
        this.status = status != null ? status : ApplicationStatus.APPLIED;
        this.coverNote = coverNote;
    }

    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ApplicationStatus.APPLIED;
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

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public CandidateProfile getCandidateProfile() {
        return candidateProfile;
    }

    public void setCandidateProfile(CandidateProfile candidateProfile) {
        this.candidateProfile = candidateProfile;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
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
        private Job job;
        private CandidateProfile candidateProfile;
        private ApplicationStatus status = ApplicationStatus.APPLIED;
        private String coverNote;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder job(Job job) {
            this.job = job;
            return this;
        }

        public Builder candidateProfile(CandidateProfile candidateProfile) {
            this.candidateProfile = candidateProfile;
            return this;
        }

        public Builder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public Builder coverNote(String coverNote) {
            this.coverNote = coverNote;
            return this;
        }

        public JobApplication build() {
            return new JobApplication(id, job, candidateProfile, status, coverNote);
        }
    }
}
