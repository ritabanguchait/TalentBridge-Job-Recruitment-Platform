import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from query parameters or defaults
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNumber,
        size: 8,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (location.trim()) params.location = location.trim();
      if (jobType) params.jobType = jobType;
      if (experienceLevel) params.experienceLevel = experienceLevel;

      const data = await jobService.searchJobs(params);
      setJobs(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setError('Unable to load jobs at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(0);
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (keyword.trim()) newParams.keyword = keyword.trim();
    if (location.trim()) newParams.location = location.trim();
    if (jobType) newParams.jobType = jobType;
    if (experienceLevel) newParams.experienceLevel = experienceLevel;

    setSearchParams(newParams);
    fetchJobs(0);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setLocation('');
    setJobType('');
    setExperienceLevel('');
    setSearchParams({});
    // Fetch all jobs directly
    jobService.searchJobs({ page: 0, size: 8 }).then((data) => {
      setJobs(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    });
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Explore Job Openings</h1>
        <p className="text-muted">
          Find your dream tech opportunity from verified companies across India and remote.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Filter Sidebar */}
        <div className="card card-body" style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Filter Jobs</h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleFilterSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="filter-keyword">Keyword / Title</label>
              <input
                id="filter-keyword"
                type="text"
                className="form-input"
                placeholder="e.g. Java, React, Spring"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-location">Location</label>
              <input
                id="filter-location"
                type="text"
                className="form-input"
                placeholder="e.g. Bangalore, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-jobtype">Employment Type</label>
              <select
                id="filter-jobtype"
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-exp">Experience Level</label>
              <select
                id="filter-exp"
                className="form-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (3-5 yrs)</option>
                <option value="SENIOR_LEVEL">Senior Level (5+ yrs)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Apply Filters
            </button>
          </form>
        </div>

        {/* Results Stream */}
        <div>
          {/* Status summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span className="text-muted" style={{ fontSize: '0.95rem' }}>
              Showing <strong>{jobs.length}</strong> of <strong>{totalElements}</strong> open positions
            </span>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <LoadingSpinner text="Searching available opportunities..." />
          ) : jobs.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 0}
                    onClick={() => fetchJobs(page - 1)}
                  >
                    &larr; Previous
                  </button>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => fetchJobs(page + 1)}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No matching jobs found"
              message="Try broadening your search query or removing some filters to see more results."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListPage;
