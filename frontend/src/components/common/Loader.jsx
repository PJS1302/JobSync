import React from 'react';

/**
 * Loader component for visual asynchronous state indications
 */
export default function Loader({ text = 'Loading student placement data...', size = 32 }) {
  return (
    <div className="loading-container">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderWidth: size > 24 ? 3 : 2
        }}
      />
      {text && <p style={{ fontSize: '0.85rem' }}>{text}</p>}
    </div>
  );
}
