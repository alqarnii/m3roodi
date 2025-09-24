'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            هل لديك ملاحظات؟
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto drop-shadow-md">
            نرحب بملاحظاتك وآرائك لمساعدتنا في تحسين خدماتنا وتقديم تجربة أفضل لك
          </p>
        </div>

        {/* Feedback Form */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-4 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-2">
                الاسم *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 bg-white transition-all duration-200"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 bg-white transition-all duration-200"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-lg font-semibold text-gray-700 mb-2">
                الملاحظات أو الرسالة *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-gray-900 bg-white transition-all duration-200 resize-vertical"
                placeholder="اكتب ملاحظاتك أو رسالتك هنا..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الملاحظات'}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
                <p className="font-semibold">تم إرسال ملاحظاتك بنجاح!</p>
                <p className="text-sm">شكراً لك على ملاحظاتك، سنقوم بمراجعتها والرد عليك قريباً.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                <p className="font-semibold">حدث خطأ أثناء إرسال الملاحظات</p>
                <p className="text-sm">يرجى المحاولة مرة أخرى أو التواصل معنا عبر البريد الإلكتروني.</p>
              </div>
            )}
          </form>
        </div>

        {/* Additional Contact Info */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
            طرق أخرى للتواصل
          </h3>
          <p className="text-blue-700 mb-4">
            يمكنك أيضاً التواصل معنا مباشرة عبر:
          </p>
          <div className="space-y-2">
            <p className="text-blue-600">
              <strong>البريد الإلكتروني:</strong> m3roodi@gmail.com
            </p>
            <p className="text-blue-600">
              <strong>واتساب:</strong> 0551117720
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>

    </div>
  );
}
