/**
 * Queue Management Page
 * Visual priority-based queue management
 */

import React, { useState, useEffect } from 'react';
import { withAuth } from '@/lib/auth';
import { usersApi } from '@/lib/api';

const PRIORITY_CONFIG = {
  1: { name: 'Emergency', color: 'red', icon: '🚨', bgGradient: 'from-red-500 to-red-600' },
  2: { name: 'Urgent', color: 'orange', icon: '⚡', bgGradient: 'from-orange-500 to-orange-600' },
  3: { name: 'High', color: 'yellow', icon: '⬆️', bgGradient: 'from-yellow-500 to-yellow-600' },
  4: { name: 'Standard', color: 'blue', icon: '📋', bgGradient: 'from-blue-500 to-blue-600' },
  5: { name: 'Routine', color: 'green', icon: '✅', bgGradient: 'from-green-500 to-green-600' },
};

function QueuePage() {
  const [patients, setPatients] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchData = async () => {
    try {
      const [patientsData, statsData] = await Promise.all([
        usersApi.getPatients(),
        usersApi.getStats(),
      ]);
      setPatients(patientsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePriorityChange = async (patientId, newPriority) => {
    try {
      await usersApi.updatePriority(patientId, newPriority);
      fetchData();
      setSelectedPatient(null);
    } catch (err) {
      alert('Error updating priority: ' + err.message);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-500 mt-1">
            Real-time patient queue by priority level
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Live Updates
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(PRIORITY_CONFIG).map(([level, config]) => {
          const count = stats?.by_priority?.[level]?.count || 0;
          return (
            <div key={level} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
              <span className="text-2xl">{config.icon}</span>
              <p className="text-2xl font-bold mt-2">{count}</p>
              <p className="text-sm text-gray-500">{config.name}</p>
            </div>
          );
        })}
      </div>

      {/* Queue Lanes */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {Object.entries(PRIORITY_CONFIG).map(([level, config]) => {
          const levelPatients = patients?.by_priority?.[level]?.patients || [];
          
          return (
            <div key={level} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Lane Header */}
              <div className={`bg-gradient-to-r ${config.bgGradient} px-4 py-3 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span className="font-semibold">{config.name}</span>
                  </div>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                    {levelPatients.length}
                  </span>
                </div>
              </div>
              
              {/* Patients */}
              <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
                {levelPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id === selectedPatient ? null : patient.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPatient === patient.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-100 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {patient.full_name}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 truncate">{patient.diagnosis || 'No diagnosis'}</p>
                    
                    {/* Priority Change Options */}
                    {selectedPatient === patient.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Change Priority:</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(PRIORITY_CONFIG).map(([l, c]) => (
                            <button
                              key={l}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (parseInt(l) !== parseInt(level)) {
                                  handlePriorityChange(patient.id, parseInt(l));
                                }
                              }}
                              disabled={parseInt(l) === parseInt(level)}
                              className={`text-xs px-2 py-1 rounded ${
                                parseInt(l) === parseInt(level)
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : `bg-${c.color}-100 text-${c.color}-800 hover:bg-${c.color}-200`
                              }`}
                              style={{
                                backgroundColor: parseInt(l) === parseInt(level) ? undefined : 
                                  l === '1' ? '#fee2e2' : l === '2' ? '#ffedd5' : l === '3' ? '#fef3c7' : l === '4' ? '#dbeafe' : '#dcfce7',
                                color: parseInt(l) === parseInt(level) ? undefined :
                                  l === '1' ? '#991b1b' : l === '2' ? '#9a3412' : l === '3' ? '#a16207' : l === '4' ? '#1e40af' : '#166534',
                              }}
                            >
                              {c.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {levelPatients.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No patients</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Priority Levels Guide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {Object.entries(PRIORITY_CONFIG).map(([level, config]) => (
            <div key={level} className="flex items-start gap-3">
              <span className="text-xl">{config.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{config.name}</p>
                <p className="text-xs text-gray-500">
                  {level === '1' && 'Immediate attention required'}
                  {level === '2' && 'Within 24-48 hours'}
                  {level === '3' && 'Within 1 week'}
                  {level === '4' && 'Scheduled, non-urgent'}
                  {level === '5' && 'Follow-up care'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withAuth(QueuePage, ['admin', 'doctor']);
