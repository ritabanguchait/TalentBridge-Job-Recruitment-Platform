package com.talentbridge.dto;

import com.talentbridge.entity.ApplicationStatus;
import com.talentbridge.entity.JobType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private JobType jobType;
    private ApplicationStatus status;
    private String coverNote;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    // Candidate details
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private String candidateHeadline;
    private String candidateSkills;
    private String candidateResumeUrl;
    private String candidatePortfolioUrl;

    // Progression Timeline
    private List<StatusHistoryDto> timeline = new ArrayList<>();

    public ApplicationResponse() {
    }

    public ApplicationResponse(Long id, Long jobId, String jobTitle, String companyName,
                               String location, JobType jobType, ApplicationStatus status,
                               String coverNote, LocalDateTime appliedAt, LocalDateTime updatedAt,
                               Long candidateId, String candidateName, String candidateEmail,
                               String candidatePhone, String candidateHeadline, String candidateSkills,
                               String candidateResumeUrl, String candidatePortfolioUrl,
                               List<StatusHistoryDto> timeline) {
        this.id = id;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.location = location;
        this.jobType = jobType;
        this.status = status;
        this.coverNote = coverNote;
        this.appliedAt = appliedAt;
        this.updatedAt = updatedAt;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.candidatePhone = candidatePhone;
        this.candidateHeadline = candidateHeadline;
        this.candidateSkills = candidateSkills;
        this.candidateResumeUrl = candidateResumeUrl;
        this.candidatePortfolioUrl = candidatePortfolioUrl;
        this.timeline = timeline != null ? timeline : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidatePhone() {
        return candidatePhone;
    }

    public void setCandidatePhone(String candidatePhone) {
        this.candidatePhone = candidatePhone;
    }

    public String getCandidateHeadline() {
        return candidateHeadline;
    }

    public void setCandidateHeadline(String candidateHeadline) {
        this.candidateHeadline = candidateHeadline;
    }

    public String getCandidateSkills() {
        return candidateSkills;
    }

    public void setCandidateSkills(String candidateSkills) {
        this.candidateSkills = candidateSkills;
    }

    public String getCandidateResumeUrl() {
        return candidateResumeUrl;
    }

    public void setCandidateResumeUrl(String candidateResumeUrl) {
        this.candidateResumeUrl = candidateResumeUrl;
    }

    public String getCandidatePortfolioUrl() {
        return candidatePortfolioUrl;
    }

    public void setCandidatePortfolioUrl(String candidatePortfolioUrl) {
        this.candidatePortfolioUrl = candidatePortfolioUrl;
    }

    public List<StatusHistoryDto> getTimeline() {
        return timeline;
    }

    public void setTimeline(List<StatusHistoryDto> timeline) {
        this.timeline = timeline;
    }
}
