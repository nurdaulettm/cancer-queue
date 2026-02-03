/**
 * Patient Dashboard
 * Personal patient view with queue status and appointments
 */

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/auth';
import { usersApi, queueApi } from '@/lib/api';

const PRIORITY_INFO = {
  1: { name: 'Emergency', color: 'red', icon: '🚨', message: 'You are in the emergency queue. A doctor will see you immediately.' },
  2: { name: 'Urgent', color: 'orange', icon: '⚡', message: 'You are marked as urgent. Expected wait time: 24-48 hours.' },
  3: { name: 'High Priority', color: 'yellow', icon: '⬆️', message: 'High priority status. Expected wait time: within 1 week.' },
  4: { name: 'Standard', color: 'blue', icon: '📋', message: 'Standard scheduling. Your appointment will be scheduled within 2 weeks.' },
  5: { name: 'Routine', color: 'green', icon: '✅', message: 'Routine follow-up. Appointments scheduled as available.' },
};

function PatientDashboard() {
  const { user, refreshUser } = useAuth();
  const [patientProfile, setPatientProfile] = useState(null);
  const [apiHealth, setApiHealth] = useState('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check API
        await queueApi.health();
        setApiHealth('healthy');
        
        // Refresh user data to get patient profile
        const userData = await refreshUser();
        setPatientProfile(userData?.patient_profile);
      } catch (err) {
        console.error('Error:', err);
        setApiHealth('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const priority = patientProfile?.priority || 4;
  const priorityInfo = PRIORITY_INFO[priority];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user?.full_name?.charAt(0) || 'P'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.full_name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 mt-1">Patient ID: {patientProfile?.patient_id || 'N/A'}</p>
          </div>
        </div>
        
        {/* System Status */}
        <div className="mt-6 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${apiHealth === 'healthy' ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-blue-100">
            {apiHealth === 'healthy' ? 'System Online' : 'System Offline'}
          </span>
        </div>
      </div>

      {/* Priority Status Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-6 py-4 ${
          priority === 1 ? 'bg-red-50' :
          priority === 2 ? 'bg-orange-50' :
          priority === 3 ? 'bg-yellow-50' :
          priority === 4 ? 'bg-blue-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{priorityInfo.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your Queue Status</h2>
                <p className="text-sm text-gray-600">{priorityInfo.name} Priority</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              priority === 1 ? 'bg-red-100 text-red-800' :
              priority === 2 ? 'bg-orange-100 text-orange-800' :
              priority === 3 ? 'bg-yellow-100 text-yellow-800' :
              priority === 4 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              Level {priority}
            </span>
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-600">{priorityInfo.message}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diagnosis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Diagnosis</h3>
          </div>
          <p className="text-gray-600">{patientProfile?.diagnosis || 'No diagnosis recorded'}</p>
        </div>

        {/* Treatment Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Treatment Plan</h3>
          </div>
          <p className="text-gray-600">{patientProfile?.treatment_plan || 'Treatment plan pending'}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Emergency</p>
              <p className="text-sm text-gray-500">Call 911</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Email Support</p>
              <p className="text-sm text-gray-500">support@truebeam.hospital</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Live Chat</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Information */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Understanding Your Queue Position</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-lg">🚨</span>
            <div>
              <p className="font-medium text-gray-900">Emergency (Level 1)</p>
              <p className="text-sm text-gray-600">Life-threatening conditions - immediate attention</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <p className="font-medium text-gray-900">Urgent (Level 2)</p>
              <p className="text-sm text-gray-600">Requires attention within 24-48 hours</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">⬆️</span>
            <div>
              <p className="font-medium text-gray-900">High Priority (Level 3)</p>
              <p className="text-sm text-gray-600">Should be seen within 1 week</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">📋</span>
            <div>
              <p className="font-medium text-gray-900">Standard (Level 4)</p>
              <p className="text-sm text-gray-600">Non-urgent, scheduled within 2 weeks</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-medium text-gray-900">Routine (Level 5)</p>
              <p className="text-sm text-gray-600">Follow-up appointments, scheduled as available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(PatientDashboard, ['patient']);
