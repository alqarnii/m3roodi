'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);
  
  // إضافة console.log في بداية المكون
  console.log('AuthPage rendered with searchParams:', {
    type: searchParams.get('type'),
    action: searchParams.get('action')
  });
  
  // إضافة console.log لمراقبة حالة isLogin
  useEffect(() => {
    console.log('Current isLogin state:', isLogin);
  }, [isLogin]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // الحصول على نوع الطلب من URL
  const requestType = searchParams.get('type'); // 'custom' أو 'ready'
  const action = searchParams.get('action'); // 'register' أو 'login'

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userAuth = localStorage.getItem('userAuth');
        if (userAuth) {
          const userData = JSON.parse(userAuth);
          // التحقق من صلاحية الجلسة (24 ساعة)
          if (Date.now() - userData.timestamp < 24 * 60 * 60 * 1000) {
            // المستخدم مسجل دخول بالفعل، توجيهه مباشرة للصفحة المطلوبة
            toast.success('أنت مسجل دخول بالفعل!');
            if (requestType === 'ready') {
              router.push('/services/ready-templates');
            } else {
              router.push('/request-form');
            }
            return;
          } else {
            // انتهت صلاحية الجلسة
            localStorage.removeItem('userAuth');
          }
        }
      } catch (error) {
        console.error('خطأ في التحقق من المصادقة:', error);
        localStorage.removeItem('userAuth');
      }
    };

    checkAuth();
  }, [router, requestType]);

  // تعيين نوع الصفحة بناءً على معامل action
  useEffect(() => {
    console.log('=== useEffect for action ===');
    console.log('Action parameter:', action);
    console.log('Request type:', requestType);
    console.log('Current isLogin state:', isLogin);
    
    if (action === 'register') {
      console.log('Setting isLogin to false (register page)');
      setIsLogin(false); // فتح صفحة إنشاء الحساب
      console.log('isLogin set to false');
    } else if (action === 'login') {
      console.log('Setting isLogin to true (login page)');
      setIsLogin(true); // فتح صفحة تسجيل الدخول
      console.log('isLogin set to true');
    } else {
      console.log('No action parameter, keeping default state');
    }
    
    // إيقاف loading state بعد تحميل الصفحة
    setIsPageLoading(false);
  }, [action, requestType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // تسجيل الدخول
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('تم تسجيل الدخول بنجاح!');
          
          // حفظ بيانات المستخدم
          localStorage.setItem('userAuth', JSON.stringify({
            user: result.user,
            token: result.token,
            timestamp: Date.now()
          }));

                      // التوجيه حسب نوع الطلب
            if (requestType === 'ready') {
              router.push('/services/ready-templates');
            } else if (requestType === 'send-proposal') {
              router.push('/services/send-proposal');
            } else {
              router.push('/request-form');
            }
        } else {
          toast.error(result.message || 'فشل في تسجيل الدخول');
        }
      } else {
        // إنشاء حساب جديد
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });

        const result = await response.json();

        if (result.success) {
          toast.success('تم إنشاء الحساب بنجاح!');
          
          // حفظ بيانات المستخدم
          localStorage.setItem('userAuth', JSON.stringify({
            user: result.user,
            token: result.token,
            timestamp: Date.now()
          }));

          // التوجيه حسب نوع الطلب
          if (requestType === 'ready') {
            router.push('/services/ready-templates');
          } else if (requestType === 'send-proposal') {
            router.push('/services/send-proposal');
          } else {
            router.push('/request-form');
          }
        } else {
          toast.error(result.message || 'فشل في إنشاء الحساب');
        }
      }
    } catch (error) {
      console.error('خطأ:', error);
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  // إظهار loading state أثناء تحميل الصفحة
  if (isPageLoading) {
    return (
      <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">
              جاري التحميل...
            </h2>
            <p className="text-xl">
              يرجى الانتظار
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {isLogin ? (
              <span className="text-white">أدخل بياناتك للوصول لحسابك</span>
            ) : (
              <span className="text-white font-bold">أنشئ حسابك الآن واحصل على خصم يصل إلى 50%</span>
            )}
          </p>
        </div>

        {/* Form */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {isLogin ? 'أدخل بياناتك' : 'أنشئ حسابك'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-3 text-right">
                  الاسم *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200 text-right"
                  placeholder="أدخل اسمك"
                />
              </div>
            )}

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3 text-right">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200 text-right"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3 text-right">
                كلمة المرور *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200 text-right"
                placeholder="أدخل كلمة المرور"
              />
              {isLogin && (
                <div className="mt-2 text-left">
                  <Link
                    href="/forgot-password"
                    className="text-blue-600 hover:text-blue-800 text-sm transition-colors hover:underline"
                  >
                    نسيت كلمة السر؟
                  </Link>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'جاري تسجيل الدخول...' : 'جاري إنشاء الحساب...'}
                </span>
              ) : (
                isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'
              )}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-lg font-semibold transition-colors hover:underline"
            >
              {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>
          
          {/* Additional info for registration */}
          {!isLogin && (
            <div className="mt-6 text-center">
              <p className="text-black text-lg font-medium">
                إنشاء حساب يمكنك من استعراض المعاريض السابقة وإرجاعها أي وقت
              </p>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white hover:text-blue-100 text-lg transition-colors hover:underline">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
          },
        }}
      />
    </div>
  );
}
