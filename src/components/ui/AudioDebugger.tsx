'use client';

import { useState, useEffect } from 'react';

interface AudioDebuggerProps {
  audioUrl: string;
  fileName?: string;
  className?: string;
}

export default function AudioDebugger({ audioUrl, fileName, className = '' }: AudioDebuggerProps) {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analyzeAudioUrl = async () => {
      const info: any = {
        originalUrl: audioUrl,
        urlType: 'unknown',
        isBlob: false,
        isLocal: false,
        isExternal: false,
        canAccess: false,
        suggestions: []
      };

      // تحديد نوع الرابط
      if (audioUrl.startsWith('blob:')) {
        info.urlType = 'blob';
        info.isBlob = true;
        info.canAccess = false;
        info.suggestions.push('هذا رابط مؤقت لا يمكن الوصول إليه من صفحة الإدارة');
        info.suggestions.push('يجب رفع الملف للخادم أولاً');
        info.suggestions.push('يمكن الوصول إليه فقط من الجلسة الحالية للمتصفح');
      } else if (audioUrl.startsWith('/uploads/audio/')) {
        info.status = 'warning';
        info.message = 'رابط محلي قديم - قد لا يعمل في الإنتاج';
        info.suggestions.push('يجب استخدام Vercel Blob Storage للحفظ الدائم');
        info.suggestions.push('الملفات المحلية تختفي بعد كل تحديث');
      } else if (audioUrl.includes('blob.vercel-storage.com')) {
        info.status = 'success';
        info.message = 'رابط Vercel Blob Storage - ممتاز!';
        info.suggestions.push('هذا الرابط دائم ولا يختفي');
        info.suggestions.push('الملف محفوظ في Vercel بشكل آمن');
      } else if (audioUrl.startsWith('/audio/')) {
        info.urlType = 'incorrect_local';
        info.isLocal = true;
        info.canAccess = false;
        info.suggestions.push('هذا رابط محلي غير صحيح');
        info.suggestions.push('يجب أن يكون /uploads/audio/ بدلاً من /audio/');
        info.suggestions.push('يمكن تصحيحه تلقائياً');
      } else if (audioUrl.startsWith('http')) {
        info.urlType = 'external';
        info.isExternal = true;
        info.canAccess = true;
        info.suggestions.push('هذا رابط خارجي');
        info.suggestions.push('يعتمد الوصول على صلاحيات الموقع');
      } else {
        info.urlType = 'unknown';
        info.canAccess = false;
        info.suggestions.push('نوع الرابط غير معروف');
        info.suggestions.push('يجب التأكد من صحة الرابط');
      }

      // اختبار الوصول للملف
      if (!info.isBlob && info.urlType !== 'unknown') {
        try {
          const response = await fetch(audioUrl, { method: 'HEAD' });
          info.httpStatus = response.status;
          info.httpOk = response.ok;
          info.canAccess = response.ok;
          
          if (!response.ok) {
            info.suggestions.push(`الملف غير متوفر (HTTP ${response.status})`);
          }
        } catch (error) {
          info.httpError = error instanceof Error ? error.message : 'خطأ غير معروف';
          info.canAccess = false;
          info.suggestions.push('فشل في الوصول للملف');
        }
      }

      setDebugInfo(info);
      setIsLoading(false);
    };

    analyzeAudioUrl();
  }, [audioUrl]);

  if (isLoading) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 text-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">جاري تحليل الرابط...</p>
      </div>
    );
  }

  const correctedUrl = audioUrl.replace('/audio/', '/uploads/audio/');
  
  // إضافة اقتراح لـ Vercel Blob Storage
  const blobStorageSuggestion = 'استخدم Vercel Blob Storage للحفظ الدائم';
  
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">🔍 تشخيص التسجيل الصوتي</h4>
      
      {/* معلومات الرابط */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">الرابط الأصلي:</span>
          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
            {debugInfo.originalUrl}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">نوع الرابط:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            debugInfo.urlType === 'local' ? 'bg-green-100 text-green-800' :
            debugInfo.urlType === 'blob' ? 'bg-orange-100 text-orange-800' :
            debugInfo.urlType === 'incorrect_local' ? 'bg-yellow-100 text-yellow-800' :
            debugInfo.urlType === 'external' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {debugInfo.urlType === 'blob' ? 'رابط مؤقت (Blob)' :
             debugInfo.urlType === 'local' ? 'رابط محلي صحيح' :
             debugInfo.urlType === 'incorrect_local' ? 'رابط محلي غير صحيح' :
             debugInfo.urlType === 'external' ? 'رابط خارجي' :
             'غير معروف'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">يمكن الوصول:</span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            debugInfo.canAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {debugInfo.canAccess ? 'نعم' : 'لا'}
          </span>
        </div>
        
        {debugInfo.httpStatus && (
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">حالة HTTP:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              debugInfo.httpOk ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {debugInfo.httpStatus}
            </span>
          </div>
        )}
      </div>
      
      {/* الاقتراحات */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-r-4 border-blue-400">
        <h5 className="font-semibold text-blue-800 mb-2">💡 الاقتراحات:</h5>
        <ul className="text-sm text-blue-700 space-y-1">
          {debugInfo.suggestions?.map((suggestion: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="mr-2">•</span>
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* الإجراءات */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {!debugInfo.isBlob && (
          <button
            onClick={() => window.open(audioUrl, '_blank')}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
          >
            🔗 فتح الرابط
          </button>
        )}
        
        {debugInfo.isBlob && (
          <button
            onClick={() => window.open(audioUrl, '_blank')}
            className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors"
          >
            🔗 فتح في الجلسة الحالية
          </button>
        )}
        
        {debugInfo.urlType === 'incorrect_local' && (
          <button
            onClick={() => {
              const correctedUrl = audioUrl.replace('/audio/', '/uploads/audio/');
              window.open(correctedUrl, '_blank');
            }}
            className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
          >
            🔧 فتح الرابط المصحح
          </button>
        )}
      </div>
    </div>
  );
}
