'use client';

import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            من نحن
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نفتخر بتقديم خدمات احترافية في كتابة وإرسال المعاريض منذ سنوات، ونلتزم بمساعدة عملائنا في تحقيق أهدافهم
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Our Mission & Vision - Moved to top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">رؤيتنا</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                أن نكون الخيار الأول والأمثل لكل من يحتاج إلى كتابة معروض احترافي ومؤثر، وأن نساهم في تسهيل إجراءات العملاء مع الجهات الرسمية.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">مهمتنا</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-center">
                تقديم خدمات كتابة معاريض عالية الجودة بأسعار منافسة، مع ضمان السرية والالتزام بالمواعيد، ومساعدة العملاء في تحقيق أهدافهم.
              </p>
            </div>
          </div>

          {/* Company Introduction */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  معروضي - شريكك الموثوق في كتابة المعاريض
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    نحن فريق متخصص من الكتاب المحترفين والخبراء القانونيين الذين يمتلكون سنوات من الخبرة في كتابة المعاريض والخطابات الرسمية. نؤمن بأن كل معروض يجب أن يكون احترافياً ومؤثراً لتحقيق الهدف المطلوب.
                  </p>
                  <p>
                    منذ تأسيسنا، ساعدنا آلاف العملاء في الحصول على نتائج إيجابية من خلال معاريض مكتوبة باحترافية عالية وبصيغة مقنعة ومؤثرة.
                  </p>
                  <p>
                    نلتزم بتقديم خدمة متميزة وجودة عالية في كل معروض نكتبه، مع ضمان السرية التامة والالتزام بالمواعيد المحددة.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold mb-4">خبرة سنوات</h3>
                <p className="text-blue-100">
                  نكتب معاريض احترافية منذ سنوات طويلة، ونفهم متطلبات كل جهة رسمية
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              لماذا تختار معروضي؟
            </h2>
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>خبرة طويلة</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>سنوات من الخبرة في كتابة المعاريض والخطابات الرسمية</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>سرعة في التسليم</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>نضمن تسليم المعروض في 3-5 أيام عمل</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>جودة عالية</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>معاريض مكتوبة باحترافية عالية وبصيغة مقنعة</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>سرية تامة</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>نضمن سرية جميع المعلومات والبيانات الشخصية</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>دعم متواصل</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>فريق دعم متخصص لمساعدتك في أي وقت</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسعار منافسة</h3>
                    <p className="text-gray-700" style={{ fontFamily: 'Tajawal, sans-serif' }}>أسعار شفافة ومنافسة لجميع الخدمات</p>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div>
  );
}
