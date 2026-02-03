/**
 * Patient Appointments Page
 * View and manage appointments
 */

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/auth';

// Mock appointments data (would come from backend in production)
const generateMockAppointments = (patientName) => {
  const today = new Date();
  return [
    {
      id: 1,
      type: 'Initial Consultation',
      doctor: 'Dr. Sarah Smith',
      department: 'Radiation Oncology',
      date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '09:30 AM',
      status: 'confirmed',
      location: 'Building A, Room 203'
    },
    {
      id: 2,
      type: 'CT Simulation',
      doctor: 'Dr. Michael Johnson',
      department: 'Radiology',
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '02:00 PM',
      status: 'pending',
      location: 'Imaging Center, Floor 2'
    },
    {
      id: 3,
      type: 'Treatment Planning',
      doctor: 'Dr. Emily Chen',
      department: 'Medical Physics',
      date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '11:00 AM',
      status: 'scheduled',
      location: 'TrueBeam Suite, Room 1'
    }
  ];
};

const STATUS_STYLES = {
  confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scheduled' },
  completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
};

function PatientAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(generateMockAppointments(user?.full_name));
      setLoading(false);
    }, 500);
  }, [user]);

  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'upcoming') return aptDate >= today;
    if (filter === 'past') return aptDate < today;
    return true;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 mt-1">Manage your upcoming and past appointments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'all', label: 'All' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {filter} appointments</h3>
          <p className="text-gray-500">You don't have any {filter} appointments scheduled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const status = STATUS_STYLES[appointment.status] || STATUS_STYLES.scheduled;
            
            return (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex gap-4">
                      {/* Date Box */}
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-blue-600 uppercase">
                          {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-bold text-blue-900">
                          {new Date(appointment.date).getDate()}
                        </span>
                      </div>
                      
                      {/* Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.type}</h3>
                        <p className="text-gray-600 mt-1">{appointment.doctor}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {appointment.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {appointment.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {appointment.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preparation Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Before Your Appointment</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start gap-2">
            <span className="mt-1">✓</span>
            <span>Bring a valid photo ID and insurance card</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✓</span>
            <span>Arrive 15 minutes early to complete paperwork</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✓</span>
            <span>Bring a list of current medications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✓</span>
            <span>Wear comfortable, loose-fitting clothing</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1">✓</span>
            <span>If you need to reschedule, please call at least 24 hours in advance</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default withAuth(PatientAppointments, ['patient']);
