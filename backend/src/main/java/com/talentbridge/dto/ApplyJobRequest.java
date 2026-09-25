package com.talentbridge.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApplyJobRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @Size(max = 2000, message = "Cover note cannot exceed 2000 characters")
    private String coverNote;

    public ApplyJobRequest() {
    }

    public ApplyJobRequest(Long jobId, String coverNote) {
        this.jobId = jobId;
        this.coverNote = coverNote;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }
}
