package com.talentbridge.repository;

import com.talentbridge.entity.ExperienceLevel;
import com.talentbridge.entity.Job;
import com.talentbridge.entity.JobStatus;
import com.talentbridge.entity.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query(value = "SELECT j FROM Job j JOIN FETCH j.recruiterProfile rp WHERE " +
            "j.status = :status AND " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(rp.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)",
            countQuery = "SELECT COUNT(j) FROM Job j WHERE " +
            "j.status = :status AND " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.skillsRequired) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.recruiterProfile.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)")
    Page<Job> searchJobs(@Param("status") JobStatus status,
                         @Param("keyword") String keyword,
                         @Param("location") String location,
                         @Param("jobType") JobType jobType,
                         @Param("experienceLevel") ExperienceLevel experienceLevel,
                         Pageable pageable);

    Page<Job> findByRecruiterProfileId(Long recruiterProfileId, Pageable pageable);

    @Query("SELECT j FROM Job j JOIN FETCH j.recruiterProfile WHERE j.id = :id")
    Optional<Job> findByIdWithRecruiter(@Param("id") Long id);

    long countByRecruiterProfileId(Long recruiterProfileId);

    long countByRecruiterProfileIdAndStatus(Long recruiterProfileId, JobStatus status);

    long countByStatus(JobStatus status);
}
