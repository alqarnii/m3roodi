

'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('تم استعادة الاتصال بالإنترنت');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('انقطع الاتصال بالإنترنت');
    };

    // مراقبة حالة الاتصال
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // فحص سرعة الاتصال
    const checkConnectionSpeed = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('/api/health', { 
          method: 'HEAD',
          cache: 'no-cache'
        });
        const endTime = performance.now();
        
        const responseTime = endTime - startTime;
        setIsSlow(responseTime > 3000); // بطيء إذا كان أكثر من 3 ثواني
        
        if (responseTime > 5000) {
          toast('الاتصال بطيء، قد تستغرق الصفحات وقتاً أطول للتحميل', {
            icon: '⚠️',
            style: {
              background: '#f59e0b',
              color: '#fff',
            },
          });
        }
      } catch (error) {
        console.warn('لا يمكن فحص سرعة الاتصال:', error);
      }
    };

    // فحص كل 30 ثانية
    const interval = setInterval(checkConnectionSpeed, 30000);
    checkConnectionSpeed(); // فحص أولي

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // لا نعرض أي شيء إذا كان كل شيء على ما يرام
  if (isOnline && !isSlow) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>غير متصل بالإنترنت</span>
        </div>
      )}
      
      {isSlow && isOnline && (
        <div className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>اتصال بطيء</span>
        </div>
      )}
    </div>
  );
}
