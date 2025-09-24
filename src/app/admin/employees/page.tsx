'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idNumber: string;
  position: string;
  department: string;
  role: string;
  isActive: boolean;
  hireDate: string;
  salary?: number;
  assignedRequests: number;
  username: string;
  password?: string;
  canAccessAdmin: boolean;
}

export default function EmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    managers: 0,
    averageSalary: 0
  });

  useEffect(() => {
    fetchEmployees();
  }, [filter, searchTerm, currentPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        filter: filter,
        search: searchTerm
      });

      const response = await fetch(`/api/admin/employees?${params}`);
      const result = await response.json();

      if (result.success) {
        setEmployees(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.total);
        
        // حساب الإحصائيات
        const totalEmployees = result.data.length;
        const activeEmployees = result.data.filter((emp: Employee) => emp.isActive).length;
        const managers = result.data.filter((emp: Employee) => emp.role === 'مدير').length;
        const totalSalary = result.data.reduce((sum: number, emp: Employee) => sum + (emp.salary || 0), 0);
        const averageSalary = totalEmployees > 0 ? Math.round(totalSalary / totalEmployees) : 0;
        
        setStats({
          totalEmployees,
          activeEmployees,
          managers,
          averageSalary
        });
      } else {
        console.error('فشل في جلب الموظفين:', result.message);
      }
    } catch (error) {
      console.error('خطأ في جلب الموظفين:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData: FormData) => {
    try {
      const employeeData = {
        firstName: formData.get('firstName') as string,
        lastName: '', // سيتم تعيينه لاحقاً
        email: '', // حقل اختياري
        phone: '', // حقل اختياري
        idNumber: '', // حقل اختياري
        position: '', // حقل اختياري
        department: '', // حقل اختياري
        role: 'موظف', // دور افتراضي
        salary: 0, // سيتم تعيينه لاحقاً
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        canAccessAdmin: false // لا يمكن الوصول للوحة الإدارة افتراضياً
      };

      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();
      if (result.success) {
        alert('تم إضافة الموظف بنجاح');
        setShowAddModal(false);
        fetchEmployees();
      } else {
        alert(result.message || 'فشل في إضافة الموظف');
      }
    } catch (error) {
      console.error('خطأ في إضافة الموظف:', error);
      alert('فشل في إضافة الموظف');
    }
  };

  const handleUpdateEmployee = async (formData: FormData) => {
    if (!editingEmployee) return;

    try {
      const employeeData = {
        employeeId: editingEmployee.id,
        firstName: formData.get('firstName') as string,
        lastName: editingEmployee.lastName, // الاحتفاظ بالقيمة الحالية
        email: formData.get('email') as string,
        phone: editingEmployee.phone, // الاحتفاظ بالقيمة الحالية
        position: editingEmployee.position, // الاحتفاظ بالقيمة الحالية
        department: editingEmployee.department, // الاحتفاظ بالقيمة الحالية
        role: editingEmployee.role, // الاحتفاظ بالقيمة الحالية
        salary: editingEmployee.salary, // الاحتفاظ بالقيمة الحالية
        isActive: editingEmployee.isActive,
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        canAccessAdmin: editingEmployee.canAccessAdmin // الاحتفاظ بالقيمة الحالية
      };

      const response = await fetch('/api/admin/employees', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();
      if (result.success) {
        alert('تم تحديث بيانات الموظف بنجاح');
        setEditingEmployee(null);
        setShowAddModal(false);
        fetchEmployees();
      } else {
        alert(result.message || 'فشل في تحديث الموظف');
      }
    } catch (error) {
      console.error('خطأ في تحديث الموظف:', error);
      alert('فشل في تحديث الموظف');
    }
  };

  const toggleEmployeeStatus = async (employeeId: number) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      if (!employee) return;

      const response = await fetch('/api/admin/employees', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          isActive: !employee.isActive,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          role: employee.role,
          salary: employee.salary
        }),
      });

      const result = await response.json();
      if (result.success) {
        setEmployees(prev => prev.map(emp => 
          emp.id === employeeId 
            ? { ...emp, isActive: !emp.isActive }
            : emp
        ));
        fetchEmployees(); // إعادة جلب البيانات لتحديث الإحصائيات
      } else {
        alert('فشل في تحديث حالة الموظف');
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الموظف:', error);
      alert('فشل في تحديث حالة الموظف');
    }
  };

  const deleteEmployee = async (employeeId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;

    try {
      const response = await fetch(`/api/admin/employees?id=${employeeId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        alert('تم حذف الموظف بنجاح');
        fetchEmployees();
      } else {
        alert(result.message || 'فشل في حذف الموظف');
      }
    } catch (error) {
      console.error('خطأ في حذف الموظف:', error);
      alert('فشل في حذف الموظف');
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && employee.isActive) ||
                         (filter === 'inactive' && !employee.isActive) ||
                         employee.role === filter;
    const matchesSearch = employee.firstName.includes(searchTerm) || 
                         employee.lastName.includes(searchTerm) ||
                         employee.email.includes(searchTerm) ||
                         employee.position.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'مدير': return 'bg-purple-100 text-purple-800';
      case 'موظف': return 'bg-blue-100 text-blue-800';
      case 'وكيل': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'إدارة المشاريع': return 'bg-indigo-100 text-indigo-800';
      case 'التطوير': return 'bg-blue-100 text-blue-800';
      case 'التصميم': return 'bg-pink-100 text-pink-800';
      case 'المبيعات': return 'bg-green-100 text-green-800';
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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الموظفين</h1>
              <p className="text-gray-600">عرض وإدارة جميع الموظفين ({totalCount} موظف)</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة موظف جديد
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الموظفين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="text-3xl">👥</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="البحث في الموظفين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">جميع الموظفين</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="مدير">مدير</option>
              <option value="موظف">موظف</option>
              <option value="وكيل">وكيل</option>
            </select>
          </div>
        </div>

        {/* Employees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">
                    {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => {
                      setEditingEmployee(employee);
                      setShowAddModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{employee.email}</p>
                <p className="text-gray-600 text-sm">{employee.phone}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">المنصب:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(employee.department)}`}>
                    {employee.position}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">القسم:</span>
                  <span className="text-sm text-gray-900">{employee.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الدور:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(employee.role)}`}>
                    {employee.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الراتب:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {employee.salary ? `${employee.salary} ريال` : 'غير محدد'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">تاريخ التعيين:</span>
                  <span className="text-sm text-gray-900">{employee.hireDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الطلبات المسندة:</span>
                  <span className="text-sm font-medium text-gray-900">{employee.assignedRequests}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">اسم المستخدم:</span>
                  <span className="text-sm font-medium text-gray-900">{employee.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">الوصول للإدارة:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.canAccessAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.canAccessAdmin ? 'مسموح' : 'غير مسموح'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  employee.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.isActive ? 'نشط' : 'غير نشط'}
                </span>
                <button
                  onClick={() => toggleEmployeeStatus(employee.id)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    employee.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {employee.isActive ? 'إيقاف' : 'تفعيل'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            عرض <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> إلى <span className="font-medium">
              {Math.min(currentPage * 10, totalCount)}
            </span> من <span className="font-medium">{totalCount}</span> نتيجة
          </div>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>

        {/* Add/Edit Employee Modal */}
        {showAddModal && (
          <div className="admin-modal bg-black bg-opacity-50">
            <div className="admin-modal-content bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {editingEmployee ? 'تعديل الموظف' : 'إضافة موظف جديد'}
              </h2>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingEmployee) {
                  handleUpdateEmployee(new FormData(e.currentTarget));
                } else {
                  handleAddEmployee(new FormData(e.currentTarget));
                }
              }} className="space-y-6">
                
                {/* الاسم */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-right">الاسم</label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="أدخل الاسم الكامل"
                    defaultValue={editingEmployee ? `${editingEmployee.firstName} ${editingEmployee.lastName}` : ''}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  />
                </div>
                
                {/* معلومات تسجيل الدخول */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">معلومات تسجيل الدخول</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">اسم المستخدم</label>
                      <input
                        name="username"
                        type="text"
                        placeholder="أدخل اسم المستخدم"
                        defaultValue={editingEmployee?.username || ''}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 text-right">كلمة المرور</label>
                      <input
                        name="password"
                        type="password"
                        placeholder={editingEmployee ? 'اتركها فارغة إذا لم ترد تغييرها' : 'أدخل كلمة المرور'}
                        required={!editingEmployee}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                      />
                      {editingEmployee && (
                        <p className="text-xs text-gray-500 mt-1 text-right">اتركها فارغة إذا لم ترد تغيير كلمة المرور</p>
                      )}
                    </div>
                  </div>
                </div>
                

                
                {/* الأزرار */}
                <div className="flex space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingEmployee(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {editingEmployee ? 'تحديث' : 'إضافة'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
