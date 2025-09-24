'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SendProposalPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    idNumber: '',
    phoneNumber: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // No authentication required - users can access directly

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // حفظ البيانات في قاعدة البيانات
      const response = await fetch('/api/send-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('تم حفظ الطلب:', result.data);
        
        // توجيه المستخدم لصفحة الدفع مع تمرير البيانات
        const queryParams = new URLSearchParams({
          recipientName: formData.recipientName,
          senderName: formData.senderName,
          idNumber: formData.idNumber,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          requestId: result.data.id.toString()
        });
        
        router.push(`/services/send-proposal/payment?${queryParams.toString()}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'Tajawal, sans-serif', textShadow: '3px 3px 10px rgba(0,0,0,0.8)' }}>
            طلب إرسال معروض
          </h1>
          <p className="text-3xl text-white arabic-text max-w-5xl mx-auto leading-relaxed">
            نحن نقدم خدمة إرسال المعاريض المطبوعة إلى الجهات الحكومية والخاصة. 
            نقوم بطباعة المعروض على ورق رسمي وإرساله بالبريد المسجل مع إيصال استلام.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipientName" className="block text-lg font-bold text-gray-700 mb-3 arabic-text">
                اسم الجهة أو المسؤول المرسل له المعروض *
              </label>
              <input
                type="text"
                id="recipientName"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="مثال: وزارة الداخلية - أو - مدير عام الشؤون الإدارية"
                required
                className="w-full px-4 py-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white text-lg"
              />
              <p className="mt-2 text-sm text-gray-600 arabic-text">
                <strong>مثال:</strong> وزارة الداخلية، ديوان المظالم، المحكمة العامة، مدير عام الشؤون الإدارية، 
                أو أي جهة حكومية أو خاصة تريد إرسال المعروض إليها
              </p>
            </div>

            <div>
              <label htmlFor="senderName" className="block text-lg font-bold text-gray-700 mb-3 arabic-text">
                اسم المرسل (صاحب المعروض) *
              </label>
              <input
                type="text"
                id="senderName"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                placeholder="الاسم الكامل لصاحب المعروض كما يظهر في الهوية"
                required
                className="w-full px-4 py-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white text-lg"
              />
              <p className="mt-2 text-sm text-gray-600 arabic-text">
                <strong>مثال:</strong> أحمد محمد عبدالله - يجب أن يكون مطابقاً للاسم في الهوية الوطنية
              </p>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-lg font-bold text-gray-700 mb-3 arabic-text">
                رقم الهوية الوطنية *
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                placeholder="10 أرقام بدون شرطات"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full px-4 py-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white text-lg text-center tracking-widest"
              />
              <p className="mt-2 text-sm text-gray-600 arabic-text">
                <strong>مثال:</strong> 1234567890 (10 أرقام فقط بالانجليزية، بدون شرطات أو مسافات)
              </p>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-bold text-gray-700 mb-3 arabic-text">
                رقم الجوال *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="05xxxxxxxx"
                required
                pattern="05[0-9]{8}"
                className="w-full px-4 py-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white text-lg text-center"
              />
              <p className="mt-2 text-sm text-gray-600 arabic-text">
                <strong>مثال:</strong> 0501234567  ( بيبدأ بـ 05 متبوع بـ 8 أرقام بالانجليزية )
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-gray-700 mb-3 arabic-text">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                required
                className="w-full px-4 py-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent arabic-text bg-white text-lg"
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-5 px-8 rounded-lg text-xl transition-all duration-300 arabic-text shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {isSubmitting ? 'جاري إرسال الطلب...' : 'إتمام الطلب والانتقال للدفع'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Toast Notifications */}
      <div id="toast-container"></div>
    </div>
  );
}
