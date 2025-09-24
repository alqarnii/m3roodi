import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء transporter لـ Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'm3roodi@gmail.com',
        pass: process.env.SMTP_PASS, // كلمة مرور التطبيق من Gmail
      },
    });

    // إعداد رسالة البريد الإلكتروني
    const mailOptions = {
      from: process.env.GMAIL_USER || 'm3roodi@gmail.com',
      to: 'm3roodi@gmail.com',
      subject: `ملاحظات جديدة من ${name}`,
      html: `
        <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e40af; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px;">
              📝 ملاحظات جديدة من موقع معروضي
            </h2>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 15px;">معلومات المرسل:</h3>
              <p style="margin: 8px 0; color: #4b5563;"><strong>الاسم:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #4b5563;"><strong>البريد الإلكتروني:</strong> ${email}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-right: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-bottom: 15px;">الملاحظات أو الرسالة:</h3>
              <p style="color: #78350f; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                تم إرسال هذه الرسالة من نموذج الملاحظات في موقع معروضي
              </p>
              <p style="color: #6b7280; font-size: 14px;">
                تاريخ الإرسال: ${new Date().toLocaleString('ar-SA')}
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // إرسال البريد الإلكتروني
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'تم إرسال الملاحظات بنجاح' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending feedback:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الملاحظات' },
      { status: 500 }
    );
  }
}
