'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getStatusColor, formatTime, calculateSweetSpot } from '@/lib/utils';

const SimulationResults = ({ data }) => {
  if (!data) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Run a simulation to see results</p>
      </div>
    );
  }

  const isSweetSpot = calculateSweetSpot(data.occupancy_percentage, data.average_wait_time);

  // Prepare histogram data
  const histogramData = data.wait_time_distribution ? [
    {
      name: 'Mean',
      value: data.wait_time_distribution.mean,
    },
    {
      name: 'Median',
      value: data.wait_time_distribution.median,
    },
    {
      name: 'P95',
      value: data.wait_time_distribution.percentile_95,
    },
    {
      name: 'P99',
      value: data.wait_time_distribution.percentile_99,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Sweet Spot Gauge */}
      <div className={`metric-card ${isSweetSpot ? 'border-green-500 border-2' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Optimization Status</h3>
            <p className="text-sm text-gray-600 mt-1">
              {isSweetSpot
                ? '✓ Sweet Spot: Occupancy > 85% AND Wait Time < 10 mins'
                : 'Adjust parameters to reach optimal conditions'}
            </p>
          </div>
          <div className={`text-4xl font-bold ${isSweetSpot ? 'text-green-600' : 'text-amber-600'}`}>
            {isSweetSpot ? '✓' : '○'}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="metric-card">
          <p className="text-sm text-gray-600 font-medium">Average Wait Time</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {formatTime(data.average_wait_time)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Lower is better (&lt;10 min target)</p>
        </div>

        <div className="metric-card">
          <p className="text-sm text-gray-600 font-medium">Occupancy Rate</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {data.occupancy_percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Target: &gt;85%</p>
        </div>

        <div className="metric-card">
          <p className="text-sm text-gray-600 font-medium">Overload Risk</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {data.risk_of_overload.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">% of simulations exceeding capacity</p>
        </div>

        <div className="metric-card">
          <p className="text-sm text-gray-600 font-medium">Machine Idle Time</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {data.machine_idle_percentage.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Minimize downtime</p>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wait Time Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => `${value.toFixed(2)} min`} />
            <Bar dataKey="value" fill="#0284c7" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistics Table */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Scheduled Patients</td>
                <td className="py-2 font-semibold text-right">{data.actual_patients_scheduled}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Expected to Show</td>
                <td className="py-2 font-semibold text-right">{data.actual_patients_showed_up.toFixed(0)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Buffer Slots</td>
                <td className="py-2 font-semibold text-right">{data.buffer_slots}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 text-gray-600">Optimal Booking (N*)</td>
                <td className="py-2 font-semibold text-right">{data.optimal_booking_count.toFixed(0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-600">95th Percentile Wait</td>
                <td className="py-2 font-semibold text-right">
                  {formatTime(data.wait_time_distribution.percentile_95)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimulationResults;
