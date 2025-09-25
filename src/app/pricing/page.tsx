'use client';

import { pricingData } from '@/lib/pricing';

export default function Pricing() {
  // Pricing page with updated follow-up service button
  const categories = [...new Set(pricingData.map(item => item.category))];

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 sm:mb-6">
            قائمة أسعار المعاريض
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            أسعار شفافة ومنافسة لجميع خدمات كتابة وإرسال المعاريض. اختر الخدمة المناسبة لك واحصل على معروض احترافي بأفضل سعر.
          </p>
        </div>

        {/* Pricing Table - Mobile Optimized */}
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
                {pricingData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-right">
                      <div className="text-gray-800 font-medium text-lg">
                        {item.service}
                      </div>
                      {item.category && (
                        <div className="text-sm text-gray-500 mt-1">
                          {item.category}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center mb-1">
                          <span className="text-3xl font-bold text-green-600">
                            {item.price}
                          </span>
                          <span className="text-gray-600 text-lg mr-2">
                            {item.currency}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.id === 'follow-up' ? (
                        <span className="inline-flex items-center justify-center px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed">
                          قريباً
                        </span>
                      ) : (
                        <a 
                          href={item.orderUrl || "https://wa.me/966551117720?text=مرحباً اريد طلب معروض"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform-gpu"
                        >
                          {/* Background gradient effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Button content */}
                          <span className="relative z-10 flex items-center gap-2">
                            <span>اطلب الآن</span>
                            <svg 
                              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
            {pricingData.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold text-base leading-tight">
                      {item.service}
                    </h3>
                    {item.category && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item.category}
                      </div>
                    )}
                  </div>
                  <div className="text-left ml-3">
                    <div className="text-2xl font-bold text-green-600">
                      {item.price}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {item.currency}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  {item.id === 'follow-up' ? (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed w-full justify-center">
                      قريباً
                    </span>
                  ) : (
                    <a 
                      href={item.orderUrl || "https://wa.me/966551117720?text=مرحباً اريد طلب معروض"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full justify-center"
                    >
                      اطلب الآن
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>





      </div>

    </div>
  );
}
