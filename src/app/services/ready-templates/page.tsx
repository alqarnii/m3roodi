'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';


export default function ReadyTemplates() {
  const router = useRouter();

  // No authentication required - users can access directly

  const templates = [
    {
      id: 'job-application',
      title: 'طلب وظيفة',
      description: 'صيغة معروض طلب وظيفة',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض التوظيف'
    },
    {
      id: 'traffic-exemption',
      title: 'طلب اعفاء من المخالفات المرورية',
      description: 'صيغة معروض طلب اعفاء من المخالفات المرورية',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض المرور'
    },
    {
      id: 'financial-assistance',
      title: 'طلب مساعدة مالية',
      description: 'صيغة معروض طلب مساعدة مالية',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض مالية'
    },
    {
      id: 'foreign-marriage',
      title: 'طلب زواج من اجنبية',
      description: 'صيغة معروض طلب زواج من اجنبية',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض الزواج'
    },
    {
      id: 'debt-payment',
      title: 'طلب سداد دين',
      description: 'صيغة معروض طلب سداد دين',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض مالية'
    },
    {
      id: 'employee-transfer',
      title: 'طلب نقل موظف',
      description: 'صيغة خطاب طلب نقل موظف',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض التوظيف'
    },
    {
      id: 'prisoner-release',
      title: 'استرحام اطلاق سراح سجين',
      description: 'صيغة معروض استرحام اطلاق سراح سجين',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض الاسترحام'
    },
    {
      id: 'housing-request',
      title: 'طلب سكن',
      description: 'صيغة معروض طلب سكن',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض السكن'
    },
    {
      id: 'treatment-request',
      title: 'طلب علاج',
      description: 'صيغة معروض طلب علاج',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض العلاج'
    },
    {
      id: 'naturalization',
      title: 'طلب تجنيس',
      description: 'صيغة معروض طلب تجنيس',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض الجنسية'
    },
    {
      id: 'land-grant',
      title: 'طلب منحة ارض',
      description: 'صيغة معروض طلب منحة ارض',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض الأراضي'
    },
    {
      id: 'scholarship',
      title: 'طلب ابتعاث خارجي',
      description: 'صيغة خطاب طلب ابتعاث خارجي',
      price: '49',
      originalPrice: '49',
      currency: 'ريال',
      category: 'معاريض التعليم'
    }
  ];

  const categories = [...new Set(templates.map(item => item.category))];



  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            الصيغ الجاهزة
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            مجموعة متنوعة من الصيغ الجاهزة لجميع أنواع المعاريض. اختر الصيغة المناسبة لك واحصل عليها فوراً بأفضل الأسعار.
          </p>
        </div>

        {/* Templates Table - Mobile Optimized */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-right text-lg font-semibold">
                    النوع
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    السعر
                  </th>
                  <th className="px-6 py-4 text-center text-lg font-semibold">
                    الطلب
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((template, index) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-right">
                      <div className="text-gray-800 font-medium text-lg">
                        {template.title}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        {template.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="text-3xl font-bold text-green-600">
                            {template.price}
                          </span>
                          <span className="text-gray-600 text-lg mr-2">
                            {template.currency}
                          </span>
                        </div>
                        {template.originalPrice && template.originalPrice !== template.price && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm relative">
                              <span className="absolute inset-0 flex items-center">
                                <div className="w-full h-0.5 bg-red-500"></div>
                              </span>
                              {template.originalPrice} ريال
                            </span>
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                              خصم 40%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/services/ready-templates/payment?template=${template.id}`}
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        اطلب الآن
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {templates.map((template, index) => (
              <div key={template.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold text-base leading-tight">
                      {template.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {template.description}
                    </p>
                  </div>
                  <div className="text-left ml-3">
                    <div className="text-2xl font-bold text-green-600">
                      {template.price}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {template.currency}
                    </div>
                    {template.originalPrice && template.originalPrice !== template.price && (
                      <div className="mt-1">
                        <div className="text-gray-400 text-xs relative">
                          <span className="absolute inset-0 flex items-center">
                            <div className="w-full h-0.5 bg-red-500"></div>
                          </span>
                          {template.originalPrice} ريال
                        </div>
                        <div className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium mt-1">
                          خصم 40%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <Link 
                    href={`/services/ready-templates/payment?template=${template.id}`}
                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
                  >
                    اطلب الآن
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 sm:p-8 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              لا تجد الصيغة المناسبة؟
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-blue-100 px-2">
              يمكننا كتابة معروض مخصص يناسب احتياجاتك بالضبط
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <a 
                href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors shadow-lg w-full sm:w-auto"
              >
                اطلب معروضك الان
              </a>
              <Link 
                href="/pricing" 
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors w-full sm:w-auto"
              >
                عرض الأسعار
              </Link>
            </div>
          </div>
        </div>


      </div>

      
      {/* Toast Notifications */}
      <div id="toast-container"></div>
    </div>
  );
}
