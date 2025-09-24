import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // جلب طلبات المستخدم
    const requests = await prisma.request.findMany({
      where: {
        userId: parseInt(userId)
      },
      include: {
        payments: {
          select: {
            amount: true,
            paymentStatus: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // تنسيق البيانات للعرض
    const formattedRequests = requests.map((request: any) => ({
      id: request.id,
      purpose: request.purpose,
      recipient: request.recipient,
      description: request.description,
      status: request.status,
      priority: request.priority,
      price: Number(request.price),
      phone: request.phone,
      idNumber: request.idNumber,
      attachments: request.attachments,
      voiceRecordingUrl: request.voiceRecordingUrl,
      createdAt: request.createdAt.toISOString(),
      deliveryDate: request.deliveryDate ? request.deliveryDate.toISOString() : null,
      totalPaid: request.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0),
      paymentStatus: request.payments.length > 0 ? 
        request.payments.every((p: any) => p.paymentStatus === 'COMPLETED') ? 'مكتمل' : 'جزئي' : 'غير مدفوع'
    }));

    return NextResponse.json({
      success: true,
      data: formattedRequests,
      total: formattedRequests.length
    });

  } catch (error) {
    console.error('خطأ في جلب طلبات المستخدم:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب طلبات المستخدم',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
