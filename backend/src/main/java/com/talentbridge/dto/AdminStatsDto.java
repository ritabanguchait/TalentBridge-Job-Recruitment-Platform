package com.talentbridge.dto;

public class AdminStatsDto {

    private long totalUsers;
    private long totalRecruiters;
    private long totalCandidates;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long activeUsers;
    private long inactiveUsers;

    public AdminStatsDto() {
    }

    public AdminStatsDto(long totalUsers, long totalRecruiters, long totalCandidates, long totalJobs,
                         long activeJobs, long totalApplications, long activeUsers, long inactiveUsers) {
        this.totalUsers = totalUsers;
        this.totalRecruiters = totalRecruiters;
        this.totalCandidates = totalCandidates;
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.totalApplications = totalApplications;
        this.activeUsers = activeUsers;
        this.inactiveUsers = inactiveUsers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalRecruiters() {
        return totalRecruiters;
    }

    public void setTotalRecruiters(long totalRecruiters) {
        this.totalRecruiters = totalRecruiters;
    }

    public long getTotalCandidates() {
        return totalCandidates;
    }

    public void setTotalCandidates(long totalCandidates) {
        this.totalCandidates = totalCandidates;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getInactiveUsers() {
        return inactiveUsers;
    }

    public void setInactiveUsers(long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }
}
