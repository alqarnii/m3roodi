'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioTestPlayerProps {
  audioUrl: string;
  className?: string;
}

export default function AudioTestPlayer({ audioUrl, className = '' }: AudioTestPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [audioInfo, setAudioInfo] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
      
      // جمع معلومات الملف
      setAudioInfo({
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
        src: audio.src,
        currentSrc: audio.currentSrc,
        error: audio.error
      });
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (e: Event) => {
      console.error('خطأ في تشغيل الملف الصوتي:', e);
      const target = e.target as HTMLAudioElement;
      setError(`فشل في تحميل الملف الصوتي: ${target.error?.message || 'خطأ غير معروف'}`);
      setIsLoading(false);
      
      setAudioInfo({
        error: target.error,
        readyState: target.readyState,
        networkState: target.networkState,
        src: target.src,
        currentSrc: target.currentSrc
      });
    };

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error('فشل في تشغيل الملف الصوتي:', err);
        setError(`فشل في تشغيل الملف الصوتي: ${err.message}`);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'audio-test';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const testUrl = async () => {
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (response.ok) {
        alert(`✅ الملف متاح!\nالحجم: ${response.headers.get('content-length')} bytes\nالنوع: ${response.headers.get('content-type')}`);
      } else {
        alert(`❌ الملف غير متاح!\nالحالة: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      alert(`❌ خطأ في الوصول للملف:\n${err instanceof Error ? err.message : 'خطأ غير معروف'}`);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 ${className}`}>
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold text-purple-900 mb-2">🧪 اختبار التسجيل الصوتي</h4>
        <p className="text-sm text-purple-700">معلومات مفصلة عن الملف الصوتي</p>
      </div>

      {/* معلومات الملف */}
      <div className="bg-white rounded-lg p-3 mb-4 text-sm">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-bold">الرابط:</span></div>
          <div className="break-all">{audioUrl}</div>
          
          <div><span className="font-bold">الحالة:</span></div>
          <div>
            {isLoading ? '🔄 جاري التحميل' : 
             error ? '❌ خطأ' : 
             '✅ جاهز'}
          </div>
          
          {audioInfo && (
            <>
              <div><span className="font-bold">مدة الملف:</span></div>
              <div>{formatTime(audioInfo.duration)}</div>
              
              <div><span className="font-bold">حالة الشبكة:</span></div>
              <div>{audioInfo.networkState}</div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="text-red-600 font-bold mb-2">❌ خطأ:</div>
          <div className="text-red-700 text-sm mb-3">{error}</div>
          
          {audioInfo?.error && (
            <div className="bg-red-100 p-2 rounded text-xs">
              <div><strong>كود الخطأ:</strong> {audioInfo.error.code}</div>
              <div><strong>رسالة الخطأ:</strong> {audioInfo.error.message}</div>
            </div>
          )}
        </div>
      )}

      {/* عنصر الصوت */}
      <audio ref={audioRef} preload="metadata" className="hidden">
        <source src={audioUrl} type="audio/wav" />
        <source src={audioUrl} type="audio/webm" />
        <source src={audioUrl} type="audio/mp4" />
        <source src={audioUrl} type="audio/mpeg" />
        متصفحك لا يدعم تشغيل الملفات الصوتية
      </audio>

      {/* أزرار التحكم */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
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
          onClick={testUrl}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🔍 اختبار الرابط
        </button>
        
        <button
          onClick={() => window.open(audioUrl, '_blank')}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          🔗 فتح في نافذة جديدة
        </button>
      </div>

      {/* شريط التقدم */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-purple-600 h-3 rounded-full transition-all duration-100"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* معلومات إضافية */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
        <div className="grid grid-cols-2 gap-2">
          <div><strong>المتصفح:</strong> {navigator.userAgent.split(' ')[0]}</div>
          <div><strong>نظام التشغيل:</strong> {navigator.platform}</div>
          <div><strong>دعم Web Audio:</strong> {typeof AudioContext !== 'undefined' ? '✅' : '❌'}</div>
          <div><strong>دعم MediaRecorder:</strong> {typeof MediaRecorder !== 'undefined' ? '✅' : '❌'}</div>
        </div>
      </div>
    </div>
  );
}
