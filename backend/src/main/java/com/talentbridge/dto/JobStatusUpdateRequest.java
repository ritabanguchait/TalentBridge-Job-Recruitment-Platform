package com.talentbridge.dto;

import com.talentbridge.entity.JobStatus;
import jakarta.validation.constraints.NotNull;

public class JobStatusUpdateRequest {

    @NotNull(message = "Job status is required (OPEN or CLOSED)")
    private JobStatus status;

    public JobStatusUpdateRequest() {
    }

    public JobStatusUpdateRequest(JobStatus status) {
        this.status = status;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}
