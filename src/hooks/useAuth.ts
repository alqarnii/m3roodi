import { useState, useEffect, useCallback } from 'react';

interface AuthUser {
  username: string;
  role: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  isLoading: boolean;
  login: (username: string, role: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    try {
      const authData = localStorage.getItem('adminAuth');
      if (authData) {
        const { username, role, timestamp } = JSON.parse(authData);
        // التحقق من أن الجلسة لم تنتهي (24 ساعة)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setIsAuthenticated(true);
          setCurrentUser({ username, role });
        } else {
          localStorage.removeItem('adminAuth');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('خطأ في التحقق من المصادقة:', error);
      localStorage.removeItem('adminAuth');
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((username: string, role: string) => {
    const authData = {
      username,
      role,
      timestamp: Date.now()
    };
    
    localStorage.setItem('adminAuth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setCurrentUser({ username, role });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  useEffect(() => {
    // التحقق الفوري
    checkAuth();

    // إضافة مستمع للتغييرات في localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuth') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // التحقق كل 10 ثوان للتأكد من صحة الجلسة
    const interval = setInterval(checkAuth, 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [checkAuth]);

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    checkAuth
  };
}
