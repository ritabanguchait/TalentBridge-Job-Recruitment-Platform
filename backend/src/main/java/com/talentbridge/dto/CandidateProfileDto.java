package com.talentbridge.dto;

import jakarta.validation.constraints.Size;

public class CandidateProfileDto {

    private Long id;

    @Size(max = 150, message = "Headline cannot exceed 150 characters")
    private String headline;

    @Size(max = 30, message = "Phone cannot exceed 30 characters")
    private String phone;

    @Size(max = 120, message = "Location cannot exceed 120 characters")
    private String location;

    private String skills;
    private Integer experienceYears;

    @Size(max = 200, message = "Education cannot exceed 200 characters")
    private String education;

    @Size(max = 255, message = "Resume URL cannot exceed 255 characters")
    private String resumeUrl;

    @Size(max = 255, message = "Portfolio URL cannot exceed 255 characters")
    private String portfolioUrl;

    public CandidateProfileDto() {
    }

    public CandidateProfileDto(Long id, String headline, String phone, String location,
                               String skills, Integer experienceYears, String education,
                               String resumeUrl, String portfolioUrl) {
        this.id = id;
        this.headline = headline;
        this.phone = phone;
        this.location = location;
        this.skills = skills;
        this.experienceYears = experienceYears;
        this.education = education;
        this.resumeUrl = resumeUrl;
        this.portfolioUrl = portfolioUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getPortfolioUrl() {
        return portfolioUrl;
    }

    public void setPortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }
}
