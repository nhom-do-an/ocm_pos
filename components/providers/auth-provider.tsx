'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { initAuth, isInitialized, currentUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Initialize auth (load user from token)
      await initAuth();
      setIsChecking(false);
    };

    checkAuthentication();
  }, [initAuth]);

  useEffect(() => {
    // Wait for auth initialization to complete
    if (!isInitialized || isChecking) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

    // If not authenticated and trying to access protected route
    if (!currentUser && !isPublicRoute) {
      console.log('🔒 Not authenticated, redirecting to login...');
      router.replace('/pos/login');
      return;
    }

    // If authenticated and trying to access login page, redirect to POS
    if (currentUser && isPublicRoute) {
      console.log('✅ Already authenticated, redirecting to POS...');
      router.replace('/pos');
      return;
    }
  }, [currentUser, isInitialized, isChecking, pathname, router]);

  // Show loading screen while checking authentication
  if (isChecking || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
