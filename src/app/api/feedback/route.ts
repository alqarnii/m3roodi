import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // التحقق من البيانات المطلوبة
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني والرسالة مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // حفظ النصيحة في قاعدة البيانات
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        phone: null,
        message,
        status: 'PENDING'
      }
    });

           // إنشاء كود خصم تلقائياً
           const discountCode = `FEEDBACK50${Date.now().toString().slice(-4)}`;
           const validUntil = new Date();
           validUntil.setDate(validUntil.getDate() + 30); // صالح لمدة 30 يوم

           const coupon = await prisma.coupon.create({
             data: {
               code: discountCode,
               discountType: 'PERCENTAGE',
               discountValue: 50,
               isActive: true,
               validFrom: new Date(),
               validUntil: validUntil
             }
           });

    return NextResponse.json(
      { 
        message: 'تم إرسال النصيحة بنجاح',
        feedbackId: feedback.id,
        discountCode: discountCode,
        couponId: coupon.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('خطأ في حفظ النصيحة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // بناء فلتر الحالة
    const where = status ? { status: status.toUpperCase() as any } : {};

    // جلب النصائح مع التصفح
    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where })
    ]);

    return NextResponse.json({
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب النصائح:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
