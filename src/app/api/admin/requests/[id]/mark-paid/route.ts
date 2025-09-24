import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    const body = await request.json();
    const { paymentStatus, paymentMethod } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من وجود الطلب
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        payments: true
      }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // إنشاء أو تحديث سجل الدفع
    if (paymentStatus === 'completed') {
      // البحث عن سجل دفع موجود
      const existingPayment = existingRequest.payments.find(
        payment => payment.paymentStatus === 'PENDING' || payment.paymentStatus === 'FAILED'
      );

      if (existingPayment) {
        // تحديث سجل الدفع الموجود
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: {
            paymentStatus: 'COMPLETED',
            paymentDate: new Date(),
            notes: 'تم تحديث الدفع يدوياً من الإدارة'
          }
        });
      } else {
        // إنشاء سجل دفع جديد
        await prisma.payment.create({
          data: {
            requestId: requestId,
            amount: existingRequest.price,
            paymentMethod: paymentMethod === 'manual' ? 'BANK_TRANSFER' : 'ELECTRONIC',
            paymentStatus: 'COMPLETED',
            paymentDate: new Date(),
            notes: 'تم إتمام الدفع يدوياً من الإدارة'
          }
        });
      }

      // تحديث حالة الطلب إلى "قيد المعالجة"
      await prisma.request.update({
        where: { id: requestId },
        data: {
          status: 'IN_PROGRESS'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الدفع بنجاح',
      data: {
        requestId: requestId,
        paymentStatus: paymentStatus,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث حالة الدفع:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في تحديث حالة الدفع',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
