package com.talentbridge.dto;

public class RecruiterDashboardStats {

    private long activeJobsCount;
    private long totalJobsCount;
    private long totalApplicantsCount;
    private long underReviewCount;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private long rejectedCount;

    public RecruiterDashboardStats() {
    }

    public RecruiterDashboardStats(long activeJobsCount, long totalJobsCount, long totalApplicantsCount,
                                   long underReviewCount, long shortlistedCount, long interviewCount,
                                   long selectedCount, long rejectedCount) {
        this.activeJobsCount = activeJobsCount;
        this.totalJobsCount = totalJobsCount;
        this.totalApplicantsCount = totalApplicantsCount;
        this.underReviewCount = underReviewCount;
        this.shortlistedCount = shortlistedCount;
        this.interviewCount = interviewCount;
        this.selectedCount = selectedCount;
        this.rejectedCount = rejectedCount;
    }

    public long getActiveJobsCount() {
        return activeJobsCount;
    }

    public void setActiveJobsCount(long activeJobsCount) {
        this.activeJobsCount = activeJobsCount;
    }

    public long getTotalJobsCount() {
        return totalJobsCount;
    }

    public void setTotalJobsCount(long totalJobsCount) {
        this.totalJobsCount = totalJobsCount;
    }

    public long getTotalApplicantsCount() {
        return totalApplicantsCount;
    }

    public void setTotalApplicantsCount(long totalApplicantsCount) {
        this.totalApplicantsCount = totalApplicantsCount;
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
