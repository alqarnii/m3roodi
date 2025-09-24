'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'm3roodi@gmail.com',
          replyTo: formData.email, // إضافة بريد المستخدم للرد عليه
          subject: `رسالة جديدة من ${formData.name}`,
          text: `
            اسم المرسل: ${formData.name}
            البريد الإلكتروني: ${formData.email}
            
            الرسالة:
            ${formData.message}
          `,
          html: `
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>رسالة جديدة من صفحة الاتصال</title>
              <style>
                body { 
                  font-family: 'Tajawal', Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #333; 
                  direction: rtl;
                  text-align: right;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: white;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  border-radius: 8px;
                }
                .header { 
                  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
                  color: white; 
                  padding: 30px; 
                  text-align: center; 
                  border-radius: 8px 8px 0 0;
                }
                .content { 
                  background: white; 
                  padding: 30px; 
                  text-align: right;
                }
                .message-info { 
                  background: #f8f9fa; 
                  padding: 20px; 
                  border-radius: 8px; 
                  margin: 20px 0; 
                  border-right: 4px solid #007bff;
                  border-left: none;
                  text-align: right;
                }
                .message-content { 
                  background: #f8f9fa; 
                  padding: 20px; 
                  border-radius: 8px; 
                  margin: 20px 0; 
                  border-right: 4px solid #28a745;
                  border-left: none;
                  text-align: right;
                }
                .footer { 
                  text-align: center; 
                  margin-top: 30px; 
                  color: #666; 
                  padding: 20px;
                  background: #f8f9fa;
                  border-radius: 0 0 8px 8px;
                }
                h1, h2, h3 { 
                  margin: 0 0 15px 0; 
                  color: #1f2937;
                  text-align: right;
                }
                p { 
                  margin: 0 0 10px 0; 
                  text-align: right;
                }
                .label {
                  font-weight: bold;
                  color: #1f2937;
                  margin-left: 10px;
                }
                .value {
                  color: #4b5563;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="color: white; margin: 0;">رسالة جديدة من صفحة الاتصال</h1>
                </div>
                
                <div class="content">
                  <div class="message-info">
                    <h3>📧 معلومات المرسل</h3>
                    <p><span class="label">الاسم:</span> <span class="value">${formData.name}</span></p>
                    <p><span class="label">البريد الإلكتروني:</span> <span class="value">${formData.email}</span></p>
                  </div>
                  
                  <div class="message-content">
                    <h3>💬 الرسالة</h3>
                    <p style="white-space: pre-wrap; line-height: 1.8;">${formData.message.replace(/\n/g, '<br>')}</p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px;">
                      يمكنك الرد على هذه الرسالة مباشرة للتواصل مع ${formData.name}
                    </p>
                  </div>
                </div>
                
                <div class="footer">
                  <p>مع تحيات فريق معروضي</p>
                  <p>📧 m3roodi@gmail.com | 📱 0551117720</p>
                </div>
              </div>
            </body>
            </html>
          `
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif', background: '#56a5de' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-4xl font-bold mb-4">
            اتصل بنا
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto">
            نحن هنا لمساعدتك. أرسل لنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-blue-50 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            أرسل لنا رسالة
          </h2>
          
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              <p className="font-semibold">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p className="font-semibold">حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                الاسم
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200"
                placeholder="أدخل اسمك"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                الرسالة
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-4 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg text-gray-900 bg-white transition-all duration-200 resize-none"
                placeholder="اكتب رسالتك هنا..."
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
