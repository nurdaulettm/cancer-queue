/**
 * Admin/Doctor Dashboard
 * Comprehensive queue management dashboard
 */

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/auth';
import { usersApi, queueApi } from '@/lib/api';
import Link from 'next/link';

// Priority colors
const PRIORITY_COLORS = {
  1: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', name: 'Emergency' },
  2: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', name: 'Urgent' },
  3: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', name: 'High' },
  4: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', name: 'Standard' },
  5: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', name: 'Routine' },
};

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState(null);
  const [apiHealth, setApiHealth] = useState('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check API health
        await queueApi.health();
        setApiHealth('healthy');

        // Fetch stats and patients
        const [statsData, patientsData] = await Promise.all([
          usersApi.getStats(),
          usersApi.getPatients(),
        ]);
        
        setStats(statsData);
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setApiHealth('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your queue today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            apiHealth === 'healthy' ? 'bg-green-500' : 
            apiHealth === 'checking' ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="text-sm text-gray-600">
            {apiHealth === 'healthy' ? 'System Online' : 
             apiHealth === 'checking' ? 'Checking...' : 'System Offline'}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.total_patients || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Emergency</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats?.by_priority?.[1]?.count || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Urgent</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {stats?.by_priority?.[2]?.count || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Standard</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {(stats?.by_priority?.[4]?.count || 0) + (stats?.by_priority?.[5]?.count || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((priority) => {
            const count = stats?.by_priority?.[priority]?.count || 0;
            const total = stats?.total_patients || 1;
            const percentage = (count / total) * 100;
            const colors = PRIORITY_COLORS[priority];
            
            return (
              <div key={priority} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {colors.name}
                </div>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full ${colors.bg} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className={`text-sm font-semibold ${colors.text}`}>{count}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Patients by Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency & Urgent */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="font-semibold text-gray-900">🚨 High Priority Patients</h3>
            <p className="text-sm text-gray-500">Requiring immediate attention</p>
          </div>
          <div className="divide-y divide-gray-100">
            {patients?.by_priority?.[1]?.patients?.slice(0, 3).concat(
              patients?.by_priority?.[2]?.patients?.slice(0, 2) || []
            ).map((patient) => (
              <div key={patient.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                    {patient.full_name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.full_name}</p>
                    <p className="text-sm text-gray-500">{patient.diagnosis}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  patients?.by_priority?.[1]?.patients?.some(p => p.id === patient.id)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {patients?.by_priority?.[1]?.patients?.some(p => p.id === patient.id) ? 'Emergency' : 'Urgent'}
                </span>
              </div>
            )) || (
              <div className="px-6 py-8 text-center text-gray-500">
                No high priority patients
              </div>
            )}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all patients →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">⚡ Quick Actions</h3>
            <p className="text-sm text-gray-500">Common tasks and tools</p>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link href="/patients" 
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Add Patient</p>
              <p className="text-xs text-gray-500 mt-1">Register new patient</p>
            </Link>

            <Link href="/queue"
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors text-center group">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Manage Queue</p>
              <p className="text-xs text-gray-500 mt-1">View & update queue</p>
            </Link>

            <Link href="/simulation"
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors text-center group">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">Run Simulation</p>
              <p className="text-xs text-gray-500 mt-1">Monte Carlo analysis</p>
            </Link>

            <Link href="/doctors"
              className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-colors text-center group">
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-200">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-medium text-gray-900">View Doctors</p>
              <p className="text-xs text-gray-500 mt-1">Team overview</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard, ['admin', 'doctor']);
