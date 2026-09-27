import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  RotateCcw, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state
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
    jobService.searchJobs({ page: 0, size: 8 }).then((data) => {
      setJobs(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    });
  };

  const hasActiveFilters = Boolean(keyword || location || jobType || experienceLevel);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Page Title Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Directory</span>
            <span>&bull;</span>
            <span>Live Openings</span>
          </div>
          <h1 className="page-title">Explore Engineering Opportunities</h1>
          <p className="page-subtitle">
            Find vetted tech roles with transparent salaries and direct employer recruitment workflows.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 310px) 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sticky Filter Sidebar */}
        <aside className="card card-body" style={{ position: 'sticky', top: '88px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: 'var(--slate-900)' }}>
              <SlidersHorizontal size={16} className="text-primary" />
              <span>Filter Criteria</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.775rem' }}
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>

          <form onSubmit={handleFilterSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="filter-keyword">
                Keyword / Role Title
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="filter-keyword"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="e.g. Java, React, DevOps"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-location">
                Location
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="filter-location"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.2rem' }}
                  placeholder="e.g. Bangalore, Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <MapPin size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-jobtype">
                Employment Type
              </label>
              <select
                id="filter-jobtype"
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="">All Employment Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="filter-exp">
                Experience Level
              </label>
              <select
                id="filter-exp"
                className="form-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="">All Experience Levels</option>
                <option value="ENTRY_LEVEL">Entry Level (0-2 yrs)</option>
                <option value="MID_LEVEL">Mid Level (3-5 yrs)</option>
                <option value="SENIOR_LEVEL">Senior Level (5+ yrs)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Filter size={15} />
              <span>Apply Filters</span>
            </button>
          </form>
        </aside>

        {/* Results Stream */}
        <section>
          {/* Status summary & Active Chips */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--slate-900)' }}>{jobs.length}</strong> of{' '}
              <strong style={{ color: 'var(--slate-900)' }}>{totalElements}</strong> positions
            </div>

            {hasActiveFilters && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                {keyword && (
                  <span className="badge badge-applied" style={{ fontSize: '0.75rem' }}>
                    Keyword: {keyword}
                  </span>
                )}
                {location && (
                  <span className="badge badge-applied" style={{ fontSize: '0.75rem' }}>
                    Location: {location}
                  </span>
                )}
                {jobType && (
                  <span className="badge badge-applied" style={{ fontSize: '0.75rem' }}>
                    {jobType.replace(/_/g, ' ')}
                  </span>
                )}
                {experienceLevel && (
                  <span className="badge badge-applied" style={{ fontSize: '0.75rem' }}>
                    {experienceLevel.replace(/_/g, ' ')}
                  </span>
                )}
              </div>
            )}
          </div>

          {error && (
            <div className="alert alert-error">
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page === 0}
                    onClick={() => fetchJobs(page - 1)}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={page + 1 >= totalPages}
                    onClick={() => fetchJobs(page + 1)}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No matching jobs found"
              message="Try broadening your search query or removing active filters to see more results."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default JobListPage;
