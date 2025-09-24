import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPriceByPurpose } from '@/lib/pricing';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('=== SUBMIT REQUEST API CALLED ===');
    const body = await request.json();
    console.log('=== REQUEST BODY ===', body);
    
    const { 
      name,
      email,
      purpose,
      recipient,
      description,
      applicantName,
      phone,
      idNumber,
      attachments,
      voiceRecording,
      saveWithoutPayment = false,
      couponCode,
      discountAmount = 0,
      finalAmount
    } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !purpose || !recipient || !phone) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // إذا لم يتم تحديد اسم مقدم الطلب، استخدم اسم المستخدم
    const finalApplicantName = applicantName || name;

    // التحقق من وجود وصف أو تسجيل صوتي
    if (!description && !voiceRecording) {
      return NextResponse.json(
        { success: false, message: 'يجب كتابة نبذة عن المعروض أو تسجيل صوتي' },
        { status: 400 }
      );
    }

    // إنشاء أو البحث عن المستخدم
    console.log('=== SEARCHING FOR USER ===', email);
    let user = await prisma.user.findUnique({
      where: { email }
    });
    console.log('=== USER FOUND ===', !!user);

    if (!user) {
      // إنشاء مستخدم جديد
      user = await prisma.user.create({
        data: {
          firstName: name.split(' ')[0] || name,
          lastName: name.split(' ').slice(1).join(' ') || '',
          email,
          phone,
          idNumber: idNumber || null,
          password: 'temp-password-' + Date.now() // كلمة مرور مؤقتة
        }
      });
    }

    // حساب الأسعار
    const originalPrice = getPriceByPurpose(purpose);
    const finalPrice = finalAmount || originalPrice;
    const actualDiscountAmount = discountAmount || (originalPrice - finalPrice);

    // إنشاء طلب جديد في قاعدة البيانات
    console.log('=== CREATING REQUEST ===');
    console.log('User ID:', user.id);
    console.log('Final Price:', finalPrice);
    
    const newRequest = await prisma.request.create({
      data: {
        userId: user.id, // ربط الطلب بالمستخدم
        applicantName: finalApplicantName,
        purpose,
        recipient,
        description: description || `تسجيل صوتي من ${name}`,
        phone,
        idNumber: idNumber || null,
        attachments: attachments || null,
        voiceRecordingUrl: voiceRecording || null, // حفظ رابط التسجيل الصوتي
        price: finalPrice, // السعر النهائي
        originalPrice: couponCode ? originalPrice : null,
        discountAmount: couponCode ? actualDiscountAmount : null,
        finalPrice: couponCode ? finalPrice : null,
        couponCode: couponCode || null,
        priority: 'MEDIUM',
        status: 'PENDING'
      }
    });
    
    console.log('=== REQUEST CREATED ===', newRequest.id);

    // إذا كان الطلب محفوظ بدون دفع، لا نحتاج لإرسال إشعار للإدارة
    if (saveWithoutPayment) {
      return NextResponse.json({
        success: true,
        message: 'تم حفظ الطلب بنجاح',
        requestId: newRequest.id
      });
    }

    // إرسال إشعار للإدارة عبر البريد الإلكتروني
    try {
      const emailData = {
        to: 'm3roodi@gmail.com',
        replyTo: email,
        subject: `طلب معروض جديد #${newRequest.id.toString().padStart(6, '0')} - ${purpose}`,
        text: `طلب معروض جديد من العميل:\n\nرقم الطلب: ${newRequest.id.toString().padStart(6, '0')}\nاسم العميل: ${name}\nالبريد الإلكتروني: ${email}\nاسم مقدم الطلب: ${finalApplicantName}\nرقم الجوال: ${phone}\n${idNumber ? `رقم الهوية: ${idNumber}\n` : ''}نوع الخدمة: ${purpose}\nالمسؤول: ${recipient}\nالنبذة: ${description || 'تم التسجيل الصوتي'}\n${attachments ? `المرفقات: ${attachments}\n` : ''}${voiceRecording ? 'التسجيل الصوتي: متوفر\n' : ''}يمكنك مراجعة الطلب في لوحة الإدارة: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders`,
        html: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>طلب معروض جديد</title>
            <style>
              body { font-family: 'Tajawal', Arial, sans-serif; line-height: 1.6; color: #333; direction: rtl; text-align: right; margin: 0; padding: 0; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-radius: 8px; }
              .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: white; padding: 30px; text-align: right; }
              .customer-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #22c55e; border-left: none; text-align: right; }
              .request-details { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-right: 4px solid #f59e0b; border-left: none; text-align: right; }
              .footer { text-align: center; margin-top: 30px; color: #666; padding: 20px; background: #f8fafc; border-radius: 0 0 8px 8px; }
              h1, h2, h3 { margin: 0 0 15px 0; color: #1f2937; text-align: right; }
              p { margin: 0 0 10px 0; text-align: right; }
              .label { font-weight: bold; color: #1f2937; margin-left: 10px; }
              .value { color: #4b5563; }
              .request-number { font-size: 24px; font-weight: bold; color: #0ea5e9; background: #f0f9ff; padding: 10px 20px; border-radius: 8px; display: inline-block; margin: 10px 0; }
              .cta-button { display: inline-block; background: #0ea5e9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: white; margin: 0;">🎉 طلب معروض جديد</h1>
                <p style="color: #d1fae5; margin: 10px 0 0 0;">تم استلام طلب جديد من العميل</p>
              </div>
              <div class="content">
                <div class="request-number">رقم الطلب: ${newRequest.id.toString().padStart(6, '0')}</div>
                <div class="customer-info">
                  <h3>👤 بيانات العميل</h3>
                  <p><span class="label">الاسم:</span> <span class="value">${name}</span></p>
                  <p><span class="label">البريد الإلكتروني:</span> <span class="value">${email}</span></p>
                  <p><span class="label">اسم مقدم الطلب:</span> <span class="value">${finalApplicantName}</span></p>
                  <p><span class="label">رقم الجوال:</span> <span class="value">${phone}</span></p>
                  ${idNumber ? `<p><span class="label">رقم الهوية:</span> <span class="value">${idNumber}</span></p>` : ''}
                </div>
                <div class="request-details">
                  <h3>📝 تفاصيل الطلب</h3>
                  <p><span class="label">نوع الخدمة:</span> <span class="value">${purpose}</span></p>
                  <p><span class="label">المسؤول:</span> <span class="value">${recipient}</span></p>
                  <p><span class="label">النبذة:</span> <span class="value">${description || 'تم التسجيل الصوتي'}</span></p>
                  ${attachments ? `<p><span class="label">المرفقات:</span> <span class="value">${attachments}</span></p>` : ''}
                  ${voiceRecording ? `<p><span class="label">التسجيل الصوتي:</span> <span class="value">✅ متوفر</span></p>` : ''}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders" class="cta-button">🚀 مراجعة الطلب في لوحة الإدارة</a>
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
      };

      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
    } catch (emailError) {
      console.error('خطأ في إرسال إشعار الإدارة:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.',
      data: {
        requestId: newRequest.id,
        requestNumber: newRequest.id.toString().padStart(6, '0'),
        status: 'PENDING'
      }
    });

  } catch (error) {
    console.error('=== ERROR IN SUBMIT REQUEST ===', error);
    console.error('Error type:', typeof error);
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // رسائل خطأ محددة بدلاً من رسالة عامة
    let errorMessage = 'فشل في إرسال الطلب';
    
    if (error instanceof Error) {
      if (error.message.includes('PrismaClientInitializationError')) {
        errorMessage = 'مشكلة في قاعدة البيانات، يرجى المحاولة لاحقاً';
      } else if (error.message.includes('DATABASE_URL')) {
        errorMessage = 'إعدادات قاعدة البيانات غير صحيحة';
      } else if (error.message.includes('Unique constraint')) {
        errorMessage = 'هذا البريد الإلكتروني مستخدم بالفعل';
      } else {
        errorMessage = `خطأ تقني: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
