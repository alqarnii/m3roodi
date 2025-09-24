'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { BarChart3, FileText, CreditCard, User, Users, Ticket, Settings, Clock, MessageSquare, Menu, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    const savedSidebarState = localStorage.getItem('adminSidebarOpen');
    if (savedSidebarState !== null) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    // التحقق من وجود بيانات المصادقة في localStorage
    const checkAuth = () => {
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
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (username: string, role: string) => {
    const authData = {
      username,
      role,
      timestamp: Date.now()
    };
    
    localStorage.setItem('adminAuth', JSON.stringify(authData));
    setIsAuthenticated(true);
    setCurrentUser({ username, role });
    setShowLoginModal(false);
  };

  const navigation = [
    { name: 'لوحة التحكم', href: '/admin', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'إدارة الطلبات', href: '/admin/orders', icon: <FileText className="w-5 h-5" /> },
    { name: 'إدارة المدفوعات', href: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
    { name: 'إدارة المستخدمين', href: '/admin/users', icon: <User className="w-5 h-5" /> },
    { name: 'إدارة الموظفين', href: '/admin/employees', icon: <Users className="w-5 h-5" /> },
    { name: 'إدارة أكواد الخصم', href: '/admin/coupons', icon: <Ticket className="w-5 h-5" /> },
    { name: 'إدارة النصائح', href: '/admin/feedback', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'نظام التذكيرات', href: '/admin/reminder-control', icon: <Clock className="w-5 h-5" /> },
    { name: 'الإعدادات', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من المصادقة...</p>
        </div>
      </div>
    );
  }

  // إذا لم يتم المصادقة، اعرض صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <LoginModal 
        isOpen={true} 
        onClose={() => {}} 
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={sidebarOpen ? 'إخفاء الشريط الجانبي' : 'إظهار الشريط الجانبي'}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <Link href="/admin" className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">م</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">معروضي</h1>
                  <p className="text-xs text-gray-500">لوحة التحكم</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="hidden sm:block bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-700 font-medium">
                  مرحباً، {currentUser?.role === 'مدير رئيسي' ? 'المدير' : currentUser?.role} {currentUser?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
              >
                تسجيل الخروج
              </button>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
              >
                العودة للموقع
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-56' : 'w-0'} bg-white/80 backdrop-blur-sm shadow-lg min-h-screen border-l border-white/20 transition-all duration-300 overflow-hidden fixed lg:relative z-50 lg:z-auto`}>
          <nav className="mt-8">
            <div className="px-4">
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-105'
                        }`}
                      >
                        <span className="ml-3 rtl:ml-0 rtl:mr-3">{item.icon}</span>
                        <span className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
