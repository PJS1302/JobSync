import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '../components/common/Button';

/**
 * Route placeholder for un-implemented feature pages
 */
export default function Placeholder({ title }) {
  const location = useLocation();
  const pageTitle =
    title ||
    location.pathname
      .replace('/', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Feature Module';

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-2xl mb-4 shadow-lg">
        🚧
      </div>
      <h1 className="text-xl font-bold text-white mb-2">{pageTitle}</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The route <code className="text-blue-400 bg-slate-800/80 px-1.5 py-0.5 rounded font-mono text-xs">{location.pathname}</code> is configured in the router foundation. Feature page implementation will be completed in its assigned module.
      </p>
      <Link to="/">
        <Button variant="outline" size="sm">
          Return to Foundation Home
        </Button>
      </Link>
    </div>
  );
}
