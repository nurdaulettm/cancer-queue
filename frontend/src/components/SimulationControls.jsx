'use client';

import React, { useState } from 'react';
import { queueApi } from '@/lib/api';

const SimulationControls = ({ onResults, onLoading }) => {
  const [config, setConfig] = useState({
    overbooking: 0,
    noShowRate: 10,
    simulations: 1000,
  });

  const [error, setError] = useState('');

  const handleSliderChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
    setError('');
  };

  const handleRunSimulation = async () => {
    try {
      setError('');
      onLoading(true);

      const response = await queueApi.simulate({
        n_simulations: config.simulations,
        p_no_show: config.noShowRate / 100,
        scheduled_patients: 66,
        overbooking_percentage: config.overbooking,
        mean_service_time: 15,
        std_service_time: 5,
      });

      onResults(response);
    } catch (err) {
      setError(err.message || 'Simulation failed. Please try again.');
      onLoading(false);
    }
  };

  return (
    <div className="metric-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Optimization Sandbox</h2>

      <div className="space-y-8">
        {/* Overbooking Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Overbooking Strategy: <span className="text-blue-600">{config.overbooking}%</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Percentage of extra patients to schedule beyond normal capacity to account for no-shows
          </p>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={config.overbooking}
            onChange={(e) => handleSliderChange('overbooking', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>No Overbooking</span>
            <span>Aggressive (+20%)</span>
          </div>
        </div>

        {/* No-Show Rate Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            No-Show Rate: <span className="text-red-600">{config.noShowRate}%</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Expected percentage of scheduled patients who don't appear for treatment
          </p>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={config.noShowRate}
            onChange={(e) => handleSliderChange('noShowRate', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Perfect Attendance</span>
            <span>High No-Shows (20%)</span>
          </div>
        </div>

        {/* Simulations Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Simulation Runs: <span className="text-emerald-600">{config.simulations}</span>
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Number of Monte Carlo iterations (more runs = higher accuracy but slower)
          </p>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={config.simulations}
            onChange={(e) => handleSliderChange('simulations', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Fast (100)</span>
            <span>Accurate (5000)</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Run Button */}
        <button
          onClick={handleRunSimulation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          ▶ Run Simulation
        </button>

        {/* Current Settings Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 mb-2">Current Configuration:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Base Patients: 66</li>
            <li>• With Overbooking: {Math.ceil(66 * (1 + config.overbooking / 100))}</li>
            <li>• Expected No-Shows: {Math.round(Math.ceil(66 * (1 + config.overbooking / 100)) * (config.noShowRate / 100))}</li>
            <li>• Expected to Show: {Math.ceil(66 * (1 + config.overbooking / 100) * ((100 - config.noShowRate) / 100))}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
