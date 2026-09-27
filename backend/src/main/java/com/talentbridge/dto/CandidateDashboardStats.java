package com.talentbridge.dto;

public class CandidateDashboardStats {

    private long totalApplications;
    private long underReviewCount;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private long rejectedCount;

    public CandidateDashboardStats() {
    }

    public CandidateDashboardStats(long totalApplications, long underReviewCount, long shortlistedCount,
                                   long interviewCount, long selectedCount, long rejectedCount) {
        this.totalApplications = totalApplications;
        this.underReviewCount = underReviewCount;
        this.shortlistedCount = shortlistedCount;
        this.interviewCount = interviewCount;
        this.selectedCount = selectedCount;
        this.rejectedCount = rejectedCount;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getUnderReviewCount() {
        return underReviewCount;
    }

    public void setUnderReviewCount(long underReviewCount) {
        this.underReviewCount = underReviewCount;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getInterviewCount() {
        return interviewCount;
    }

    public void setInterviewCount(long interviewCount) {
        this.interviewCount = interviewCount;
    }

    public long getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(long selectedCount) {
        this.selectedCount = selectedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }
}
