'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // التحقق من وجود بيانات المصادقة في localStorage
    const authData = localStorage.getItem('adminAuth');
    if (authData) {
      try {
        const { username, timestamp } = JSON.parse(authData);
        // التحقق من أن الجلسة لم تنتهي (24 ساعة)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminAuth');
          router.push('/admin');
        }
      } catch (error) {
        localStorage.removeItem('adminAuth');
        router.push('/admin');
      }
    } else {
      router.push('/admin');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // سيتم إعادة التوجيه تلقائياً
  }

  return <>{children}</>;
}
