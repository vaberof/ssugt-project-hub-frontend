import React from 'react';

interface ModerationCardProps {
  title: string;
  authors: string;
  status: string;
  description: string;
  onApprove: () => void;
  onReject: () => void;
}

export const ModerationCard: React.FC<ModerationCardProps> = ({
  title,
  authors,
  status,
  description,
  onApprove,
  onReject
}) => {
  return (
    <div className="moderation-card">
      <div className="card-header">
        <div className="card-info">
          <h2 className="card-title">{title}</h2>
          <p className="card-authors">{authors}</p>
        </div>
        <div className="status-badge">{status}</div>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-actions">
        <button className="approve-button" onClick={onApprove}>
          Подтвердить
        </button>
        <button className="reject-button" onClick={onReject}>
          Отклонить
        </button>
      </div>
    </div>
  );
};