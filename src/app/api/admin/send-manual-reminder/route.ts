import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, requestId, purpose, price, subject, message } = body;
    
    // Debug logging
    console.log('Manual reminder data received:', { email, name, requestId, purpose, price, subject, message });

    if (!email || !name) {
      return NextResponse.json({
        success: false,
        message: 'البريد الإلكتروني والاسم مطلوبان'
      }, { status: 400 });
    }

    // Create manual reminder record
    const manualReminder = await prisma.manualReminder.create({
      data: {
        email,
        name,
        requestId: requestId || null,
        purpose: purpose || null,
        price: price || null,
        subject: subject || 'تذكير بدفع الطلب',
        message: message || 'يرجى إكمال عملية الدفع لطلبك'
      }
    });

    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject: subject || 'تذكير بدفع الطلب',
      html: `
        <div style="font-family: 'Tajawal', Arial, sans-serif; direction: rtl; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 24px;">معروضي</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">خدمة كتابة المعاريض الرسمية</p>
            </div>
            
            <div style="background-color: #fef3c7; border-right: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
              <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">${subject || 'تذكير بدفع الطلب'}</h2>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                مرحباً ${name}،
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                ${message || 'يرجى إكمال عملية الدفع لطلبك في أقرب وقت ممكن.'}
              </p>
            </div>

            ${(requestId || purpose || (price && price.trim() !== '')) ? `
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">تفاصيل الطلب:</h3>
              ${requestId ? `<p style="color: #6b7280; margin: 5px 0; font-size: 14px;"><strong>رقم الطلب:</strong> ${requestId}</p>` : ''}
              ${purpose ? `<p style="color: #6b7280; margin: 5px 0; font-size: 14px;"><strong>نوع الخدمة:</strong> ${purpose}</p>` : ''}
              ${price && price.trim() !== '' ? `<p style="color: #6b7280; margin: 5px 0; font-size: 14px;"><strong>المبلغ:</strong> ${price} ريال</p>` : ''}
            </div>
            ` : ''}

            <div style="background-color: #f0f9ff; border: 2px solid #0ea5e9; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px; text-align: center;">معلومات التحويل البنكي</h3>
              
              <div style="background-color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <p style="color: #374151; margin: 8px 0; font-size: 16px; font-weight: bold;">
                  <span style="color: #0c4a6e;">المصرف:</span> مصرف الراجحي
                </p>
                <p style="color: #374151; margin: 8px 0; font-size: 16px; font-weight: bold;">
                  <span style="color: #0c4a6e;">رقم الحساب:</span> 358608010441994
                </p>
                <p style="color: #374151; margin: 8px 0; font-size: 16px; font-weight: bold;">
                  <span style="color: #0c4a6e;">رقم الآيبان:</span> SA2980000358608010441994
                </p>
                <p style="color: #374151; margin: 8px 0; font-size: 16px; font-weight: bold;">
                  <span style="color: #0c4a6e;">اسم المؤسسة:</span> مؤسسة ابراج السماء للخدمات
                </p>
              </div>
              
              <div style="background-color: #fef3c7; border-right: 4px solid #f59e0b; padding: 12px; border-radius: 5px;">
                <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center; font-weight: bold;">
                  ⚠️ يرجى إرسال إيصال التحويل بعد إتمام العملية
                </p>
              </div>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
                شكراً لاختيارك خدمات معروضي
              </p>
              
              <div style="text-align: center; margin-top: 15px; padding: 15px; background-color: #f8f9fa; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0; font-weight: 500;">
                  مع تحيات موقع معروضي كتابة الخطابات m3roodi.com
                </p>
              </div>
            </div>
          </div>
        </div>
      `,
      text: `${subject || 'تذكير بدفع الطلب'}\n\nمرحباً ${name}،\n\n${message || 'يرجى إكمال عملية الدفع لطلبك في أقرب وقت ممكن.'}\n\n${(requestId || purpose || (price && price.trim() !== '')) ? 'تفاصيل الطلب:\n' : ''}${requestId ? `رقم الطلب: ${requestId}\n` : ''}${purpose ? `نوع الخدمة: ${purpose}\n` : ''}${price && price.trim() !== '' ? `المبلغ: ${price} ريال\n` : ''}\n\nمعلومات التحويل البنكي:\nالمصرف: مصرف الراجحي\nرقم الحساب: 358608010441994\nرقم الآيبان: SA2980000358608010441994\nاسم المؤسسة: مؤسسة ابراج السماء للخدمات\n\nيرجى إرسال إيصال التحويل بعد إتمام العملية\n\nمع تحيات موقع معروضي كتابة الخطابات m3roodi.com`
    });

    // Update manual reminder status
    await prisma.manualReminder.update({
      where: { id: manualReminder.id },
      data: {
        status: emailResult.success ? 'SENT' : 'FAILED',
        sentAt: emailResult.success ? new Date() : null
      }
    });

    if (emailResult.success) {
      return NextResponse.json({
        success: true,
        message: 'تم إرسال التذكير بنجاح',
        data: {
          id: manualReminder.id,
          email,
          status: 'SENT'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'فشل في إرسال التذكير'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending manual reminder:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في إرسال التذكير',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
