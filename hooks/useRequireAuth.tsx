'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export function useRequireAuth() {
  const router = useRouter();
  const { currentUser, isInitialized, checkAuth } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      // Wait for auth initialization
      if (!isInitialized) return;

      // Check if user is authenticated
      const isAuthenticated = await checkAuth();

      if (!isAuthenticated) {
        console.log('🔒 Authentication required, redirecting to login...');
        router.replace('/login');
      }
    };

    verifyAuth();
  }, [isInitialized, currentUser, checkAuth, router]);

  return { currentUser, isAuthenticated: !!currentUser };
}
