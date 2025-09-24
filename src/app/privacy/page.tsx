'use client';

import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              سياسة الخصوصية
            </h1>
            <p className="text-lg text-gray-600">
              نلتزم بحماية خصوصيتك وبياناتك الشخصية
            </p>
          </div>

          {/* Privacy Content */}
          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            {/* Introduction */}
            <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg">
              <p className="text-blue-800 text-lg leading-relaxed">
                جميع بياناتك تعامل بسرية تامة و في مايلي آلية التعامل مع البيانات
              </p>
            </div>

            {/* Information Collection */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                جمع المعلومات
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                نقوم بجمع معلومات محددة منك عند استخدام موقع معروضي ، وهذه المعلومات تشمل ما يلي:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">معلومات شخصية:</h3>
                  <p className="text-gray-700">
                    مثل الاسم، العنوان، رقم الهاتف، وعنوان البريد الإلكتروني.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">معلومات المعاملات:</h3>
                  <p className="text-gray-700">
                    مثل تفاصيل الدفع و الارسال عند إجراء مشتريات عبر موقع معروضي .
                  </p>
                </div>
              </div>
            </div>

            {/* Information Usage */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                استخدام المعلومات
              </h2>
              <p className="text-gray-700 leading-relaxed">
                نحن نستخدم المعلومات التي نقوم بجمعها لأغراض معينة، مثل معالجة الطلبات وتسليم الطلبات، وتقديم خدمة العملاء، وتحسين تجربة العميل، وإرسال تنبيهات وعروض خاصة إليك .
              </p>
            </div>

            {/* Information Protection */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                حماية المعلومات
              </h2>
              <p className="text-gray-700 leading-relaxed">
                نحن نتخذ إجراءات أمان ملائمة لحماية المعلومات الشخصية التي نجمعها من الوصول غير المصرح به، والاستخدام غير المصرح به، والإفصاح غير المصرح به، والتدمير غير المصرح به.
              </p>
            </div>

            {/* Information Sharing */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                مشاركة المعلومات
              </h2>
              <p className="text-gray-700 leading-relaxed">
                نحن لا نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقتك الصريحة، إلا في الحالات التي يلزم فيها الامتثال للقوانين والتشريعات المعمول بها.
              </p>
            </div>

            {/* Legal Compliance */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                الامتثال للقوانين
              </h2>
              <p className="text-gray-700 leading-relaxed">
                نلتزم بامتثال جميع القوانين واللوائح المعمول بها في المملكة العربية السعودية فيما يتعلق بحماية الخصوصية والبيانات الشخصية.
              </p>
            </div>

            {/* Access and Modification */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                الوصول والتعديل
              </h2>
              <p className="text-gray-700 leading-relaxed">
                يمكنك الاتصال بنا للوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها إذا كنت بحاجة إلى ذلك.
              </p>
            </div>

            {/* Privacy Policy Changes */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                التغييرات في سياسة الخصوصية
              </h2>
              <p className="text-gray-700 leading-relaxed">
                نحتفظ بحق تحديث سياسة الخصوصية هذه من وقت لآخر، وسيتم نشر أي تغييرات جديدة على موقعنا على الإنترنت.
              </p>
            </div>

            {/* Conclusion */}
            <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded-lg">
              <p className="text-green-800 text-lg leading-relaxed mb-4">
                نقدر خصوصيتك ونسعى دائمًا لحماية معلوماتك الشخصية. إذا كان لديك أي استفسار بخصوص سياسة الخصوصية الخاصة بنا، فلا تتردد في الاتصال بنا.
              </p>
              <div className="text-center">
                <a 
                  href="mailto:info@m3roodi.com" 
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  📧 info@m3roodi.com
                </a>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors shadow-lg"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
