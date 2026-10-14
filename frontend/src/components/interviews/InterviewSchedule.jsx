import React, { useState } from 'react';
import InterviewCard from './InterviewCard';
import Button from '../common/Button';

/**
 * InterviewSchedule Component
 * Manages timeline view of upcoming and past candidate interviews
 */
export default function InterviewSchedule({ interviews = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredInterviews = interviews.filter((item) => {
    if (filter === 'all') return true;
    return item.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
        {['all', 'scheduled', 'completed'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredInterviews.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-3xl mb-2">📅</div>
          <h3 className="text-base font-bold text-white">No Interviews Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {filter === 'all'
              ? 'You do not have any interviews scheduled currently.'
              : `No interviews found matching status "${filter}".`}
          </p>
          {filter !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => setFilter('all')}>
              Show All Interviews
            </Button>
          )}
        </div>
      ) : (
        /* Interviews List */
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
