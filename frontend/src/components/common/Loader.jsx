import React from 'react';

/**
 * Common Loader component using Tailwind CSS
 */
export default function Loader({ text = 'Loading...', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex flex-col items-center justify-center p-6 gap-3 text-slate-400 ${className}`}>
      <div
        className={`${spinnerSize} rounded-full border-slate-700 border-t-blue-500 animate-spin`}
        role="status"
        aria-label="loading"
      />
      {text && <span className="text-sm font-medium tracking-wide text-slate-300">{text}</span>}
    </div>
  );
}
