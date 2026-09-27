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
    <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
      <div className="card card-body" style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          The requested URL does not exist or may have been relocated.
        </p>
        <a href="/" className="btn btn-primary">
          Return to Home
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
