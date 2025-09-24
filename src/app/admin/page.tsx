'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, DollarSign, Users, Settings, BarChart3, CheckCircle, AlertCircle, Database, Mail, HardDrive } from 'lucide-react';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalPayments: 0,
    totalEmployees: 0,
    recentOrders: [],
    recentPayments: []
  });
  const [isLoading, setIsLoading] = useState(true);

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

  const loadData = async () => {
    try {
      setIsLoading(true);
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

      console.log('📊 البيانات المستلمة في لوحة التحكم:', { statsJson, ordersJson, paymentsJson });
      console.log('📊 تفاصيل الإحصائيات:', statsJson?.data);
      console.log('📊 تفاصيل الطلبات:', ordersJson?.data);
      console.log('📊 تفاصيل المدفوعات:', paymentsJson?.data);

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
      
      console.log('📊 البيانات النهائية المعروضة:', {
        totalOrders: statsJson?.data?.totalRequests ?? ordersJson?.pagination?.total ?? 0,
        totalPayments: paymentsJson?.pagination?.total ?? 0,
        totalEmployees: statsJson?.data?.totalEmployees ?? 0,
        recentOrdersCount: recentOrders.length,
        recentPaymentsCount: recentPayments.length
      });
    } catch (err) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', err);
      console.error('تفاصيل الخطأ:', err);
      
      // إعادة تعيين البيانات في حالة الخطأ
      setStats({
        totalOrders: 0,
        totalPayments: 0,
        totalEmployees: 0,
        recentOrders: [],
        recentPayments: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const StatCard = ({ title, value, icon, color, href }: any) => (
    <Link href={href} className="block group">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity">
            {icon}
          </div>
        </div>
        <div className={`mt-4 h-1 rounded-full ${color.replace('border-', 'bg-')} group-hover:h-2 transition-all duration-300`}></div>
      </div>
    </Link>
  );

  const RecentItem = ({ item, type }: any) => (
    <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">{item.customer.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{item.customer}</p>
          <p className="text-sm text-gray-500">{type === 'order' ? item.type : item.method}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 text-lg">{item.amount} ريال</p>
        <p className={`text-sm font-medium px-2 py-1 rounded-full ${
          item.status === 'مكتمل' ? 'bg-green-100 text-green-700' : 
          item.status === 'قيد المعالجة' ? 'bg-yellow-100 text-yellow-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {item.status}
        </p>
        <p className="text-xs text-gray-500 mt-1">{item.date}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل بيانات لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              لوحة التحكم
            </h1>
            <p className="text-gray-600 text-lg">مرحباً بك في لوحة تحكم معروضي</p>
          </div>
          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'جاري التحميل...' : 'إعادة تحميل البيانات'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          color="border-blue-500"
          href="/admin/orders"
        />
        <StatCard
          title="إجمالي المدفوعات"
          value={stats.totalPayments}
          icon={<DollarSign className="w-8 h-8 text-green-600" />}
          color="border-green-500"
          href="/admin/payments"
        />
        <StatCard
          title="الموظفين"
          value={stats.totalEmployees}
          icon={<Users className="w-8 h-8 text-purple-600" />}
          color="border-purple-500"
          href="/admin/employees"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">آخر الطلبات</h2>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                عرض الكل
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <RecentItem key={order.id} item={order} type="order" />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد طلبات حديثة</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">آخر المدفوعات</h2>
              <Link href="/admin/payments" className="text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
                عرض الكل
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {stats.recentPayments.length > 0 ? (
              stats.recentPayments.map((payment) => (
                <RecentItem key={payment.id} item={payment} type="payment" />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>لا توجد مدفوعات حديثة</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/employees"
            className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">إدارة الموظفين</p>
              <p className="text-sm text-gray-500">عرض وإضافة وتعديل الموظفين</p>
            </div>
          </Link>

          <Link
            href="/admin/settings"
            className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 hover:transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-shadow">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">إعدادات النظام</p>
              <p className="text-sm text-gray-500">تكوين النظام والإعدادات</p>
            </div>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">حالة النظام</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-sm"></div>
            <span className="text-sm font-medium text-green-700">النظام يعمل بشكل طبيعي</span>
          </div>
          <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-sm"></div>
            <span className="text-sm font-medium text-blue-700">قاعدة البيانات متصلة</span>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-sm"></div>
            <span className="text-sm font-medium text-green-700">البريد الإلكتروني يعمل</span>
          </div>
          <div className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 shadow-sm"></div>
            <span className="text-sm font-medium text-yellow-700">نسخة احتياطية مطلوبة</span>
          </div>
        </div>
      </div>
    </div>
  );
}