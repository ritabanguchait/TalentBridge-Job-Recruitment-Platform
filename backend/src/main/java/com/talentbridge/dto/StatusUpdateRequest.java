package com.talentbridge.dto;

import com.talentbridge.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StatusUpdateRequest {

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;

    @Size(max = 255, message = "Remarks cannot exceed 255 characters")
    private String remarks;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(ApplicationStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
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
}
