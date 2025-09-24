'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestPaymentRedirect() {
  const [orderNumber, setOrderNumber] = useState('RF70');
  const [status, setStatus] = useState('pending');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">اختبار صفحة توجيه الدفع</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الطلب:</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: RF70"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">حالة الدفع:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">في الانتظار</option>
              <option value="success">نجح</option>
              <option value="failed">فشل</option>
            </select>
          </div>
          
          <div className="pt-4">
            <Link
              href={`/request-form/payment-redirect?orderNumber=${orderNumber}&status=${status}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors block text-center"
            >
              اختبار صفحة توجيه الدفع
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">ملاحظات الاختبار:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>اختر "في الانتظار" لاختبار عملية التحقق</li>
            <li>اختر "نجح" لاختبار حالة النجاح</li>
            <li>اختر "فشل" لاختبار حالة الفشل</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
