'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { getPriceByPurpose } from '@/lib/pricing';
import { CreditCard, Building2, Lock, CheckCircle, ArrowRight, Clock, Zap } from 'lucide-react';

export default function RequestFormPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'electronic' | 'bank'>('electronic');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  useEffect(() => {
    const requestId = searchParams.get('requestId');
    
    if (requestId) {
      fetchRequestData(requestId);
      return;
    }
    
    const storedRequest = localStorage.getItem('pendingRequest');
    if (storedRequest) {
      try {
        const requestData = JSON.parse(storedRequest);
        const requestTime = requestData.timestamp || 0;
        const currentTime = Date.now();
        const timeDiff = currentTime - requestTime;
        
        if (timeDiff > 2 * 60 * 60 * 1000) {
          localStorage.removeItem('pendingRequest');
          router.push('/request-form?error=انتهت صلاحية بيانات الطلب، يرجى إعادة ملء النموذج');
          return;
        }
        
        setRequestData(requestData);
      } catch (error) {
        localStorage.removeItem('pendingRequest');
        router.push('/request-form?error=بيانات الطلب تالفة، يرجى إعادة ملء النموذج');
        return;
      }
    } else {
      setTimeout(() => {
        router.push('/request-form?error=لا توجد بيانات طلب، يرجى إعادة ملء النموذج');
      }, 3000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const bankTransfer = urlParams.get('bankTransfer');
    if (bankTransfer === 'true') {
      setPaymentMethod('bank');
    }
  }, [router, searchParams]);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('يرجى إدخال كود الخصم');
      return;
    }

    try {
      setIsApplyingCoupon(true);
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          amount: getPriceByPurpose(requestData?.purpose || '')
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAppliedCoupon(result.coupon);
      } else {
        toast.error(result.message || 'كود الخصم غير صحيح أو منتهي الصلاحية');
      }
    } catch (error) {
      console.error('خطأ في تطبيق كود الخصم:', error);
      toast.error('حدث خطأ في تطبيق كود الخصم');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const fetchRequestData = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`);
      const data = await response.json();
      
      if (data.success) {
        const formattedRequestData = {
          requestId: data.request.id,
          name: data.request.applicantName || 'مستخدم',
          email: data.request.user?.email || '',
          purpose: data.request.purpose,
          recipient: data.request.recipient,
          description: data.request.description,
          applicantName: data.request.applicantName,
          phone: data.request.phone,
          idNumber: data.request.idNumber,
          attachments: data.request.attachments,
          price: data.request.price,
          timestamp: Date.now()
        };
        
        setRequestData(formattedRequestData);
      } else {
        toast.error('فشل في جلب بيانات الطلب');
        setTimeout(() => {
          router.push('/request-form');
        }, 3000);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات الطلب:', error);
      toast.error('حدث خطأ في جلب بيانات الطلب');
      setTimeout(() => {
        router.push('/request-form');
      }, 3000);
    }
  };

  const handleElectronicPayment = async () => {
    if (!requestData) {
      toast.error('بيانات الطلب غير متوفرة');
      return;
    }

    try {
      setIsButtonClicked(true);
      setIsProcessing(true);
      const loadingToast = toast.loading('جاري إنشاء عملية الدفع...');
      
      const orderNumber = requestData.requestId ? `RF${requestData.requestId}` : 'RF' + Date.now().toString().slice(-8);
      
      // حساب الأسعار
      const originalPrice = getPriceByPurpose(requestData?.purpose || '');
      const discountAmount = appliedCoupon?.discountAmount || 0;
      const finalPrice = originalPrice - discountAmount;
      
      const paymentData = {
        amount: finalPrice,
        orderNumber: orderNumber,
        customerName: requestData.name || requestData.applicantName || 'مستخدم',
        customerEmail: requestData.email,
        purpose: `طلب معروض: ${requestData.purpose}`,
        recipient: requestData.recipient,
        requestData: requestData,
        existingRequestId: requestData.requestId,
        couponCode: appliedCoupon?.code || null,
        discountAmount: discountAmount
      };

      console.log('=== PAYMENT DATA ===', paymentData);

      // التحقق من صحة البيانات
      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new Error('المبلغ غير صحيح');
      }
      if (!paymentData.customerName || !paymentData.customerEmail) {
        throw new Error('بيانات العميل غير مكتملة');
      }

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      console.log('=== API RESPONSE STATUS ===', response.status);

      const result = await response.json();
      toast.dismiss(loadingToast);
      
      if (result.success) {
        const updatedRequestData = { 
          ...requestData, 
          orderNumber,
          timestamp: Date.now(),
          originalAmount: originalPrice,
          discountAmount: discountAmount,
          finalAmount: finalPrice,
          couponCode: appliedCoupon?.code || null
        };
        localStorage.setItem('pendingRequest', JSON.stringify(updatedRequestData));
        
        // تتبع عملية الدفع
        // تم اختيار الدفع الإلكتروني
        
        window.location.href = result.paymentUrl;
      } else {
        // رسالة خطأ محددة من API
        const errorMessage = result.message || 'فشل في إنشاء عملية الدفع';
        toast.error(errorMessage);
      }
      
    } catch (error) {
      console.error('خطأ في handleElectronicPayment:', error);
      
      // رسائل خطأ محددة بدلاً من رسالة عامة
      let errorMessage = 'حدث خطأ في إنشاء عملية الدفع';
      
      if (error instanceof Error) {
        if (error.message.includes('المبلغ غير صحيح')) {
          errorMessage = 'المبلغ غير صحيح، يرجى المحاولة مرة أخرى';
        } else if (error.message.includes('بيانات العميل غير مكتملة')) {
          errorMessage = 'بيانات العميل غير مكتملة، يرجى التحقق من المعلومات';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'مشكلة في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى';
        } else {
          errorMessage = `خطأ تقني: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!requestData) {
      toast.error('بيانات الطلب غير متوفرة');
      return;
    }

    let loadingToast: string | undefined;
    try {
      setIsButtonClicked(true);
      setIsProcessing(true);
      loadingToast = toast.loading('جاري معالجة طلبك...');
      
      // حساب الأسعار
      const originalPrice = getPriceByPurpose(requestData?.purpose || '');
      const discountAmount = appliedCoupon?.discountAmount || 0;
      const finalPrice = originalPrice - discountAmount;
      
      const response = await fetch('/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          paymentMethod: 'bank',
          couponCode: appliedCoupon?.code || null,
          discountAmount: discountAmount,
          finalAmount: finalPrice
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // تتبع عملية الدفع البنكي
        // تم اختيار التحويل البنكي
        
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: requestData.email,
              name: requestData.name,
              purpose: requestData.purpose,
              recipient: requestData.recipient,
              price: finalPrice,
              originalPrice: originalPrice,
              discountAmount: discountAmount,
              couponCode: appliedCoupon?.code || null
            }),
          });

          const emailResult = await emailResponse.json();
          
          if (emailResult.success) {
            toast.success('سيتم إرسال المعلومات على إيميلك!', {
              duration: 4000,
            });
          } else {
            toast.error('حدث خطأ في إرسال البريد الإلكتروني');
          }
        } catch (emailError) {
          console.error('خطأ في إرسال البريد:', emailError);
          toast.error('حدث خطأ في إرسال البريد الإلكتروني');
        }

        localStorage.removeItem('pendingRequest');
        
        toast.success(`تم إرسال طلبك بنجاح! رقم الطلب: ${result.data.requestNumber}`, {
          duration: 6000,
        });
        
        router.push(`/thank-you?paymentMethod=bank&requestNumber=${result.data.requestNumber}&name=${encodeURIComponent(requestData.name)}&email=${encodeURIComponent(requestData.email)}&purpose=${encodeURIComponent(requestData.purpose)}&recipient=${encodeURIComponent(requestData.recipient)}&status=success&orderNumber=${result.data.requestNumber}`);
      } else {
        toast.error(result.message || 'فشل في إرسال الطلب');
      }
      
    } catch (error) {
      console.error('خطأ في handleBankTransfer:', error);
      
      // رسائل خطأ محددة بدلاً من رسالة عامة
      let errorMessage = 'حدث خطأ في إرسال الطلب';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) {
          errorMessage = 'مشكلة في الخادم، يرجى المحاولة مرة أخرى';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'مشكلة في الاتصال، يرجى التحقق من الإنترنت والمحاولة مرة أخرى';
        } else {
          errorMessage = `خطأ تقني: ${error.message}`;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  if (!requestData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const originalPrice = getPriceByPurpose(requestData?.purpose || '');
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إتمام الدفع
          </h1>
          <p className="text-gray-600">اختر طريقة الدفع المناسبة لك</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">ملخص الطلب</h2>
            <button
              onClick={() => router.push('/request-form')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              تعديل
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">الاسم:</span>
              <span className="text-gray-900 text-right">{requestData?.applicantName || requestData?.name}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">البريد الإلكتروني:</span>
              <span className="text-gray-900 text-right">{requestData?.email}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">رقم الهاتف:</span>
              <span className="text-gray-900 text-right">{requestData?.phone}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">رقم الهوية:</span>
              <span className="text-gray-900 text-right">{requestData?.idNumber || 'غير محدد'}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">الهدف من الخطاب:</span>
              <span className="text-gray-900 text-right">{requestData?.purpose}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">المسؤول المراد تقديم المعروض عليه:</span>
              <span className="text-gray-900 text-right">{requestData?.recipient}</span>
            </div>
            
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">نبذة عن المعروض:</span>
              <span className="text-gray-900 text-right max-w-xs">{requestData?.description || 'لا يوجد'}</span>
            </div>
            
            {requestData?.attachments && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">المرفقات:</span>
                <span className="text-gray-900 text-right">مرفق</span>
              </div>
            )}
            
            {requestData?.voiceRecording && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">التسجيل الصوتي:</span>
                <span className="text-gray-900 text-right">مسجل</span>
              </div>
            )}
          </div>
        </div>

        {/* Price Display */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
          <div className="text-center">
            {appliedCoupon ? (
              <div>
                <div className="text-2xl font-bold text-gray-400 line-through mb-1">
                  {originalPrice} ريال
                </div>
                <div className="text-4xl font-black text-green-600 mb-2">
                  {finalPrice} ريال
                </div>
                <div className="text-sm text-green-600 font-medium mb-2">
                  خصم {discountAmount} ريال
                </div>
              </div>
            ) : (
              <div className="text-4xl font-black text-green-600 mb-2">
                {originalPrice} ريال
              </div>
            )}
            <p className="text-gray-600 font-medium">المبلغ المطلوب دفعه</p>
            <p className="text-sm text-gray-500 mt-1">{requestData.purpose}</p>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="لديك كود خصم ؟ ضعه هنا"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isApplyingCoupon || !!appliedCoupon}
            />
            <button
              onClick={applyCoupon}
              disabled={isApplyingCoupon || !!appliedCoupon || !couponCode.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isApplyingCoupon ? 'جاري التطبيق...' : 'طبق'}
            </button>
          </div>
          {appliedCoupon && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 mr-1" />
                تم تطبيق كود الخصم بنجاح
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-8">
          {/* Electronic Payment - Primary */}
          <div 
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'electronic' 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white'
            }`}
            onClick={() => setPaymentMethod('electronic')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="electronic"
                checked={paymentMethod === 'electronic'}
                onChange={() => setPaymentMethod('electronic')}
                className="mr-3 text-blue-600 w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="font-bold text-gray-800 text-lg">الدفع الإلكتروني</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">بطاقات ائتمان، مدى، Apple Pay، Google Pay</div>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div 
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'bank' 
                ? 'border-green-500 bg-green-50 shadow-md' 
                : 'border-gray-200 hover:border-green-300 hover:shadow-sm bg-white'
            }`}
            onClick={() => setPaymentMethod('bank')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                className="mr-3 text-green-600 w-5 h-5"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-green-600 mr-3" />
                    <div className="font-bold text-gray-800 text-lg">التحويل البنكي</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">تحويل بنكي - معالجة خلال 24 ساعة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer Details - Only show when selected */}
        {paymentMethod === 'bank' && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              معلومات الحساب البنكي
            </h3>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">البنك</div>
                <div className="font-bold text-gray-900">مصرف الراجحي</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">اسم المستفيد</div>
                <div className="font-bold text-gray-900">مؤسسة ابراج السماء للخدمات</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">رقم الحساب</div>
                <div className="font-mono font-bold text-green-600 text-lg">358608010441994</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">رقم الآيبان</div>
                <div className="font-mono font-bold text-green-600 text-sm">SA2980000358608010441994</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">المبلغ المطلوب</div>
                <div className="font-bold text-green-600 text-xl">{finalPrice} ريال</div>
                {appliedCoupon && (
                  <div className="text-xs text-gray-500 mt-1">
                    (خصم {discountAmount} ريال)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Button */}
        <div className="space-y-4">
          {paymentMethod === 'electronic' ? (
            <button
              onClick={handleElectronicPayment}
              disabled={isProcessing}
              className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none ${
                isButtonClicked && !isProcessing
                  ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white'
                  : isProcessing
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-green-600 hover:to-green-700 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span>جاري المعالجة...</span>
                </div>
              ) : (
                <span>اتمام الدفع</span>
              )}
            </button>
          ) : (
            <button
              onClick={handleBankTransfer}
              disabled={isProcessing}
              className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none ${
                isButtonClicked && !isProcessing
                  ? 'bg-gradient-to-r from-green-800 to-green-900 hover:from-green-900 hover:to-green-950 text-white'
                  : isProcessing
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  <span>جاري المعالجة...</span>
                </div>
              ) : (
                <span>إتمام الطلب</span>
              )}
            </button>
          )}

        </div>


        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span>دفع آمن ومحمي</span>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            fontFamily: 'Tajawal, sans-serif',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '500',
            zIndex: 10000,
          },
          success: {
            duration: 6000,
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 5000,
            style: {
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            duration: Infinity,
            style: {
              background: '#f8fafc',
              color: '#475569',
              border: '1px solid #cbd5e1',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}