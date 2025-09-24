export interface PricingItem {
  service: string;
  price: number;  currency: string;
  category: string;
  id: string;
}

export const pricingData: PricingItem[] = [
  {
    id: 'financial-assistance',
    service: 'طلب مساعدة مالية',
    price: 199,
    currency: 'ريال',
    category: 'معاريض مالية'
  },
  {
    id: 'debt-payment',
    service: 'طلب سداد دين',
    price: 199,
    currency: 'ريال',
    category: 'معاريض مالية'
  },
  {
    id: 'transfer-request',
    service: 'طلب نقل',
    price: 199,
    currency: 'ريال',
    category: 'خدمات النقل'
  },
  {
    id: 'naturalization',
    service: 'طلب تجنيس',
    price: 350,
    currency: 'ريال',
    category: 'معاريض الجنسية'
  },
  {
    id: 'treatment-request',
    service: 'طلب علاج',
    price: 150,
    currency: 'ريال',
    category: 'معاريض العلاج'
  },
  {
    id: 'mercy-request',
    service: 'طلب استرحام',
    price: 199,
    currency: 'ريال',
    category: 'معاريض الاسترحام'
  },
  {
    id: 'foreign-marriage',
    service: 'طلب زواج من اجنبية',
    price: 300,
    currency: 'ريال',
    category: 'معاريض الزواج'
  },
  {
    id: 'job-application',
    service: 'طلب وظيفة',
    price: 199,
    currency: 'ريال',
    category: 'معاريض التوظيف'
  },
  {
    id: 'complaint-letter',
    service: 'شكوى او تظلم',
    price: 250,
    currency: 'ريال',
    category: 'معاريض الشكاوى'
  },
  {
    id: 'special-request',
    service: 'معروض خاص',
    price: 350,
    currency: 'ريال',
    category: 'معاريض خاصة'
  },
  {
    id: 'certificate-letter',
    service: 'كتابة مشهد',
    price: 199,
    currency: 'ريال',
    category: 'خطابات المشاهد'
  },
  {
    id: 'royal-court',
    service: 'كتابة معروض للديوان الملكي',
    price: 199,
    currency: 'ريال',
    category: 'معاريض الديوان الملكي'
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
    category: 'معاريض الأراضي'
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


