'use client';

import { Component, ReactNode } from 'react';

// تعريف نوع لـ gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
  }
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // إرسال الخطأ إلى خدمة مراقبة الأخطاء (إذا كانت متوفرة)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-gray-600 mb-4">عذراً، حدث خطأ في تحميل الصفحة. يرجى المحاولة مرة أخرى.</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
              >
                إعادة تحميل الصفحة
              </button>
              <button 
                onClick={() => window.history.back()}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors w-full"
              >
                العودة للصفحة السابقة
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
              >
                الذهاب للصفحة الرئيسية
              </button>
            </div>
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
              <p className="text-sm text-gray-600 mb-2">تفاصيل الخطأ:</p>
              <code className="text-xs text-red-600 break-all">
                {this.state.error?.message || 'خطأ غير معروف'}
              </code>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
