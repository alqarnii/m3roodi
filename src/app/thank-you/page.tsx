'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ThankYou() {
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    purpose: '',
    recipient: '',
    orderNumber: '',
    paymentMethod: '',
    status: ''
  });

  useEffect(() => {
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const purpose = searchParams.get('purpose') || '';
    const recipient = searchParams.get('recipient') || '';
    const orderNumber = searchParams.get('orderNumber') || '';
    const paymentMethod = searchParams.get('paymentMethod') || '';
    const status = searchParams.get('status') || '';
    setUserData({ name, email, purpose, recipient, orderNumber, paymentMethod, status });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* أيقونة النجاح */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* رسالة الشكر */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {userData.paymentMethod === 'bank' ? 'تم إرسال طلبك بنجاح! 🎉' : 'شكراً لك! 🎉'}
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              مرحباً {userData.name}
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {userData.paymentMethod === 'bank' 
                ? 'تم إرسال طلبك بنجاح! إليك معلومات الحساب البنكي لإتمام الدفع. بعد إتمام التحويل، سيتم التواصل معك لتأكيد الدفع وتقديم الخدمة المطلوبة.'
                : 'تم استلام تأكيد الدفع بنجاح! فريق معروضي سيقوم بمراجعة طلبك والبدء في العمل عليه فوراً.'
              }
            </p>



            {/* تفاصيل الطلب */}
            {userData.orderNumber && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                <h3 className="text-xl font-semibold text-blue-800 mb-4">📋 تفاصيل الطلب</h3>
                <div className="space-y-3 text-gray-700 text-right">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">رقم الطلب:</span>
                    <span className="font-mono text-lg bg-white px-3 py-1 rounded border">#{userData.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">الاسم:</span>
                    <span>{userData.name || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">الهدف:</span>
                    <span>{userData.purpose || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">المسؤول:</span>
                    <span>{userData.recipient || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">طريقة الدفع:</span>
                    <span className="text-green-600 font-semibold">
                      {userData.paymentMethod === 'electronic' ? 'دفع إلكتروني' : 'تحويل بنكي'}
                    </span>
                  </div>
                  {userData.status && (
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">حالة الدفع:</span>
                      <span className={`font-semibold ${
                        userData.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {userData.status === 'success' ? 'تم بنجاح' : 'فشل'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* معلومات الحساب البنكي للتحويل البنكي */}
            {userData.paymentMethod === 'bank' && (
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-6">
                <h3 className="text-xl font-semibold text-yellow-800 mb-4">🏦 معلومات الحساب البنكي</h3>
                <div className="space-y-3 text-yellow-700 text-right">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">البنك:</span>
                    <span>مصرف الراجحي</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">رقم الحساب:</span>
                    <span className="font-mono text-lg bg-white px-3 py-1 rounded border">358608010441994</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">رقم الآيبان:</span>
                    <span className="font-mono text-lg bg-white px-3 py-1 rounded border">SA2980000358608010441994</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">اسم المستفيد:</span>
                    <span>مؤسسة أبراج السماء للخدمات</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>💡 ملاحظة مهمة:</strong> بعد إتمام التحويل، سيتم التواصل معك لتأكيد الدفع وتقديم الخدمة المطلوبة.
                  </p>
                </div>
              </div>
            )}


          </div>

          {/* أزرار التنقل */}
          <div className="space-x-4 rtl:space-x-reverse">
            <Link 
              href="/" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              العودة للصفحة الرئيسية
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              تواصل معنا
            </Link>
          </div>

          {/* رسالة إضافية */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>💡 ملاحظة:</strong> {
                userData.paymentMethod === 'bank' 
                  ? 'بعد إتمام التحويل البنكي، سيتم التواصل معك لتأكيد استلام الدفع وبدء العمل على طلبك.'
                  : 'سيتم التواصل معك قريباً لتأكيد استلام الدفع وبدء العمل على طلبك.'
              }
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
