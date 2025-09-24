'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, FileText, LogOut, Menu, X } from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export default function Navbar() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkUserAuth();
  }, []);

  const checkUserAuth = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const authData = localStorage.getItem('userAuth');
      if (authData) {
        const { user: authUser, timestamp } = JSON.parse(authData);
        // التحقق من أن الجلسة لم تنتهي (24 ساعة)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setUser(authUser);
        } else {
          localStorage.removeItem('userAuth');
          setUser(null);
        }
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userAuth');
      }
      setUser(null);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userAuth');
    }
    setUser(null);
    setIsUserMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsServicesOpen(false);
  };

  return (
    <>
      {/* Add CSS to prevent body scroll when menu is open */}
      {isServicesOpen && (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
      
      <nav className="bg-white shadow-none border-none arabic-text">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Site Name */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity gap-6">
              <div className="flex-shrink-0">
                <img
                  src="/m3log.avif"
                  alt="معروضي Logo"
                  className="h-12 w-12 rounded-lg object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <div className="pl-8">
                <div className="text-5xl font-bold text-gray-900 arabic-text-bold">
                  <span className="hidden sm:inline">معروضي - لكتابة الخطابات</span>
                  <span className="sm:hidden">معروضي</span>
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8 rtl:space-x-reverse">
                <Link
                  href="/"
                  className="text-black hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-bold transition-colors arabic-text"
                >
                  الرئيسية
                </Link>
                
                <Link
                  href="/about"
                  className="text-black hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-bold transition-colors arabic-text"
                >
                  من نحن
                </Link>
                
                <Link
                  href="/pricing"
                  className="text-black hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-bold transition-colors arabic-text"
                >
                  الأسعار
                </Link>
                
                <Link
                  href="/contact"
                  className="text-black hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-bold transition-colors arabic-text"
                >
                  اتصل بنا
                </Link>

                {/* Services Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="text-black hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-bold transition-colors flex items-center arabic-text"
                  >
                    الخدمات
                    <svg
                      className={`ml-2 h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isServicesOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <a
                        href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 text-sm text-black hover:bg-blue-100 transition-colors font-bold arabic-text"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        طلب كتابة معروض
                      </a>
                      <Link
                        href="/services/ready-templates"
                        className="block px-4 py-2 text-sm text-black hover:bg-blue-100 transition-colors font-bold arabic-text"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        صيغ جاهزة
                      </Link>
                      <Link
                        href="/services/send-proposal"
                        className="block px-4 py-2 text-sm text-black hover:bg-blue-100 transition-colors font-bold arabic-text"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        طلب إرسال معروض
                      </Link>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 rtl:space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold arabic-text"
                    >
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </span>
                      </div>
                      <span>حسابي</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            مرحباً {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium arabic-text"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          عرض حسابي
                        </Link>
                        
                        <a
                          href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium arabic-text"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          طلب جديد
                        </a>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium arabic-text"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-bold arabic-text"
                  >
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4 rtl:space-x-reverse">
              {/* User Menu for Mobile */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {/* Mobile User Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          مرحباً {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/account"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium arabic-text"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        عرض حسابي
                      </Link>
                      
                      <a
                        href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors font-medium arabic-text"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        طلب جديد
                      </a>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium arabic-text"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu with animation */}
          <div className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
            isServicesOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
            
            {/* Sidebar */}
            <div className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isServicesOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 arabic-text-bold">القائمة</h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="p-4 space-y-2">
                <Link
                  href="/"
                  className="text-black hover:bg-blue-100 block px-3 py-3 rounded-md text-base font-bold arabic-text transition-colors"
                  onClick={closeMobileMenu}
                >
                  الرئيسية
                </Link>
                <Link
                  href="/about"
                  className="text-black hover:bg-blue-100 block px-3 py-3 rounded-md text-base font-bold arabic-text transition-colors"
                  onClick={closeMobileMenu}
                >
                  من نحن
                </Link>
                <Link
                  href="/pricing"
                  className="text-black hover:bg-blue-100 block px-3 py-3 rounded-md text-base font-bold arabic-text transition-colors"
                  onClick={closeMobileMenu}
                >
                  الأسعار
                </Link>
                <Link
                  href="/contact"
                  className="text-black hover:bg-blue-100 block px-3 py-3 rounded-md text-base font-bold arabic-text transition-colors"
                  onClick={closeMobileMenu}
                >
                  اتصل بنا
                </Link>
                
                {/* Services Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-gray-700 font-bold mb-3 arabic-text-bold text-lg">الخدمات</div>
                  <div className="space-y-2">
                    <a
                      href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:bg-blue-100 block py-2 px-3 text-base font-bold arabic-text rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      طلب كتابة معروض
                    </a>
                    <Link
                      href="/services/ready-templates"
                      className="text-black hover:bg-blue-100 block py-2 px-3 text-base font-bold arabic-text rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      صيغ جاهزة
                    </Link>
                    <Link
                      href="/services/send-proposal"
                      className="text-black hover:bg-blue-100 block py-2 px-3 text-base font-bold arabic-text rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      طلب إرسال معروض
                    </Link>
                  </div>
                </div>

                {/* Login Button for Mobile */}
                {!user && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/auth"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-bold arabic-text text-center block"
                      onClick={closeMobileMenu}
                    >
                      تسجيل الدخول
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
