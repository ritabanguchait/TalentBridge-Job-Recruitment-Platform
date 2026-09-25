package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Detailed professional profile for a Job Seeker / Candidate.
 */
@Entity
@Table(name = "candidate_profiles")
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 150)
    private String headline;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String location;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(length = 200)
    private String education;

    @Column(name = "resume_url", length = 255)
    private String resumeUrl;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CandidateProfile() {
    }

    public CandidateProfile(Long id, User user, String headline, String phone, String location,
                            String skills, Integer experienceYears, String education,
                            String resumeUrl, String portfolioUrl) {
        this.id = id;
        this.user = user;
        this.headline = headline;
        this.phone = phone;
        this.location = location;
        this.skills = skills;
        this.experienceYears = experienceYears;
        this.education = education;
        this.resumeUrl = resumeUrl;
        this.portfolioUrl = portfolioUrl;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
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
        private User user;
        private String headline;
        private String phone;
        private String location;
        private String skills;
        private Integer experienceYears;
        private String education;
        private String resumeUrl;
        private String portfolioUrl;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder headline(String headline) {
            this.headline = headline;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public Builder location(String location) {
            this.location = location;
            return this;
        }

        public Builder skills(String skills) {
            this.skills = skills;
            return this;
        }

        public Builder experienceYears(Integer experienceYears) {
            this.experienceYears = experienceYears;
            return this;
        }

        public Builder education(String education) {
            this.education = education;
            return this;
        }

        public Builder resumeUrl(String resumeUrl) {
            this.resumeUrl = resumeUrl;
            return this;
        }

        public Builder portfolioUrl(String portfolioUrl) {
            this.portfolioUrl = portfolioUrl;
            return this;
        }

        public CandidateProfile build() {
            return new CandidateProfile(id, user, headline, phone, location, skills, experienceYears, education, resumeUrl, portfolioUrl);
        }
    }
}
