'use client';

import Link from 'next/link';

export default function PublishEarnPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-300 to-blue-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full shadow-2xl mb-6 animate-pulse">
              <span className="text-6xl">🚀</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 mb-8 drop-shadow-lg" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            قريباً
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 opacity-80" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            نظام تسويق العمولة الأكثر تطوراً
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full text-xl font-semibold mb-12 shadow-xl animate-bounce">
            <span className="mr-3">⏰</span>
            قريباً جداً
          </div>

          {/* Back Button */}
          <div className="mt-16">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold text-lg"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            >
              <span className="mr-3">🏠</span>
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
