import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة - معروضي',
  description: 'الصفحة التي تبحث عنها غير موجودة. عد إلى الصفحة الرئيسية لمعروضي - خدمات كتابة المعاريض الاحترافية.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://m3roodi.com/404',
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">الصفحة غير موجودة</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
          <br />
          <span className="text-blue-600 font-medium">عد إلى الصفحة الرئيسية واستكشف خدمات معروضي المميزة</span>
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🏠 العودة للصفحة الرئيسية
          </Link>
          
          <Link
            href="/contact"
            className="w-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-block shadow-md hover:shadow-lg"
          >
            📞 اتصل بنا
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">هل تحتاج مساعدة؟ جرب هذه الروابط:</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/about" className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
              👥 من نحن
            </Link>
            <Link href="/services/ready-templates" className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
              📝 خدماتنا
            </Link>
            <Link href="/pricing" className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
              💰 الأسعار
            </Link>
            <a href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
              ✍️ طلب معروض
            </a>
          </div>
        </div>

        {/* SEO Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            معروضي - خدمات كتابة المعاريض الاحترافية | 
            <Link href="/" className="text-blue-500 hover:text-blue-600"> الصفحة الرئيسية</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
