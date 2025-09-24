import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getPriceByPurpose } from '@/lib/pricing';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request URL:', request.url);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    
    // تسجيل البيانات المستلمة
    console.log('Webhook body:', JSON.stringify(body, null, 2));
    console.log('Webhook status:', body.status);
    console.log('Webhook metadata:', body.metadata);
    console.log('Webhook reference:', body.reference);
    
    // التحقق من حالة الدفع - تحقق شامل
    const orderNumber = body.reference?.transaction;
    const status = body.status;
    
    console.log(`Payment status for order ${orderNumber}: ${status}`);
    
    if (status === 'CAPTURED') {
      // الدفع تم بنجاح
      console.log('Payment successful for order:', orderNumber);
      
      try {
        // تحديث حالة الدفع إلى مكتمل
        await updatePaymentStatus(orderNumber, 'COMPLETED');
        
        // التحقق من نوع الطلب من metadata
        const metadata = body.metadata || {};
        const requestType = metadata.requestType;
        
        if (requestType === 'new_request') {
          // إنشاء طلب معروض جديد
          console.log('Creating new request from webhook with metadata:', metadata);
          await createNewRequestFromWebhook(metadata, orderNumber, body.reference.chargeId);
        } else if (requestType === 'ready_template') {
          // معالجة طلب القالب الجاهز
          console.log('Processing ready template order:', orderNumber);
          await processReadyTemplateOrder(metadata, orderNumber, body.reference.chargeId);
        } else {
          // معالجة القوالب الجاهزة
          console.log('Processing ready template order:', orderNumber);
        }
        
        return NextResponse.json({ success: true, message: 'Payment confirmed and request processed' });
        
      } catch (error) {
        console.error('Error processing request after payment:', error);
        return NextResponse.json({ success: false, message: 'Payment confirmed but request processing failed' });
      }
      
    } else if (status === 'FAILED' || status === 'DECLINED' || status === 'CANCELLED') {
      // الدفع فشل أو تم إلغاؤه
      console.log(`Payment ${status.toLowerCase()} for order:`, orderNumber);
      
      // تحديث حالة الدفع في قاعدة البيانات إذا كان موجوداً
      try {
        await updatePaymentStatus(orderNumber, status);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
      
      return NextResponse.json({ success: false, message: `Payment ${status.toLowerCase()}` });
      
    } else if (status === 'INITIATED' || status === 'PENDING') {
      // الدفع في حالة انتظار
      console.log(`Payment ${status.toLowerCase()} for order:`, orderNumber);
      
      return NextResponse.json({ success: true, message: `Payment ${status.toLowerCase()}` });
      
    } else {
      // حالات أخرى غير معروفة
      console.log(`Unknown payment status: ${status} for order:`, orderNumber);
      
      return NextResponse.json({ success: false, message: `Unknown payment status: ${status}` });
    }
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ success: false, message: 'Webhook error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// دالة تحديث حالة الدفع
async function updatePaymentStatus(orderNumber: string, status: string) {
  try {
    // البحث عن الدفع في قاعدة البيانات
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: orderNumber
      }
    });

    if (payment) {
      // تحديث حالة الدفع
      let newPaymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' = 'PENDING';
      if (status === 'COMPLETED' || status === 'CAPTURED') {
        newPaymentStatus = 'COMPLETED';
      } else if (status === 'FAILED' || status === 'DECLINED' || status === 'CANCELLED') {
        newPaymentStatus = 'FAILED';
      }
      
      await prisma.payment.update({
        where: {
          id: payment.id
        },
        data: {
          paymentStatus: newPaymentStatus,
          notes: `تم تحديث الحالة عبر webhook: ${status}`,
          paymentDate: new Date() // إضافة تاريخ الدفع
        }
      });

      console.log(`Payment status updated for order ${orderNumber}: ${status}`);
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

// دالة معالجة طلب القالب الجاهز
async function processReadyTemplateOrder(metadata: any, orderNumber: string, chargeId: string) {
  try {
    const { customerName, customerEmail, purpose, recipient } = metadata;
    
    // إنشاء أو البحث عن المستخدم
    let user = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    if (!user) {
      // إنشاء مستخدم جديد
      user = await prisma.user.create({
        data: {
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          phone: '500000000',
          password: 'temp-password-' + Date.now()
        }
      });
    }

    // إنشاء طلب مؤقت للقالب الجاهز
    const tempRequest = await prisma.request.create({
      data: {
        userId: user.id,
        applicantName: customerName,
        purpose: purpose || 'قالب جاهز',
        recipient: recipient || 'غير محدد',
        description: 'طلب قالب جاهز - تم الدفع عبر بوابة تاب',
        phone: '500000000',
        price: getPriceByPurpose(purpose),
        priority: 'MEDIUM',
        status: 'COMPLETED' // مباشرة مكتمل
      }
    });

    // إنشاء سجل الدفع
    await prisma.payment.create({
      data: {
        requestId: tempRequest.id,
        amount: getPriceByPurpose(purpose),
        paymentMethod: 'ELECTRONIC',
        paymentStatus: 'COMPLETED',
        transactionId: orderNumber,
        paymentDate: new Date(),
        notes: 'دفع قالب جاهز عبر بوابة تاب'
      }
    });

    console.log('Ready template order processed successfully');
    
  } catch (error) {
    console.error('Error processing ready template order:', error);
    throw error;
  }
}

// دالة إنشاء طلب جديد من webhook
async function createNewRequestFromWebhook(metadata: any, orderNumber: string, chargeId: string) {
  try {
    // استخراج البيانات من metadata
    const { 
      customerName, 
      customerEmail, 
      purpose, 
      recipient, 
      applicantName,
      phone,
      idNumber,
      attachments,
      voiceRecordingUrl,
      description,
      existingRequestId
    } = metadata;
    
    // إنشاء أو البحث عن المستخدم
    let user = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    if (!user) {
      // إنشاء مستخدم جديد
      user = await prisma.user.create({
        data: {
          firstName: customerName.split(' ')[0] || customerName,
          lastName: customerName.split(' ').slice(1).join(' ') || '',
          email: customerEmail,
          phone: phone || '500000000',
          idNumber: idNumber || null,
          password: 'temp-password-' + Date.now() // كلمة مرور مؤقتة
        }
      });
    }

    let newRequest;
    
    // إذا كان هناك طلب محفوظ مسبقاً، نحدثه بدلاً من إنشاء طلب جديد
    if (existingRequestId) {
      console.log('Updating existing request:', existingRequestId);
      
      // تحديث الطلب الموجود
      newRequest = await prisma.request.update({
        where: { id: parseInt(existingRequestId) },
        data: {
          status: 'IN_PROGRESS' // تحديث الحالة إلى قيد المعالجة
        }
      });
      
      console.log('Existing request updated:', newRequest.id);
    } else {
      // إنشاء طلب جديد
      newRequest = await prisma.request.create({
        data: {
          userId: user.id,
          applicantName: applicantName || customerName,
          purpose: purpose || 'طلب معروض',
          recipient: recipient || 'غير محدد',
          description: description || 'تم إنشاء الطلب بعد تأكيد الدفع',
          phone: phone || '500000000',
          idNumber: idNumber || null,
          attachments: attachments || null,
          voiceRecordingUrl: voiceRecordingUrl || null,
          price: getPriceByPurpose(purpose),
          priority: 'MEDIUM',
          status: 'PENDING'
        }
      });
      
      console.log('New request created:', newRequest.id);
    }

    // إنشاء سجل الدفع
    await prisma.payment.create({
      data: {
        requestId: newRequest.id,
        amount: getPriceByPurpose(purpose),
        paymentMethod: 'ELECTRONIC',
        paymentStatus: 'COMPLETED',
        transactionId: orderNumber,
        paymentDate: new Date(),
        notes: 'تم الدفع عبر بوابة تاب'
      }
    });

    console.log('New request created successfully:', newRequest.id);
    
    // إرسال إشعار للإدارة
    try {
      const emailData = {
        to: 'm3roodi@gmail.com',
        replyTo: customerEmail,
        subject: `طلب معروض جديد #${newRequest.id.toString().padStart(6, '0')} - ${purpose}`,
        text: `طلب معروض جديد من العميل:

رقم الطلب: ${newRequest.id.toString().padStart(6, '0')}
رقم الطلب المالي: ${orderNumber}
اسم العميل: ${customerName}
البريد الإلكتروني: ${customerEmail}
نوع الخدمة: ${purpose}
المسؤول: ${recipient}
تم الدفع بنجاح عبر بوابة تاب

يمكنك مراجعة الطلب في لوحة الإدارة: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders`
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
    
  } catch (error) {
    console.error('Error creating request from webhook:', error);
    throw error;
  }
}