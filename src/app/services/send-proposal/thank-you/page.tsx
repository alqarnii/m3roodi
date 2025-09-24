'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function ThankYouPage() {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // إنشاء رقم طلب عشوائي في Client فقط
    const randomOrderNumber = Math.floor(Math.random() * 900000) + 100000;
    setOrderNumber(`SP-${randomOrderNumber}`);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 arabic-text-bold">
            شكراً لك! تم إتمام طلبك بنجاح
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed arabic-text">
            تم استلام طلب إرسال معروضك إلى الجهة الحكومية المحددة
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 arabic-text-bold">
            تفاصيل الطلب
          </h2>
          
          <div className="space-y-4 text-right">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 arabic-text">نوع الخدمة:</span>
              <span className="font-medium arabic-text">إرسال معروض حكومي</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 arabic-text">حالة الطلب:</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium arabic-text">
                تم التأكيد
              </span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600 arabic-text">رقم الطلب:</span>
              <span className="font-mono text-gray-800 arabic-text">#{orderNumber || 'جاري التحميل...'}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-8 mb-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 arabic-text-bold">
            الخطوات التالية
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-right">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-blue-900 mb-2 arabic-text">تأكيد الدفع</h3>
              <p className="text-blue-800 text-sm arabic-text">
                سيتم التواصل معك خلال 24 ساعة لتأكيد استلام الدفع
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-bold text-blue-900 mb-2 arabic-text">معالجة الطلب</h3>
              <p className="text-blue-800 text-sm arabic-text">
                سيتم طباعة وتغليف المعروض خلال 3-5 أيام عمل
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-bold text-blue-900 mb-2 arabic-text">إرسال المعروض</h3>
              <p className="text-blue-800 text-sm arabic-text">
                سيتم إرسال المعروض وإبلاغك برقم الإرسالية
              </p>
            </div>
          </div>
        </div>



        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors arabic-text"
          >
            العودة للصفحة الرئيسية
          </Link>
          
          <Link
            href="/services/ready-templates"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors arabic-text"
          >
            تصفح الصيغ الجاهزة
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 arabic-text">
            معروضي - نضمن وصول رسالتك بكل دقة وأمان
          </p>
        </div>
      </div>
    </div>
  );
}
