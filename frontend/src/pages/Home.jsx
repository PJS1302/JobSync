import React, { useState } from 'react';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { studentApiClient, placementApiClient } from '../services/api';

/**
 * Foundation Demonstration & Welcome Page
 */
export default function Home() {
  const [apiTesting, setApiTesting] = useState(false);
  const [apiResult, setApiResult] = useState(null);

  const testApiClients = async () => {
    setApiTesting(true);
    setApiResult(null);

    try {
      // Test Student Service Client connectivity
      const studentRes = await studentApiClient.get('/health').catch((err) => ({
        success: false,
        message: err.message
      }));

      setApiResult({
        studentEndpoint: studentApiClient.defaults.baseURL,
        placementEndpoint: placementApiClient.defaults.baseURL,
        status: studentRes?.success ? 'Connected' : 'Client configured (Services offline or waiting to start)'
      });
    } finally {
      setApiTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Foundation Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Foundation Initialized
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          JobSync Frontend Foundation
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-400 max-w-2xl">
          Core application routing, Tailwind CSS design system, responsive layout, common UI components, and Axios API clients are set up and operational.
        </p>
      </div>

      {/* Common UI Components Verification Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Button Component Foundation */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <h2 className="text-base font-semibold text-white">Button Component Variants</h2>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" size="sm">Primary</Button>
            <Button variant="secondary" size="sm">Secondary</Button>
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
            <Button variant="danger" size="sm">Danger</Button>
          </div>
          <div className="flex items-center gap-2.5 pt-2">
            <Button variant="primary" size="sm" loading>Loading</Button>
            <Button variant="secondary" size="sm" disabled>Disabled</Button>
          </div>
        </div>

        {/* StatusBadge Component Foundation */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <h2 className="text-base font-semibold text-white">StatusBadge Component</h2>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="eligible" />
            <StatusBadge status="applied" />
            <StatusBadge status="scheduled" />
            <StatusBadge status="shortlisted" />
            <StatusBadge status="pending" />
            <StatusBadge status="rejected" />
          </div>
        </div>

        {/* Loader Component Foundation */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <h2 className="text-base font-semibold text-white">Loader Component</h2>
          <div className="flex items-center justify-around py-2">
            <Loader size="sm" text="Small" />
            <Loader size="md" text="Medium" />
          </div>
        </div>

        {/* API Client Configuration Verification */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <h2 className="text-base font-semibold text-white">Axios API Client Foundation</h2>
          <div className="space-y-1.5 text-xs text-slate-400 font-mono">
            <div>Student Service URL: <span className="text-blue-400">{studentApiClient.defaults.baseURL}</span></div>
            <div>Placement Service URL: <span className="text-indigo-400">{placementApiClient.defaults.baseURL}</span></div>
          </div>
          <Button
            id="btn-test-api-foundation"
            variant="outline"
            size="sm"
            onClick={testApiClients}
            loading={apiTesting}
          >
            Verify Client Configuration
          </Button>

          {apiResult && (
            <div className="p-3 rounded-lg bg-slate-800/80 text-xs border border-slate-700 space-y-1">
              <div className="text-slate-300"><strong>Status:</strong> {apiResult.status}</div>
              <div className="text-slate-400">Endpoints bound to configured environment variables.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
