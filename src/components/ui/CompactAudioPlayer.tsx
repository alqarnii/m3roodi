'use client';

import { useState, useRef, useEffect } from 'react';

interface CompactAudioPlayerProps {
  audioUrl: string;
  fileName?: string;
  className?: string;
}

export default function CompactAudioPlayer({ audioUrl, fileName, className = '' }: CompactAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
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

    const handleError = (e: Event) => {
      console.error('خطأ في تشغيل الملف الصوتي:', e);
      setError('فشل في تحميل الملف الصوتي');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
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
        setError('فشل في تشغيل الملف الصوتي');
      });
      setIsPlaying(true);
    }
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
    return (
      <div className={`bg-red-50 border border-red-200 rounded p-2 text-center ${className}`}>
        <div className="text-red-600 text-xs mb-1">❌ خطأ</div>
        <div className="space-x-1 rtl:space-x-reverse">
          <button
            onClick={() => window.open(audioUrl, '_blank')}
            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
          >
            🔗
          </button>
          <button
            onClick={handleDownload}
            className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
          >
            💾
          </button>
        </div>
      </div>
    );
  }

  if (showFullPlayer) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded p-2 ${className}`}>
        <div className="text-center mb-2">
          <button
            onClick={() => setShowFullPlayer(false)}
            className="text-blue-600 hover:text-blue-800 text-xs mb-1"
          >
            ✕ إغلاق
          </button>
        </div>
        
        <audio ref={audioRef} preload="metadata" className="hidden">
          <source src={audioUrl} type="audio/wav" />
          <source src={audioUrl} type="audio/webm" />
          <source src={audioUrl} type="audio/mp4" />
          <source src={audioUrl} type="audio/mpeg" />
        </audio>

        <div className="space-y-2">
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
            >
              💾
            </button>
          </div>

          <div className="text-xs text-gray-600 text-center">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded p-2 text-center ${className}`}>
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-1"></div>
      ) : (
        <div className="space-y-1">
          <button
            onClick={togglePlayPause}
            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <div className="text-xs text-gray-600">
            {formatTime(duration)}
          </div>
          
          <button
            onClick={() => setShowFullPlayer(true)}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            🔍
          </button>
        </div>
      )}
    </div>
  );
}
