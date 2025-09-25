export interface PricingItem {
  service: string;
  price: number;
  currency: string;
  category: string;
  id: string;
  orderUrl?: string;
}

export const pricingData: PricingItem[] = [
  {
    id: 'financial-assistance',
    service: 'طلب مساعدة مالية',
    price: 199,
    currency: 'ريال',
    category: 'معاريض مالية',
    orderUrl: 'https://new-mall.com/qGqgWKY'
  },
  {
    id: 'debt-payment',
    service: 'طلب سداد دين',
    price: 199,
    currency: 'ريال',
    category: 'معاريض مالية',
    orderUrl: 'https://new-mall.com/KRlYydp'
  },
  {
    id: 'transfer-request',
    service: 'طلب نقل',
    price: 199,
    currency: 'ريال',
    category: 'خدمات النقل',
    orderUrl: 'https://new-mall.com/YzAPwgj'
  },
  {
    id: 'naturalization',
    service: 'طلب تجنيس',
    price: 350,
    currency: 'ريال',
    category: 'معاريض الجنسية',
    orderUrl: 'https://new-mall.com/ngPQWDn'
  },
  {
    id: 'treatment-request',
    service: 'طلب علاج',
    price: 150,
    currency: 'ريال',
    category: 'معاريض العلاج',
    orderUrl: 'https://new-mall.com/BpKPAZn'
  },
  {
    id: 'mercy-request',
    service: 'طلب استرحام',
    price: 199,
    currency: 'ريال',
    category: 'معاريض الاسترحام',
    orderUrl: 'https://new-mall.com/ngPQWDn'
  },
  {
    id: 'foreign-marriage',
    service: 'طلب زواج من اجنبية',
    price: 300,
    currency: 'ريال',
    category: 'معاريض الزواج',
    orderUrl: 'https://new-mall.com/qGqgWpQ'
  },
  {
    id: 'job-application',
    service: 'طلب وظيفة',
    price: 199,
    currency: 'ريال',
    category: 'معاريض التوظيف',
    orderUrl: 'https://new-mall.com/ZqGRynP'
  },
  {
    id: 'complaint-letter',
    service: 'شكوى او تظلم',
    price: 250,
    currency: 'ريال',
    category: 'معاريض الشكاوى',
    orderUrl: 'https://new-mall.com/DpXNPmW'
  },
  {
    id: 'special-request',
    service: 'معروض خاص',
    price: 350,
    currency: 'ريال',
    category: 'معاريض خاصة',
    orderUrl: 'https://new-mall.com/oZEQPDR'
  },
  {
    id: 'certificate-letter',
    service: 'كتابة مشهد',
    price: 199,
    currency: 'ريال',
    category: 'خطابات المشاهد',
    orderUrl: 'https://new-mall.com/eQgrKnX'
  },
  {
    id: 'royal-court',
    service: 'كتابة معروض للديوان الملكي',
    price: 199,
    currency: 'ريال',
    category: 'معاريض الديوان الملكي',
    orderUrl: 'https://new-mall.com/vAynrQB'
  },
  {
    id: 'send-proposal',
    service: 'إرسال معروض الى المسؤول (بدون كتابة)',
    price: 550,
    currency: 'ريال',
    category: 'خدمات الإرسال'
  },
  {
    id: 'follow-up',
    service: 'متابعة معاملة',
    price: 3999,
    currency: 'ريال',
    category: 'خدمات المتابعة'
  },
  {
    id: 'land-grant-request',
    service: 'طلب منحة أرض',
    price: 199,
    currency: 'ريال',
    category: 'معاريض الأراضي',
    orderUrl: 'https://new-mall.com/XzAbroO'
  }
];

// دالة للحصول على السعر حسب نوع الخدمة
export function getPriceByService(serviceName: string): number {
  const item = pricingData.find(item => 
    item.service.includes(serviceName) || 
    serviceName.includes(item.service)
  );
  return item ? item.price : 199; // سعر افتراضي
}

// دالة للحصول على السعر حسب ID
export function getPriceById(id: string): number {
  const item = pricingData.find(item => item.id === id);
  return item ? item.price : 199; // سعر افتراضي
}

// دالة للحصول على السعر حسب الغرض
export function getPriceByPurpose(purpose: string): number {
  const item = pricingData.find(item => 
    purpose.includes(item.service) || 
    item.service.includes(purpose)
  );
  return item ? item.price : 199; // سعر افتراضي
}


