'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Users, TrendingUp } from 'lucide-react';

export default function FollowUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            متابعة المعاملات
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Tajawal, sans-serif' }}>
            خدمة متابعة المعاملات الحكومية والخاصة مع فريق متخصص من الموظفين
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                قريباً جداً! 🚀
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-xl mb-6 text-blue-100" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                نحن نعمل على تطوير خدمة متابعة المعاملات لتكون الأفضل في المملكة
              </p>
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                  ما ستوفره لك هذه الخدمة:
                </h3>
                <ul className="space-y-2 text-blue-100 text-right">
                  <li className="flex items-center justify-end gap-2">
                    <span>متابعة مستمرة لجميع مراحل المعاملة</span>
                    <TrendingUp className="w-5 h-5" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>تقارير دورية عن حالة المعاملة</span>
                    <FileText className="w-5 h-5" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>فريق متخصص من الموظفين</span>
                    <Users className="w-5 h-5" />
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span>إشعارات فورية بأي تحديثات</span>
                    <Clock className="w-5 h-5" />
                  </li>
                </ul>
              </div>
              <p className="text-lg font-medium text-blue-100" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                يمكنك الاشتراك في قائمة الانتظار للحصول على إشعار عند إطلاق الخدمة
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                فريق متخصص
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                موظفون مدربون على متابعة المعاملات الحكومية والخاصة بكفاءة عالية
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                متابعة مستمرة
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                متابعة يومية لجميع مراحل المعاملة مع تقارير مفصلة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إشعارات فورية
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                إشعارات فورية عبر الواتساب والبريد الإلكتروني بأي تحديثات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="text-center">
          <Card className="bg-white shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-600" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                هل تريد معرفة المزيد؟
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                يمكنك التواصل معنا للحصول على معلومات أكثر تفصيلاً عن هذه الخدمة
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/966551117720"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  تواصل معنا على الواتساب
                </a>
                <a
                  href="/contact"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  style={{ fontFamily: 'Tajawal, sans-serif' }}
                >
                  صفحة التواصل
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
