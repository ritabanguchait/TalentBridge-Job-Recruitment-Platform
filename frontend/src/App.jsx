import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import JobListPage from './pages/public/JobListPage';
import JobDetailsPage from './pages/public/JobDetailsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import MyApplicationsPage from './pages/candidate/MyApplicationsPage';
import ApplicationDetailsPage from './pages/candidate/ApplicationDetailsPage';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJobPage from './pages/recruiter/PostJobPage';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import ApplicantsPage from './pages/recruiter/ApplicantsPage';
import ApplicantDetailsPage from './pages/recruiter/ApplicantDetailsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import JobManagementPage from './pages/admin/JobManagementPage';

function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div className="card card-body" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary-600)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
          404
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--slate-950)', marginBottom: '0.75rem' }}>
          Page Not Found
        </h2>
        <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.925rem', lineHeight: 1.6 }}>
          The link you navigated to might be broken, expired, or the page may have been moved to another location.
        </p>
        <a href="/" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          Return to Platform Home
        </a>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobListPage />} />
        <Route path="jobs/:id" element={<JobDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Candidate Routes */}
        <Route
          path="candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidate/profile"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
              <CandidateProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidate/applications"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
              <MyApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="candidate/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_CANDIDATE']}>
              <ApplicationDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Recruiter Routes */}
        <Route
          path="recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/post-job"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/jobs/new"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/jobs/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <PostJobPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/jobs"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <ManageJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/jobs/:jobId/applicants"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/applicants"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="recruiter/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
              <ApplicantDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/jobs"
          element={
            <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <JobManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
