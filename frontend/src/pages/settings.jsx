/**
 * Settings Page
 * User preferences and system settings
 */

import React, { useState } from 'react';
import { useAuth, withAuth } from '@/lib/auth';

function Settings() {
  const { user, logout } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    appointments: true,
    queueUpdates: true,
    promotions: false,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and notifications</p>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email Address</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Change
            </button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed 3 months ago</p>
            </div>
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Change Password
            </button>
          </div>
          
          {showPasswordChange && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Account Type</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={() => handleNotificationChange('email')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${notifications.email ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>

          <label className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via text message</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.sms ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${notifications.sms ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>

          <label className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Appointment Reminders</p>
              <p className="text-sm text-gray-500">Get notified before appointments</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.appointments}
                onChange={() => handleNotificationChange('appointments')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.appointments ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${notifications.appointments ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>

          <label className="flex items-center justify-between py-3 cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Queue Status Updates</p>
              <p className="text-sm text-gray-500">Updates when your queue position changes</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications.queueUpdates}
                onChange={() => handleNotificationChange('queueUpdates')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${notifications.queueUpdates ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${notifications.queueUpdates ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Active Sessions</p>
              <p className="text-sm text-gray-500">Manage your logged-in devices</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Download My Data</p>
              <p className="text-sm text-gray-500">Request a copy of your data</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Request
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 bg-red-100">
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Sign Out from All Devices</p>
              <p className="text-sm text-red-700">This will log you out from all devices</p>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Sign Out All
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {saving && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default withAuth(Settings, ['admin', 'doctor', 'patient']);
