'use client';

import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string, role: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // محاولة تسجيل الدخول كمدير رئيسي
      const adminResponse = await fetch('/api/admin/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const adminResult = await adminResponse.json();
      
      if (adminResult.success) {
        onLoginSuccess(username, adminResult.user.role);
        return;
      }

      // محاولة تسجيل الدخول كموظف
      const employeeResponse = await fetch('/api/admin/employee-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const employeeResult = await employeeResponse.json();
      
      if (employeeResult.success) {
        onLoginSuccess(username, employeeResult.employee.role);
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      setError('حدث خطأ في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">معروضي</h1>
          <p className="text-gray-600 text-lg">لوحة التحكم الإدارية</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-600">يرجى تسجيل الدخول للوصول إلى لوحة الإدارة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                اسم المستخدم
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="أدخل اسم المستخدم"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-right text-base transition-all duration-200"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="أدخل كلمة المرور"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 text-right text-base transition-all duration-200"
                dir="rtl"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-center font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  <span>جاري تسجيل الدخول...</span>
                </div>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
