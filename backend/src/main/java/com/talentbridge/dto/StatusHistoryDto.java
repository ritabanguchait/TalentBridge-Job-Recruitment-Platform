package com.talentbridge.dto;

import com.talentbridge.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class StatusHistoryDto {

    private ApplicationStatus status;
    private String remarks;
    private LocalDateTime changedAt;

    public StatusHistoryDto() {
    }

    public StatusHistoryDto(ApplicationStatus status, String remarks, LocalDateTime changedAt) {
        this.status = status;
        this.remarks = remarks;
        this.changedAt = changedAt;
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
}
