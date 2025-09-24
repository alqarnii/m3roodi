'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">حدث خطأ غير متوقع</h1>
            <p className="text-gray-600 mb-6">
              عذراً، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  تفاصيل الخطأ (للمطورين)
                </summary>
                <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                إعادة المحاولة
              </button>
              
              <Link
                href="/"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>

            {/* Contact Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">هل تحتاج مساعدة؟</p>
              <Link href="/contact" className="text-blue-600 hover:text-blue-700 text-sm">
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
