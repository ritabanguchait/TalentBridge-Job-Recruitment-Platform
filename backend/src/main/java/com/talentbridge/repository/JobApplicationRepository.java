package com.talentbridge.repository;

import com.talentbridge.entity.ApplicationStatus;
import com.talentbridge.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    boolean existsByJobIdAndCandidateProfileId(Long jobId, Long candidateProfileId);

    Optional<JobApplication> findByIdAndCandidateProfileId(Long id, Long candidateProfileId);

    @Query(value = "SELECT a FROM JobApplication a " +
            "JOIN FETCH a.job j " +
            "JOIN FETCH j.recruiterProfile " +
            "WHERE a.candidateProfile.id = :candidateProfileId",
            countQuery = "SELECT COUNT(a) FROM JobApplication a WHERE a.candidateProfile.id = :candidateProfileId")
    Page<JobApplication> findByCandidateProfileId(@Param("candidateProfileId") Long candidateProfileId, Pageable pageable);

    @Query("SELECT a FROM JobApplication a " +
            "JOIN FETCH a.job j " +
            "JOIN FETCH j.recruiterProfile rp " +
            "JOIN FETCH rp.user " +
            "JOIN FETCH a.candidateProfile cp " +
            "JOIN FETCH cp.user " +
            "WHERE a.id = :id")
    Optional<JobApplication> findByIdWithDetails(@Param("id") Long id);

    @Query(value = "SELECT a FROM JobApplication a " +
            "JOIN FETCH a.job j " +
            "JOIN FETCH j.recruiterProfile " +
            "JOIN FETCH a.candidateProfile cp " +
            "JOIN FETCH cp.user " +
            "WHERE j.id = :jobId AND (:status IS NULL OR a.status = :status)",
            countQuery = "SELECT COUNT(a) FROM JobApplication a WHERE a.job.id = :jobId AND (:status IS NULL OR a.status = :status)")
    Page<JobApplication> findByJobIdAndOptionalStatus(@Param("jobId") Long jobId,
                                                     @Param("status") ApplicationStatus status,
                                                     Pageable pageable);

    @Query(value = "SELECT a FROM JobApplication a " +
            "JOIN FETCH a.job j " +
            "JOIN FETCH a.candidateProfile cp " +
            "JOIN FETCH cp.user " +
            "WHERE j.recruiterProfile.id = :recruiterProfileId",
            countQuery = "SELECT COUNT(a) FROM JobApplication a WHERE a.job.recruiterProfile.id = :recruiterProfileId")
    Page<JobApplication> findByRecruiterProfileId(@Param("recruiterProfileId") Long recruiterProfileId, Pageable pageable);

    long countByCandidateProfileId(Long candidateProfileId);

    long countByCandidateProfileIdAndStatus(Long candidateProfileId, ApplicationStatus status);

    long countByJobId(Long jobId);

    long countByJobIdAndStatus(Long jobId, ApplicationStatus status);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.recruiterProfile.id = :recruiterProfileId")
    long countAllByRecruiterProfileId(@Param("recruiterProfileId") Long recruiterProfileId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.recruiterProfile.id = :recruiterProfileId AND a.status = :status")
    long countByRecruiterProfileIdAndStatus(@Param("recruiterProfileId") Long recruiterProfileId,
                                           @Param("status") ApplicationStatus status);

    long countByStatus(ApplicationStatus status);
}
