'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Phone, Home, AlertTriangle } from 'lucide-react';

export default function PaymentFailed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const orderNumber = searchParams.get('orderNumber');
  const error = searchParams.get('error');
  const tapId = searchParams.get('tap_id');
  const cancelled = searchParams.get('cancelled');
  const verified = searchParams.get('verified');

  const handleRetryPayment = () => {
    // العودة لصفحة الطلب للمحاولة مرة أخرى
    router.push('/request-form');
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleCheckPaymentStatus = () => {
    // العودة لصفحة التحقق من الدفع
    if (orderNumber) {
      router.push(`/request-form/payment-redirect?orderNumber=${orderNumber}&status=pending`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">M3roodi</h1>
          <p className="text-gray-600">نظام إدارة الطلبات والمدفوعات</p>
        </div>

        {/* أيقونة الفشل */}
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-16 h-16 text-red-600" />
        </div>

        {/* العنوان الرئيسي */}
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          فشل في إتمام الدفع
        </h2>

        {/* رسالة الخطأ */}
        {error && (
          <div className={`rounded-lg p-4 mb-6 ${
            cancelled === 'true' 
              ? 'bg-yellow-50 border-l-4 border-yellow-400' 
              : 'bg-red-50 border-l-4 border-red-400'
          }`}>
            <p className={`text-sm ${
              cancelled === 'true' 
                ? 'text-yellow-800' 
                : 'text-red-800'
            }`}>
              <strong>
                {cancelled === 'true' ? 'سبب التراجع:' : 'سبب الفشل:'}
              </strong> {error}
            </p>
          </div>
        )}

        {/* رسالة التحقق من الدفع */}
        {verified === 'false' && (
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 mb-6">
            <p className="text-orange-800 text-sm">
              <strong>تنبيه:</strong> لم يتم التحقق من الدفع في قاعدة البيانات. قد يكون الدفع قيد المعالجة أو لم يتم تأكيده بعد.
            </p>
          </div>
        )}

        {/* معلومات الطلب */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="text-gray-800 font-semibold">معلومات الطلب</span>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>رقم الطلب: <strong>{orderNumber || 'غير محدد'}</strong></p>
            {tapId && <p>معرف الدفع: <strong>{tapId}</strong></p>}
            <p>وقت المحاولة: {new Date().toLocaleString('ar-SA')}</p>
          </div>
        </div>

        {/* شرح الحالة */}
        <div className={`rounded-lg p-4 mb-6 ${
          cancelled === 'true' 
            ? 'bg-yellow-50' 
            : verified === 'false'
            ? 'bg-orange-50'
            : 'bg-blue-50'
        }`}>
          <p className={`text-sm text-center leading-relaxed ${
            cancelled === 'true' 
              ? 'text-yellow-800' 
              : verified === 'false'
              ? 'text-orange-800'
              : 'text-blue-800'
          }`}>
            <strong>
              {cancelled === 'true' ? '🔄 خيارات التراجع عن الدفع:' : 
               verified === 'false' ? '⏳ حالة الدفع غير مؤكدة:' : 
               '💡 لديك عدة خيارات:'}
            </strong>
          </p>
          <div className={`mt-3 text-sm space-y-2 ${
            cancelled === 'true' 
              ? 'text-yellow-700' 
              : verified === 'false'
              ? 'text-orange-700'
              : 'text-blue-700'
          }`}>
            {cancelled === 'true' ? (
              <>
                <p>• <strong>لقد تراجعت عن الدفع:</strong> لم يتم خصم أي مبلغ من حسابك</p>
                <p>• <strong>يمكنك المحاولة مرة أخرى:</strong> العودة لصفحة الطلب</p>
                <p>• <strong>أو التواصل معنا:</strong> إذا كنت تحتاج مساعدة</p>
              </>
            ) : verified === 'false' ? (
              <>
                <p>• <strong>الدفع قيد المعالجة:</strong> قد يستغرق التأكيد بضع دقائق</p>
                <p>• <strong>تحقق من حالة الدفع:</strong> استخدم الزر أدناه للتحقق</p>
                <p>• <strong>إذا استمرت المشكلة:</strong> تواصل معنا للمساعدة</p>
              </>
            ) : (
              <>
                <p>• <strong>إذا تراجعت عن الدفع:</strong> يمكنك العودة والمحاولة مرة أخرى</p>
                <p>• <strong>إذا أكملت الدفع فعلاً:</strong> قد يستغرق التأكيد وقتاً</p>
                <p>• <strong>إذا استمرت المشكلة:</strong> يمكنك التواصل معنا للمساعدة</p>
              </>
            )}
          </div>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          {/* التحقق من حالة الدفع - أولوية عالية إذا لم يتم التحقق */}
          {orderNumber && (verified === 'false' || !verified) && (
            <button
              onClick={handleCheckPaymentStatus}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              🔍 التحقق من حالة الدفع
            </button>
          )}

          {/* إعادة المحاولة - إذا لم يكن إلغاء */}
          {cancelled !== 'true' && (
            <button
              onClick={handleRetryPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              🔄 إعادة المحاولة
            </button>
          )}

          {/* التحقق من حالة الدفع - إذا كان إلغاء أو حالة عادية */}
          {orderNumber && cancelled === 'true' && (
            <button
              onClick={handleCheckPaymentStatus}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              🔍 التحقق من حالة الدفع
            </button>
          )}

          {/* التواصل مع الدعم */}
          <button
            onClick={handleContactSupport}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            📞 التواصل مع الدعم
          </button>

          {/* العودة للرئيسية */}
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            🏠 العودة للرئيسية
          </button>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>إذا كنت بحاجة لمساعدة فورية، يمكنك:</p>
            <p>• الاتصال بنا: <strong>+966 50 000 0000</strong></p>
            <p>• إرسال بريد إلكتروني: <strong>support@m3roodi.com</strong></p>
            <p>• زيارة صفحة التواصل: <strong>/contact</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
