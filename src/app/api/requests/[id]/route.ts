import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    
    if (isNaN(requestId)) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب غير صحيح' },
        { status: 400 }
      );
    }

    // جلب بيانات الطلب مع المستخدم
    const requestData = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        user: true,
        payments: true
      }
    });

    if (!requestData) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // حساب إجمالي المدفوع
    const totalPaid = requestData.payments
      .filter(payment => payment.paymentStatus === 'COMPLETED')
      .reduce((sum, payment) => sum + Number(payment.amount), 0);

    // تحديد حالة الدفع
    let paymentStatus = 'غير مدفوع';
    if (totalPaid >= Number(requestData.price)) {
      paymentStatus = 'مكتمل';
    } else if (totalPaid > 0) {
      paymentStatus = 'جزئي';
    }

    // تنسيق البيانات للإرسال
    const formattedRequest = {
      id: requestData.id,
      purpose: requestData.purpose,
      recipient: requestData.recipient,
      description: requestData.description,
      applicantName: requestData.applicantName,
      phone: requestData.phone,
      idNumber: requestData.idNumber,
      attachments: requestData.attachments,
      voiceRecordingUrl: requestData.voiceRecordingUrl,
      status: requestData.status,
      price: requestData.price,
      totalPaid: totalPaid,
      paymentStatus: paymentStatus,
      createdAt: requestData.createdAt,
      updatedAt: requestData.updatedAt,
      user: requestData.user ? {
        firstName: requestData.user.firstName,
        lastName: requestData.user.lastName,
        email: requestData.user.email,
        phone: requestData.user.phone
      } : null
    };

    return NextResponse.json({
      success: true,
      request: formattedRequest
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات الطلب:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب بيانات الطلب' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
