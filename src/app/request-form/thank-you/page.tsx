'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RequestFormThankYou() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [verificationError, setVerificationError] = useState<string>('');

    useEffect(() => {
    console.log('صفحة الشكر - بدء التحميل...');
    
    // استرجاع طريقة الدفع ورقم الطلب من URL
    const method = searchParams.get('paymentMethod');
    const requestNumber = searchParams.get('requestNumber');
    console.log('بيانات URL:', { method, requestNumber });
    
    // التحقق من وجود رقم طلب في URL
    if (!requestNumber) {
      console.log('لا يوجد رقم طلب في URL، توجيه لصفحة الفشل');
      router.push('/request-form/payment-failed?error=لم يتم العثور على رقم الطلب');
      return;
    }
    
    // إذا كان هناك رقم طلب في URL، نستمر في التحميل
    console.log('يوجد رقم طلب في URL، نستمر في التحميل...');
    
    if (method) {
      setPaymentMethod(method);
    }
    
    // إنشاء بيانات الطلب من URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const email = urlParams.get('email');
    const purpose = urlParams.get('purpose');
    const recipient = urlParams.get('recipient');
    
    setRequestInfo({
      name: name || 'غير محدد',
      email: email || 'غير محدد',
      purpose: purpose || 'غير محدد',
      recipient: recipient || 'غير محدد',
      orderNumber: requestNumber
    });

    // التحقق من حالة الدفع إذا كان الدفع إلكتروني
    if (method === 'electronic' && email) {
      verifyPaymentStatus(requestNumber, email);
    } else {
      setIsVerifying(false);
      setVerificationStatus('success');
    }
    
    // تنظيف البيانات بعد دقيقة واحدة بدلاً من 30 ثانية
    const cleanupTimer = setTimeout(() => {
      console.log('تنظيف البيانات من localStorage...');
      localStorage.removeItem('pendingRequest');
    }, 60000);

    return () => clearTimeout(cleanupTimer);
  }, [searchParams, router]);

  // دالة التحقق من حالة الدفع
  const verifyPaymentStatus = async (orderNumber: string, email: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          customerEmail: email
        }),
      });

      const result = await response.json();
      
      if (result.success && result.paymentStatus === 'COMPLETED') {
        setVerificationStatus('success');
        setVerificationError('');
      } else {
        setVerificationStatus('failed');
        setVerificationError(result.message || 'فشل في التحقق من الدفع');
      }
    } catch (error) {
      setVerificationStatus('failed');
      setVerificationError('حدث خطأ في الاتصال');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoHome = () => {
    localStorage.removeItem('pendingRequest');
    router.push('/');
  };

  const handleNewRequest = () => {
    localStorage.removeItem('pendingRequest');
    router.push('/request-form');
  };

  const handleConfirmPayment = () => {
    // توجيه المستخدم لصفحة تأكيد الدفع
    router.push('/thank-you');
  };

  // إذا كان في حالة التحقق، عرض شاشة التحميل
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من حالة الدفع...</p>
        </div>
      </div>
    );
  }

  // إذا فشل التحقق من الدفع، توجيه لصفحة الفشل
  if (verificationStatus === 'failed') {
    router.push(`/request-form/payment-failed?error=${encodeURIComponent(verificationError)}`);
    return null;
  }

  // إذا لم يكن هناك معلومات طلب، توجيه لصفحة الفشل
  if (!requestInfo) {
    router.push('/request-form/payment-failed?error=بيانات الطلب غير متوفرة');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* أيقونة النجاح */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-6xl">✅</span>
            </div>
          </div>

          {/* رسالة النجاح */}
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            تم استلام طلب الدفع لطلبك
          </h1>
          
          <div className="text-xl text-gray-600 mb-8 space-y-2">
            <p>وسيتم التحقق من إتمام الدفع ومن ثم التواصل معك.</p>
            <p>مقدّرين لك تعاملك معنا.</p>
            <p className="text-lg font-semibold text-blue-600">معروض لكتابة الخطابات</p>
            <p className="text-sm text-gray-500">https://m3roodi.com</p>
          </div>



          {/* تفاصيل الطلب */}
          {requestInfo && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8 border-r-4 border-blue-500 text-right">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">📋 تفاصيل الطلب</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-blue-700">الاسم:</span> {requestInfo.name}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">البريد الإلكتروني:</span> {requestInfo.email}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">نوع الخدمة:</span> {requestInfo.purpose}
                </div>
                <div>
                  <span className="font-semibold text-blue-700">المسؤول:</span> {requestInfo.recipient}
                </div>
                {requestInfo.orderNumber && (
                  <div className="md:col-span-2">
                    <span className="font-semibold text-blue-700">رقم الطلب:</span> 
                    <span className="text-lg font-bold text-blue-600 mr-2"> {requestInfo.orderNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* الخطوات التالية - مختلفة حسب نوع الدفع */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 border-r-4 border-blue-500">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">🚀 ما يحدث بعد ذلك؟</h2>
            <div className="space-y-3 text-sm text-blue-700">
              {paymentMethod === 'bank' ? (
                <>
                  <div className="flex items-center justify-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">1</span>
                    <span>تحقق من بريدك الإلكتروني للحصول على معلومات التحويل</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">2</span>
                    <span>قم بالتحويل البنكي حسب المعلومات المرسلة</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">3</span>
                    <span>اضغط على الزر الأخضر أدناه بعد إتمام التحويل</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">1</span>
                    <span>سيتم مراجعة طلبك من قبل فريقنا المتخصص</span>
                  </div>
                  <div className="flex items-center justify-start">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">2</span>
                    <span>سيتم إرسال المعروض النهائي خلال 3-5 أيام عمل</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* معلومات التواصل */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 border-r-4 border-blue-400">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">📞 معلومات التواصل</h2>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>البريد الإلكتروني:</strong> m3roodi@gmail.com</p>
              <p><strong>رقم الجوال:</strong> 0551117720</p>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {paymentMethod === 'bank' && (
              <button
                onClick={handleConfirmPayment}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
              >
                ✅ تم التحويل - تأكيد الدفع
              </button>
            )}
            
            <button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              🏠 العودة للصفحة الرئيسية
            </button>
            
            <button
              onClick={handleNewRequest}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              📝 طلب جديد
            </button>
          </div>

          {/* ملاحظة مهمة */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>💡 ملاحظة:</strong> إذا كان لديك أي استفسارات أو تحتاج لتعديلات على الطلب، 
              لا تتردد في التواصل معنا عبر البريد الإلكتروني أو الجوال.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
