'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ReadyTemplateThankYou() {
  const searchParams = useSearchParams();
  const [templateInfo, setTemplateInfo] = useState<any>(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    paymentMethod: '',
    status: ''
  });

  // روابط الصيغ الجاهزة
  const templateLinks = {
    'job-application': {
      title: 'طلب وظيفة',
      link: 'https://docs.google.com/document/d/1d7GovtJqMB0AZfB5MuVFDo1d5GP1xSdpvm1i1CeHMoY/edit?tab=t.0',
      price: 1
    },
    'traffic-exemption': {
      title: 'طلب اعفاء من المخالفات المرورية',
      link: 'https://docs.google.com/document/d/1Wf3SmFet5pp9uIQqTNaUvCWBQcf5igVjPlz3QS5RTH0/edit?usp=sharing',
      price: 1
    },
    'financial-assistance': {
      title: 'طلب مساعدة مالية',
      link: 'https://docs.google.com/document/d/1hHYOfijcXlVEdtFY68AjjE7bZhJFbknXDOo2i6bf2lk/edit?usp=sharing',
      price: 1
    },
    'foreign-marriage': {
      title: 'طلب زواج من اجنبية',
      link: 'https://docs.google.com/document/d/1m3qjiwlIEuy_37YgMfalLIOdHqYbg3FAM8RInRecg4c/edit?usp=sharing',
      price: 1
    },
    'debt-payment': {
      title: 'طلب سداد دين',
      link: 'https://docs.google.com/document/d/1nAzSXP7pxzQMUUG4nK3awPW3atKsRbkiMcUMC-c8uNg/edit?usp=sharing',
      price: 1
    },
    'employee-transfer': {
      title: 'طلب نقل موظف',
      link: 'https://docs.google.com/document/d/1vHKzBsm-fAROzTWJWCdtCQJJDjpY5UhzubRbz_B13g8/edit?usp=sharing',
      price: 1
    },
    'prisoner-release': {
      title: 'طلب استرحام',
      link: 'https://docs.google.com/document/d/1fkad990aSfSlMmqr2rg2u80IE-UtmH3ab5ulXKGFjMQ/edit?usp=sharing',
      price: 1
    },
    'housing-request': {
      title: 'طلب سكن',
      link: 'https://docs.google.com/document/d/1XJQS7P_DyvKUiReGMwB6qBf85XzIAkDteX7J5cC0VbY/edit?usp=sharing',
      price: 1
    },
    'treatment-request': {
      title: 'طلب علاج',
      link: 'https://docs.google.com/document/d/1qcaX541BhXLG4CTDY17N9ihYjb9FsslJ-_M8Ehd8lcQ/edit?usp=sharing',
      price: 49
    },
    'naturalization': {
      title: 'طلب تجنيس',
      link: 'https://docs.google.com/document/d/1WIDqHRz5K1YPpQlc1d19kSpnywb1nox2DXVsxLzqUeo/edit?usp=drive_link',
      price: 1
    },
    'land-grant': {
      title: 'طلب منحة ارض',
      link: 'https://docs.google.com/document/d/1YrrNuAzY09va9AupnSXwit5yoNhB2SzgfWO31SRNHCY/edit?usp=sharing',
      price: 1
    },
    'scholarship': {
      title: 'طلب ابتعاث',
      link: 'https://docs.google.com/document/d/1xUMJZYytrs6yJeZQXpzwP5tX5pXPJhCCOkccSunwpWQ/edit?usp=sharing',
      price: 1
    }
  };

  useEffect(() => {
    const template = searchParams.get('template');
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const orderNumber = searchParams.get('orderNumber') || '';
    const paymentMethod = searchParams.get('paymentMethod') || '';
    const status = searchParams.get('status') || '';

    setUserData({ name, email, orderNumber, paymentMethod, status });

    if (template && templateLinks[template as keyof typeof templateLinks]) {
      setTemplateInfo(templateLinks[template as keyof typeof templateLinks]);
    }
  }, [searchParams]);

  if (!templateInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* أيقونة النجاح */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* رسالة الشكر */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            شكراً لك! 🎉
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              مرحباً {userData.name}
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              تم استلام تأكيد الدفع بنجاح! يمكنك الآن تحميل الصيغة الجاهزة التي طلبتها.
            </p>

            {/* تفاصيل الطلب */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">📋 تفاصيل الطلب</h3>
              <div className="space-y-3 text-gray-700 text-right">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">رقم الطلب:</span>
                  <span className="font-mono text-lg bg-white px-3 py-1 rounded border">#{userData.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">الاسم:</span>
                  <span>{userData.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">الصيغة:</span>
                  <span>{templateInfo.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">السعر:</span>
                  <span className="text-green-600 font-semibold">{templateInfo.price} ريال</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">طريقة الدفع:</span>
                  <span className="text-green-600 font-semibold">
                    {userData.paymentMethod === 'electronic' ? 'دفع إلكتروني' : 'تحويل بنكي'}
                  </span>
                </div>
              </div>
            </div>

            {/* رابط تحميل الصيغة */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">📥 تحميل الصيغة</h3>
              <p className="text-gray-700 mb-4">
                اضغط على الرابط أدناه لتحميل الصيغة الجاهزة:
              </p>
              <a
                href={templateInfo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                📄 تحميل {templateInfo.title}
              </a>
              <p className="text-sm text-gray-600 mt-3">
                سيتم فتح الصيغة في نافذة جديدة. يمكنك حفظها أو طباعتها حسب احتياجك.
              </p>
            </div>

            {/* تعليمات إضافية */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">💡 تعليمات مهمة</h3>
              <ul className="text-gray-700 text-right space-y-2">
                <li>• الصيغة جاهزة للاستخدام مباشرة</li>
                <li>• يمكنك تعديل البيانات حسب احتياجاتك</li>
                <li>• احفظ نسخة من الصيغة على جهازك</li>
                <li>• للاستفسارات، تواصل معنا عبر الواتس آب</li>
              </ul>
            </div>
          </div>

          {/* أزرار التنقل */}
          <div className="space-x-4 rtl:space-x-reverse">
            <Link 
              href="/services/ready-templates" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              طلب صيغة أخرى
            </Link>
            
            <Link 
              href="/contact" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              تواصل معنا
            </Link>
          </div>

          {/* رسالة إضافية */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>🎯 ملاحظة:</strong> شكراً لثقتك في معروضي. نتمنى أن تجد الصيغة مفيدة لاحتياجاتك!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
