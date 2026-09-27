package com.talentbridge.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

/**
 * Profile details for a Recruiter account, representing their associated company.
 */
@Entity
@Table(name = "recruiter_profiles")
public class RecruiterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank(message = "Company name is required")
    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "company_website", length = 200)
    private String companyWebsite;

    @Column(name = "company_location", length = 150)
    private String companyLocation;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public RecruiterProfile() {
    }

    public RecruiterProfile(Long id, User user, String companyName, String companyWebsite,
                            String companyLocation, String companyDescription) {
        this.id = id;
        this.user = user;
        this.companyName = companyName;
        this.companyWebsite = companyWebsite;
        this.companyLocation = companyLocation;
        this.companyDescription = companyDescription;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
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
        private String companyName;
        private String companyWebsite;
        private String companyLocation;
        private String companyDescription;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder user(User user) {
            this.user = user;
            return this;
        }

        public Builder companyName(String companyName) {
            this.companyName = companyName;
            return this;
        }

        public Builder companyWebsite(String companyWebsite) {
            this.companyWebsite = companyWebsite;
            return this;
        }

        public Builder companyLocation(String companyLocation) {
            this.companyLocation = companyLocation;
            return this;
        }

        public Builder companyDescription(String companyDescription) {
            this.companyDescription = companyDescription;
            return this;
        }

        public RecruiterProfile build() {
            return new RecruiterProfile(id, user, companyName, companyWebsite, companyLocation, companyDescription);
        }
    }
}
