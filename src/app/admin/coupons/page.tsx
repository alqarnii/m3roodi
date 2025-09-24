'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Ticket } from 'lucide-react';

interface Coupon {
  id: number;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    discountValue: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons');
      const data = await response.json();
      
      if (data.success) {
        setCoupons(data.coupons);
      } else {
        toast.error('فشل في جلب أكواد الخصم');
      }
    } catch (error) {
      console.error('خطأ في جلب أكواد الخصم:', error);
      toast.error('حدث خطأ في جلب أكواد الخصم');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCoupon ? `/api/admin/coupons/${editingCoupon.id}` : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingCoupon ? 'تم تحديث كود الخصم بنجاح' : 'تم إنشاء كود الخصم بنجاح');
        fetchCoupons();
        resetForm();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('خطأ في حفظ كود الخصم:', error);
      toast.error('حدث خطأ في حفظ كود الخصم');
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0],
      isActive: coupon.isActive
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف كود الخصم؟')) return;

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('تم حذف كود الخصم بنجاح');
        fetchCoupons();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('خطأ في حذف كود الخصم:', error);
      toast.error('حدث خطأ في حذف كود الخصم');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
    setShowCreateForm(false);
    setEditingCoupon(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const getStatusBadge = (coupon: Coupon) => {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (!coupon.isActive) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">غير نشط</span>;
    }

    if (now < validFrom) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">لم يبدأ</span>;
    }

    if (now > validUntil) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">منتهي</span>;
    }



    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">نشط</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Ticket className="w-6 h-6 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">إدارة أكواد الخصم</h1>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة كود خصم جديد
            </button>
          </div>

          {/* جدول أكواد الخصم */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكود
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع الخصم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    قيمة الخصم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono font-semibold text-blue-600">{coupon.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {coupon.discountType === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {coupon.discountType === 'PERCENTAGE' 
                          ? `${coupon.discountValue}%` 
                          : `${coupon.discountValue} ريال`
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(coupon)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {coupons.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">لا توجد أكواد خصم</p>
            </div>
          )}
        </div>

        {/* نموذج إنشاء/تعديل كود الخصم */}
        {showCreateForm && (
          <div className="admin-modal bg-black bg-opacity-50">
            <div className="admin-modal-content bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-bold mb-4">
                {editingCoupon ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كود الخصم *
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="مثال: WELCOME20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع الخصم *
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="PERCENTAGE">نسبة مئوية</option>
                      <option value="FIXED_AMOUNT">مبلغ ثابت</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      قيمة الخصم *
                    </label>
                    <input
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                      step="0.01"
                      placeholder={formData.discountType === 'PERCENTAGE' ? '20' : '50'}
                    />
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ البداية *
                    </label>
                    <input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      تاريخ الانتهاء *
                    </label>
                    <input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>



                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                    نشط
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCoupon ? 'تحديث' : 'إنشاء'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
