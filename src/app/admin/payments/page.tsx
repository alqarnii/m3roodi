'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';
import { Building2, CreditCard } from 'lucide-react';

interface Payment {
  id: number;
  requestId: number;
  applicantName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
  bankReference?: string;
  paymentDate?: string;
  createdAt: string;
  notes?: string;
  purpose: string;
  recipient: string;
}

// Modal component for payment details
function PaymentDetailsModal({ payment, isOpen, onClose }: { 
  payment: Payment | null; 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen || !payment) return null;

  return (
    <div className="admin-modal bg-black/60 backdrop-blur-sm">
      <div className="admin-modal-content bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-8">
          <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">تفاصيل الدفع #{payment.id}</h2>
                <p className="text-green-100 mt-1">عرض جميع بيانات الدفع</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">اسم العميل</label>
                <p className="text-sm text-gray-900 mt-1">{payment.applicantName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">رقم الطلب</label>
                <p className="text-sm text-gray-900 mt-1">#{payment.requestId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">الغرض</label>
                <p className="text-sm text-gray-900 mt-1">{payment.purpose}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">المستلم</label>
                <p className="text-sm text-gray-900 mt-1">{payment.recipient}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                معلومات الدفع
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">المبلغ</label>
                <p className="text-lg font-bold text-green-600 mt-1">{payment.amount} ريال</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">طريقة الدفع</label>
                <p className="text-sm text-gray-900 mt-1">{payment.paymentMethod}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">الحالة</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                  payment.paymentStatus === 'مكتمل' ? 'bg-green-100 text-green-800' :
                  payment.paymentStatus === 'معلق' ? 'bg-yellow-100 text-yellow-800' :
                  payment.paymentStatus === 'فشل' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {payment.paymentStatus}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">تاريخ ووقت الإنشاء</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(payment.createdAt).toLocaleString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              تفاصيل المعاملة
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">رقم المعاملة</label>
                <p className="text-sm text-gray-900 mt-1 font-mono">
                  {payment.transactionId || payment.bankReference || 'غير محدد'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600">تاريخ الدفع</label>
                <p className="text-sm text-gray-900 mt-1">
                  {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('ar-SA') : 'لم يتم الدفع بعد'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                الملاحظات
              </h3>
              <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                {payment.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 space-x-3 rtl:space-x-reverse">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            إغلاق
          </button>
          <Link
            href={`/admin/payments/${payment.id}`}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            تعديل الدفع
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0
  });

  useEffect(() => {
    fetchPayments();
  }, [filter, searchTerm, currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: filter,
        search: searchTerm
      });

      const response = await fetch(`/api/admin/payments?${params}`);
      const result = await response.json();

      if (result.success) {
        setPayments(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.total);
        
        // حساب الإحصائيات
        const totalAmount = result.data.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
        const completedCount = result.data.filter((p: Payment) => p.paymentStatus === 'مكتمل').length;
        const pendingCount = result.data.filter((p: Payment) => p.paymentStatus === 'معلق').length;
        const failedCount = result.data.filter((p: Payment) => p.paymentStatus === 'فشل').length;
        
        setStats({
          totalAmount,
          completedCount,
          pendingCount,
          failedCount
        });
      } else {
        console.error('فشل في جلب المدفوعات:', result.message);
      }
    } catch (error) {
      console.error('خطأ في جلب المدفوعات:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/payments`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          paymentId, 
          paymentStatus: newStatus 
        }),
      });

      const result = await response.json();
      if (result.success) {
        // تحديث الحالة في القائمة المحلية
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, paymentStatus: newStatus }
            : payment
        ));
        
        // إعادة جلب البيانات لتحديث الإحصائيات
        fetchPayments();
      } else {
        alert('فشل في تحديث حالة الدفع');
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الدفع:', error);
      alert('فشل في تحديث حالة الدفع');
    }
  };

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closePaymentDetails = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.paymentStatus === filter;
    const matchesSearch = payment.applicantName.includes(searchTerm) || 
                         payment.transactionId?.includes(searchTerm) ||
                         payment.bankReference?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتمل': return 'bg-green-100 text-green-800';
      case 'معلق': return 'bg-yellow-100 text-yellow-800';
      case 'فشل': return 'bg-red-100 text-red-800';
      case 'مسترد': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'تحويل بنكي': return 'bg-blue-100 text-blue-800';
      case 'دفع إلكتروني': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">إجمالي المدفوعات</p>
                  <p className="text-3xl font-bold text-green-700">
                    {stats.totalAmount.toLocaleString()} ريال
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">المدفوعات المكتملة</p>
                  <p className="text-3xl font-bold text-blue-700">
                    {stats.completedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-600">المدفوعات المعلقة</p>
                  <p className="text-3xl font-bold text-amber-700">
                    {stats.pendingCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">المدفوعات الفاشلة</p>
                  <p className="text-3xl font-bold text-red-700">
                    {stats.failedCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="البحث في المدفوعات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="all">جميع الحالات</option>
                <option value="معلق">معلق</option>
                <option value="مكتمل">مكتمل</option>
                <option value="فشل">فشل</option>
                <option value="مسترد">مسترد</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      العميل
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      طريقة الدفع
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      رقم المعاملة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      تاريخ الدفع
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      وقت الإنشاء
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      الملاحظات
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.applicantName}
                      </div>
                      <div className="text-sm text-gray-500">طلب #{payment.requestId}</div>
                      <div className="text-xs text-gray-400">{payment.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{payment.amount} ريال</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod === 'تحويل بنكي' ? (
                          <div className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" />
                            تحويل بنكي
                          </div>
                        ) : payment.paymentMethod === 'دفع إلكتروني' ? (
                          <div className="flex items-center">
                            <CreditCard className="w-3 h-3 mr-1" />
                            دفع إلكتروني
                          </div>
                        ) : payment.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.transactionId || payment.bankReference || 'غير محدد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {payment.paymentDate || 'لم يتم الدفع بعد'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium text-blue-600">
                          {new Date(payment.createdAt).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(payment.createdAt).toLocaleTimeString('ar-SA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {payment.notes || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <select
                          value={payment.paymentStatus}
                          onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="معلق">معلق</option>
                          <option value="مكتمل">مكتمل</option>
                          <option value="فشل">فشل</option>
                          <option value="مسترد">مسترد</option>
                        </select>
                        <button
                          onClick={() => openPaymentDetails(payment)}
                          className="text-blue-600 hover:text-blue-900 text-xs"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

          {/* Pagination */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                عرض <span className="font-bold text-green-600">{(currentPage - 1) * 10 + 1}</span> إلى <span className="font-bold text-green-600">
                  {Math.min(currentPage * 10, totalCount)}
                </span> من <span className="font-bold text-green-600">{totalCount}</span> نتيجة
              </div>
              <div className="flex space-x-3 rtl:space-x-reverse">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  السابق
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  التالي
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Payment Details Modal */}
        <PaymentDetailsModal
          payment={selectedPayment}
          isOpen={isModalOpen}
          onClose={closePaymentDetails}
        />
    </ProtectedRoute>
  );
}
