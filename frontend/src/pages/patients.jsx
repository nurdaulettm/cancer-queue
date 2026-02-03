/**
 * Patients Management Page
 * View, add, and manage patients with priority system
 */

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/auth';
import { usersApi } from '@/lib/api';

// Priority configuration
const PRIORITIES = [
  { level: 1, name: 'Emergency', color: 'red', description: 'Life-threatening, immediate attention' },
  { level: 2, name: 'Urgent', color: 'orange', description: '24-48 hours max wait' },
  { level: 3, name: 'High', color: 'yellow', description: 'Within 1 week' },
  { level: 4, name: 'Standard', color: 'blue', description: 'Non-urgent, scheduled' },
  { level: 5, name: 'Routine', color: 'green', description: 'Follow-up appointments' },
];

const getPriorityColor = (level) => {
  const colors = {
    1: { bg: 'bg-red-100', text: 'text-red-800', badge: 'bg-red-500' },
    2: { bg: 'bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-500' },
    3: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-500' },
    4: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'bg-blue-500' },
    5: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-500' },
  };
  return colors[level] || colors[4];
};

function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);

  // Form state for new patient
  const [newPatient, setNewPatient] = useState({
    email: '',
    full_name: '',
    password: '',
    priority: 4,
    diagnosis: '',
    treatment_plan: '',
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getPatients();
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await usersApi.createPatient(newPatient);
      setShowAddModal(false);
      setNewPatient({
        email: '',
        full_name: '',
        password: '',
        priority: 4,
        diagnosis: '',
        treatment_plan: '',
      });
      fetchPatients();
    } catch (err) {
      alert('Error creating patient: ' + err.message);
    }
  };

  const handleUpdatePriority = async (patientId, newPriority) => {
    try {
      await usersApi.updatePriority(patientId, newPriority);
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      alert('Error updating priority: ' + err.message);
    }
  };

  // Get all patients as flat array
  const getAllPatients = () => {
    if (!patients?.by_priority) return [];
    
    let allPatients = [];
    Object.entries(patients.by_priority).forEach(([priority, data]) => {
      data.patients?.forEach(patient => {
        allPatients.push({ ...patient, priority: parseInt(priority) });
      });
    });
    
    // Filter by priority
    if (selectedPriority !== 'all') {
      allPatients = allPatients.filter(p => p.priority === parseInt(selectedPriority));
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      allPatients = allPatients.filter(p => 
        p.full_name?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.diagnosis?.toLowerCase().includes(query)
      );
    }
    
    // Sort by priority (most urgent first)
    return allPatients.sort((a, b) => a.priority - b.priority);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const allPatients = getAllPatients();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500 mt-1">
            Manage patient queue and priorities ({patients?.total || 0} total)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Patient
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Priority Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSelectedPriority('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedPriority === 'all' 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {PRIORITIES.map((p) => (
              <button
                key={p.level}
                onClick={() => setSelectedPriority(p.level.toString())}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedPriority === p.level.toString()
                    ? `${getPriorityColor(p.level).badge} text-white`
                    : `${getPriorityColor(p.level).bg} ${getPriorityColor(p.level).text} hover:opacity-80`
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allPatients.map((patient) => {
                const colors = getPriorityColor(patient.priority);
                const priorityInfo = PRIORITIES.find(p => p.level === patient.priority);
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${colors.badge} flex items-center justify-center text-white font-semibold`}>
                          {patient.full_name?.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                          <div className="text-sm text-gray-500">{patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingPatient === patient.id ? (
                        <select
                          value={patient.priority}
                          onChange={(e) => handleUpdatePriority(patient.id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          {PRIORITIES.map(p => (
                            <option key={p.level} value={p.level}>{p.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
                          <span className={`w-2 h-2 rounded-full ${colors.badge} mr-2`}></span>
                          {priorityInfo?.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{patient.diagnosis || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 font-mono">{patient.patient_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingPatient === patient.id ? (
                        <button
                          onClick={() => setEditingPatient(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditingPatient(patient.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit Priority
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {allPatients.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Patient</h2>
              
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPatient.full_name}
                    onChange={(e) => setNewPatient({...newPatient, full_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="patient@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newPatient.password}
                    onChange={(e) => setNewPatient({...newPatient, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min. 6 characters"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newPatient.priority}
                    onChange={(e) => setNewPatient({...newPatient, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {PRIORITIES.map(p => (
                      <option key={p.level} value={p.level}>
                        {p.name} - {p.description}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={newPatient.diagnosis}
                    onChange={(e) => setNewPatient({...newPatient, diagnosis: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Lung cancer Stage III"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Plan</label>
                  <input
                    type="text"
                    value={newPatient.treatment_plan}
                    onChange={(e) => setNewPatient({...newPatient, treatment_plan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Standard Protocol"
                  />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(PatientsPage, ['admin', 'doctor']);
