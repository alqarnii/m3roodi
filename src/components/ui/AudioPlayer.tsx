'use client';

import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  fileName?: string;
  className?: string;
}

export default function AudioPlayer({ 
  audioUrl, 
  fileName, 
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // تصحيح الروابط المحلية
  const correctUrl = (url: string) => {
    if (url.startsWith('/audio/')) {
      return url.replace('/audio/', '/uploads/audio/');
    }
    return url;
  };

  const correctedAudioUrl = correctUrl(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setError('انتهت مهلة تحميل الملف الصوتي');
        setIsLoading(false);
      }
    }, 10000);

    const handleLoadedMetadata = () => {
      clearTimeout(loadingTimeout);
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      clearTimeout(loadingTimeout);
      setError('فشل في تحميل الملف الصوتي');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      clearTimeout(loadingTimeout);
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setIsLoading(false);
      setError(null);
    };

    audio.src = correctedAudioUrl;
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // إظهار المشغل فوراً بعد تحميل الرابط
    setIsLoading(false);

    return () => {
      clearTimeout(loadingTimeout);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [correctedAudioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        setError(`فشل في تشغيل الملف: ${err.message}`);
      });
      setIsPlaying(true);
    }
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.min(duration, audio.currentTime + 5);
    audio.currentTime = newTime;
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Math.max(0, audio.currentTime - 5);
    audio.currentTime = newTime;
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackRate(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };



  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 text-center ${className}`}>
        <div className="text-red-600 mb-2">❌ {error}</div>
        <div className="text-sm text-red-500 mb-3">رابط الملف: {correctedAudioUrl}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل التسجيل الصوتي...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-lg p-6 ${className}`}>
      {/* العنوان */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🎤 مشغل التسجيل الصوتي</h3>
        {fileName && (
          <p className="text-sm text-gray-600">{fileName}</p>
        )}
      </div>

      <audio ref={audioRef} preload="metadata" className="hidden">
        <source src={correctedAudioUrl} type="audio/wav" />
        <source src={correctedAudioUrl} type="audio/webm" />
        <source src={correctedAudioUrl} type="audio/mp4" />
        <source src={correctedAudioUrl} type="audio/mpeg" />
      </audio>

      {/* أزرار التحكم الرئيسية */}
      <div className="flex justify-center items-center space-x-4 rtl:space-x-reverse mb-6">
        <button
          onClick={skipBackward}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          title="رجوع 5 ثواني"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
        </button>

        <button
          onClick={togglePlayPause}
          className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <button
          onClick={skipForward}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
          title="تقدم 5 ثواني"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
        </button>
      </div>

      {/* زر سرعة الصوت */}
      <div className="flex justify-center mt-4">
        <div className="bg-gray-100 rounded-lg p-3">
          <label className="text-sm font-medium text-gray-700 block mb-2">⚡ سرعة التشغيل</label>
          <select
            value={playbackRate}
            onChange={handleSpeedChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value={0.5}>0.5x (بطيء)</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x (عادي)</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x (سريع)</option>
          </select>
        </div>
      </div>

    </div>
  );
}