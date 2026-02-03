'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';

/**
 * Index Page - Redirects users to their role-specific dashboard
 */
export default function IndexPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Redirect based on user role
    switch (user?.role) {
      case 'admin':
      case 'doctor':
        router.replace('/dashboard');
        break;
      case 'patient':
        router.replace('/patient/dashboard');
        break;
      default:
        router.replace('/login');
    }
  }, [user, loading, isAuthenticated, router]);

  // Show loading state while checking auth
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading TrueBeam...</h2>
        <p className="text-gray-500 mt-2">Preparing your dashboard</p>
      </div>
    </div>
  );
}
