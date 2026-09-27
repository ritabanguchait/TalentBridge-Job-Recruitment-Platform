import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Users, 
  Mail, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  UserX,
  UserCheck
} from 'lucide-react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import StatusBadge from '../../components/common/StatusBadge';

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
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <div className="page-header-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
            <span>Admin</span>
            <span>&bull;</span>
            <span>User Governance</span>
          </div>
          <h1 className="page-title">User Account Directory</h1>
          <p className="page-subtitle">
            Audit registered candidates and recruiters, examine permission tiers, and enforce access suspension.
          </p>
        </div>

        <div className="page-actions">
          <Link to="/admin/dashboard" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card card-body" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search by candidate/recruiter name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
          </div>

          <select
            className="form-select"
            style={{ width: '170px' }}
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

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
            <Search size={15} />
            <span>Search</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.75rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div style={{ padding: '3.5rem 1.5rem' }}>
          <LoadingSpinner text="Querying user directory..." />
        </div>
      ) : (
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Showing <strong>{users.length}</strong> of <strong>{totalElements}</strong> registered users
            </span>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User Details</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const initials = `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase() || 'U';

                  return (
                    <tr key={u.id}>
                      <td style={{ color: 'var(--slate-500)', fontSize: '0.8rem' }}>#{u.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div 
                            style={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: 'var(--radius-full)', 
                              backgroundColor: 'var(--slate-100)', 
                              color: 'var(--slate-700)', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '0.75rem', 
                              fontWeight: 700 
                            }}
                          >
                            {initials}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                            {u.firstName} {u.lastName}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-600)' }}>
                          <Mail size={13} className="text-muted" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={u.role} />
                      </td>
                      <td>
                        <span className={`badge ${u.active ? 'badge-selected' : 'badge-rejected'}`}>
                          {u.active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td style={{ textAlign: 'right' }}>
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            type="button"
                            className={`btn btn-sm ${u.active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => setSelectedUser(u)}
                          >
                            {u.active ? (
                              <>
                                <UserX size={13} />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} />
                                <span>Reactivate</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-default)' }}>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 0}
                onClick={() => fetchUsers(page - 1)}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={page + 1 >= totalPages}
                onClick={() => fetchUsers(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedUser}
        title={selectedUser?.active ? 'Suspend User Access?' : 'Reactivate User Account?'}
        message={
          selectedUser?.active
            ? `Are you sure you want to suspend account privileges for ${selectedUser?.email}? The user will immediately be barred from signing in.`
            : `Are you sure you want to reactivate access for ${selectedUser?.email}? Their ability to log in and manage data will be restored.`
        }
        confirmText={selectedUser?.active ? 'Yes, Suspend Account' : 'Yes, Reactivate Account'}
        confirmVariant={selectedUser?.active ? 'danger' : 'primary'}
        isLoading={processing}
        onConfirm={handleToggleStatus}
        onCancel={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default UserManagementPage;
