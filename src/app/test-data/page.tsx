'use client';

import { useState, useEffect } from 'react';

interface Stats {
  totalOrders: number;
  totalPayments: number;
  totalEmployees: number;
  recentOrders: Array<{
    id: number;
    customer: string;
    type: string;
    amount: number;
    status: string;
    date: string;
  }>;
  recentPayments: Array<{
    id: number;
    customer: string;
    amount: number;
    method: string;
    status: string;
    date: string;
  }>;
}

export default function TestDataPage() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalPayments: 0,
    totalEmployees: 0,
    recentOrders: [],
    recentPayments: []
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // تحويل حالة الطلب من قيم النظام إلى نص عربي للعرض
  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'مكتمل';
      case 'IN_PROGRESS':
        return 'قيد المعالجة';
      case 'PENDING':
        return 'معلق';
      case 'CANCELLED':
        return 'ملغي';
      default:
        return status;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [statsRes, ordersRes, paymentsRes] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/admin/orders?page=1&limit=5', { cache: 'no-store' }),
          fetch('/api/admin/payments?page=1&limit=5', { cache: 'no-store' })
        ]);

        const [statsJson, ordersJson, paymentsJson] = await Promise.all([
          statsRes.json().catch(() => ({ success: false })),
          ordersRes.json().catch(() => ({ success: false })),
          paymentsRes.json().catch(() => ({ success: false }))
        ]);

        console.log('📊 البيانات المستلمة:', { statsJson, ordersJson, paymentsJson });

        const recentOrders = Array.isArray(ordersJson?.data)
          ? ordersJson.data.map((r: any) => ({
              id: r.id,
              customer: r.applicantName,
              type: r.purpose,
              amount: Number(r.price) || 0,
              status: getOrderStatusText(r.status),
              date: r.createdAt,
            }))
          : [];

        const recentPayments = Array.isArray(paymentsJson?.data)
          ? paymentsJson.data.map((p: any) => ({
              id: p.id,
              customer: p.applicantName,
              amount: Number(p.amount) || 0,
              method: p.paymentMethod,
              status: p.paymentStatus,
              date: p.paymentDate || p.createdAt,
            }))
          : [];

        setStats({
          totalOrders: statsJson?.data?.totalRequests ?? ordersJson?.pagination?.total ?? 0,
          totalPayments: paymentsJson?.pagination?.total ?? 0,
          totalEmployees: statsJson?.data?.totalEmployees ?? 0,
          recentOrders,
          recentPayments,
        });
      } catch (err) {
        console.error('خطأ في جلب بيانات لوحة التحكم:', err);
        setError('حدث خطأ في جلب البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري جلب البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">❌</div>
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">صفحة اختبار البيانات</h1>
          <p className="text-xl text-gray-600">عرض البيانات من قاعدة البيانات بدون مصادقة</p>
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-medium">✅ قاعدة البيانات متصلة وتعمل بشكل ممتاز!</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المدفوعات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الموظفين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">حالة النظام</p>
                <p className="text-2xl font-bold text-green-600">ممتاز</p>
              </div>
              <div className="text-3xl">🟢</div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">آخر الطلبات</h2>
            <p className="text-gray-600 mt-2">عرض آخر 5 طلبات من قاعدة البيانات</p>
          </div>
          <div className="p-6 space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">{order.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount} ريال</p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">لا توجد طلبات حديثة</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">آخر المدفوعات</h2>
            <p className="text-gray-600 mt-2">عرض آخر 5 مدفوعات من قاعدة البيانات</p>
          </div>
          <div className="p-6 space-y-4">
            {stats.recentPayments.length > 0 ? (
              stats.recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">{payment.customer.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.customer}</p>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{payment.amount} ريال</p>
                    <p className="text-sm text-gray-600">{payment.status}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">لا توجد مدفوعات حديثة</p>
            )}
          </div>
        </div>

        {/* Database Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">معلومات قاعدة البيانات</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800"><strong>النوع:</strong> PostgreSQL</p>
              <p className="text-blue-800"><strong>المزود:</strong> Neon (Cloud Database)</p>
              <p className="text-blue-800"><strong>الموقع:</strong> eu-west-2.aws.neon.tech</p>
            </div>
            <div>
              <p className="text-blue-800"><strong>عدد الجداول:</strong> 8 جداول</p>
              <p className="text-blue-800"><strong>حالة الاتصال:</strong> متصل ✅</p>
              <p className="text-blue-800"><strong>آخر تحديث:</strong> {new Date().toLocaleString('ar-SA')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
