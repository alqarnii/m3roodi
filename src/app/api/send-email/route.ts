import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// إنشاء transporter للبريد الإلكتروني
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // التحقق من وجود متغيرات البيئة
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('متغيرات البريد الإلكتروني غير محددة');
    }

    // تحديد نوع الرسالة
    if (body.to && body.subject && body.text) {
      // رسالة اتصال من صفحة الاتصال
      const mailOptions = {
        from: process.env.SMTP_FROM || `معروضي <${process.env.SMTP_USER}>`,
        to: body.to,
        replyTo: body.replyTo || body.from, // إضافة Reply-To
        subject: body.subject,
        text: body.text,
        html: body.html || body.text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('تم إرسال رسالة الاتصال:', info.messageId);
      console.log('إلى:', body.to);
      console.log('Reply-To:', body.replyTo || body.from);

      return NextResponse.json({ 
        success: true, 
        message: 'تم إرسال الرسالة بنجاح',
        messageId: info.messageId
      });
    } else if (body.email && body.name && body.purpose && body.recipient) {
      // رسالة معلومات الحساب البنكي
      const { email, name, purpose, recipient, price } = body;

      // محتوى البريد الإلكتروني
      const emailContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>معلومات الحساب البنكي - معروضي</title>
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
            }
            .header { 
              background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
              color: white; 
              padding: 30px; 
              text-align: center; 
              border-radius: 0;
            }
            .content { 
              background: white; 
              padding: 30px; 
              border-radius: 0;
              text-align: right;
            }
            .bank-info { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-right: 4px solid #28a745;
              border-left: none;
              text-align: right;
            }
            .request-details { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-right: 4px solid #007bff;
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
            .highlight { 
              background: #fff3cd; 
              padding: 15px; 
              border-radius: 8px; 
              border: 1px solid #ffeaa7; 
              margin: 20px 0;
              text-align: right;
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
            .account-number {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              font-weight: bold;
              color: #1f2937;
              background: transparent;
              padding: 0;
              margin: 0;
            }
            .button-container {
              text-align: center;
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="color: white;">معروضي</h1>
            </div>
            
            <div class="content">
              <h2>مرحباً ${name} 👋</h2>
              <p>شكراً لك على طلبك. إليك معلومات الحساب البنكي لإتمام الدفع:</p>
              
              <div class="bank-info">
                <h3>🏦 معلومات الحساب البنكي</h3>
                <p><strong>البنك:</strong> مصرف الراجحي</p>
                <p><strong>رقم الحساب:</strong> <span class="account-number">358608010441994</span></p>
                <p><strong>رقم الايبان:</strong> <span class="account-number">SA2980000358608010441994</span></p>
                <p><strong>اسم المستفيد:</strong> مؤسسة ابراج السماء للخدمات</p>
              </div>
              
              <div class="request-details">
                <h3>📝 تفاصيل طلبك</h3>
                <p><strong>الهدف:</strong> ${purpose}</p>
                <p><strong>المسؤول:</strong> ${recipient}</p>
                ${price && price.trim() !== '' ? `<p><strong>المبلغ المطلوب:</strong> <span style="color: #10B981; font-weight: bold; font-size: 18px;">${price} ريال</span></p>` : ''}
              </div>
              
              <div class="highlight">
                <p><strong>💡 ملاحظة مهمة:</strong> بعد إتمام التحويل، سيتم التواصل معك لتأكيد الدفع وتقديم الخدمة المطلوبة.</p>
              </div>
              
              <div class="button-container">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/thank-you?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}" 
                   style="display: inline-block; background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  تم التحويل - تأكيد الدفع
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p>مع تحيات فريق معروضي</p>
              <p>📧 m3roodi@gmail.com | 📱 0551117720</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // إرسال البريد الإلكتروني
      const mailOptions = {
        from: process.env.SMTP_FROM || `معروضي <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'معلومات الحساب البنكي - معروضي',
        html: emailContent,
      };

      const info = await transporter.sendMail(mailOptions);

      // إرسال نسخة إلى m3roodi@gmail.com
      const adminMailOptions = {
        from: process.env.SMTP_FROM || `معروضي <${process.env.SMTP_USER}>`,
        to: 'm3roodi@gmail.com',
        subject: `طلب جديد - تحويل بنكي - ${name}`,
        html: `
          <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; padding: 20px; background-color: #f8f9fa;">
            <h2 style="color: #1e40af;">طلب جديد - تحويل بنكي</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>معلومات العميل:</h3>
              <p><strong>الاسم:</strong> ${name}</p>
              <p><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p><strong>نوع الخدمة:</strong> ${purpose}</p>
              <p><strong>المسؤول:</strong> ${recipient}</p>
              <p><strong>المبلغ:</strong> ${price || 199} ريال</p>
              <p><strong>طريقة الدفع:</strong> تحويل بنكي</p>
              <p><strong>التاريخ:</strong> ${new Date().toLocaleString('ar-SA')}</p>
            </div>
            <p style="color: #666;">تم إرسال هذا التأكيد تلقائياً من نظام معروضي</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(adminMailOptions);
        console.log('تم إرسال نسخة إلى m3roodi@gmail.com');
      } catch (adminEmailError) {
        console.error('خطأ في إرسال النسخة إلى m3roodi@gmail.com:', adminEmailError);
      }

      console.log('تم إرسال البريد الإلكتروني:', info.messageId);
      console.log('إلى:', email);

      return NextResponse.json({ 
        success: true, 
        message: 'تم إرسال البريد الإلكتروني بنجاح',
        messageId: info.messageId
      });
    } else {
      throw new Error('بيانات غير صحيحة - يجب تحديد نوع الرسالة');
    }

  } catch (error) {
    console.error('خطأ في إرسال البريد الإلكتروني:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في إرسال البريد الإلكتروني',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
