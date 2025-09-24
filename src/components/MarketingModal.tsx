'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Gift, Users, CheckCircle, AlertCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface MarketingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiscountGenerated: (discountCode: string) => void;
}

export default function MarketingModal({ isOpen, onClose, onDiscountGenerated }: MarketingModalProps) {
  const [emails, setEmails] = useState<string[]>(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDiscount, setGeneratedDiscount] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'success'>('form');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmails(['', '', '', '', '']);
      setGeneratedDiscount(null);
      setStep('form');
    }
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAllEmails = (): boolean => {
    return emails.every(email => email.trim() !== '' && validateEmail(email.trim()));
  };

  const checkTempEmail = async (email: string): Promise<boolean> => {
    // List of common temporary email domains
    const tempDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc',
      'yopmail.com', 'tempail.com', 'sharklasers.com', 'guerrillamail.info',
      'pokemail.net', 'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
      'mailnesia.com', 'mailcatch.com', 'inboxalias.com', 'mailmetrash.com',
      'trashmail.net', 'spamgourmet.com', 'spam.la', 'binkmail.com',
      'bobmail.info', 'chammy.info', 'devnullmail.com', 'letthemeatspam.com',
      'mailin8r.com', 'mailinator2.com', 'notmailinator.com', 'reallymymail.com',
      'sogetthis.com', 'spamhereplease.com', 'superrito.com', 'thisisnotmyrealemail.com',
      'tradermail.info', 'veryrealemail.com', 'wegwerfmail.de', 'wegwerfmail.net',
      'wegwerfmail.org', 'wegwerfmailadresse.de', 'wegwerpmailadres.nl', 'wegwerpmailadres.nl',
      'wegwerpmailadres.nl', 'wegwerpmailadres.nl', 'wegwerpmailadres.nl', 'wegwerpmailadres.nl'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return tempDomains.includes(domain || '');
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllEmails()) {
      toast.error('يرجى إدخال 5 عناوين بريد إلكتروني صحيحة');
      return;
    }

    // Check for temporary emails
    setIsLoading(true);
    let hasTempEmail = false;
    
    for (const email of emails) {
      if (await checkTempEmail(email.trim())) {
        hasTempEmail = true;
        break;
      }
    }

    if (hasTempEmail) {
      toast.error('لا يمكن استخدام عناوين البريد الإلكتروني المؤقتة');
      setIsLoading(false);
      return;
    }

    try {
      // Generate discount code
      const discountCode = `REF${Date.now().toString().slice(-6)}`;
      
      // Send referral emails
      const response = await fetch('/api/send-referral-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: emails.map(email => email.trim()),
          discountCode: discountCode
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedDiscount(discountCode);
        setStep('success');
        onDiscountGenerated(discountCode);
        toast.success('تم إرسال الرسائل بنجاح!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error sending referral emails:', error);
      toast.error('حدث خطأ في إرسال الرسائل. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">احصل على خصم خاص</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Description */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                شارك خدمتنا مع أصدقائك واحصل على خصم
              </h3>
              <p className="text-gray-600 text-sm">
                أدخل 5 عناوين بريد إلكتروني لأصدقائك أو معارفك وسنرسل لهم معلومات عن خدمتنا
              </p>
            </div>

            {/* Email inputs */}
            <div className="space-y-4 mb-6">
              {emails.map((email, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder={`البريد الإلكتروني ${index + 1}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                    {email && validateEmail(email) && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {email && !validateEmail(email) && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !validateAllEmails()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse mb-6"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>احصل على خصم الان</span>
                </>
              )}
            </button>

            {/* Terms */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-2 rtl:space-x-reverse">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">ملاحظة مهمة:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• يجب أن تكون عناوين البريد الإلكتروني صحيحة</li>
                    <li>• لا يمكن استخدام البريد المؤقت أو الوهمي</li>
                    <li>• سيتم إرسال رسالة تسويقية واحدة فقط لكل عنوان</li>
                    <li>• ستحصل على كود خصم فريد بعد الإرسال</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        )}

        {step === 'success' && generatedDiscount && (
          <div className="p-6 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            {/* Success message */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              مبروك! تم إرسال الرسائل بنجاح
            </h3>
            
            <p className="text-gray-600 mb-6">
              تم إرسال رسائل تسويقية إلى الأصدقاء الذين أدخلتهم. شكراً لك على المساعدة في نشر خدمتنا!
            </p>

            {/* Discount code */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">كود الخصم الخاص بك:</h4>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-300">
                <div className="text-2xl font-bold text-purple-600 mb-2">{generatedDiscount}</div>
                <p className="text-sm text-gray-600">استخدم هذا الكود في صفحة الدفع</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedDiscount);
                  toast.success('تم نسخ كود الخصم!');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                نسخ كود الخصم
              </button>
              
              <button
                onClick={onClose}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
