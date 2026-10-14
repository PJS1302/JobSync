import React from 'react';
import { getStatusConfig } from '../../utils/statusUtils';

/**
 * StatusBadge Component for rendering standardized status indicators
 */
export default function StatusBadge({ status, label = null, className = '' }) {
  const config = getStatusConfig(status);
  const displayLabel = label || config.label;

  return (
    <span
      className={`status-badge ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.text}33`
      }}
    >
      <span
        className="status-dot"
        style={{
          backgroundColor: config.text,
          boxShadow: `0 0 6px ${config.text}`
        }}
      />
      {displayLabel}
    </span>
  );
}
