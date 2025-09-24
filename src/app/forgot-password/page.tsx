'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: new password, 4: success
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
        toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      } else {
        toast.error(data.error || 'حدث خطأ أثناء إرسال الطلب');
      }
    } catch (error) {
      console.error('خطأ في إرسال طلب إعادة تعيين كلمة السر:', error);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('يرجى إدخال رمز التحقق');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
        toast.success('تم التحقق من الرمز بنجاح!');
      } else {
        toast.error(data.error || 'رمز التحقق غير صحيح');
      }
    } catch (error) {
      console.error('خطأ في التحقق من الرمز:', error);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('يرجى إدخال كلمة المرور الجديدة وتأكيدها');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: verificationCode, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(4);
        toast.success('تم تغيير كلمة المرور بنجاح!');
      } else {
        toast.error(data.error || 'حدث خطأ أثناء تغيير كلمة المرور');
      }
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      toast.error('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setStep(1);
  };

  // إيقاف loading state بعد تحميل الصفحة
  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  // إظهار loading state أثناء تحميل الصفحة
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <CardTitle className="text-2xl text-blue-600">جاري التحميل...</CardTitle>
            <CardDescription className="text-gray-600">
              يرجى الانتظار
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
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
            <CardTitle className="text-2xl text-green-600">تم تغيير كلمة المرور بنجاح</CardTitle>
            <CardDescription className="text-gray-600">
              يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/auth')}
                className="w-full"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={resetForm}
                className="w-full"
                variant="outline"
              >
                طلب جديد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: New Password Form
  if (step === 3) {
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
            <CardTitle className="text-2xl text-gray-800">إدخال كلمة المرور الجديدة</CardTitle>
            <CardDescription className="text-gray-600">
              أدخل كلمة المرور الجديدة لحسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  required
                  className="w-full"
                  dir="ltr"
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  required
                  className="w-full"
                  dir="ltr"
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
                  'تغيير كلمة المرور'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => setStep(2)}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700"
              >
                العودة إلى رمز التحقق
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 2: Verification Code Form
  if (step === 2) {
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-gray-800">إدخال رمز التحقق</CardTitle>
            <CardDescription className="text-gray-600">
              تم إرسال رمز التحقق إلى {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز التحقق
                </label>
                <Input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="أدخل رمز التحقق المكون من 6 أرقام"
                  required
                  className="w-full text-center text-lg tracking-widest"
                  dir="ltr"
                  maxLength={6}
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
                    <span>جاري التحقق...</span>
                  </div>
                ) : (
                  'التحقق من الرمز'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700"
              >
                تغيير البريد الإلكتروني
              </Button>
              <Button
                onClick={handleEmailSubmit}
                variant="outline"
                className="w-full"
              >
                إعادة إرسال الرمز
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Email Form
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
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl text-gray-800">نسيت كلمة المرور؟</CardTitle>
          <CardDescription className="text-gray-600">
            أدخل بريدك الإلكتروني وسنرسل لك رمز تحقق لإعادة تعيين كلمة المرور
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                required
                className="w-full"
                dir="ltr"
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
                  <span>جاري الإرسال...</span>
                </div>
              ) : (
                'إرسال رمز التحقق'
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
