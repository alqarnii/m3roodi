'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('رمز التحقق مطلوب');
      router.push('/forgot-password');
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsValidToken(true);
        setEmail(data.email);
      } else {
        toast.error(data.error);
        router.push('/forgot-password');
      }
    } catch (error) {
      console.error('خطأ في التحقق من الرمز:', error);
      toast.error('حدث خطأ في الاتصال');
      router.push('/forgot-password');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('كلمة السر يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمتا السر غير متطابقتين');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success(data.message);
      } else {
        toast.error(data.error || 'حدث خطأ أثناء إعادة تعيين كلمة السر');
      }
    } catch (error) {
      console.error('خطأ في إعادة تعيين كلمة السر:', error);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحقق من الرابط...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-600">تم تغيير كلمة السر بنجاح</CardTitle>
            <CardDescription className="text-gray-600">
              تم تحديث كلمة السر الخاصة بحسابك
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-500 mb-6">
              تم إرسال تأكيد إلى بريدك الإلكتروني. يمكنك الآن تسجيل الدخول بكلمة السر الجديدة.
            </p>
            <Button
              onClick={() => router.push('/auth')}
              className="w-full"
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-gray-800">إعادة تعيين كلمة السر</CardTitle>
          <CardDescription className="text-gray-600">
            أدخل كلمة السر الجديدة لحسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                كلمة السر الجديدة
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="أدخل كلمة السر الجديدة"
                required
                className="w-full"
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                يجب أن تكون 8 أحرف على الأقل
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة السر
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة السر الجديدة"
                required
                className="w-full"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحديث...</span>
                </div>
              ) : (
                'تحديث كلمة السر'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              onClick={() => router.push('/auth')}
              variant="ghost"
              className="text-blue-600 hover:text-blue-700"
            >
              العودة إلى تسجيل الدخول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
