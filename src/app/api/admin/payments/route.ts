import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};
    
    if (status !== 'all') {
      where.paymentStatus = status;
    }
    
    if (search) {
      where.OR = [
        { transactionId: { contains: search, mode: 'insensitive' } },
        { bankReference: { contains: search, mode: 'insensitive' } },
        { request: { applicantName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // جلب المدفوعات مع معلومات الطلب
    const [payments, totalCount] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          request: {
            select: {
              applicantName: true,
              purpose: true,
              recipient: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.payment.count({ where })
    ]);

    // تنسيق البيانات للعرض
    const formattedPayments = payments.map((payment: any) => ({
      id: payment.id,
      requestId: payment.requestId,
      applicantName: payment.request.applicantName,
      amount: Number(payment.amount),
      paymentMethod: payment.paymentMethod === 'BANK_TRANSFER' ? 'تحويل بنكي' : 'دفع إلكتروني',
      paymentStatus: payment.paymentStatus === 'COMPLETED' ? 'مكتمل' : 
                    payment.paymentStatus === 'PENDING' ? 'معلق' :
                    payment.paymentStatus === 'FAILED' ? 'فشل' : 'مسترد',
      transactionId: payment.transactionId,
      bankReference: payment.bankReference,
      paymentDate: payment.paymentDate ? payment.paymentDate.toISOString().split('T')[0] : null,
      createdAt: payment.createdAt.toISOString(),
      notes: payment.notes,
      purpose: payment.request.purpose,
      recipient: payment.request.recipient
    }));

    return NextResponse.json({
      success: true,
      data: formattedPayments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب المدفوعات:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب المدفوعات',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, paymentStatus, notes } = body;

    if (!paymentId || !paymentStatus) {
      return NextResponse.json(
        { success: false, message: 'معرف الدفعة والحالة مطلوبان' },
        { status: 400 }
      );
    }

    // تحديث حالة الدفع
    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(paymentId) },
      data: {
        paymentStatus: paymentStatus === 'مكتمل' ? 'COMPLETED' :
                      paymentStatus === 'معلق' ? 'PENDING' :
                      paymentStatus === 'فشل' ? 'FAILED' : 'REFUNDED',
        notes,
        paymentDate: paymentStatus === 'مكتمل' ? new Date() : null
      },
      include: {
        request: {
          select: {
            applicantName: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الدفع بنجاح',
      data: {
        id: updatedPayment.id,
        paymentStatus: updatedPayment.paymentStatus === 'COMPLETED' ? 'مكتمل' : 
                      updatedPayment.paymentStatus === 'PENDING' ? 'معلق' :
                      updatedPayment.paymentStatus === 'FAILED' ? 'فشل' : 'مسترد',
        notes: updatedPayment.notes,
        paymentDate: updatedPayment.paymentDate ? updatedPayment.paymentDate.toISOString().split('T')[0] : null
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الدفع:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في تحديث الدفع',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
