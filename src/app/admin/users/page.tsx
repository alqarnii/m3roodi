'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string | null;
  createdAt: string;
  updatedAt: string;
  requests?: Array<{
    id: number;
    purpose: string;
    status: string;
    price: string;
  }>;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // States for modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        throw new Error('فشل في جلب المستخدمين');
      }

      const data = await response.json();
      
      if (data.success && data.users) {
        // فلترة المستخدمين حسب البحث
        let filteredUsers = data.users;
        if (searchTerm.trim()) {
          filteredUsers = data.users.filter((user: User) =>
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // تقسيم المستخدمين إلى صفحات
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        setTotalUsers(data.totalUsers);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalUsers(0);
      }
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUsers(users.filter(user => user.id !== userToDelete.id));
        alert(result.message || 'تم حذف المستخدم بنجاح');
        closeDeleteModal();
      } else {
        alert(result.message || 'فشل في حذف المستخدم');
      }
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      alert('حدث خطأ في حذف المستخدم');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm)) ||
    (user.idNumber && user.idNumber.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
              <p className="mt-2 text-gray-600">عرض وإدارة جميع المستخدمين المسجلين في النظام</p>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              العودة للوحة التحكم
            </Link>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="البحث في المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              إجمالي المستخدمين: <span className="font-semibold">{totalUsers}</span>
              {/* سيتم تحديث هذا لاحقاً لعرض العدد الصحيح */}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل المستخدمين...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المستخدم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        معلومات الاتصال
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الطلبات
                      </th>
                                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاريخ ووقت التسجيل
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الإجراءات
                        </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-lg">
                                  {user.firstName.charAt(0)}{user.lastName ? user.lastName.charAt(0) : ''}
                                </span>
                              </div>
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName || ''}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone || 'غير محدد'}</div>
                          {user.idNumber && (
                            <div className="text-sm text-gray-500">هوية: {user.idNumber}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.requests?.length || 0} طلب
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-sm text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(user.createdAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                            >
                              عرض
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      التالي
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        عرض <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> إلى{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, users.length)}
                        </span>{' '}
                        من <span className="font-medium">{users.length}</span> نتيجة
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal عرض بيانات المستخدم */}
        {showViewModal && selectedUser && (
          <div className="admin-modal bg-black bg-opacity-50">
            <div className="admin-modal-content bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">👤 بيانات المستخدم</h2>
                    <p className="text-blue-100 mt-2">عرض جميع بيانات المستخدم</p>
                  </div>
                  <button
                    onClick={closeViewModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* معلومات المستخدم الأساسية */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">📋 المعلومات الأساسية</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">رقم المستخدم:</span>
                        <span className="text-gray-900 font-bold">#{selectedUser.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">الاسم الأول:</span>
                        <span className="text-gray-900">{selectedUser.firstName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">الاسم الأخير:</span>
                        <span className="text-gray-900">{selectedUser.lastName || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">الاسم الكامل:</span>
                        <span className="text-gray-900 font-bold">{selectedUser.firstName} {selectedUser.lastName || ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* معلومات الاتصال */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-green-900 mb-3">📞 معلومات الاتصال</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">البريد الإلكتروني:</span>
                        <span className="text-gray-900">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">رقم الجوال:</span>
                        <span className="text-gray-900">{selectedUser.phone || 'غير محدد'}</span>
                      </div>
                      {selectedUser.idNumber && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-700">رقم الهوية:</span>
                          <span className="text-gray-900">{selectedUser.idNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-yellow-900 mb-3">📊 معلومات إضافية</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">عدد الطلبات:</span>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {selectedUser.requests?.length || 0} طلب
                            </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">تاريخ ووقت التسجيل:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(selectedUser.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">آخر تحديث:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(selectedUser.updatedAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* الإجراءات */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">⚙️ الإجراءات</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleDeleteClick(selectedUser)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      🗑️ حذف المستخدم
                    </button>
                    
                    <button
                      onClick={closeViewModal}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal تأكيد الحذف */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">⚠️ تأكيد الحذف</h2>
                    <p className="text-red-100 mt-2">هل أنت متأكد من حذف هذا المستخدم؟</p>
                  </div>
                  <button
                    onClick={closeDeleteModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <span className="text-red-600 text-2xl">🗑️</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    حذف المستخدم: {userToDelete.firstName} {userToDelete.lastName || ''}
                  </h3>
                  <p className="text-sm text-gray-500">
                    هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المستخدم نهائياً.
                  </p>
                </div>

                {/* تفاصيل المستخدم */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">بيانات المستخدم:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>البريد الإلكتروني: {userToDelete.email}</div>
                    <div>رقم الجوال: {userToDelete.phone || 'غير محدد'}</div>
                    {userToDelete.idNumber && (
                      <div>رقم الهوية: {userToDelete.idNumber}</div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>عدد الطلبات:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (userToDelete.requests?.length || 0) > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {userToDelete.requests?.length || 0} طلب
                      </span>
                    </div>
                  </div>
                  
                  {/* تحذير إذا كان هناك طلبات */}
                  {(userToDelete.requests?.length || 0) > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border-r-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        <strong>ملاحظة:</strong> هذا المستخدم لديه {userToDelete.requests?.length} طلب مرتبط. 
                        سيتم إزالة العلاقة بين الطلبات والمستخدم، لكن الطلبات ستبقى في النظام.
                      </p>
                    </div>
                  )}
                </div>

                {/* الأزرار */}
                <div className="flex justify-end space-x-3 rtl:space-x-reverse">
                  <button
                    onClick={closeDeleteModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    تأكيد الحذف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
