'use client';

import { useState, useRef, useEffect } from 'react';

interface UniversalAudioPlayerProps {
  audioUrl: string;
  fileName?: string;
  className?: string;
}

export default function UniversalAudioPlayer({ audioUrl, fileName, className = '' }: UniversalAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // إذا كان الرابط blob URL (تسجيل محلي)، عرض رسالة خاصة
    if (audioUrl.startsWith('blob:')) {
      setError('رابط مؤقت للتسجيل الصوتي - لا يمكن الوصول إليه من صفحة الإدارة');
      setIsLoading(false);
      return;
    }

    let loadingTimeout: NodeJS.Timeout;

    const resetTimeout = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      loadingTimeout = setTimeout(() => {
        if (isLoading) {
          console.error('انتهت مهلة تحميل الملف الصوتي:', audioUrl);
          setError('انتهت مهلة تحميل الملف الصوتي. يرجى المحاولة مرة أخرى.');
          setIsLoading(false);
        }
      }, 10000); // 10 ثواني timeout
    };

    const handleLoadedMetadata = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      console.log('تم تحميل الملف الصوتي بنجاح:', audioUrl);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      console.error('خطأ في تشغيل الملف الصوتي:', e);
      console.error('الرابط:', audioUrl);
      setError('فشل في تحميل الملف الصوتي. يرجى التحقق من الرابط.');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      console.log('الملف الصوتي جاهز للتشغيل:', audioUrl);
    };

    // تعيين الرابط
    audio.src = audioUrl;
    console.log('محاولة تحميل الرابط:', audioUrl);
    
    resetTimeout();

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, isLoading]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error('فشل في تشغيل الملف الصوتي:', err);
        setError('فشل في تشغيل الملف الصوتي');
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;
    
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = fileName || 'audio-recording';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    // إذا كان الرابط blob URL، عرض رسالة خاصة
    if (audioUrl.startsWith('blob:')) {
      return (
        <div className={`bg-orange-50 border border-orange-200 rounded-lg p-4 text-center ${className}`}>
          <div className="text-orange-600 mb-2">⚠️ رابط مؤقت للتسجيل الصوتي</div>
          <div className="text-sm text-orange-700 mb-3">
            هذا الرابط مؤقت ولا يمكن الوصول إليه من صفحة الإدارة. 
            يجب رفع الملف للخادم أولاً.
          </div>
          <div className="text-xs text-gray-500 mb-3">
            <p>الرابط الحالي: <span className="font-mono">{audioUrl}</span></p>
          </div>
          <div className="space-x-2 rtl:space-x-reverse space-y-2">
            <button
              onClick={() => window.open(audioUrl, '_blank')}
              className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors"
            >
              🔗 فتح في نافذة جديدة
            </button>
            <button
              onClick={handleDownload}
              className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200 transition-colors"
            >
              💾 تحميل
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 text-center ${className}`}>
        <div className="text-red-600 mb-2">❌ خطأ في تحميل التسجيل الصوتي</div>
        <div className="text-sm text-red-500 mb-3">{error}</div>
        <div className="text-xs text-gray-500 mb-3">
          <p>الرابط: <span className="font-mono">{audioUrl}</span></p>
        </div>
        <div className="space-x-2 rtl:space-x-reverse space-y-2">
          <button
            onClick={() => window.open(audioUrl, '_blank')}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
          >
            🔗 فتح في نافذة جديدة
          </button>
          <button
            onClick={handleDownload}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
          >
            💾 تحميل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold text-blue-900 mb-2">🎤 التسجيل الصوتي</h4>
        {fileName && (
          <p className="text-sm text-blue-700">{fileName}</p>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-blue-600">جاري تحميل الملف الصوتي...</p>
          <p className="text-xs text-gray-500 mt-1">الرابط: {audioUrl}</p>
        </div>
      )}

      <audio ref={audioRef} preload="metadata" className="hidden">
        <source src={audioUrl} type="audio/wav" />
        <source src={audioUrl} type="audio/webm" />
        <source src={audioUrl} type="audio/mp4" />
        <source src={audioUrl} type="audio/mpeg" />
        متصفحك لا يدعم تشغيل الملفات الصوتية
      </audio>

      <div className="space-y-4">
        {/* أزرار التحكم */}
        <div className="flex justify-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPlaying ? '⏸️ إيقاف مؤقت' : '▶️ تشغيل'}
          </button>
          
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            💾 تحميل
          </button>
          
          <button
            onClick={() => window.open(audioUrl, '_blank')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            🔗 فتح في نافذة جديدة
          </button>
        </div>

        {/* شريط التقدم */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="w-full bg-gray-200 rounded-full h-2 cursor-pointer hover:bg-gray-300 transition-colors"
          >
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-100"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="text-center text-sm text-gray-600">
          <p>يمكنك النقر على شريط التقدم للانتقال إلى نقطة معينة</p>
          <p className="mt-1">الرابط: <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{audioUrl}</span></p>
          {audioUrl.includes('blob.vercel-storage.com') && (
            <p className="mt-1 text-xs text-green-600">
              ✅ ملف محفوظ في Vercel Blob Storage
            </p>
          )}
        </div>
      </div>
    </div>
  );
}