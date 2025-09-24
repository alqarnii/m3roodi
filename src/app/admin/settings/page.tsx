'use client';

import { useState } from 'react';

interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  defaultCurrency: string;
  timezone: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoAssignRequests: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  backupFrequency: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: 'معروضي',
    companyEmail: 'info@m3roodi.com',
    companyPhone: '0551117720',
    companyAddress: 'الرياض، المملكة العربية السعودية',
    defaultCurrency: 'SAR',
    timezone: 'Asia/Riyadh',
    language: 'ar',
    emailNotifications: true,
    smsNotifications: false,
    autoAssignRequests: true,
    maxFileSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'png'],
    maintenanceMode: false,
    backupFrequency: 'daily'
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // محاكاة حفظ الإعدادات
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('تم حفظ الإعدادات بنجاح');
  };

  const tabs = [
    { id: 'general', name: 'عام', icon: '⚙️' },
    { id: 'notifications', name: 'الإشعارات', icon: '🔔' },
    { id: 'security', name: 'الأمان', icon: '🔒' },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: '💾' },
    { id: 'advanced', name: 'متقدم', icon: '🔧' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إعدادات النظام</h1>
        <p className="text-gray-600">تكوين إعدادات النظام والشركة</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="ml-2 rtl:ml-0 rtl:mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">إعدادات الشركة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم الشركة
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={settings.companyPhone}
                    onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة الافتراضية
                  </label>
                  <select
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({...settings, defaultCurrency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة الزمنية
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                    <option value="Asia/Dubai">دبي (GMT+4)</option>
                    <option value="Europe/London">لندن (GMT+0)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اللغة
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الشركة
                </label>
                <textarea
                  value={settings.companyAddress}
                  onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">إعدادات الإشعارات</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-500">إرسال إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">إشعارات الرسائل النصية</h4>
                    <p className="text-sm text-gray-500">إرسال إشعارات عبر الرسائل النصية</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">تعيين الطلبات تلقائياً</h4>
                    <p className="text-sm text-gray-500">تعيين الطلبات الجديدة للموظفين تلقائياً</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoAssignRequests}
                      onChange={(e) => setSettings({...settings, autoAssignRequests: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">إعدادات الأمان</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأقصى لحجم الملف (ميجابايت)
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    أنواع الملفات المسموحة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['pdf', 'doc', 'docx', 'jpg', 'png', 'zip', 'rar'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          checked={settings.allowedFileTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettings({...settings, allowedFileTypes: [...settings.allowedFileTypes, type]});
                            } else {
                              setSettings({...settings, allowedFileTypes: settings.allowedFileTypes.filter(t => t !== type)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type.toUpperCase()}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">إعدادات النسخ الاحتياطي</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تكرار النسخ الاحتياطي
                  </label>
                  <select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hourly">كل ساعة</option>
                    <option value="daily">يومياً</option>
                    <option value="weekly">أسبوعياً</option>
                    <option value="monthly">شهرياً</option>
                  </select>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-blue-400">💾</span>
                    </div>
                    <div className="mr-3 rtl:mr-0 rtl:ml-3">
                      <h3 className="text-sm font-medium text-blue-800">آخر نسخة احتياطية</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>تم إنشاء آخر نسخة احتياطية في: 2024-01-15 14:30</p>
                        <p>حجم النسخة: 2.5 ميجابايت</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    إنشاء نسخة احتياطية الآن
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    استعادة من نسخة احتياطية
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">الإعدادات المتقدمة</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">وضع الصيانة</h4>
                    <p className="text-sm text-gray-500">إيقاف النظام مؤقتاً للصيانة</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="mr-3 rtl:mr-0 rtl:ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">تحذير</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>هذه الإعدادات متقدمة وقد تؤثر على أداء النظام. تأكد من فهمك لها قبل التغيير.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 rtl:space-x-reverse">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    إعادة تعيين الإعدادات
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
                    تصدير الإعدادات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>
    </div>
  );
}
