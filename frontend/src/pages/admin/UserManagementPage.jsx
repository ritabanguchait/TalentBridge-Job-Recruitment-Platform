import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status toggle confirmation
  const [selectedUser, setSelectedUser] = useState(null);
  const [processing, setProcessing] = useState(false);

  const fetchUsers = async (pageNumber = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pageNumber,
        size: 10,
      };
      if (roleFilter) params.role = roleFilter;
      if (activeFilter !== '') params.isActive = activeFilter === 'true';
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await adminService.getUsers(params);
      setUsers(data.content || []);
      setPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Unable to load user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [roleFilter, activeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers(0);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setProcessing(true);
    try {
      await adminService.updateUserStatus(selectedUser.id, !selectedUser.active);
      setSelectedUser(null);
      fetchUsers(page);
    } catch (err) {
      console.error('Failed to update user status', err);
      alert(err.response?.data?.message || 'Failed to update user account status.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            User Account Management
          </h1>
          <p className="text-muted">
            Inspect registered accounts, audit user roles, and govern login permissions.
          </p>
        </div>
        <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card card-body" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: '1 1 200px' }}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select"
            style={{ width: '180px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="ROLE_CANDIDATE">Candidate</option>
            <option value="ROLE_RECRUITER">Recruiter</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>

          <select
            className="form-select"
            style={{ width: '160px' }}
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Suspended Only</option>
          </select>

          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading && users.length === 0 ? (
        <div style={{ padding: '3.5rem 1rem' }}>
          <LoadingSpinner text="Loading user accounts..." />
        </div>
      ) : (
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>
              Showing {users.length} of {totalElements} user records
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Registered Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-admin' : u.role === 'ROLE_RECRUITER' ? 'badge-recruiter' : 'badge-primary'}`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'badge-selected' : 'badge-withdrawn'}`}>
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'ROLE_ADMIN' && (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{
                            borderColor: u.active ? 'var(--danger)' : 'var(--success)',
                            color: u.active ? 'var(--danger)' : 'var(--success)',
                          }}
                          onClick={() => setSelectedUser(u)}
                        >
                          {u.active ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchUsers(page - 1)}
              >
                &larr; Prev
              </button>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchUsers(page + 1)}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedUser}
        title={selectedUser?.active ? 'Suspend Account?' : 'Reactivate Account?'}
        message={
          selectedUser?.active
            ? `Are you sure you want to deactivate ${selectedUser?.email}? They will no longer be able to log in.`
            : `Are you sure you want to reactivate ${selectedUser?.email}? Their account access will be restored.`
        }
        confirmText={selectedUser?.active ? 'Yes, Suspend Account' : 'Yes, Reactivate'}
        confirmVariant={selectedUser?.active ? 'danger' : 'primary'}
        isLoading={processing}
        onConfirm={handleToggleStatus}
        onCancel={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default UserManagementPage;
