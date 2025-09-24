import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPriceByPurpose } from '@/lib/pricing';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const requestData = searchParams.get('requestData');
    
    if (!orderNumber) {
      return NextResponse.json({ success: false, message: 'رقم الطلب مطلوب' });
    }

    console.log('=== PAYMENT SUCCESS ROUTE CALLED ===');
    console.log('Order Number:', orderNumber);
    console.log('Request Data:', requestData);

    // إذا كان هناك بيانات طلب، أنشئ الطلب
    if (requestData) {
      try {
        const parsedRequestData = JSON.parse(decodeURIComponent(requestData));
        console.log('Parsed Request Data:', parsedRequestData);

        // إنشاء أو البحث عن المستخدم
        let user = await prisma.user.findUnique({
          where: { email: parsedRequestData.email }
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              firstName: parsedRequestData.name.split(' ')[0] || parsedRequestData.name,
              lastName: parsedRequestData.name.split(' ').slice(1).join(' ') || '',
              email: parsedRequestData.email,
              phone: parsedRequestData.phone || '500000000',
              idNumber: parsedRequestData.idNumber || null,
              password: 'temp-password-' + Date.now() // كلمة مرور مؤقتة
            }
          });
        }

        // إنشاء طلب جديد
        const newRequest = await prisma.request.create({
          data: {
            userId: user.id,
            applicantName: parsedRequestData.applicantName || parsedRequestData.name,
            purpose: parsedRequestData.purpose || 'طلب معروض',
            recipient: parsedRequestData.recipient || 'غير محدد',
            description: parsedRequestData.description || 'تم إنشاء الطلب بعد تأكيد الدفع',
            phone: parsedRequestData.phone || '500000000',
            idNumber: parsedRequestData.idNumber || null,
            attachments: parsedRequestData.attachments || null,
            voiceRecordingUrl: parsedRequestData.voiceRecording || null,
            price: getPriceByPurpose(parsedRequestData.purpose),
            priority: 'MEDIUM',
            status: 'PENDING'
          }
        });

        // إنشاء سجل الدفع
        await prisma.payment.create({
          data: {
            requestId: newRequest.id,
            amount: getPriceByPurpose(parsedRequestData.purpose),
            paymentMethod: 'ELECTRONIC',
            paymentStatus: 'COMPLETED',
            transactionId: orderNumber,
            paymentDate: new Date(),
            notes: 'تم الدفع عبر بوابة تاب'
          }
        });

        console.log('Request created successfully:', newRequest.id);
        
        // إرسال إشعار للإدارة
        try {
          const emailData = {
            to: 'm3roodi@gmail.com',
            replyTo: parsedRequestData.email,
            subject: `طلب معروض جديد #${newRequest.id.toString().padStart(6, '0')} - ${parsedRequestData.purpose}`,
            text: `طلب معروض جديد من العميل:

رقم الطلب: ${newRequest.id.toString().padStart(6, '0')}
رقم الطلب المالي: ${orderNumber}
اسم العميل: ${parsedRequestData.name}
البريد الإلكتروني: ${parsedRequestData.email}
نوع الخدمة: ${parsedRequestData.purpose}
المسؤول: ${parsedRequestData.recipient}
تم الدفع بنجاح عبر بوابة تاب

يمكنك مراجعة الطلب في لوحة الإدارة: ${process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com'}/admin/orders`
          };

          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com'}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          });
        } catch (emailError) {
          console.error('خطأ في إرسال إشعار الإدارة:', emailError);
        }

      } catch (error) {
        console.error('Error creating request:', error);
      }
    }

    await prisma.$disconnect();
    
    // توجيه المستخدم إلى صفحة الشكر مع البيانات
    const thankYouUrl = new URL('/thank-you', request.url);
    thankYouUrl.searchParams.set('orderNumber', orderNumber);
    thankYouUrl.searchParams.set('status', 'success');
    thankYouUrl.searchParams.set('paymentMethod', 'electronic');
    
    if (requestData) {
      try {
        const parsedRequestData = JSON.parse(decodeURIComponent(requestData));
        thankYouUrl.searchParams.set('name', parsedRequestData.name || '');
        thankYouUrl.searchParams.set('email', parsedRequestData.email || '');
        thankYouUrl.searchParams.set('purpose', parsedRequestData.purpose || '');
        thankYouUrl.searchParams.set('recipient', parsedRequestData.recipient || '');
      } catch (error) {
        console.error('Error parsing request data for redirect:', error);
      }
    }
    
    return NextResponse.redirect(thankYouUrl);

  } catch (error) {
    console.error('خطأ في payment-success:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'حدث خطأ في تأكيد الدفع'
    }, { status: 500 });
  }
}
