import React from 'react';

const ConfirmationModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem' }}>{title}</h3>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--navy-700)', fontSize: '0.95rem' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="btn btn-outline btn-sm">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`btn btn-sm ${isDanger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
