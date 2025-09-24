'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPriceById } from '@/lib/pricing';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    paymentMethod: 'bank',
    requestId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // No authentication required - users can access directly

  // استرجاع البيانات من URL إذا كانت موجودة
  useEffect(() => {
    const recipientName = searchParams.get('recipientName');
    const senderName = searchParams.get('senderName');
    const idNumber = searchParams.get('idNumber');
    const phoneNumber = searchParams.get('phoneNumber');
    const email = searchParams.get('email');
    const requestId = searchParams.get('requestId');
    const method = searchParams.get('method');
    
    if (senderName && phoneNumber) {
      setFormData(prev => ({
        ...prev,
        fullName: senderName,
        phoneNumber: phoneNumber,
        email: email || ''
      }));
    }
    
    // حفظ requestId للاستخدام لاحقاً
    if (requestId) {
      setFormData(prev => ({
        ...prev,
        requestId: requestId
      }));
    }

    // إذا كان هناك method محدد، تعيينه
    if (method === 'bank') {
      setFormData(prev => ({
        ...prev,
        paymentMethod: 'bank'
      }));
    }

    // التحقق من وجود جلسة دفع سابقة (العودة من بوابة الدفع)
    const paymentSession = localStorage.getItem('paymentSession');
    if (paymentSession) {
      try {
        const sessionData = JSON.parse(paymentSession);
        const sessionAge = Date.now() - sessionData.timestamp;
        
        // إذا كانت الجلسة حديثة (أقل من 30 دقيقة)
        if (sessionAge < 30 * 60 * 1000) {
          // التحقق من أن المستخدم عاد من بوابة الدفع
          const urlParams = new URLSearchParams(window.location.search);
          const tapStatus = urlParams.get('tap_status');
          const tapOrderId = urlParams.get('tap_order_id');
          
          if (tapStatus && tapOrderId) {
            // المستخدم عاد من بوابة الدفع
            if (tapStatus === 'success') {
              // الدفع نجح - توجيه لصفحة الشكر
              localStorage.removeItem('paymentSession');
              router.push('/services/send-proposal/thank-you');
            } else {
              // الدفع فشل - توجيه لصفحة فشل الدفع
              const failureParams = new URLSearchParams({
                recipientName: sessionData.recipientName || '',
                senderName: sessionData.senderName || '',
                idNumber: sessionData.idNumber || '',
                phoneNumber: sessionData.phoneNumber || '',
                requestId: sessionData.requestId || '',
                reason: 'تم إلغاء الدفع أو فشل في إتمام العملية'
              });
              
              localStorage.removeItem('paymentSession');
              router.push(`/services/send-proposal?${failureParams.toString()}`);
            }
          }
        } else {
          // الجلسة قديمة - حذفها
          localStorage.removeItem('paymentSession');
        }
      } catch (error) {
        console.error('Error parsing payment session:', error);
        localStorage.removeItem('paymentSession');
      }
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // هنا يمكن إضافة منطق معالجة الدفع
      console.log('Payment data:', formData);
      
      if (formData.paymentMethod === 'electronic') {
        // للدفع الإلكتروني - توجيه لبوابة الدفع
        const paymentData = {
          amount: servicePrice,
          orderId: `SP-${Date.now().toString().slice(-6)}`,
          customerName: formData.fullName,
          customerPhone: formData.phoneNumber,
          service: 'إرسال معروض حكومي',
          // إضافة بيانات إضافية للتعامل مع فشل الدفع
          metadata: {
            requestType: 'send_proposal',
            recipientName: searchParams.get('recipientName'),
            senderName: searchParams.get('senderName'),
            idNumber: searchParams.get('idNumber'),
            phoneNumber: formData.phoneNumber,
            requestId: formData.requestId
          }
        };
        
        try {
          // إرسال البيانات لـ API لإنشاء رابط الدفع
          const response = await fetch('/api/payment/redirect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
          });
          
          const result = await response.json();
          
          if (result.success) {
            // حفظ بيانات الدفع في localStorage للتعامل مع العودة
            const paymentSession = {
              orderId: paymentData.orderId,
              amount: servicePrice,
              customerName: formData.fullName,
              customerPhone: formData.phoneNumber,
              recipientName: searchParams.get('recipientName'),
              senderName: searchParams.get('senderName'),
              idNumber: searchParams.get('idNumber'),
              requestId: formData.requestId,
              timestamp: Date.now()
            };
            localStorage.setItem('paymentSession', JSON.stringify(paymentSession));
            
            // توجيه المستخدم لبوابة الدفع
            window.location.href = result.paymentUrl;
          } else {
            throw new Error(result.message);
          }
          
        } catch (error) {
          console.error('Payment gateway error:', error);
          toast.error('حدث خطأ في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى.');
        }
        
      } else {
        // للتحويل البنكي - محاكاة عملية الدفع
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // توجيه المستخدم لصفحة الشكر
        router.push('/services/send-proposal/thank-you');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const servicePrice = getPriceById('send-proposal'); // سعر الخدمة: 550 ريال

  return (
    <div className="min-h-screen py-12" style={{ background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold text-white mb-4 arabic-text-bold">
            طلب إرسال معروض
          </h1>
          <p className="text-xl text-white arabic-text max-w-3xl mx-auto">
            اكمل بياناتك واختر طريقة الدفع لإرسال معروضك
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-6">
          {/* Price Display */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 mb-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">💰 إجمالي المبلغ المطلوب</h3>
            <div className="text-5xl font-bold mb-2">{servicePrice} ريال</div>
            <p className="text-green-100 text-lg">
              شامل: الطباعة + التغليف + الإرسال + المتابعة + إيصال الاستلام
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4 arabic-text-bold">
            بيانات الدفع
          </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2 arabic-text">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2 arabic-text">
                  رقم الجوال *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 arabic-text">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white"
                />
              </div>



              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2 arabic-text">
                  طريقة الدفع *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white"
                >
                  <option value="bank">تحويل بنكي</option>
                  <option value="electronic">دفع إلكتروني</option>
                </select>
              </div>

              {/* Payment Instructions */}
              {formData.paymentMethod === 'bank' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2 arabic-text">معلومات التحويل البنكي:</h3>
                  <div className="text-sm text-blue-800 space-y-1 arabic-text">
                    <p>البنك: مصرف الراجحي</p>
                    <p>رقم الحساب: 358608010441994</p>
                    <p>رقم الآيبان: SA2980000358608010441994</p>
                    <p>اسم المستفيد: مؤسسة أبراج السماء للخدمات</p>
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg text-center">
                      <p className="font-bold text-blue-900 text-lg">المبلغ المطلوب: {servicePrice} ريال</p>
                      <p className="text-blue-700 text-sm">يرجى التأكد من تحويل المبلغ الصحيح</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'electronic' && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 mb-2 arabic-text">الدفع الإلكتروني:</h3>
                  <p className="text-sm text-green-800 arabic-text">
                    سيتم توجيهك لبوابة الدفع الإلكتروني لإتمام العملية
                  </p>
                </div>
              )}


              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors arabic-text"
                >
                  {isProcessing ? 'جاري معالجة الدفع...' : `إتمام الدفع - ${servicePrice} ريال`}
                </button>
              </div>
            </form>

          {/* Additional Info */}
          <div className="mt-8 bg-yellow-50 rounded-lg p-6 text-center">
            <p className="text-yellow-800 arabic-text">
              <strong>ملاحظة:</strong> بعد إتمام الدفع، سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب 
              وبدء إجراءات إرسال المعروض.
            </p>
          </div>
        </div>
      </div>
      
      
      {/* Toast Notifications */}
      <div id="toast-container"></div>
    </div>
  );
}
