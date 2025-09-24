'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ReadyTemplatePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templateInfo, setTemplateInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });


  // بيانات الصيغ الجاهزة - الأسعار الصحيحة
  const templates = {
    'job-application': { title: 'طلب وظيفة', price: 49, originalPrice: 49, image: '/wzfh.webp' },
    'traffic-exemption': { title: 'طلب اعفاء من المخالفات المرورية', price: 49, originalPrice: 49, image: '/mkalfah.webp' },
    'financial-assistance': { title: 'طلب مساعدة مالية', price: 49, originalPrice: 49, image: '/moneyord.webp' },
    'foreign-marriage': { title: 'طلب زواج من اجنبية', price: 49, originalPrice: 49, image: '/wifes.webp' },
    'debt-payment': { title: 'طلب سداد دين', price: 49, originalPrice: 49, image: '/sdaddin.webp' },
    'employee-transfer': { title: 'طلب نقل موظف', price: 49, originalPrice: 49, image: '/wzfh.webp' },
    'prisoner-release': { title: 'استرحام اطلاق سراح سجين', price: 49, originalPrice: 49, image: '/loaz.png' },
    'housing-request': { title: 'طلب سكن', price: 49, originalPrice: 49, image: '/loaz.png' },
    'treatment-request': { title: 'طلب علاج', price: 49, originalPrice: 49, image: '/loaz.png' },
    'naturalization': { title: 'طلب تجنيس', price: 49, originalPrice: 49, image: '/loaz.png' },
    'land-grant': { title: 'طلب منحة ارض', price: 49, originalPrice: 49, image: '/loaz.png' },
    'scholarship': { title: 'طلب ابتعاث خارجي', price: 49, originalPrice: 49, image: '/loaz.png' }
  };

  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && templates[templateId as keyof typeof templates]) {
      setTemplateInfo(templates[templateId as keyof typeof templates]);
    } else {
      // إذا لم يتم تحديد قالب، توجيه للصفحة الرئيسية
      router.push('/services/ready-templates');
    }
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleElectronicPayment = async () => {
    try {
      if (!formData.name || !formData.phone) {
        toast.error('يرجى إدخال الاسم ورقم الجوال أولاً');
        return;
      }

      const loadingToast = toast.loading('جاري حفظ الطلب وإنشاء عملية الدفع...');
      
      // أولاً: حفظ الطلب في قاعدة البيانات
      const templateId = Object.keys(templates).find(key => templates[key as keyof typeof templates].title === templateInfo?.title);
      
      const orderResponse = await fetch('/api/ready-template-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: templateId,
          templateName: templateInfo?.title,
          customerName: formData.name,
          customerEmail: formData.email || '',
          customerPhone: formData.phone,
          additionalNotes: ''
        }),
      });

      const orderResult = await orderResponse.json();
      
      if (!orderResult.success) {
        toast.dismiss(loadingToast);
        toast.error('فشل في حفظ الطلب');
        return;
      }

      // ثانياً: إنشاء عملية الدفع
      const paymentResponse = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: templateInfo?.price || 49,
          orderNumber: orderResult.data.orderNumber,
          customerName: formData.name,
          customerEmail: formData.email || '',
          purpose: `صيغة جاهزة: ${templateInfo?.title}`,
          recipient: 'فريق معروضي',
          template: templateId,
          requestId: orderResult.data.id
        }),
      });

      const paymentResult = await paymentResponse.json();
      toast.dismiss(loadingToast);
      
      if (paymentResult.success) {
        toast.success('تم حفظ الطلب وإنشاء عملية الدفع! جاري التوجيه لبوابة الدفع...', {
          duration: 3000,
        });
        
        setTimeout(() => {
          window.location.href = paymentResult.paymentUrl;
        }, 2000);
      } else {
        toast.error(paymentResult.message || 'فشل في إنشاء عملية الدفع');
      }
      
    } catch (error) {
      toast.error('حدث خطأ في إنشاء عملية الدفع. حاول مرة أخرى.');
    }
  };

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
    <div className="min-h-screen py-12" style={{ background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold text-white mb-4">
            الصيغ الجاهزة
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            اختر من مجموعة متنوعة من الصيغ الجاهزة للمعاريض والخطابات الرسمية
          </p>
        </div>

        {/* تفاصيل الطلب والسعر */}
        <div className="bg-green-50 rounded-lg p-6 mb-8 border-r-4 border-green-500">
          <h2 className="text-xl font-semibold text-green-800 mb-4">💰 تفاصيل الطلب</h2>
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-800 mb-2">
              {templateInfo.title}
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {templateInfo.price} ريال
            </div>
            <p className="text-green-700">سعر الصيغة الجاهزة شامل الضريبة</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6 mb-8 bg-blue-50 rounded-2xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                رقم الجوال
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
                placeholder="05xxxxxxxx"
              />
            </div>
          </div>
        </form>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">طريقة الدفع</h3>
          <div className="text-center">
            <div className="inline-block p-6 border-2 border-blue-600 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">💳</div>
              <div className="font-semibold text-gray-800">دفع إلكتروني</div>
              <div className="text-sm text-gray-600">بطاقة ائتمان أو مدى</div>
            </div>
          </div>
        </div>


        {/* Electronic Payment Button */}
        <div className="text-center">
          <button 
            onClick={handleElectronicPayment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            متابعة الدفع الإلكتروني
          </button>
        </div>
      </div>


      
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
