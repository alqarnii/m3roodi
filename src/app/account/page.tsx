'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    requests: number;
  };
}

interface Request {
  id: number;
  purpose: string;
  recipient: string;
  status: string;
  price: number;
  createdAt: string;
  paymentStatus: string;
  totalPaid: number;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    try {
      // التحقق من وجود بيانات المصادقة
      const authData = localStorage.getItem('userAuth');
      if (!authData) {
        router.push('/auth');
        return;
      }

      const { user: authUser, token } = JSON.parse(authData);
      
      // التحقق من أن الجلسة لم تنتهي (24 ساعة)
      if (Date.now() - authUser.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('userAuth');
        router.push('/auth');
        return;
      }

      // جلب بيانات المستخدم
      await fetchUserData(authUser.id, token);
      await fetchUserRequests(authUser.id, token);
      
    } catch (error) {
      console.error('خطأ في التحقق من المصادقة:', error);
      localStorage.removeItem('userAuth');
      router.push('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async (userId: number, token: string) => {
    try {
      const response = await fetch(`/api/user/profile?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات المستخدم:', error);
    }
  };

  const fetchUserRequests = async (userId: number, token: string) => {
    try {
      const response = await fetch(`/api/user/requests?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRequests(data.data);
        }
      }
    } catch (error) {
      console.error('خطأ في جلب طلبات المستخدم:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    toast.success('تم تسجيل الخروج بنجاح');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'مكتمل';
      case 'IN_PROGRESS': return 'قيد المعالجة';
      case 'PENDING': return 'معلق';
      case 'CANCELLED': return 'ملغي';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h1>
          <Link href="/auth" className="text-blue-600 hover:text-blue-800">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">حسابي</h1>
              <p className="text-blue-100 text-lg">
                مرحباً {user.firstName} {user.lastName} - مرحباً بك في حسابك الشخصي
              </p>
            </div>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link
                href="/"
                className="bg-white bg-opacity-20 px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-300"
              >
                🏠 الرئيسية
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-all duration-300"
              >
                🚪 تسجيل الخروج
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex space-x-4 rtl:space-x-reverse border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📋 الملف الشخصي
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              📝 طلباتي ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-lg font-medium rounded-t-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ⚙️ الإعدادات
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* معلومات المستخدم الأساسية */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">📋 المعلومات الأساسية</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">رقم المستخدم:</span>
                      <span className="text-gray-900 font-bold">#{user.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">الاسم الأول:</span>
                      <span className="text-gray-900">{user.firstName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">الاسم الأخير:</span>
                      <span className="text-gray-900">{user.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">الاسم الكامل:</span>
                      <span className="text-gray-900 font-bold">{user.firstName} {user.lastName}</span>
                    </div>
                  </div>
                </div>

                {/* معلومات الاتصال */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-900 mb-4">📞 معلومات الاتصال</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">البريد الإلكتروني:</span>
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">رقم الجوال:</span>
                      <span className="text-gray-900">{user.phone || 'غير محدد'}</span>
                    </div>
                    {user.idNumber && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">رقم الهوية:</span>
                        <span className="text-gray-900">{user.idNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* معلومات الحساب */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-900 mb-4">📊 معلومات الحساب</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">عدد الطلبات:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {user._count?.requests || 0} طلب
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">تاريخ التسجيل:</span>
                      <span className="text-gray-900">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">آخر تحديث:</span>
                      <span className="text-gray-900">{formatDate(user.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* إحصائيات سريعة */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-purple-900 mb-4">📈 إحصائيات سريعة</h3>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {requests.filter(r => r.status === 'COMPLETED').length}
                      </div>
                      <div className="text-sm text-gray-600">الطلبات المكتملة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {requests.filter(r => r.status === 'IN_PROGRESS').length}
                      </div>
                      <div className="text-sm text-gray-600">قيد المعالجة</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        {requests.filter(r => r.status === 'PENDING').length}
                      </div>
                      <div className="text-sm text-gray-600">معلق</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="p-8">
              {requests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">لا توجد طلبات بعد</h3>
                  <p className="text-gray-600 mb-6">ابدأ بإنشاء طلبك الأول للحصول على خدمة كتابة المعروض</p>
                  <a
                    href="https://wa.me/966551117720?text=مرحباً اريد طلب معروض"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    إنشاء طلب جديد
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">📝 طلباتي</h3>
                  <div className="grid gap-6">
                    {requests.map((request) => (
                      <div key={request.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              طلب #{request.id.toString().padStart(6, '0')}
                            </h4>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">الهدف:</span> {request.purpose}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">المستلم:</span> {request.recipient}
                            </p>
                          </div>
                          <div className="text-left">
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {getStatusText(request.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">السعر:</span>
                            <span className="text-green-600 font-bold mr-2"> {request.price} ريال</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">المدفوع:</span>
                            <span className="text-blue-600 font-bold mr-2"> {request.totalPaid} ريال</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">تاريخ الطلب:</span>
                            <span className="text-gray-600 mr-2"> {formatDate(request.createdAt)}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              حالة الدفع: <span className={`font-medium ${
                                request.paymentStatus === 'مكتمل' ? 'text-green-600' :
                                request.paymentStatus === 'جزئي' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>{request.paymentStatus}</span>
                            </span>
                            <Link
                              href={`/request-form/payment?requestId=${request.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              عرض التفاصيل →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">⚙️ إعدادات الحساب</h3>
                
                <div className="space-y-6">
                  {/* تحديث المعلومات الشخصية */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-900 mb-4">📝 تحديث المعلومات الشخصية</h4>
                    <p className="text-gray-600 mb-4">
                      يمكنك تحديث معلوماتك الشخصية من خلال التواصل مع إدارة الموقع
                    </p>
                    <Link
                      href="/contact"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      التواصل مع الإدارة
                    </Link>
                  </div>

                  {/* تغيير كلمة المرور */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-900 mb-4">🔐 تغيير كلمة المرور</h4>
                    <p className="text-gray-600 mb-4">
                      لتغيير كلمة المرور، يرجى التواصل مع إدارة الموقع
                    </p>
                    <Link
                      href="/contact"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      طلب تغيير كلمة المرور
                    </Link>
                  </div>

                  {/* إعدادات الإشعارات */}
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-yellow-900 mb-4">🔔 إعدادات الإشعارات</h4>
                    <p className="text-gray-600 mb-4">
                      سيتم إرسال إشعارات لك عبر البريد الإلكتروني عند تحديث حالة طلباتك
                    </p>
                    <div className="text-sm text-gray-500">
                      البريد الإلكتروني: {user.email}
                    </div>
                  </div>

                  {/* حذف الحساب */}
                  <div className="bg-red-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-red-900 mb-4">🗑️ حذف الحساب</h4>
                    <p className="text-gray-600 mb-4">
                      تحذير: حذف الحساب سيؤدي إلى فقدان جميع البيانات والطلبات نهائياً
                    </p>
                    <Link
                      href="/contact"
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      طلب حذف الحساب
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
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
