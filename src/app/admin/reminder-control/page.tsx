'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute';
import { 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Pause,
  Square,
  Plus,
  Edit,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ReminderStats {
  totalReminders: number;
  sentToday: number;
  pendingRequests: number;
  successRate: number;
}

interface ReminderLog {
  id: string;
  requestId: number | null;
  email: string;
  userName: string;
  reminderType: string;
  status: string;
  sentAt: string | null;
  notes?: string;
  type: 'automatic' | 'manual';
}

interface ReminderSettings {
  id: number;
  firstReminderHours: number;
  secondReminderHours: number;
  finalReminderHours: number;
  isActive: boolean;
  maxRemindersPerDay: number;
  reminderSubject: string;
  reminderTemplate?: string;
}

interface ManualReminder {
  id: number;
  email: string;
  name: string;
  requestId?: string;
  purpose?: string;
  price?: string;
  subject: string;
  message: string;
  status: string;
  sentAt?: string;
  createdAt: string;
}

interface UserEmail {
  id: string;
  email: string;
  name: string;
  phone: string;
  type: 'user' | 'request';
  lastRequest?: {
    id: number;
    purpose: string;
    status: string;
    createdAt: string;
  } | null;
}

export default function ReminderControl() {
  const [stats, setStats] = useState<ReminderStats>({
    totalReminders: 0,
    sentToday: 0,
    pendingRequests: 0,
    successRate: 0
  });
  const [recentLogs, setRecentLogs] = useState<ReminderLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string>('');
  const [settings, setSettings] = useState<ReminderSettings | null>(null);
  const [manualReminders, setManualReminders] = useState<ManualReminder[]>([]);
  const [userEmails, setUserEmails] = useState<UserEmail[]>([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSendingManual, setIsSendingManual] = useState(false);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [emailFilter, setEmailFilter] = useState<'all' | 'users' | 'requests'>('all');
  const [manualForm, setManualForm] = useState({
    selectedUsers: [] as UserEmail[],
    manualEmails: [] as {email: string, name: string, price: string}[],
    requestId: '',
    purpose: '',
    price: '',
    subject: 'تذكير بدفع الطلب',
    message: 'يرجى إكمال عملية الدفع لطلبك في أقرب وقت ممكن.'
  });

  useEffect(() => {
    fetchData();
    checkCronStatus();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/reminder-stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent logs
      const logsResponse = await fetch('/api/admin/reminder-logs');
      const logsData = await logsResponse.json();
      if (logsData.success) {
        setRecentLogs(logsData.data);
      }

      // Fetch settings
      const settingsResponse = await fetch('/api/admin/reminder-settings');
      const settingsData = await settingsResponse.json();
      if (settingsData.success) {
        setSettings(settingsData.data);
      }

      // Fetch manual reminders
      const manualResponse = await fetch('/api/admin/manual-reminders');
      const manualData = await manualResponse.json();
      if (manualData.success) {
        setManualReminders(manualData.data);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('فشل في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserEmails = async () => {
    try {
      setIsLoadingEmails(true);
      const response = await fetch('/api/admin/user-emails');
      const data = await response.json();
      if (data.success) {
        setUserEmails(data.data);
      } else {
        toast.error('فشل في جلب قائمة البريد الإلكتروني');
      }
    } catch (error) {
      console.error('Error fetching user emails:', error);
      toast.error('فشل في جلب قائمة البريد الإلكتروني');
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const checkCronStatus = async () => {
    try {
      const response = await fetch('/api/admin/cron-status');
      const data = await response.json();
      if (data.success) {
        setIsRunning(data.data.isRunning);
        setLastRun(data.data.lastRun);
      }
    } catch (error) {
      console.error('Error checking cron status:', error);
    }
  };




  const handleUserToggle = (user: UserEmail) => {
    setManualForm(prev => {
      const isSelected = prev.selectedUsers.some(u => u.id === user.id);
      if (isSelected) {
        return {
          ...prev,
          selectedUsers: prev.selectedUsers.filter(u => u.id !== user.id)
        };
      } else {
        return {
          ...prev,
          selectedUsers: [...prev.selectedUsers, user]
        };
      }
    });
  };

  const clearSelectedUsers = () => {
    setManualForm(prev => ({
      ...prev,
      selectedUsers: []
    }));
  };

  const selectAllUsers = () => {
    const filteredEmails = userEmails.filter(user => {
      if (emailFilter === 'all') return true;
      if (emailFilter === 'users') return user.type === 'user';
      if (emailFilter === 'requests') return user.type === 'request';
      return true;
    });
    
    setManualForm(prev => ({
      ...prev,
      selectedUsers: [...filteredEmails]
    }));
  };

  const addManualEmail = () => {
    const emailInput = document.getElementById('manualEmail') as HTMLInputElement;
    const nameInput = document.getElementById('manualName') as HTMLInputElement;
    const priceInput = document.getElementById('manualPrice') as HTMLInputElement;
    const email = emailInput?.value?.trim();
    const name = nameInput?.value?.trim();
    const price = priceInput?.value?.trim();
    
    if (!email) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    if (!name) {
      toast.error('يرجى إدخال الاسم');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    // Check if email already exists
    if (manualForm.manualEmails.some(item => item.email === email)) {
      toast.error('هذا البريد الإلكتروني موجود بالفعل');
      return;
    }
    
    setManualForm(prev => ({
      ...prev,
      manualEmails: [...prev.manualEmails, { email, name, price: price || '' }]
    }));
    
    // Clear the inputs
    emailInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    toast.success('تم إضافة البريد الإلكتروني والاسم والمبلغ بنجاح');
  };

  const removeManualEmail = (index: number) => {
    setManualForm(prev => ({
      ...prev,
      manualEmails: prev.manualEmails.filter((_, i) => i !== index)
    }));
  };

  const sendManualReminder = async () => {
    if (manualForm.selectedUsers.length === 0 && manualForm.manualEmails.length === 0) {
      toast.error('يرجى اختيار مستخدم واحد على الأقل أو إضافة بريد إلكتروني يدوي');
      return;
    }

    try {
      setIsSendingManual(true);
      const totalRecipients = manualForm.selectedUsers.length + manualForm.manualEmails.length;
      toast.loading(`جاري إرسال التذكير إلى ${totalRecipients} مستلم...`, { id: 'manual' });

      let successCount = 0;
      let failCount = 0;

      // Send reminders to each selected user
      for (const user of manualForm.selectedUsers) {
        try {
          const response = await fetch('/api/admin/send-manual-reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              requestId: manualForm.requestId,
              purpose: manualForm.purpose,
              price: manualForm.price,
              subject: manualForm.subject,
              message: manualForm.message
            })
          });

          const result = await response.json();
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Error sending reminder to ${user.email}:`, error);
          failCount++;
        }
      }

      // Send reminders to manual emails
      for (const item of manualForm.manualEmails) {
        try {
          const requestData = {
            email: item.email,
            name: item.name,
            requestId: manualForm.requestId,
            purpose: manualForm.purpose,
            price: item.price || manualForm.price, // Use individual price or fallback to form price
            subject: manualForm.subject,
            message: manualForm.message
          };
          
          console.log('Sending manual reminder with data:', requestData);
          
          const response = await fetch('/api/admin/send-manual-reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
          });

          const result = await response.json();
          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Error sending reminder to ${item.email}:`, error);
          failCount++;
        }
      }

      toast.dismiss('manual');

      if (successCount > 0) {
        toast.success(`تم إرسال التذكير إلى ${successCount} مستخدم${failCount > 0 ? ` (فشل ${failCount})` : ''}`);
        setShowManualForm(false);
        setManualForm({
          selectedUsers: [],
          manualEmails: [],
          requestId: '',
          purpose: '',
          price: '',
          subject: 'تذكير بدفع الطلب',
          message: 'يرجى إكمال عملية الدفع لطلبك في أقرب وقت ممكن.'
        });
        await fetchData();
      } else {
        toast.error('فشل في إرسال التذكير إلى جميع المستخدمين');
      }

    } catch (error) {
      console.error('Error sending manual reminders:', error);
      toast.dismiss('manual');
      toast.error('فشل في إرسال التذكير');
    } finally {
      setIsSendingManual(false);
    }
  };

  const getReminderTypeText = (type: string) => {
    switch (type) {
      case 'FIRST_REMINDER': return 'تذكير أولي';
      case 'SECOND_REMINDER': return 'تذكير ثانوي';
      case 'FINAL_REMINDER': return 'تذكير نهائي';
      case 'MANUAL_REMINDER': return 'تذكير يدوي';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'SENT': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'تم التسليم';
      case 'FAILED': return 'فشل';
      case 'SENT': return 'تم الإرسال';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">جاري تحميل بيانات التذكيرات...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">نظام التذكيرات التلقائي</h1>
                  <p className="text-gray-600">إدارة ومراقبة نظام التذكيرات التلقائي</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className={`px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse ${
                  isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">
                    {isRunning ? 'نشط' : 'متوقف'}
                  </span>
                </div>
                {lastRun && (
                  <div className="text-sm text-gray-500">
                    آخر تشغيل: {new Date(lastRun).toLocaleString('ar-SA')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي التذكيرات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReminders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">تم الإرسال اليوم</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.sentToday}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">طلبات معلقة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <button
                onClick={() => {
                  setShowManualForm(true);
                  fetchUserEmails();
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>إرسال تذكير يدوي</span>
              </button>

            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">سجل التذكيرات الأخيرة</h2>
            
            {recentLogs.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">لا توجد تذكيرات حديثة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الطلب</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المستخدم</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">نوع التذكير</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">التاريخ</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          {log.requestId ? (
                            <span className="font-medium text-blue-600">#{log.requestId}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{log.userName}</p>
                            <p className="text-sm text-gray-500">{log.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              log.type === 'manual' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {getReminderTypeText(log.reminderType)}
                            </span>
                            {log.type === 'manual' && (
                              <span className="px-1 py-0.5 text-xs bg-orange-200 text-orange-700 rounded">
                                يدوي
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                            {getStatusText(log.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {log.sentAt ? new Date(log.sentAt).toLocaleString('ar-SA') : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">{log.notes || '-'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Manual Reminders History */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">التذكيرات اليدوية</h2>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 rtl:space-x-reverse"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>تحديث</span>
              </button>
            </div>
            
            {manualReminders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">المستقبل</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الموضوع</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">الحالة</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualReminders.slice(0, 10).map((reminder) => (
                      <tr key={reminder.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{reminder.name}</p>
                            <p className="text-sm text-gray-500">{reminder.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{reminder.subject}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reminder.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reminder.status === 'SENT' ? 'تم الإرسال' : 'فشل'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(reminder.createdAt).toLocaleString('ar-SA')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد تذكيرات يدوية</h3>
                <p className="text-gray-500">لم يتم إرسال أي تذكيرات يدوية بعد</p>
              </div>
            )}
          </div>
        </div>


        {/* Manual Reminder Modal */}
        {showManualForm && (
          <div className="admin-modal bg-black bg-opacity-50">
            <div className="admin-modal-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">إرسال تذكير يدوي</h3>
                <button
                  onClick={() => setShowManualForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendManualReminder(); }} className="p-6 space-y-6">
                {/* User Selection Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-800">اختيار المستخدمين</h3>
                      {userEmails.length > 0 && (
                        <div className="flex items-center space-x-4 rtl:space-x-reverse mt-1 text-sm text-gray-600">
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>مستخدمين: {userEmails.filter(u => u.type === 'user').length}</span>
                          </span>
                          <span className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>طلبات: {userEmails.filter(u => u.type === 'request').length}</span>
                          </span>
                          <span className="text-gray-500">المجموع: {userEmails.length}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2">
                      {/* Filter buttons */}
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                          type="button"
                          onClick={() => setEmailFilter('all')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            emailFilter === 'all' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          الكل
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailFilter('users')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            emailFilter === 'users' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          المستخدمين
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailFilter('requests')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            emailFilter === 'requests' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          الطلبات
                        </button>
                      </div>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        <button
                        type="button"
                        onClick={fetchUserEmails}
                        disabled={isLoadingEmails}
                        className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center space-x-1 rtl:space-x-reverse text-sm"
                      >
                        <RefreshCw className={`w-4 h-4 ${isLoadingEmails ? 'animate-spin' : ''}`} />
                        <span>تحديث</span>
                      </button>
                      {userEmails.length > 0 && (
                        <button
                          type="button"
                          onClick={selectAllUsers}
                          className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center space-x-1 rtl:space-x-reverse text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>اختيار الكل</span>
                        </button>
                      )}
                      {manualForm.selectedUsers.length > 0 && (
                        <button
                          type="button"
                          onClick={clearSelectedUsers}
                          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center space-x-1 rtl:space-x-reverse text-sm"
                        >
                          <X className="w-4 h-4" />
                          <span>مسح الكل</span>
                        </button>
                      )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* User List */}
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                      {userEmails.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {isLoadingEmails ? 'جاري تحميل المستخدمين...' : 'لا يوجد مستخدمين'}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {userEmails
                            .filter(user => {
                              if (emailFilter === 'all') return true;
                              if (emailFilter === 'users') return user.type === 'user';
                              if (emailFilter === 'requests') return user.type === 'request';
                              return true;
                            })
                            .map((user) => {
                            const isSelected = manualForm.selectedUsers.some(u => u.id === user.id);
                            return (
                              <div
                                key={user.id}
                                onClick={() => handleUserToggle(user)}
                                className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                                  isSelected ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                                }`}
                              >
                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isSelected 
                                      ? 'bg-blue-500 border-blue-500' 
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    {user.lastRequest && (
                                      <div className="text-xs text-blue-600 mt-1">
                                        آخر طلب: {user.lastRequest.purpose} - {user.lastRequest.status}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs">
                                    {user.type === 'user' ? (
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">مستخدم</span>
                                    ) : (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">طلب</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Selected Users Summary */}
                    {manualForm.selectedUsers.length > 0 && (
                      <div className="bg-white border border-blue-300 rounded-lg p-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-green-700 mb-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">
                            تم اختيار {manualForm.selectedUsers.length} مستخدم
                          </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {manualForm.selectedUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between py-1">
                              <div className="text-sm text-gray-700">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-gray-500 mr-2"> - {user.email}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleUserToggle(user)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Manual Email Entry Section */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">إضافة بريد إلكتروني يدوي</h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">الاسم</label>
                        <input
                          type="text"
                          id="manualName"
                          placeholder="أدخل الاسم هنا..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">البريد الإلكتروني</label>
                        <input
                          type="email"
                          id="manualEmail"
                          placeholder="أدخل البريد الإلكتروني هنا..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addManualEmail();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">المبلغ (اختياري)</label>
                        <input
                          type="text"
                          id="manualPrice"
                          placeholder="مثال: 199 ريال"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addManualEmail}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center space-x-1 rtl:space-x-reverse"
                      >
                        <span>إضافة</span>
                      </button>
                    </div>
                    
                    {/* Manual Emails List */}
                    {manualForm.manualEmails.length > 0 && (
                      <div className="bg-white border border-orange-300 rounded-lg p-3">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-orange-700 mb-2">
                          <span className="font-medium">
                            البريد الإلكتروني المضافة يدوياً ({manualForm.manualEmails.length})
                          </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {manualForm.manualEmails.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                              <div className="text-sm text-gray-700 flex-1">
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="text-gray-500 text-xs">{item.email}</div>
                                {item.price && item.price.trim() !== '' && (
                                  <div className="text-green-600 text-xs font-medium">{item.price}</div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeManualEmail(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Optional Details Section */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">تفاصيل إضافية (اختيارية)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">رقم الطلب</label>
                      <input
                        type="text"
                        value={manualForm.requestId}
                        onChange={(e) => setManualForm({...manualForm, requestId: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="مثال: #12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">نوع الخدمة</label>
                      <input
                        type="text"
                        value={manualForm.purpose}
                        onChange={(e) => setManualForm({...manualForm, purpose: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="مثال: طلب تجنيس"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">المبلغ</label>
                    <input
                      type="text"
                      value={manualForm.price}
                      onChange={(e) => setManualForm({...manualForm, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: 199 ريال"
                    />
                  </div>
                </div>

                {/* Message Section */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">محتوى الرسالة</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الرسالة</label>
                      <input
                        type="text"
                        value={manualForm.subject}
                        onChange={(e) => setManualForm({...manualForm, subject: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="مثال: تذكير بدفع الطلب"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نص الرسالة</label>
                      <textarea
                        value={manualForm.message}
                        onChange={(e) => setManualForm({...manualForm, message: e.target.value})}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="اكتب نص التذكير هنا..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingManual || (manualForm.selectedUsers.length === 0 && manualForm.manualEmails.length === 0)}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    {isSendingManual ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          إرسال التذكير {(manualForm.selectedUsers.length + manualForm.manualEmails.length) > 0 && `(${manualForm.selectedUsers.length + manualForm.manualEmails.length})`}
                        </span>
                      </>
                    )}
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
