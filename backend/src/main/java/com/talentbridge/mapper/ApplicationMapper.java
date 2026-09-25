package com.talentbridge.mapper;

import com.talentbridge.dto.ApplicationResponse;
import com.talentbridge.dto.StatusHistoryDto;
import com.talentbridge.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class ApplicationMapper {

    public static ApplicationResponse toResponse(JobApplication app, List<ApplicationStatusHistory> historyList) {
        if (app == null) {
            return null;
        }

        Job job = app.getJob();
        CandidateProfile candidate = app.getCandidateProfile();
        User candidateUser = candidate != null ? candidate.getUser() : null;
        RecruiterProfile recruiterProfile = job != null ? job.getRecruiterProfile() : null;

        String companyName = recruiterProfile != null ? recruiterProfile.getCompanyName() : "Company";
        String candidateName = candidateUser != null ? (candidateUser.getFirstName() + " " + candidateUser.getLastName()) : "Candidate";
        String candidateEmail = candidateUser != null ? candidateUser.getEmail() : null;

        List<StatusHistoryDto> timeline = (historyList != null)
                ? historyList.stream()
                .map(h -> new StatusHistoryDto(h.getStatus(), h.getRemarks(), h.getChangedAt()))
                .collect(Collectors.toList())
                : List.of();

        return new ApplicationResponse(
                app.getId(),
                job != null ? job.getId() : null,
                job != null ? job.getTitle() : "Unknown Job",
                companyName,
                job != null ? job.getLocation() : null,
                job != null ? job.getJobType() : null,
                app.getStatus(),
                app.getCoverNote(),
                app.getAppliedAt(),
                app.getUpdatedAt(),
                candidate != null ? candidate.getId() : null,
                candidateName,
                candidateEmail,
                candidate != null ? candidate.getPhone() : null,
                candidate != null ? candidate.getHeadline() : null,
                candidate != null ? candidate.getSkills() : null,
                candidate != null ? candidate.getResumeUrl() : null,
                candidate != null ? candidate.getPortfolioUrl() : null,
                timeline
        );
    }
}
