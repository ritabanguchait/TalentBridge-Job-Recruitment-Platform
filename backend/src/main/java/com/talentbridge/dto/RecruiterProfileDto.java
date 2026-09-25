package com.talentbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RecruiterProfileDto {

    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @Size(max = 200, message = "Website URL cannot exceed 200 characters")
    private String companyWebsite;

    @Size(max = 150, message = "Location cannot exceed 150 characters")
    private String companyLocation;

    private String companyDescription;

    public RecruiterProfileDto() {
    }

    public RecruiterProfileDto(Long id, String companyName, String companyWebsite,
                               String companyLocation, String companyDescription) {
        this.id = id;
        this.companyName = companyName;
        this.companyWebsite = companyWebsite;
        this.companyLocation = companyLocation;
        this.companyDescription = companyDescription;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyWebsite() {
        return companyWebsite;
    }

    public void setCompanyWebsite(String companyWebsite) {
        this.companyWebsite = companyWebsite;
    }

    public String getCompanyLocation() {
        return companyLocation;
    }

    public void setCompanyLocation(String companyLocation) {
        this.companyLocation = companyLocation;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }
}
