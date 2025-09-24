import nodemailer from 'nodemailer';

// تكوين مرسل البريد الإلكتروني
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'm3roodi@gmail.com',
    pass: process.env.SMTP_PASS || 'ggcc viel neje jone',
  },
});

// دالة إرسال رمز التحقق لإعادة تعيين كلمة السر
export async function sendPasswordResetEmail(
  email: string,
  verificationCode: string,
  userName: string
) {
  const mailOptions = {
    from: `"معروضي" <${process.env.SMTP_USER || 'm3roodi@gmail.com'}>`,
    to: email,
    subject: 'رمز التحقق لإعادة تعيين كلمة السر - معروضي',
    html: `
      <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #56a5de; margin: 0;">معروضي</h1>
          <p style="color: #666; margin: 10px 0;">خدمات كتابة المعاريض الاحترافية</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center; margin-bottom: 20px;">رمز التحقق لإعادة تعيين كلمة السر</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            مرحباً ${userName}،
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            لقد تلقينا طلباً لإعادة تعيين كلمة السر الخاصة بحسابك في معروضي.
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            رمز التحقق الخاص بك هو:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #56a5de; color: white; padding: 20px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; min-width: 200px;">
              ${verificationCode}
            </div>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            <strong>ملاحظة مهمة:</strong> هذا الرمز صالح لمدة 15 دقيقة فقط. إذا انتهت صلاحية الرمز، يمكنك طلب رمز جديد.
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            إذا لم تطلب إعادة تعيين كلمة السر، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
            معروضي - خدمات كتابة المعاريض الاحترافية<br>
            للتواصل: m3roodi@gmail.com
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('تم إرسال بريد إعادة تعيين كلمة السر:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('خطأ في إرسال بريد إعادة تعيين كلمة السر:', error);
    throw new Error('فشل في إرسال بريد إعادة تعيين كلمة السر');
  }
}

// دالة إرسال بريد تأكيد تغيير كلمة السر
export async function sendPasswordChangedEmail(
  email: string,
  userName: string
) {
  const mailOptions = {
    from: `"معروضي" <${process.env.SMTP_USER || 'm3roodi@gmail.com'}>`,
    to: email,
    subject: 'تم تغيير كلمة السر بنجاح - معروضي',
    html: `
      <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #56a5de; margin: 0;">معروضي</h1>
          <p style="color: #666; margin: 10px 0;">خدمات كتابة المعاريض الاحترافية</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;">تم تغيير كلمة السر بنجاح</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            مرحباً ${userName}،
          </p>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            تم تغيير كلمة السر الخاصة بحسابك في معروضي بنجاح.
          </p>
          
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; text-align: center; font-weight: bold;">
              ✅ تم تحديث كلمة السر بنجاح
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            إذا لم تقم أنت بهذا التغيير، يرجى التواصل معنا فوراً على:
          </p>
          
          <p style="text-align: center; margin: 20px 0;">
            <a href="mailto:m3roodi@gmail.com" style="color: #56a5de; text-decoration: none; font-weight: bold;">
              m3roodi@gmail.com
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
            معروضي - خدمات كتابة المعاريض الاحترافية<br>
            للتواصل: m3roodi@gmail.com
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('تم إرسال بريد تأكيد تغيير كلمة السر:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('خطأ في إرسال بريد تأكيد تغيير كلمة السر:', error);
    throw new Error('فشل في إرسال بريد تأكيد تغيير كلمة السر');
  }
}

// دالة إرسال تذكير الدفع
export async function sendPaymentReminderEmail(
  email: string,
  userName: string,
  requestId: string,
  purpose: string
) {
  const mailOptions = {
    from: `"معروضي" <${process.env.SMTP_USER || 'm3roodi@gmail.com'}>`,
    to: email,
    subject: 'تذكير مهم: إتمام الدفع لطلبك - معروضي',
    html: `
      <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #56a5de; margin: 0;">معروضي</h1>
          <p style="color: #666; margin: 10px 0;">خدمات كتابة المعاريض الاحترافية</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #dc3545; text-align: center; margin-bottom: 20px;">تذكير مهم: إتمام الدفع</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            عميلنا العزيز ${userName}،
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; text-align: center; font-weight: bold;">
              ⚠️ وصلنا طلبكم لكتابة الخطاب عبر موقع معروضي والى الان لم يتم اتمام الطلب
            </p>
          </div>
          
          ${!requestId || requestId === '' || requestId === '0' ? `
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            <strong>رسالة تذكير مخصصة</strong><br>
            هذه رسالة تذكير خاصة من فريق معروضي
          </p>
          ` : `
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            <strong>تفاصيل الطلب:</strong><br>
            رقم الطلب: ${requestId}<br>
            نوع الطلب: ${purpose}
          </p>
          `}
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            الرجاء اتمام الدفع لطلبكم ليتم كتابته بافضل صيغة لتحقق هدفكم بعون الله
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; margin: 30px 0;">
            <h3 style="color: #28a745; margin-bottom: 15px;">لاستكمال الطلب:</h3>
            <a 
              href="https://m3roodi.com/account" 
              style="display: inline-block; background-color: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 10px;"
            >
              🚀 اتمام الطلب الآن
            </a>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
              سيتم توجيهك لصفحة حسابك - تبويب "طلباتي"
            </p>
          </div>
          
          <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; color: #1565c0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; text-align: center; font-weight: bold;">
              📋 سجل دخول بأسم المستخدم وكلمة المرور
            </p>
            <p style="margin: 5px 0 0 0; text-align: center; font-size: 14px;">
              ثم اذهب لتبويب "طلباتي" لإتمام الدفع
            </p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #555; margin-bottom: 10px;">
              <strong>لأي مساعدة أو استفسارات راسلنا على:</strong>
            </p>
            <p style="color: #28a745; font-size: 18px; font-weight: bold; margin: 0;">
              📞 00966551117720
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
            مقدرين لكم تعاملكم معنا<br>
            <strong>موقع معروضي لكتابة الخطابات:</strong> 
            <a href="https://m3roodi.com/account" style="color: #56a5de; text-decoration: none;">https://m3roodi.com/account</a>
          </p>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; font-weight: 500;">
              مع تحيات موقع معروضي كتابة الخطابات m3roodi.com
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('تم إرسال تذكير الدفع:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('خطأ في إرسال تذكير الدفع:', error);
    return { success: false, error: error instanceof Error ? error.message : 'فشل في إرسال تذكير الدفع' };
  }
}



// دالة إرسال تذكير مخصص
export async function sendCustomReminderEmail(
  email: string,
  userName: string,
  message: string,
  subject: string
) {
  const mailOptions = {
    from: `"معروضي" <${process.env.SMTP_USER || 'm3roodi@gmail.com'}>`,
    to: email,
    subject: subject || 'تذكير من معروضي',
    html: `
      <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #56a5de; margin: 0;">معروضي</h1>
          <p style="color: #666; margin: 10px 0;">خدمات كتابة المعاريض الاحترافية</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #dc3545; text-align: center; margin-bottom: 20px;">تذكير مهم</h2>
          
          <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
            عميلنا العزيز ${userName}،
          </p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; text-align: center; font-weight: bold;">
              📢 رسالة تذكير خاصة من فريق معروضي
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; color: #495057; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; line-height: 1.6; text-align: center; font-size: 16px;">
              ${message}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #555; margin-bottom: 10px;">
              <strong>لأي مساعدة أو استفسارات راسلنا على:</strong>
            </p>
            <p style="color: #28a745; font-size: 18px; font-weight: bold; margin: 0;">
              📞 00966551117720
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center; margin: 0;">
            مقدرين لكم تعاملكم معنا<br>
            <strong>موقع معروضي لكتابة الخطابات:</strong> 
            <a href="https://m3roodi.com/account" style="color: #56a5de; text-decoration: none;">https://m3roodi.com/account</a>
          </p>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; font-weight: 500;">
              مع تحيات موقع معروضي كتابة الخطابات m3roodi.com
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('تم إرسال التذكير المخصص:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('خطأ في إرسال التذكير المخصص:', error);
    return { success: false, error: error instanceof Error ? error.message : 'فشل في إرسال التذكير المخصص' };
  }
}

// دالة اختبار إرسال البريد
export async function testEmailConnection() {
  try {
    console.log('🧪 اختبار اتصال البريد الإلكتروني...');
    console.log('📧 إعدادات SMTP:', {
      user: process.env.SMTP_USER || 'm3roodi@gmail.com',
      hasPass: !!process.env.SMTP_PASS,
      service: 'gmail'
    });
    
    await transporter.verify();
    console.log('✅ اتصال البريد الإلكتروني يعمل بشكل صحيح');
    return { success: true, message: 'اتصال البريد الإلكتروني يعمل بشكل صحيح' };
  } catch (error) {
    console.error('❌ فشل في اختبار اتصال البريد الإلكتروني:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'فشل في اختبار اتصال البريد الإلكتروني' 
    };
  }
}

// دالة عامة لإرسال البريد الإلكتروني
export async function sendEmail({ to, subject, html, text }: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    const mailOptions = {
      from: `"معروضي" <${process.env.SMTP_USER || 'm3roodi@gmail.com'}>`,
      to,
      subject,
      html,
      text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال البريد الإلكتروني بنجاح:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ فشل في إرسال البريد الإلكتروني:', error);
    throw error;
  }
}

export default transporter;
