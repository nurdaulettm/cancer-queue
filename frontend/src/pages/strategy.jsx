'use client';

import React, { useState } from 'react';
import QueueTimeline from '@/components/QueueTimeline';
import SimulationControls from '@/components/SimulationControls';
import SimulationResults from '@/components/SimulationResults';
import { withAuth } from '@/lib/auth';

function Strategy() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Queue Optimization Strategy
        </h1>
        <p className="text-gray-600 mt-1">
          Use Monte Carlo simulation to test overbooking strategies and optimize machine utilization
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Simulation Parameters</h2>
        <SimulationControls onResults={setResults} onLoading={setLoading} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Running Monte Carlo simulation...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Simulation Results</h2>
          <SimulationResults data={results} />
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Queue Timeline Preview</h2>
        <QueueTimeline />
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 About Monte Carlo Simulation</h3>
        <p className="text-blue-800 text-sm">
          This tool uses Monte Carlo methods to simulate thousands of scenarios with different patient no-show rates 
          and overbooking strategies. It helps you find the optimal balance between machine utilization and patient 
          wait times, ensuring efficient use of TrueBeam Linear Accelerator resources while minimizing overbooking risks.
        </p>
      </div>
    </div>
  );
}

export default withAuth(Strategy, ['admin', 'doctor']);
