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
    const userId = searchParams.get('userId') || '';
    
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};
    
    if (status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.OR = [
        { applicantName: { contains: search, mode: 'insensitive' } },
        { purpose: { contains: search, mode: 'insensitive' } },
        { recipient: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // إضافة فلتر المستخدم إذا تم تحديده
    if (userId) {
      where.userId = parseInt(userId);
    }

    // إظهار جميع الطلبات (مدفوعة وغير مدفوعة) مع تمييز حالة الدفع
    // where.payments = {
    //   some: {
    //     paymentStatus: 'COMPLETED'
    //   }
    // };

    // جلب الطلبات مع معلومات المستخدم والموظف المسؤول
    let requests: any[] = [];
    let totalCount = 0;
    
    try {
      const result = await Promise.all([
        prisma.request.findMany({
          where,
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            },
            assignedTo: {
              select: {
                firstName: true,
                lastName: true,
                position: true
              }
            },
            payments: {
              select: {
                amount: true,
                paymentStatus: true,
                paymentMethod: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          skip,
          take: limit
        }),
        prisma.request.count({ where })
      ]);
      
      requests = result[0];
      totalCount = result[1];
    } catch (error) {
      console.error('خطأ في جلب الطلبات من قاعدة البيانات:', error);
      requests = [];
      totalCount = 0;
    }

    // تنسيق البيانات للعرض
    const formattedRequests = requests.map((request: any) => ({
      id: request.id,
      applicantName: request.applicantName,
      purpose: request.purpose,
      recipient: request.recipient,
      description: request.description,
      status: request.status,
      priority: request.priority,
      price: Number(request.price),
      originalPrice: request.originalPrice ? Number(request.originalPrice) : Number(request.price),
      discountAmount: request.discountAmount ? Number(request.discountAmount) : 0,
      finalPrice: request.finalPrice ? Number(request.finalPrice) : Number(request.price),
      couponCode: request.couponCode,
      phone: request.phone, // إضافة رقم الجوال
      idNumber: request.idNumber, // إضافة رقم الهوية
      attachments: request.attachments, // إضافة المرفقات
      voiceRecordingUrl: request.voiceRecordingUrl, // إضافة رابط التسجيل الصوتي
      createdAt: request.createdAt.toISOString(),
      deliveryDate: request.deliveryDate ? request.deliveryDate.toISOString().split('T')[0] : null,
      assignedTo: request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.lastName}` : null,
      user: request.user ? {
        name: `${request.user.firstName} ${request.user.lastName}`,
        email: request.user.email,
        phone: request.user.phone
      } : null,
      totalPaid: request.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0),
      paymentStatus: request.payments.length > 0 ? 
        request.payments.every((p: any) => p.paymentStatus === 'COMPLETED') ? 'مكتمل' : 'جزئي' : 'غير مدفوع',
      paymentMethod: request.payments.length > 0 ? 
        request.payments[0].paymentMethod === 'BANK_TRANSFER' ? 'تحويل بنكي' : 
        request.payments[0].paymentMethod === 'ELECTRONIC' ? 'دفع إلكتروني' : 'غير محدد' : 'غير محدد'
    }));

    return NextResponse.json({
      success: true,
      data: formattedRequests,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب الطلبات',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      applicantName, 
      purpose, 
      recipient, 
      description, 
      phone, 
      idNumber, 
      price, 
      priority = 'MEDIUM',
      assignedToId 
    } = body;

    // التحقق من البيانات المطلوبة
    if (!applicantName || !purpose || !recipient || !description || !phone || !price) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء طلب جديد
    const newRequest = await prisma.request.create({
      data: {
        applicantName,
        purpose,
        recipient,
        description,
        phone,
        idNumber,
        price: parseFloat(price),
        priority,
        assignedToId: assignedToId ? parseInt(assignedToId) : null,
        status: 'PENDING'
      },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            position: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      data: {
        id: newRequest.id,
        applicantName: newRequest.applicantName,
        purpose: newRequest.purpose,
        recipient: newRequest.recipient,
        status: newRequest.status,
        priority: newRequest.priority,
        price: Number(newRequest.price),
        createdAt: newRequest.createdAt.toISOString().split('T')[0],
        assignedTo: newRequest.assignedTo ? `${newRequest.assignedTo.firstName} ${newRequest.assignedTo.lastName}` : null
      }
    });

  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في إنشاء الطلب',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
