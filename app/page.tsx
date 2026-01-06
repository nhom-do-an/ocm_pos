'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function HomePage() {
  const router = useRouter();
  const { currentUser, isInitialized } = useAuthStore();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isInitialized) return;

    // Redirect based on auth status
    // if (currentUser) {
    //   router.replace('/pos');
    // } else {
    //   router.replace('/pos/login');
    // }
  }, [currentUser, isInitialized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
