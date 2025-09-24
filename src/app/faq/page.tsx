'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'كيف اطلب خطاب او معروض منكم ؟',
      answer: 'بكل بساطة املاء نموذج الطلب و اتم الدفع من ثم يتم كتابة المعروض و ارساله لك PDF.'
    },
    {
      question: 'متى استلام الخطاب ؟',
      answer: 'تستلم المعروض خلال 3 أيام من تاريخ دفع قيمة المعروض'
    },
    {
      question: 'كيف استلم الخطاب ؟',
      answer: 'بعد انتهاء الخطاب نرسله لك على صيغة pdf عبر الواتس اب وتستطيع طباعتها بكل بساطة من اي طابعة'
    },
    {
      question: 'لدي أسئلة أخرى كيف اتواصل معكم ؟',
      answer: 'راسلنا عبر الواتس اب على الرقم 0551117720'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            الأسئلة الشائعة
          </h1>
          <p className="text-xl text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            إجابات على أكثر الأسئلة شيوعاً حول خدماتنا
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                className="w-full px-6 py-4 text-right text-lg font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <span className="flex-1">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 text-lg leading-relaxed" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Questions CTA */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              لديك أسئلة و أجوبة أخرى؟
            </h3>
            <p className="text-lg text-gray-600 mb-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>
              اضغط على الزر ادناه للتواصل معنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 inline-flex items-center justify-center"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                اتصل بنا
              </Link>
              <a
                href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                style={{ fontFamily: 'Tajawal, sans-serif' }}
              >
                اطلب معروض الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
