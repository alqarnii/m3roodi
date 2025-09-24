'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import AudioTestPlayer from '@/components/ui/AudioTestPlayer';

interface AudioFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export default function AudioTestPage() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

  useEffect(() => {
    // قائمة الملفات الصوتية المتاحة
    const files: AudioFile[] = [
      {
        name: 'تسجيل صوتي 1 (WAV)',
        url: 'https://example.blob.vercel-storage.com/recording_1755539307355.wav',
        size: 44,
        type: 'wav'
      },
      {
        name: 'تسجيل صوتي 2 (WAV)',
        url: 'https://example.blob.vercel-storage.com/recording_1755540645745.wav',
        size: 44,
        type: 'wav'
      },
      {
        name: 'تسجيل صوتي 3 (WEBM)',
        url: 'https://example.blob.vercel-storage.com/recording_1755556814987.webm',
        size: 51,
        type: 'webm'
      },
      {
        name: 'تسجيل صوتي 4 (WEBM)',
        url: 'https://example.blob.vercel-storage.com/recording_1755557383070.webm',
        size: 32,
        type: 'webm'
      }
    ];

    setAudioFiles(files);
    setLoading(false);
  }, []);

  const testAllFiles = async () => {
    const results = [];
    
    for (const file of audioFiles) {
      try {
        const response = await fetch(file.url, { method: 'HEAD' });
        results.push({
          name: file.name,
          status: response.ok ? '✅ متاح' : '❌ غير متاح',
          code: response.status,
          size: response.headers.get('content-length'),
          type: response.headers.get('content-type')
        });
      } catch (err) {
        results.push({
          name: file.name,
          status: '❌ خطأ',
          code: 'خطأ في الشبكة',
          size: 'غير معروف',
          type: 'غير معروف'
        });
      }
    }

    alert('نتائج اختبار الملفات:\n\n' + results.map(r => 
      `${r.name}: ${r.status}\nالحالة: ${r.code}\nالحجم: ${r.size}\nالنوع: ${r.type}`
    ).join('\n\n'));
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
        <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🧪 اختبار التسجيلات الصوتية</h1>
            <p className="text-purple-100 text-lg">
              اختبار وتشخيص مشاكل التسجيلات الصوتية في النظام
            </p>
            <div className="mt-4">
              <button
                onClick={testAllFiles}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
              >
                🔍 اختبار جميع الملفات
              </button>
            </div>
          </div>
        </div>

        {/* معلومات النظام */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 معلومات النظام</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">المتصفح</div>
              <div className="text-blue-900 font-bold">{navigator.userAgent.split(' ')[0]}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">نظام التشغيل</div>
              <div className="text-green-900 font-bold">{navigator.platform}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">دعم Web Audio</div>
              <div className="text-purple-900 font-bold">
                {typeof AudioContext !== 'undefined' ? '✅ متوفر' : '❌ غير متوفر'}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-orange-600 text-sm font-medium">دعم MediaRecorder</div>
              <div className="text-orange-900 font-bold">
                {typeof MediaRecorder !== 'undefined' ? '✅ متوفر' : '❌ غير متوفر'}
              </div>
            </div>
          </div>
        </div>

        {/* قائمة الملفات الصوتية */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎵 الملفات الصوتية المتاحة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {audioFiles.map((file, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedFile?.url === file.url 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setSelectedFile(file)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {file.type.includes('wav') ? '🎵' : '🎤'}
                  </div>
                  <div className="font-medium text-gray-900 mb-1">{file.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{file.size} KB</div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {file.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* اختبار الملف المحدد */}
        {selectedFile && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🧪 اختبار: {selectedFile.name}
            </h2>
            <AudioTestPlayer 
              audioUrl={selectedFile.url}
              className="w-full"
            />
          </div>
        )}

        {/* تعليمات الاستخدام */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">📖 تعليمات الاستخدام</h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-blue-600 font-bold">1.</span>
              <span>اختر ملف صوتي من القائمة أعلاه لاختباره</span>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-blue-600 font-bold">2.</span>
              <span>استخدم أزرار التشغيل والتحكم لاختبار الملف</span>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-blue-600 font-bold">3.</span>
              <span>اضغط على "اختبار الرابط" لفحص إمكانية الوصول للملف</span>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-blue-600 font-bold">4.</span>
              <span>استخدم "اختبار جميع الملفات" لفحص حالة جميع التسجيلات</span>
            </div>
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <span className="text-blue-600 font-bold">5.</span>
              <span>إذا واجهت مشاكل، تحقق من معلومات الخطأ المعروضة</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
