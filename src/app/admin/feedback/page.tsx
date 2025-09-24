'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Eye, CheckCircle, XCircle, Clock, Trash2, Edit3 } from 'lucide-react';

interface Feedback {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig = {
  PENDING: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  REVIEWED: { label: 'تم المراجعة', color: 'bg-blue-100 text-blue-800', icon: Eye },
  RESPONDED: { label: 'تم الرد', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CLOSED: { label: 'مغلق', color: 'bg-gray-100 text-gray-800', icon: XCircle },
};

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, statusFilter]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      });

      const response = await fetch(`/api/feedback?${params}`);
      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data.feedbacks);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error('خطأ في جلب النصائح:', data.error);
      }
    } catch (error) {
      console.error('خطأ في جلب النصائح:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchFeedbacks();
      } else {
        console.error('خطأ في تحديث الحالة');
      }
    } catch (error) {
      console.error('خطأ في تحديث الحالة:', error);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedFeedback || !adminNotes.trim()) return;

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          adminNotes: adminNotes.trim(),
          status: 'REVIEWED'
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setAdminNotes('');
        setSelectedFeedback(null);
        fetchFeedbacks();
      } else {
        console.error('خطأ في إضافة الملاحظات');
      }
    } catch (error) {
      console.error('خطأ في إضافة الملاحظات:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه النصيحة؟')) return;

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchFeedbacks();
      } else {
        console.error('خطأ في حذف النصيحة');
      }
    } catch (error) {
      console.error('خطأ في حذف النصيحة:', error);
    }
  };

  const openNotesModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setAdminNotes(feedback.adminNotes || '');
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة النصائح والملاحظات</h1>
        <p className="text-gray-600">إدارة نصائح العملاء وملاحظاتهم لتحسين الخدمات</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">جميع الحالات</option>
          <option value="PENDING">معلق</option>
          <option value="REVIEWED">تم المراجعة</option>
          <option value="RESPONDED">تم الرد</option>
          <option value="CLOSED">مغلق</option>
        </select>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {feedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد نصائح في الوقت الحالي</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {feedbacks.map((feedback) => {
              const StatusIcon = statusConfig[feedback.status].icon;
              return (
                <div key={feedback.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {feedback.name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[feedback.status].color}`}>
                          <StatusIcon className="w-3 h-3 ml-1" />
                          {statusConfig[feedback.status].label}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>البريد الإلكتروني:</strong> {feedback.email}</p>
                        {feedback.phone && (
                          <p><strong>الهاتف:</strong> {feedback.phone}</p>
                        )}
                        <p><strong>التاريخ:</strong> {formatDate(feedback.createdAt)}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-gray-800 leading-relaxed">{feedback.message}</p>
                      </div>

                      {feedback.adminNotes && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">ملاحظات الإدارة:</p>
                          <p className="text-blue-800 text-sm">{feedback.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => openNotesModal(feedback)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 ml-1" />
                        ملاحظات
                      </button>

                      <div className="flex gap-1">
                        {feedback.status === 'PENDING' && (
                          <button
                            onClick={() => handleStatusUpdate(feedback.id, 'REVIEWED')}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                          >
                            مراجعة
                          </button>
                        )}
                        {feedback.status === 'REVIEWED' && (
                          <button
                            onClick={() => handleStatusUpdate(feedback.id, 'RESPONDED')}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                          >
                            رد
                          </button>
                        )}
                        {feedback.status === 'RESPONDED' && (
                          <button
                            onClick={() => handleStatusUpdate(feedback.id, 'CLOSED')}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
                          >
                            إغلاق
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(feedback.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 ml-1" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              السابق
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 text-sm border rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إضافة ملاحظات للنصيحة
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات الإدارة
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="أدخل ملاحظاتك هنا..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setAdminNotes('');
                    setSelectedFeedback(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddNotes}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ الملاحظات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
