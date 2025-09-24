'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { Search, BarChart3, Send, FileText, Edit, Trash2, CheckCircle, AlertCircle, DollarSign, Building2, CreditCard, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface Request {
  id: number;
  applicantName: string;
  purpose: string;
  recipient: string;
  description: string;
  status: string;
  priority: string;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  couponCode?: string;
  createdAt: string;
  assignedTo?: string;
  deliveryDate?: string;
  user?: {
    name: string;
    email: string;
    phone: string;
  };
  totalPaid: number;
  paymentStatus: string;
  paymentMethod?: string;
  phone: string;
  idNumber?: string;
  attachments?: string;
  voiceRecordingUrl?: string;
}

export default function OrdersManagement() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [serviceType, setServiceType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Request>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // دالة لتحويل التاريخ إلى العربية
  const formatArabicDate = (dateString: string) => {
    const date = new Date(dateString);
    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const day = date.getDate();
    const month = arabicMonths[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour % 12 || 12;
    
    return `${day} ${month} ${year} - ${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  // إحصائيات إضافية
  const [stats, setStats] = useState({
    pendingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    blobUrlCount: 0,
    sendProposalCount: 0,
    readyTemplateCount: 0,
    customRequestCount: 0
  });

  useEffect(() => {
    fetchRequests();
  }, [filter, serviceType, searchTerm, currentPage]);

  // حساب الإحصائيات عند تغيير الطلبات
  useEffect(() => {
            if (requests.length > 0) {
          setStats({
            pendingCount: requests.filter(r => r.status === 'PENDING').length,
            inProgressCount: requests.filter(r => r.status === 'IN_PROGRESS').length,
            completedCount: requests.filter(r => r.status === 'COMPLETED').length,
            blobUrlCount: requests.filter(r => r.voiceRecordingUrl?.startsWith('blob:')).length,
            sendProposalCount: requests.filter(r => r.purpose === 'إرسال معروض حكومي').length,
            readyTemplateCount: requests.filter(r => r.purpose.includes('صيغة جاهزة')).length,
            customRequestCount: requests.filter(r => r.purpose !== 'إرسال معروض حكومي' && !r.purpose.includes('صيغة جاهزة')).length
          });
        } else {
              // إعادة تعيين الإحصائيات عند عدم وجود طلبات
        setStats({
          pendingCount: 0,
          inProgressCount: 0,
          completedCount: 0,
          blobUrlCount: 0,
          sendProposalCount: 0,
          readyTemplateCount: 0,
          customRequestCount: 0
        });
    }
  }, [requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: filter,
        search: searchTerm
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      const result = await response.json();

      if (result.success) {
        setRequests(result.data);
        setTotalPages(result.pagination.totalPages);
        setTotalCount(result.pagination.total);
        
        // حساب الإحصائيات مباشرة
        if (result.data.length > 0) {
          setStats({
            pendingCount: result.data.filter((r: Request) => r.status === 'PENDING').length,
            inProgressCount: result.data.filter((r: Request) => r.status === 'IN_PROGRESS').length,
            completedCount: result.data.filter((r: Request) => r.status === 'COMPLETED').length,
            blobUrlCount: result.data.filter((r: Request) => r.voiceRecordingUrl?.startsWith('blob:')).length,
            sendProposalCount: result.data.filter((r: Request) => r.purpose === 'إرسال معروض حكومي').length,
            readyTemplateCount: result.data.filter((r: Request) => r.purpose.includes('صيغة جاهزة')).length,
            customRequestCount: result.data.filter((r: Request) => r.purpose !== 'إرسال معروض حكومي' && !r.purpose.includes('صيغة جاهزة')).length
          });
        }
      } else {
        console.error('فشل في جلب الطلبات:', result.message);
        // إعادة تعيين الإحصائيات في حالة الفشل
        setStats({
          pendingCount: 0,
          inProgressCount: 0,
          completedCount: 0,
          blobUrlCount: 0,
          sendProposalCount: 0,
          readyTemplateCount: 0,
          customRequestCount: 0
        });
      }
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
              // إعادة تعيين الإحصائيات في حالة الخطأ
        setStats({
          pendingCount: 0,
          inProgressCount: 0,
          completedCount: 0,
          blobUrlCount: 0,
          sendProposalCount: 0,
          readyTemplateCount: 0,
          customRequestCount: 0
        });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        // تتبع إجراء الإدارة
        // تم تحديث حالة الطلب
        
        // تحديث الحالة في القائمة المحلية
        setRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus }
            : request
        ));
        
        // تحديث الإحصائيات
        setStats(prev => ({
          ...prev,
          pendingCount: prev.pendingCount + (newStatus === 'PENDING' ? 1 : 0) - (prev.pendingCount > 0 ? 1 : 0),
          inProgressCount: prev.inProgressCount + (newStatus === 'IN_PROGRESS' ? 1 : 0) - (prev.inProgressCount > 0 ? 1 : 0),
          completedCount: prev.completedCount + (newStatus === 'COMPLETED' ? 1 : 0) - (prev.completedCount > 0 ? 1 : 0)
        }));
      } else {
        alert('فشل في تحديث حالة الطلب');
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error);
      alert('فشل في تحديث حالة الطلب');
    }
  };

  const handleViewRequest = (request: Request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const closeModal = () => {
    // إيقاف أي تسجيل صوتي قيد التشغيل عند إغلاق النافذة
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsPlaying(false);
    }
    setShowModal(false);
    setSelectedRequest(null);
  };

  const openEditModal = (request: Request) => {
    setEditForm({
      applicantName: request.applicantName,
      phone: request.phone,
      idNumber: request.idNumber,
      purpose: request.purpose,
      recipient: request.recipient,
      description: request.description,
      priority: request.priority,
      price: request.price
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({});
  };

  // وظائف التحكم في التسجيل الصوتي
  const playAudio = (audioUrl: string) => {
    // إيقاف أي تسجيل صوتي قيد التشغيل
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio);
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    audio.onerror = (error) => {
      console.error('فشل في تشغيل الملف الصوتي:', error);
      alert('فشل في تشغيل الملف الصوتي');
      setIsPlaying(false);
      setCurrentAudio(null);
    };

    audio.play().catch(err => {
      console.error('فشل في تشغيل الملف الصوتي:', err);
      alert('فشل في تشغيل الملف الصوتي');
      setIsPlaying(false);
      setCurrentAudio(null);
    });
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  // وظيفة تحديث حالة الدفع
  const markAsPaid = async (requestId: number) => {
    if (!confirm('هل أنت متأكد من أن الدفع تم فعلاً؟ سيتم تغيير حالة الطلب إلى "قيد المعالجة".')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/requests/${requestId}/mark-paid`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'completed',
          paymentMethod: 'manual'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // تحديث الطلب في القائمة المحلية
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { 
                  ...request, 
                  paymentStatus: 'مكتمل',
                  status: 'IN_PROGRESS',
                  totalPaid: request.price
                }
              : request
          )
        );

        // تحديث الطلب المحدد إذا كان مفتوحاً
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(prev => prev ? {
            ...prev,
            paymentStatus: 'مكتمل',
            status: 'IN_PROGRESS',
            totalPaid: prev.price
          } : null);
        }

        // إظهار رسالة نجاح
        const successMessage = document.createElement('div');
        successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successMessage.textContent = 'تم تحديث حالة الدفع بنجاح!';
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
      } else {
        alert(`فشل في تحديث حالة الدفع: ${result.message}`);
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الدفع:', error);
      alert('حدث خطأ في تحديث حالة الدفع');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      const response = await fetch(`/api/admin/orders/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();
      if (result.success) {
        // تحديث الطلب في القائمة المحلية
        setRequests(prev => prev.map(request => 
          request.id === selectedRequest.id 
            ? { ...request, ...editForm }
            : request
        ));
        
        // تحديث الطلب المحدد
        setSelectedRequest({ ...selectedRequest, ...editForm });
        
        alert('تم تحديث الطلب بنجاح');
        closeEditModal();
      } else {
        alert('فشل في تحديث الطلب');
      }
    } catch (error) {
      console.error('خطأ في تحديث الطلب:', error);
      alert('فشل في تحديث الطلب');
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${requestId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        // حذف الطلب من القائمة المحلية
        setRequests(prev => prev.filter(request => request.id !== requestId));
        
        // إغلاق النافذة المنبثقة إذا كان الطلب المحذوف مفتوحاً
        if (selectedRequest && selectedRequest.id === requestId) {
          closeModal();
        }
        
        alert('تم حذف الطلب بنجاح');
      } else {
        alert('فشل في حذف الطلب');
      }
    } catch (error) {
      console.error('خطأ في حذف الطلب:', error);
      alert('فشل في حذف الطلب');
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesServiceType = serviceType === 'all' || 
      (serviceType === 'send-proposal' && request.purpose === 'إرسال معروض حكومي') ||
      (serviceType === 'ready-template' && request.purpose.includes('صيغة جاهزة')) ||
      (serviceType === 'custom-request' && request.purpose !== 'إرسال معروض حكومي' && !request.purpose.includes('صيغة جاهزة'));
    const matchesSearch = request.applicantName.includes(searchTerm) || 
                         request.purpose.includes(searchTerm) ||
                         request.recipient.includes(searchTerm) ||
                         (request.user?.email && request.user.email.includes(searchTerm));
    return matchesFilter && matchesServiceType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'مكتمل';
      case 'IN_PROGRESS': return 'قيد المعالجة';
      case 'PENDING': return 'معلق';
      case 'CANCELLED': return 'ملغي';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'عالية';
      case 'MEDIUM': return 'متوسطة';
      case 'LOW': return 'منخفضة';
      default: return priority;
    }
  };

  // دالة لإرسال رسالة واتساب
  const sendWhatsAppMessage = (phone: string, requestId: number, customerName: string) => {
    // تنظيف رقم الهاتف (إزالة المسافات والرموز)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // إضافة رمز الدولة إذا لم يكن موجوداً
    const formattedPhone = cleanPhone.startsWith('966') ? cleanPhone : 
                          cleanPhone.startsWith('0') ? '966' + cleanPhone.substring(1) : 
                          '966' + cleanPhone;
    
    // رسالة افتراضية
    const message = `مرحباً ${customerName}،

نحن من فريق معروضي نتصل بك بخصوص طلبك رقم #${requestId.toString().padStart(6, '0')}.

هل يمكننا مساعدتك في أي شيء آخر؟

مع تحيات فريق معروضي`;

    // فتح واتساب
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-white/20 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        إدارة الطلبات
                      </h1>
                      <p className="text-gray-600 text-lg mb-2">
                        عرض وإدارة جميع الطلبات - إجمالي الطلبات: <span className="font-bold text-indigo-600">{totalCount}</span> طلب
                      </p>
                      <p className="text-gray-500 text-sm">
                        آخر تحديث: {formatArabicDate(new Date().toISOString())}
                      </p>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-amber-600 font-medium">الطلبات المعلقة</p>
                          <p className="text-2xl font-bold text-amber-700">{stats.pendingCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">قيد المعالجة</p>
                          <p className="text-2xl font-bold text-blue-700">{stats.inProgressCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">مكتملة</p>
                          <p className="text-2xl font-bold text-green-700">{stats.completedCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">خدمة الإرسال</p>
                          <p className="text-2xl font-bold text-blue-700">{stats.sendProposalCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-medium">قوالب جاهزة</p>
                          <p className="text-2xl font-bold text-purple-700">{stats.readyTemplateCount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-emerald-600 font-medium">كتابة معروض</p>
                          <p className="text-2xl font-bold text-emerald-700">{stats.customRequestCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {stats.blobUrlCount > 0 && (
                    <div className="mt-4">
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm text-red-600 font-medium">مشاكل في التسجيل</p>
                            <p className="text-2xl font-bold text-red-700">{stats.blobUrlCount}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {stats.blobUrlCount > 0 && (
                <button
                  onClick={() => {
                    if (confirm('هل تريد تشغيل سكريبت إصلاح روابط التسجيلات الصوتية؟')) {
                      alert('يمكنك تشغيل السكريبت من Terminal:\n\nnpm run fix:audio-urls');
                    }
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl"
                  title="تشغيل سكريبت إصلاح روابط التسجيلات الصوتية"
                >
                  🔧 إصلاح الروابط
                </button>
              )}
            </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Search className="w-4 h-4 mr-1" />
                البحث في الطلبات
              </label>
              <input
                type="text"
                placeholder="ابحث بالاسم، البريد الإلكتروني، الهدف، المستلم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                تصفية حسب الحالة
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-w-[200px]"
              >
                <option value="all">جميع الحالات</option>
                <option value="PENDING">معلق</option>
                <option value="IN_PROGRESS">قيد المعالجة</option>
                <option value="COMPLETED">مكتمل</option>
                <option value="CANCELLED">ملغي</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">🔧 تصفية حسب نوع الخدمة</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg min-w-[200px]"
              >
                <option value="all">جميع الخدمات</option>
                <option value="send-proposal">خدمة الإرسال</option>
                <option value="ready-template">قوالب جاهزة</option>
                <option value="custom-request">كتابة معروض</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    رقم الطلب
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    اسم العميل
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    البريد الإلكتروني
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    رقم الجوال
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    نوع الخدمة
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    حالة الدفع
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    نوع الدفع
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    الحالة
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    السعر
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-gray-700 border-b border-gray-200">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-blue-50 transition-colors duration-200">
                    {/* رقم الطلب */}
                    <td className="px-3 py-3 text-center">
                      <div className="text-sm font-bold text-blue-600">#{request.id.toString().padStart(6, '0')}</div>
                    </td>
                    
                    {/* اسم العميل */}
                    <td className="px-3 py-3">
                      <div className="text-sm font-medium text-gray-900">{request.applicantName}</div>
                    </td>
                    
                    {/* البريد الإلكتروني */}
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-600">
                        {request.user?.email || 'غير متوفر'}
                      </div>
                    </td>
                    
                    {/* رقم الجوال */}
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-600">{request.phone}</div>
                    </td>
                    
                                      {/* نوع الخدمة */}
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-900">{request.purpose}</div>
                    {request.purpose === 'إرسال معروض حكومي' && (
                      <div className="text-xs text-blue-600 font-medium mt-1 flex items-center">
                        <Send className="w-3 h-3 mr-1" />
                        خدمة إرسال
                      </div>
                    )}
                    {request.purpose.includes('صيغة جاهزة') && (
                      <div className="text-xs text-purple-600 font-medium mt-1 flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        قالب جاهز
                      </div>
                    )}
                    {request.purpose.includes('طلب') && !request.purpose.includes('إرسال') && !request.purpose.includes('صيغة جاهزة') && (
                      <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                        <Edit className="w-3 h-3 mr-1" />
                        كتابة معروض
                      </div>
                    )}
                  </td>
                    
                    {/* إدارة الطلب: حالة الدفع */}
                    <td className="px-3 py-3">
                      <div className="space-y-2">
                        {/* حالة الدفع */}
                        <div className="text-sm text-center">
                          <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                            request.paymentStatus === 'مكتمل' ? 'bg-green-100 text-green-800' :
                            request.paymentStatus === 'جزئي' ? 'bg-orange-100 text-orange-800' :
                            request.paymentStatus === 'غير مدفوع' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.paymentStatus || 'غير محدد'}
                          </span>
                        </div>
                        
                        {/* المبلغ المدفوع */}
                        {request.totalPaid > 0 && (
                          <div className="text-xs text-green-600 font-medium text-center">
                            المدفوع: {request.totalPaid} ريال
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* نوع الدفع */}
                    <td className="px-3 py-3">
                      <div className="text-center">
                        {request.paymentMethod && request.paymentMethod !== 'غير محدد' ? (
                          <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                            request.paymentMethod === 'تحويل بنكي' ? 'bg-blue-100 text-blue-800' :
                            request.paymentMethod === 'دفع إلكتروني' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.paymentMethod === 'تحويل بنكي' ? (
                              <div className="flex items-center">
                                <Building2 className="w-3 h-3 mr-1" />
                                تحويل بنكي
                              </div>
                            ) : request.paymentMethod === 'دفع إلكتروني' ? (
                              <div className="flex items-center">
                                <CreditCard className="w-3 h-3 mr-1" />
                                دفع إلكتروني
                              </div>
                            ) : request.paymentMethod}
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-600">
                            غير محدد
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* الحالة */}
                    <td className="px-3 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    
                    {/* السعر */}
                    <td className="px-3 py-3 text-center">
                      {request.couponCode ? (
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-green-600">{request.finalPrice || request.price} ريال</div>
                          <div className="text-xs text-gray-500 line-through">{request.originalPrice || request.price} ريال</div>
                          <div className="text-xs text-blue-600 font-medium">خصم: {request.discountAmount || 0} ريال</div>
                          <div className="text-xs text-purple-600 font-medium">كود: {request.couponCode}</div>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-green-600">{request.price} ريال</div>
                      )}
                    </td>
                    
                    {/* الإجراءات */}
                    <td className="px-3 py-3">
                      <div className="space-y-2">
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                          className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="PENDING">معلق</option>
                          <option value="IN_PROGRESS">قيد المعالجة</option>
                          <option value="COMPLETED">مكتمل</option>
                          <option value="CANCELLED">ملغي</option>
                        </select>
                        
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleViewRequest(request)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs text-center hover:bg-blue-700 transition-colors"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => {
                              // تم النقر على رابط الدفع
                              window.open(`/request-form/payment?requestId=${request.id}`, '_blank');
                            }}
                            className="bg-indigo-600 text-white px-2 py-1 rounded text-xs text-center hover:bg-indigo-700 transition-colors flex items-center justify-center"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            دفع
                          </button>
                          <button
                            onClick={() => openEditModal(request)}
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs text-center hover:bg-green-700 transition-colors"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs text-center hover:bg-red-700 transition-colors"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-lg text-gray-700">
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                عرض <span className="font-bold text-blue-600">{(currentPage - 1) * 10 + 1}</span> إلى <span className="font-bold text-blue-600">
                {Math.min(currentPage * 10, totalCount)}
              </span> من <span className="font-bold text-blue-600">{totalCount}</span> نتيجة
              </div>
            </div>
            <div className="flex space-x-3 rtl:space-x-reverse">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                السابق
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                التالي
                <ArrowRight className="w-4 h-4 mr-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal لعرض تفاصيل الطلب */}
        {showModal && selectedRequest && (
          <div className="admin-modal bg-black/60 backdrop-blur-sm">
            <div className="admin-modal-content bg-white rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white p-8">
                <div className="absolute inset-0 bg-black/10 rounded-t-2xl"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        طلب #{selectedRequest.id.toString().padStart(6, '0')}
                      </h2>
                      <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedRequest.status)}`}>
                          {getStatusText(selectedRequest.status)}
                        </span>
                        <span className="text-indigo-200 text-sm">
                          {formatArabicDate(selectedRequest.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* بيانات العميل */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">بيانات العميل</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">اسم مقدم المعروض</span>
                          <span className="text-gray-900 font-semibold">{selectedRequest.applicantName}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-blue-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">رقم الجوال</span>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <a href={`tel:${selectedRequest.phone}`} className="text-blue-600 font-semibold hover:text-blue-800">
                              {selectedRequest.phone}
                            </a>
                            <button
                              onClick={() => sendWhatsAppMessage(selectedRequest.phone, selectedRequest.id, selectedRequest.applicantName)}
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                              title="إرسال رسالة واتساب"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {selectedRequest.idNumber && (
                        <div className="bg-white rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">رقم الهوية</span>
                            <span className="text-gray-900 font-semibold">{selectedRequest.idNumber}</span>
                          </div>
                        </div>
                      )}
                      {selectedRequest.user && (
                        <div className="bg-white rounded-xl p-4 border border-blue-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">البريد الإلكتروني</span>
                            <a href={`mailto:${selectedRequest.user.email}`} className="text-blue-600 font-semibold hover:text-blue-800">
                              {selectedRequest.user.email}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* تفاصيل الطلب */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-green-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">نوع الخدمة</span>
                          <span className="text-gray-900 font-semibold">{selectedRequest.purpose}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-green-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">المستلم</span>
                          <span className="text-gray-900 font-semibold">{selectedRequest.recipient}</span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-green-100">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-600 mb-2">نبذة عن المعروض</span>
                          <p className="text-gray-900 text-sm leading-relaxed">{selectedRequest.description}</p>
                        </div>
                      </div>
                      {selectedRequest.attachments && (
                        <div className="bg-white rounded-xl p-4 border border-green-100">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 mb-2">المرفقات</span>
                            <p className="text-gray-900 text-sm">{selectedRequest.attachments}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* الحالة والأولوية */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">الحالة والأولوية</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">الحالة</span>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                            {getStatusText(selectedRequest.status)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">الأولوية</span>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                            {getPriorityText(selectedRequest.priority)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-amber-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">تاريخ الإنشاء</span>
                          <span className="text-gray-900 font-semibold">
                            {formatArabicDate(selectedRequest.createdAt)}
                          </span>
                        </div>
                      </div>
                      {selectedRequest.deliveryDate && (
                        <div className="bg-white rounded-xl p-4 border border-amber-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">تاريخ التسليم</span>
                            <span className="text-gray-900 font-semibold">{selectedRequest.deliveryDate}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* معلومات الدفع */}
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">معلومات الدفع</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">حالة الدفع</span>
                          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                            selectedRequest.paymentStatus === 'مكتمل' ? 'bg-green-100 text-green-800' :
                            selectedRequest.paymentStatus === 'جزئي' ? 'bg-orange-100 text-orange-800' :
                            selectedRequest.paymentStatus === 'غير مدفوع' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedRequest.paymentStatus || 'غير محدد'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-purple-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">نوع الدفع</span>
                          <span className={`font-semibold ${
                            selectedRequest.paymentMethod === 'تحويل بنكي' ? 'text-blue-600' :
                            selectedRequest.paymentMethod === 'دفع إلكتروني' ? 'text-purple-600' :
                            'text-gray-600'
                          }`}>
                            {selectedRequest.paymentMethod || 'غير محدد'}
                          </span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600">المبلغ المدفوع</span>
                          <span className="text-green-600 font-bold text-lg">{selectedRequest.totalPaid} ريال</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        {selectedRequest.couponCode ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-600">السعر الأصلي</span>
                              <span className="text-gray-500 line-through">{selectedRequest.originalPrice || selectedRequest.price} ريال</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-red-600">الخصم</span>
                              <span className="text-red-600 font-bold">-{selectedRequest.discountAmount || 0} ريال</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-purple-600">كود الخصم</span>
                              <span className="text-purple-600 font-bold">{selectedRequest.couponCode}</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-2">
                              <span className="text-sm font-medium text-gray-600">السعر النهائي</span>
                              <span className="text-blue-600 font-bold text-lg">{selectedRequest.finalPrice || selectedRequest.price} ريال</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">السعر الإجمالي</span>
                            <span className="text-blue-600 font-bold text-lg">{selectedRequest.price} ريال</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* التسجيل الصوتي */}
                  {selectedRequest.voiceRecordingUrl && (
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">التسجيل الصوتي</h3>
                      </div>
                      
                      {/* تحذير إذا كان الرابط blob URL */}
                      {selectedRequest.voiceRecordingUrl.startsWith('blob:') && (
                        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-red-800 font-semibold">تحذير مهم!</span>
                          </div>
                          <p className="text-red-700 text-sm">
                            هذا التسجيل الصوتي يحتوي على رابط مؤقت (blob URL) لا يمكن الوصول إليه من صفحة الإدارة.
                            يجب إعادة رفع الملف من قبل المستخدم أو حذف الطلب.
                          </p>
                        </div>
                      )}
                      
                      {/* مشغل الصوت الحديث */}
                      <AudioPlayer 
                        audioUrl={selectedRequest.voiceRecordingUrl}
                        fileName={`تسجيل صوتي - ${selectedRequest.applicantName}`}
                        className="w-full"
                      />

                      {/* حالة الملف */}
                      <div className="text-center mt-4">
                        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium">
                          {selectedRequest.voiceRecordingUrl.includes('blob.vercel-storage.com') ? (
                            <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full">
                              ✅ ملف محفوظ في Vercel Blob Storage
                            </span>
                          ) : selectedRequest.voiceRecordingUrl.startsWith('blob:') ? (
                            <span className="text-red-600 bg-red-100 px-3 py-1 rounded-full">
                              ⚠️ رابط مؤقت - لا يمكن الوصول إليه
                            </span>
                          ) : (
                            <span className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                              🔗 رابط خارجي
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* المعلومات المالية */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                      <h3 className="text-lg font-bold text-purple-900">المعلومات المالية</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">السعر:</span>
                        {selectedRequest.couponCode ? (
                          <div className="text-right">
                            <div className="text-green-600 font-bold">{selectedRequest.finalPrice || selectedRequest.price} ريال</div>
                            <div className="text-xs text-gray-500 line-through">{selectedRequest.originalPrice || selectedRequest.price} ريال</div>
                            <div className="text-xs text-blue-600">خصم: {selectedRequest.discountAmount || 0} ريال</div>
                          </div>
                        ) : (
                          <span className="text-green-600 font-bold">{selectedRequest.price} ريال</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">المدفوع:</span>
                        <span className="text-blue-600 font-bold">{selectedRequest.totalPaid} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">حالة الدفع:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRequest.paymentStatus === 'مكتمل' ? 'bg-green-100 text-green-800' :
                          selectedRequest.paymentStatus === 'جزئي' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedRequest.paymentStatus}
                        </span>
                      </div>
                      
                      {/* زر تم الدفع */}
                      {selectedRequest.paymentStatus !== 'مكتمل' && (
                        <div className="pt-3 border-t border-purple-200">
                          <button
                            onClick={() => markAsPaid(selectedRequest.id)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            تم الدفع
                          </button>
                          <p className="text-xs text-gray-600 text-center mt-2">
                            اضغط هنا إذا تأكدت من إتمام الدفع
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* الإجراءات */}
                <div className="mt-8 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">الإجراءات</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">تغيير الحالة</label>
                      <select
                        value={selectedRequest.status}
                        onChange={(e) => {
                          handleStatusUpdate(selectedRequest.id, e.target.value);
                          setSelectedRequest({...selectedRequest, status: e.target.value});
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                      >
                        <option value="PENDING">معلق</option>
                        <option value="IN_PROGRESS">قيد المعالجة</option>
                        <option value="COMPLETED">مكتمل</option>
                        <option value="CANCELLED">ملغي</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => {
                        // تم النقر على رابط الدفع من النافذة المنبثقة
                        window.open(`/request-form/payment?requestId=${selectedRequest.id}`, '_blank');
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <CreditCard className="w-5 h-5 inline-block mr-2" />
                      رابط الدفع
                    </button>
                    
                    <button
                      onClick={() => openEditModal(selectedRequest)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      تعديل الطلب
                    </button>
                    
                    <button
                      onClick={() => handleDeleteRequest(selectedRequest.id)}
                      className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      حذف الطلب
                    </button>
                    
                    <button
                      onClick={closeModal}
                      className="bg-gradient-to-r from-gray-600 to-slate-600 text-white px-6 py-3 rounded-xl hover:from-gray-700 hover:to-slate-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal تعديل الطلب */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <Edit className="w-6 h-6 mr-2" />
                      <h2 className="text-2xl font-bold">تعديل الطلب</h2>
                    </div>
                    <p className="text-green-100 mt-2">تعديل بيانات الطلب</p>
                  </div>
                  <button
                    onClick={closeEditModal}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* بيانات العميل */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسم العميل *</label>
                    <input
                      type="text"
                      value={editForm.applicantName || ''}
                      onChange={(e) => setEditForm({...editForm, applicantName: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال *</label>
                    <input
                      type="tel"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهوية</label>
                    <input
                      type="text"
                      value={editForm.idNumber || ''}
                      onChange={(e) => setEditForm({...editForm, idNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخدمة *</label>
                    <input
                      type="text"
                      value={editForm.purpose || ''}
                      onChange={(e) => setEditForm({...editForm, purpose: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المستلم *</label>
                    <input
                      type="text"
                      value={editForm.recipient || ''}
                      onChange={(e) => setEditForm({...editForm, recipient: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الأولوية</label>
                    <select
                      value={editForm.priority || 'MEDIUM'}
                      onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="LOW">منخفضة</option>
                      <option value="MEDIUM">متوسطة</option>
                      <option value="HIGH">عالية</option>
                      <option value="URGENT">عاجلة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ ووقت الإنشاء</label>
                    <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                      {selectedRequest ? new Date(selectedRequest.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      }) : ''}
                    </div>
                  </div>
                </div>

                {/* الوصف */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* الأزرار */}
                <div className="mt-6 flex justify-end space-x-3 rtl:space-x-reverse">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRequest) {
                        handleDeleteRequest(selectedRequest.id);
                      }
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    حذف الطلب
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
