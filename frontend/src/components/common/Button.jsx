import React from 'react';

/**
 * Common Button component using Tailwind CSS
 */
export default function Button({
  id,
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon = null,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5'
  }[size] || 'text-sm px-4 py-2 gap-2';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 focus:ring-blue-500',
    secondary:
      'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700/80 focus:ring-slate-600',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-100 focus:ring-slate-600',
    danger:
      'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-500'
  }[variant] || 'bg-blue-600 hover:bg-blue-500 text-white';

  return (
    <button
      id={id}
      type={type}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex items-center shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
