import React from 'react';
import { SearchX, Inbox, AlertCircle } from 'lucide-react';

const EmptyState = ({
  icon: IconComponent,
  title = 'No records found',
  message,
  actionText,
  actionLabel,
  onAction,
}) => {
  const buttonText = actionText || actionLabel;
  const RenderIcon = IconComponent || SearchX;

  return (
    <div className="empty-state">
      <div className="empty-icon-wrap">
        <RenderIcon size={28} strokeWidth={1.8} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {buttonText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
