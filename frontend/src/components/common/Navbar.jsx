import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Common Navbar component using Tailwind CSS
 */
export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">JobSync</span>
        </Link>

        <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Placement Portal
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Connection status indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Services Ready</span>
        </div>

        {/* User avatar menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center ring-2 ring-slate-800">
            JS
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white">Alex Rivera</div>
            <div className="text-[11px] text-slate-400">22CS104 • CSE</div>
          </div>
        </div>
      </div>
    </header>
  );
}
