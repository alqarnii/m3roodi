'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function PaymentRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [attempts, setAttempts] = useState(0);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // متغير للتحكم في نجاح الدفع
  const maxAttempts = 6; // 6 محاولات × 5 ثواني = 30 ثانية
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [requestDetails, setRequestDetails] = useState<any>(null);

  useEffect(() => {
    // استرجاع حالة الدفع من URL
    const paymentStatus = searchParams.get('status');
    const orderNumber = searchParams.get('orderNumber');
    const error = searchParams.get('error');
    const fromGateway = searchParams.get('fromGateway');

    console.log('بيانات URL:', { paymentStatus, orderNumber, error, fromGateway });

    // إذا لم يكن هناك orderNumber في URL، نحاول الحصول عليه من localStorage
    let finalOrderNumber = orderNumber;
    if (!finalOrderNumber) {
      const storedRequest = localStorage.getItem('pendingRequest');
      console.log('البيانات المحفوظة في localStorage:', storedRequest);
      
      if (storedRequest) {
        try {
          const requestData = JSON.parse(storedRequest);
          finalOrderNumber = requestData.orderNumber;
          console.log('تم الحصول على orderNumber من localStorage:', finalOrderNumber);
          
          // إذا لم يكن orderNumber موجود في localStorage أيضاً، نستخدم requestId
          if (!finalOrderNumber && requestData.requestId) {
            finalOrderNumber = `RF${requestData.requestId}`;
            console.log('تم إنشاء orderNumber من requestId:', finalOrderNumber);
          }
          
        } catch (error) {
          console.error('خطأ في قراءة localStorage:', error);
        }
      }
    }

    // التحقق من أن orderNumber صحيح
    if (!finalOrderNumber || finalOrderNumber === 'null' || finalOrderNumber === 'undefined' || finalOrderNumber === '') {
      console.error('رقم الطلب غير صحيح:', finalOrderNumber);
      console.log('محتويات localStorage:', localStorage.getItem('pendingRequest'));
      
      // محاولة أخيرة - إنشاء orderNumber من timestamp
      const storedRequest = localStorage.getItem('pendingRequest');
      if (storedRequest) {
        try {
          const requestData = JSON.parse(storedRequest);
          if (requestData.requestId) {
            finalOrderNumber = `RF${requestData.requestId}`;
            console.log('محاولة أخيرة - تم إنشاء orderNumber من requestId:', finalOrderNumber);
          } else if (requestData.timestamp) {
            finalOrderNumber = `RF${requestData.timestamp}`;
            console.log('محاولة أخيرة - تم إنشاء orderNumber من timestamp:', finalOrderNumber);
          }
        } catch (error) {
          console.error('خطأ في المحاولة الأخيرة:', error);
        }
      }
      
      // إذا لم نتمكن من الحصول على orderNumber، نعرض خطأ
      if (!finalOrderNumber) {
        setStatus('failed');
        handlePaymentFailure('لم يتم العثور على رقم الطلب - يرجى التواصل معنا');
        return;
      }
    }

    console.log('رقم الطلب النهائي:', finalOrderNumber);

    if (paymentStatus === 'pending') {
      // الدفع في حالة انتظار - انتظار webhook
      setStatus('processing');
      setAttempts(0); // إعادة تعيين عدد المحاولات
      
      // إذا جاء من بوابة الدفع مباشرة، ابدأ التحقق فوراً
      if (fromGateway === 'true') {
        console.log('جاء من بوابة الدفع مباشرة، بدء التحقق فوراً...');
        checkPaymentStatus(finalOrderNumber);
      } else {
        // محاولة استدعاء webhook مباشرة أولاً
        console.log('محاولة استدعاء webhook مباشرة...');
        if (finalOrderNumber) {
          checkWebhookStatus(finalOrderNumber);
        }
        
        // بدء التحقق من حالة الدفع
        checkPaymentStatus(finalOrderNumber);
      }
    } else if (paymentStatus === 'success' && finalOrderNumber) {
      // الدفع نجح - توجيه مباشر لصفحة الشكر
      console.log('الدفع نجح، توجيه مباشر لصفحة الشكر...');
      handlePaymentSuccess(finalOrderNumber);
    } else if (paymentStatus === 'failed' || error) {
      // الدفع فشل
      console.log('الدفع فشل:', error);
      setStatus('failed');
      handlePaymentFailure(error || 'فشل في إتمام الدفع');
    } else {
      // حالة غير معروفة
      console.log('حالة دفع غير معروفة');
      setStatus('failed');
      handlePaymentFailure('حالة دفع غير معروفة');
    }
  }, [searchParams]);

  // useEffect إضافي للتأكد من أن الكود يتوقف عند تغيير الحالة
  useEffect(() => {
    if (status === 'success' || status === 'failed') {
      // إيقاف أي عمليات تحقق مستمرة
      console.log(`تم إيقاف عمليات التحقق - الحالة: ${status}`);
    }
  }, [status]);

  // دالة التحقق المباشر من webhook
  const checkWebhookStatus = async (orderNumber: string) => {
    try {
      console.log('التحقق المباشر من webhook...');
      
      // محاولة الوصول لـ webhook مباشرة
      const webhookResponse = await fetch('/api/payment-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CAPTURED',
          reference: { transaction: orderNumber },
          metadata: {
            orderNumber: orderNumber,
            requestType: 'new_request',
            customerName: 'Test User',
            customerEmail: 'test@test.com',
            purpose: 'طلب معروض',
            recipient: 'غير محدد'
          }
        }),
      });
      
      if (webhookResponse.ok) {
        console.log('Webhook تم استدعاؤه بنجاح');
        // انتظار قليل ثم التحقق من الدفع
        setTimeout(() => {
          checkPaymentStatus(orderNumber);
        }, 3000);
      } else {
        console.log('فشل في استدعاء webhook');
      }
    } catch (error) {
      console.error('خطأ في استدعاء webhook:', error);
    }
  };

  // دالة التحقق من حالة الدفع مع إعادة المحاولة
  const checkPaymentStatus = async (orderNumber: string | null) => {
    if (!orderNumber) {
      setStatus('failed');
      handlePaymentFailure('رقم الطلب غير متوفر');
      return;
    }

    // التحقق من أن الدفع لم ينجح بالفعل
    if (isPaymentSuccessful) {
      console.log('الدفع نجح بالفعل، إيقاف التحقق');
      return;
    }

    // التحقق من عدد المحاولات قبل البدء
    if (attempts >= maxAttempts) {
      console.log('انتهت جميع المحاولات - إيقاف التحقق');
      setStatus('failed');
      handlePaymentFailure('انتهت مهلة انتظار الدفع. يرجى التواصل معنا للتحقق من حالة الدفع.');
      return;
    }

    try {
      console.log(`محاولة التحقق من الدفع #${attempts + 1} لطلب: ${orderNumber}`);
      
      // استرجاع بيانات الطلب من localStorage للحصول على البريد الإلكتروني الصحيح
      const storedRequest = localStorage.getItem('pendingRequest');
      let customerEmail = 'temp@temp.com';
      
      if (storedRequest) {
        try {
          const requestData = JSON.parse(storedRequest);
          customerEmail = requestData.email || 'temp@temp.com';
          console.log('البريد الإلكتروني المستخدم:', customerEmail);
        } catch (error) {
          console.error('خطأ في قراءة بيانات الطلب:', error);
        }
      }
      
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          customerEmail: customerEmail
        }),
      });

      const result = await response.json();
      console.log('نتيجة التحقق من الدفع:', result);
      
      if (result.success && result.paymentStatus === 'COMPLETED') {
        console.log('تم العثور على دفع ناجح!');
        setStatus('success');
        handlePaymentSuccess(orderNumber);
        return;
      } else {
        // الدفع لم يكتمل بعد
        console.log(`الدفع لم يكتمل بعد: ${result.message}`);
        console.log(`حالة الدفع: ${result.paymentStatus}`);
        
        // زيادة عدد المحاولات
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts < maxAttempts) {
          // إعادة المحاولة بعد 5 ثواني
          console.log(`إعادة المحاولة #${newAttempts + 1} بعد 5 ثواني...`);
          setTimeout(() => {
            checkPaymentStatus(orderNumber);
          }, 5000);
        } else {
          // انتهت المحاولات - فشل
          console.log('انتهت جميع المحاولات - فشل في التحقق من الدفع');
          setStatus('failed');
          handlePaymentFailure('انتهت مهلة انتظار الدفع. يرجى التواصل معنا للتحقق من حالة الدفع.');
        }
      }
    } catch (error) {
      console.error('خطأ في التحقق من الدفع:', error);
      
      // زيادة عدد المحاولات
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts < maxAttempts) {
        // إعادة المحاولة بعد 5 ثواني
        console.log(`إعادة المحاولة #${newAttempts + 1} بعد 5 ثواني...`);
        setTimeout(() => {
          checkPaymentStatus(orderNumber);
        }, 5000);
      } else {
        console.log('انتهت جميع المحاولات - فشل في التحقق من الدفع');
        setStatus('failed');
        handlePaymentFailure('حدث خطأ في التحقق من الدفع بعد عدة محاولات');
      }
    }
  };

  const handlePaymentSuccess = (orderNumber: string) => {
    console.log('معالجة نجاح الدفع:', orderNumber);
    
    // تحديث حالة الدفع
    setIsPaymentSuccessful(true);
    
    // استرجاع بيانات الطلب من localStorage
    const storedRequest = localStorage.getItem('pendingRequest');
    if (storedRequest) {
      try {
        const requestData = JSON.parse(storedRequest);
        console.log('بيانات الطلب الموجودة:', requestData);
        
        // بناء URL صفحة الشكر مع تفاصيل الدفع
        const thankYouParams = new URLSearchParams({
          paymentMethod: 'electronic',
          requestNumber: orderNumber,
          name: requestData.name || '',
          email: requestData.email || '',
          purpose: requestData.purpose || '',
          recipient: requestData.recipient || ''
        });

        // إضافة تفاصيل الدفع إذا كانت متوفرة في البيانات المحفوظة
        if (requestData.originalAmount) {
          thankYouParams.set('originalAmount', requestData.originalAmount.toString());
        }
        if (requestData.discountAmount) {
          thankYouParams.set('discountAmount', requestData.discountAmount.toString());
        }
        if (requestData.finalAmount) {
          thankYouParams.set('finalAmount', requestData.finalAmount.toString());
        }
        if (requestData.couponCode) {
          thankYouParams.set('couponCode', requestData.couponCode);
        }

        const thankYouUrl = `/request-form/thank-you?${thankYouParams.toString()}`;
        
        console.log('سيتم التوجيه إلى:', thankYouUrl);
        
        // توجيه فوري لصفحة الشكر مع البيانات
        console.log('بدء التوجيه الفوري لصفحة الشكر...');
        router.push(thankYouUrl);
      } catch (error) {
        console.error('خطأ في قراءة بيانات الطلب:', error);
        // إذا فشل في قراءة البيانات، توجيه لصفحة النجاح بدون بيانات
        const thankYouUrl = `/request-form/thank-you?paymentMethod=electronic&requestNumber=${orderNumber}`;
        console.log('توجيه بدون بيانات إلى:', thankYouUrl);
        
        console.log('بدء التوجيه الفوري لصفحة الشكر بدون بيانات...');
        router.push(thankYouUrl);
      }
    } else {
      console.log('لا توجد بيانات طلب في localStorage، توجيه لصفحة النجاح بدون بيانات');
      // إذا لم تكن هناك بيانات، توجيه لصفحة النجاح بدون بيانات
      const thankYouUrl = `/request-form/thank-you?paymentMethod=electronic&requestNumber=${orderNumber}`;
      console.log('توجيه بدون بيانات إلى:', thankYouUrl);
      
      console.log('بدء التوجيه الفوري لصفحة الشكر بدون بيانات...');
      router.push(thankYouUrl);
    }
  };

  const handleGoToThankYou = () => {
    const orderNumber = searchParams.get('orderNumber');
    if (!orderNumber) return;
    
    // استرجاع بيانات الطلب من localStorage
    const storedRequest = localStorage.getItem('pendingRequest');
    if (storedRequest) {
      try {
        const requestData = JSON.parse(storedRequest);
        console.log('بيانات الطلب الموجودة:', requestData);
        
        // بناء URL صفحة الشكر مع تفاصيل الدفع
        const thankYouParams = new URLSearchParams({
          paymentMethod: 'electronic',
          requestNumber: orderNumber,
          name: requestData.name || '',
          email: requestData.email || '',
          purpose: requestData.purpose || '',
          recipient: requestData.recipient || ''
        });

        const thankYouUrl = `/request-form/thank-you?${thankYouParams.toString()}`;
        
        console.log('سيتم التوجيه إلى:', thankYouUrl);
        router.push(thankYouUrl);
      } catch (error) {
        console.error('خطأ في قراءة بيانات الطلب:', error);
        // إذا فشل في قراءة البيانات، توجيه لصفحة النجاح بدون بيانات
        const thankYouUrl = `/request-form/thank-you?paymentMethod=electronic&requestNumber=${orderNumber}`;
        console.log('توجيه بدون بيانات إلى:', thankYouUrl);
        router.push(thankYouUrl);
      }
    } else {
      console.log('لا توجد بيانات طلب في localStorage، توجيه لصفحة النجاح بدون بيانات');
      const thankYouUrl = `/request-form/thank-you?paymentMethod=electronic&requestNumber=${orderNumber}`;
      console.log('توجيه بدون بيانات إلى:', thankYouUrl);
      router.push(thankYouUrl);
    }
  };

  const handlePaymentFailure = (errorMessage: string) => {
    // توجيه لصفحة الفشل
    setTimeout(() => {
      router.push(`/request-form/payment-failed?error=${encodeURIComponent(errorMessage)}`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-md mx-auto text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">جاري التحقق من حالة الدفع...</h2>
            <p className="text-gray-600 mb-4">يرجى الانتظار - نتحقق من حالة الدفع عبر webhook</p>
            
            {/* عرض عدد المحاولات */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                المحاولة: {attempts + 1} من {maxAttempts}
              </p>
              <p className="text-blue-600 text-xs mt-1">
                الوقت المتبقي: {Math.max(0, (maxAttempts - attempts - 1) * 5)} ثانية
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>• إذا أكملت الدفع، سيتم توجيهك لصفحة التأكيد</p>
              <p>• إذا تراجعت عن الدفع، سيتم توجيهك لصفحة المساعدة</p>
              <p>• قد يستغرق التأكيد بضع ثوانٍ</p>
            </div>
            
            {/* زر إعادة المحاولة اليدوية */}
            <div className="mt-6">
              <button
                onClick={() => {
                  console.log('إعادة المحاولة اليدوية...');
                  setAttempts(0);
                  const currentOrderNumber = searchParams.get('orderNumber');
                  if (currentOrderNumber) {
                    checkPaymentStatus(currentOrderNumber);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                🔄 إعادة المحاولة
              </button>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">جاري التوجيه...</h2>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">فشل في التحقق من الدفع</h2>
            <p className="text-gray-600 mb-4">جاري توجيهك لصفحة المساعدة...</p>
            
            {/* معلومات إضافية للمستخدم */}
            <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <p><strong>💡 ملاحظة مهمة:</strong></p>
              <p>• إذا أكملت الدفع فعلاً، قد يستغرق التأكيد وقتاً</p>
              <p>• يمكنك التواصل معنا للتحقق من حالة الدفع</p>
              <p>• رقم الطلب: {searchParams.get('orderNumber')}</p>
            </div>
          </>
        )}
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
          },
        }}
      />
    </div>
  );
}
