package com.talentbridge.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Audit log recording status transitions for each job application.
 */
@Entity
@Table(name = "application_status_history", indexes = {
        @Index(name = "idx_history_app_id", columnList = "application_id")
})
public class ApplicationStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status;

    @Column(length = 255)
    private String remarks;

    @Column(name = "changed_at", nullable = false)
    private LocalDateTime changedAt;

    public ApplicationStatusHistory() {
    }

    public ApplicationStatusHistory(Long id, JobApplication application, ApplicationStatus status,
                                    String remarks, LocalDateTime changedAt) {
        this.id = id;
        this.application = application;
        this.status = status;
        this.remarks = remarks;
        this.changedAt = changedAt != null ? changedAt : LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobApplication getApplication() {
        return application;
    }

    public void setApplication(JobApplication application) {
        this.application = application;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private JobApplication application;
        private ApplicationStatus status;
        private String remarks;
        private LocalDateTime changedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder application(JobApplication application) {
            this.application = application;
            return this;
        }

        public Builder status(ApplicationStatus status) {
            this.status = status;
            return this;
        }

        public Builder remarks(String remarks) {
            this.remarks = remarks;
            return this;
        }

        public Builder changedAt(LocalDateTime changedAt) {
            this.changedAt = changedAt;
            return this;
        }

        public ApplicationStatusHistory build() {
            return new ApplicationStatusHistory(id, application, status, remarks, changedAt);
        }
    }
}
