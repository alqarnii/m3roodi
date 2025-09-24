'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPriceByPurpose } from '@/lib/pricing';
import { Square, Trash2, Clock, Upload, CheckCircle } from 'lucide-react';

export default function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState({
    purpose: '',
    recipient: '',
    description: '',
    applicantName: '',
    phone: '',
    email: '',
    idNumber: '',
    attachments: '',
    voiceRecording: ''
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const purposeOptions = [
    'طلب مساعدة مالية',
    'طلب سداد دين',
    'طلب نقل',
    'طلب تجنيس',
    'طلب علاج',
    'طلب استرحام',
    'طلب زواج من اجنبية',
    'طلب وظيفة',
    'شكوى أو تظلم',
    'كتابة معروض للديوان الملكي',
    'كتابة مشهد',
    'طلب منحة أرض',
    'معروض خاص',
    'معروض اخر'
  ];

  // إيقاف loading state بعد تحميل الصفحة
  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  // Prefill purpose from URL if provided
  useEffect(() => {
    const p = searchParams.get('purpose');
    if (p) {
      setFormData(prev => ({ ...prev, purpose: p }));
    }
  }, [searchParams]);

  // Handle requestId from URL (when coming back from payment page)
  useEffect(() => {
    const requestId = searchParams.get('requestId');
    if (requestId) {
      // If there's a requestId, try to load data from localStorage first
      const savedRequest = localStorage.getItem('pendingRequest');
      if (savedRequest) {
        try {
          const requestData = JSON.parse(savedRequest);
          if (requestData.requestId === requestId) {
            setFormData({
              purpose: requestData.purpose || '',
              recipient: requestData.recipient || '',
              description: requestData.description || '',
              applicantName: requestData.applicantName || requestData.name || '',
              phone: requestData.phone || '',
              email: requestData.email || '',
              idNumber: requestData.idNumber || '',
              attachments: requestData.attachments || '',
              voiceRecording: requestData.voiceRecording || ''
            });
            
            if (requestData.voiceRecording) {
              setAudioURL(requestData.voiceRecording);
            }
          }
        } catch (error) {
          console.error('Error loading request data:', error);
        }
      }
    }
  }, [searchParams]);

  // Load data from localStorage when coming back from payment page
  useEffect(() => {
    const savedRequest = localStorage.getItem('pendingRequest');
    if (savedRequest) {
      try {
        const requestData = JSON.parse(savedRequest);
        console.log('Loading saved request data:', requestData);
        
        setFormData({
          purpose: requestData.purpose || '',
          recipient: requestData.recipient || '',
          description: requestData.description || '',
          applicantName: requestData.applicantName || requestData.name || '',
          phone: requestData.phone || '',
          email: requestData.email || '',
          idNumber: requestData.idNumber || '',
          attachments: requestData.attachments || '',
          voiceRecording: requestData.voiceRecording || ''
        });
        
        // Set audio URL if there's a voice recording
        if (requestData.voiceRecording) {
          setAudioURL(requestData.voiceRecording);
        }
        
        console.log('Form data loaded successfully');
      } catch (error) {
        console.error('Error loading saved request:', error);
      }
    }
  }, []);

  // Handle error parameter from URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  // دالة لحساب السعر حسب الهدف المختار
  const getSelectedPurposePrice = () => {
    if (!formData.purpose) return null;
    
    const price = getPriceByPurpose(formData.purpose);
    
    return { price };
  };

  // بدء التسجيل الصوتي
  const startRecording = async () => {
    try {
      // التحقق من دعم MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح لا يدعم التسجيل الصوتي. يرجى استخدام متصفح حديث مثل Chrome أو Firefox أو Safari.');
      }

      // التحقق من دعم MediaRecorder
      if (typeof MediaRecorder === 'undefined') {
        throw new Error('المتصفح لا يدعم MediaRecorder. يرجى استخدام متصفح حديث.');
      }
      
      // التحقق من دعم getUserMedia
      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('المتصفح لا يدعم الوصول للميكروفون. يرجى استخدام متصفح حديث.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { 
            type: mediaRecorder.mimeType || 'audio/webm' 
          });
          
          console.log('تم إنشاء blob صوتي:', {
            size: audioBlob.size,
            type: audioBlob.type,
            chunksCount: audioChunksRef.current.length
          });
          
          // رفع التسجيل للخادم
          setIsUploading(true);
          const uploadedUrl = await uploadAudioToServer(audioBlob);
          
          if (uploadedUrl) {
            setAudioURL(uploadedUrl);
            setFormData(prev => ({ ...prev, voiceRecording: uploadedUrl }));
            toast.success('تم حفظ التسجيل الصوتي بنجاح!');
          } else {
            // فشل في رفع الملف - لا يمكن حفظ الطلب بدون رفع الملف
            console.error('فشل في رفع الملف للخادم');
            toast.error('فشل في رفع التسجيل الصوتي للخادم. يرجى المحاولة مرة أخرى.');
            setAudioURL(null);
            setFormData(prev => ({ ...prev, voiceRecording: '' }));
          }
        } catch (err) {
          console.error('فشل في معالجة التسجيل:', err);
          
          // فشل في معالجة التسجيل - لا يمكن حفظ الطلب
          console.error('فشل في معالجة التسجيل الصوتي');
          toast.error('فشل في معالجة التسجيل الصوتي. يرجى المحاولة مرة أخرى.');
          setAudioURL(null);
          setFormData(prev => ({ ...prev, voiceRecording: '' }));
        } finally {
          setIsUploading(false);
          // تنظيف المسار الصوتي
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorder.start(1000); // تسجيل كل ثانية
      setIsRecording(true);
      setRecordingTime(0);
      
      // بدء عداد الوقت
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('بدأ التسجيل الصوتي! تحدث الآن');
    } catch (error) {
      console.error('خطأ في التسجيل الصوتي:', error);
      
      // تنظيف أي موارد مفتوحة
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          toast.error('تم رفض الوصول للميكروفون. يرجى السماح بالوصول وإعادة المحاولة.');
        } else if (error.name === 'NotFoundError') {
          toast.error('لم يتم العثور على ميكروفون. تأكد من توصيل الميكروفون.');
        } else if (error.name === 'NotReadableError') {
          toast.error('الميكروفون مشغول من قبل تطبيق آخر. أغلق التطبيقات الأخرى وحاول مرة أخرى.');
        } else {
          toast.error(`فشل في التسجيل الصوتي: ${error.message}`);
        }
      } else {
        toast.error('فشل في الوصول للميكروفون. تأكد من السماح بالوصول للميكروفون.');
      }
    }
  };

  // إيقاف التسجيل الصوتي
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      toast.success('تم إيقاف التسجيل الصوتي!');
    }
  };

  // رفع التسجيل الصوتي للخادم
  const uploadAudioToServer = async (audioBlob: Blob): Promise<string | null> => {
    try {
      console.log('بدء رفع التسجيل الصوتي:', {
        blobSize: audioBlob.size,
        blobType: audioBlob.type
      });
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      console.log('إرسال طلب رفع الملف...');
      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });
      
      console.log('استجابة الخادم:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('خطأ في الاستجابة:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('نتيجة الرفع:', result);
      
      if (result.success) {
        return result.audioUrl;
      } else {
        throw new Error(result.message || 'فشل في رفع الملف');
      }
    } catch (error) {
      console.error('خطأ في رفع التسجيل الصوتي:', error);
      toast.error('فشل في رفع التسجيل الصوتي للخادم');
      return null;
    }
  };

  // حذف التسجيل الصوتي
  const deleteRecording = () => {
    if (audioURL) {
      // إلغاء رابط blob فقط عند الضرورة
      if (audioURL.startsWith('blob:')) {
        URL.revokeObjectURL(audioURL);
      }
      setAudioURL(null);
      setFormData(prev => ({ ...prev, voiceRecording: '' }));
      setRecordingTime(0);
      toast.success('تم حذف التسجيل الصوتي');
    }
  };

  // No authentication required - users can access directly

  // تنظيف عند إغلاق المكون
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (audioURL && audioURL.startsWith('blob:')) {
        URL.revokeObjectURL(audioURL);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioURL]);

  // تنسيق الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!formData.purpose) {
      toast.error('يرجى اختيار الهدف من الخطاب');
      return;
    }
    
    if (!formData.recipient) {
      toast.error('يرجى كتابة المسؤول المراد تقديم المعروض عليه');
      return;
    }
    
    if (!formData.applicantName) {
      toast.error('يرجى كتابة اسم مقدم الطلب');
      return;
    }
    
    if (!formData.phone) {
      toast.error('يرجى كتابة رقم الجوال');
      return;
    }
    
    if (!formData.email) {
      toast.error('يرجى كتابة البريد الإلكتروني');
      return;
    }
    
    // التحقق من وجود وصف أو تسجيل صوتي
    if (!formData.description && !formData.voiceRecording) {
      toast.error('يرجى كتابة نبذة عن المعروض أو تسجيل صوتي');
      return;
    }

    // التحقق من أن التسجيل الصوتي ليس blob URL
    if (formData.voiceRecording && formData.voiceRecording.startsWith('blob:')) {
      toast.error('التسجيل الصوتي لم يتم رفعه للخادم بعد. يرجى الانتظار حتى يكتمل الرفع أو إعادة التسجيل.');
      return;
    }

    try {
      // إنشاء رقم طلب مؤقت
      const tempRequestId = 'TEMP_' + Date.now().toString().slice(-8);
      
      // حفظ البيانات في localStorage للاستخدام في صفحة الدفع
      const requestData: any = {
        name: formData.applicantName,
        email: formData.email,
        purpose: formData.purpose,
        recipient: formData.recipient,
        description: formData.description,
        applicantName: formData.applicantName,
        phone: formData.phone,
        idNumber: formData.idNumber,
        attachments: formData.attachments,
        voiceRecording: formData.voiceRecording || null,
        tempRequestId: tempRequestId,
        timestamp: Date.now() // إضافة timestamp للتحقق من الصلاحية
      };
      
      // حفظ الطلب في قاعدة البيانات أولاً (بدون دفع)
      const saveResponse = await fetch('/api/submit-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...requestData,
          saveWithoutPayment: true // علامة لحفظ الطلب بدون دفع
        }),
      });

      const saveResult = await saveResponse.json();
      
      if (saveResult.success) {
        // إضافة معرف الطلب للبيانات
        requestData.requestId = saveResult.requestId;
        localStorage.setItem('pendingRequest', JSON.stringify(requestData));
        
        // تم حفظ الطلب بنجاح
        
        // توجيه المستخدم لصفحة الدفع
        router.push(`/request-form/payment?requestId=${saveResult.requestId}`);
      } else {
        throw new Error(saveResult.message || 'فشل في حفظ الطلب');
      }
      
    } catch (error) {
      toast.error('حدث خطأ في معالجة الطلب. حاول مرة أخرى.');
    }
  };

  // إظهار loading state أثناء تحميل الصفحة
  if (isPageLoading) {
    return (
      <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="bg-blue-50 rounded-2xl shadow-2xl p-4 sm:p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                جاري التحميل...
              </h2>
              <p className="text-gray-600">
                يرجى الانتظار
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
            نموذج طلب معروض
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* الهدف من الخطاب */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 text-right">
                  الهدف من الخطاب *
                </label>
                <Select
                  name="purpose"
                  value={formData.purpose}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}
                  required
                >
                  <SelectTrigger className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200 h-auto text-right">
                    <SelectValue placeholder="اختر الهدف من الخطاب" />
                  </SelectTrigger>
                  <SelectContent 
                    className="text-right" 
                    side="bottom" 
                    align="start"
                    sideOffset={4}
                    avoidCollisions={false}
                    position="popper"
                  >
                    {purposeOptions.map((option, index) => (
                      <SelectItem key={index} value={option} className="text-right">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                

              </div>

              {/* المسؤول المراد تقديم المعروض عليه */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  المسؤول المراد تقديم المعروض عليه *
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="مثال: الديوان الملكي، وزارة الصحة، إدارة التعليم..."
                />
              </div>

              {/* نبذة عن المعروض */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  نبذة عن المعروض *
                </label>
                <div className="mb-3 p-3 sm:p-4 bg-blue-50 rounded-lg border-r-4 border-blue-500">
                  <p className="text-blue-800 text-xs sm:text-sm">
                    <strong>توضيح:</strong> اعطنا نبذة بسيطة عن موضوعك (رؤوس أقلام لا تفكر في الصيغة فقط اكتب لنا ما تريده بشكل عفوي ونحن سوف نصيغة بأفضل صيغة) واذا لم تكن قادر على الكتابة اضغط زر التسجيل وسجل النبذة بصوتك.
                  </p>
                </div>
                
                {/* خيار الكتابة */}
                <div className="mb-4">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                    placeholder="اكتب نبذة عن معروضك هنا..."
                  />
                  
                  {/* زر التسجيل الصوتي تحت يسار حقل الكتابة */}
                  <div className="mt-3 flex justify-start">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      {!isRecording && !audioURL && (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={startRecording}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-xs"
                          >
                            تسجيل صوتي 🔴
                          </button>
                          <span className="text-green-600 text-sm font-medium">
                            واذا كانت النبذة طويلة عليك في الكتابة يمكنك تسجلها بصوتك. بالضغط على زر التسجيل.
                          </span>
                        </div>
                      )}
                      
                      {isRecording && (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-xs"
                        >
                          <Square className="w-3 h-3" />
                          <span>إيقاف التسجيل</span>
                        </button>
                      )}
                      
                      {audioURL && !isRecording && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={startRecording}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full mr-1"></span>
                            تسجيل جديد 🔴
                          </button>
                          <button
                            type="button"
                            onClick={deleteRecording}
                            className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* عرض حالة التسجيل */}
                  {isRecording && (
                    <div className="mt-3 text-center p-3 bg-red-100 rounded-lg">
                      <div className="text-red-800 text-lg font-semibold mb-2">
                        <Clock className="w-4 h-4" /> {formatTime(recordingTime)}
                      </div>
                      <p className="text-red-700 text-sm">جاري التسجيل... تحدث الآن!</p>
                      <div className="mt-2 w-4 h-4 bg-red-600 rounded-full animate-pulse mx-auto"></div>
                    </div>
                  )}

                  {/* عرض حالة الرفع */}
                  {isUploading && (
                    <div className="mt-3 text-center p-3 bg-blue-100 rounded-lg">
                      <div className="text-blue-800 text-lg font-semibold mb-2">
                        <Upload className="w-4 h-4" /> جاري رفع التسجيل...
                      </div>
                      <p className="text-blue-700 text-sm">يرجى الانتظار...</p>
                      <div className="mt-2 w-4 h-4 bg-blue-600 rounded-full animate-pulse mx-auto"></div>
                    </div>
                  )}


                  
                  {/* عرض التسجيل المسجل */}
                  {audioURL && !isRecording && !isUploading && (
                    <div className="mt-3 text-center p-3 bg-green-100 rounded-lg">
                      <h5 className="text-green-800 font-semibold mb-2 text-sm flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        تم التسجيل بنجاح!
                      </h5>
                      <audio controls className="w-full max-w-md mx-auto mb-2">
                        <source src={audioURL} type="audio/webm" />
                        <source src={audioURL} type="audio/mp4" />
                        <source src={audioURL} type="audio/wav" />
                        متصفحك لا يدعم تشغيل الملفات الصوتية
                      </audio>
                    </div>
                  )}
                </div>
                
              </div>

              {/* اسم مقدم المعروض */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  اسم مقدم المعروض *
                </label>
                <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <strong>توضيح:</strong> سجل اسمك او اسم مقدم الطلب
                  </p>
                </div>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="اسم مقدم الطلب"
                />
              </div>

              {/* رقم الجوال */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  رقم الجوال *
                </label>
                <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <strong>توضيح:</strong> رقم الجوال المراد وضعه في الخطاب
                  </p>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="05xxxxxxxx"
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="example@email.com"
                />
              </div>

              {/* رقم الهوية */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  رقم الهوية
                </label>
                <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <strong>توضيح:</strong> رقم الهوية المراد وضعها في الخطاب (اختياري)
                  </p>
                </div>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="xxxxxxxxxxxxxxx"
                />
              </div>

              {/* المرفقات */}
              <div>
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                  المرفقات
                </label>
                <div className="mb-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm">
                    <strong>توضيح:</strong> هل ستضع مرفقات مع الخطاب؟ اذا نعم اذكر اسمائها هنا ليتم الإشارة لها (اختياري)
                  </p>
                </div>
                <textarea
                  name="attachments"
                  value={formData.attachments}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg text-gray-900 bg-white transition-all duration-200"
                  placeholder="اسماء المرفقات فقط"
                />
              </div>



              {/* زر اتمام الطلب */}
              <div className="text-center pt-4 sm:pt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg font-semibold text-lg sm:text-xl transition-colors shadow-lg w-full sm:w-auto"
                >
                  اتمام الطلب و الدفع
                </button>
              </div>
            </form>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontFamily: 'Tajawal, sans-serif',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
