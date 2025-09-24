import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - جلب جميع أكواد الخصم
export async function GET(request: NextRequest) {
  try {
    console.log('محاولة جلب أكواد الخصم...');
    
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log('تم جلب أكواد الخصم بنجاح:', coupons.length);

    return NextResponse.json({
      success: true,
      coupons
    });

  } catch (error) {
    console.error('خطأ في جلب أكواد الخصم:', error);
    console.error('تفاصيل الخطأ:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب أكواد الخصم', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - إنشاء كود خصم جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      validFrom,
      validUntil,
      isActive
    } = body;

    // التحقق من البيانات المطلوبة
    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // التحقق من أن الكود غير موجود
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم موجود بالفعل' },
        { status: 400 }
      );
    }

    // التحقق من صحة التواريخ
    const fromDate = new Date(validFrom);
    const untilDate = new Date(validUntil);

    if (fromDate >= untilDate) {
      return NextResponse.json(
        { success: false, message: 'تاريخ البداية يجب أن يكون قبل تاريخ الانتهاء' },
        { status: 400 }
      );
    }

    // التحقق من صحة قيمة الخصم
    if (discountType === 'PERCENTAGE' && (discountValue < 0 || discountValue > 100)) {
      return NextResponse.json(
        { success: false, message: 'نسبة الخصم يجب أن تكون بين 0 و 100' },
        { status: 400 }
      );
    }

    if (discountType === 'FIXED_AMOUNT' && discountValue < 0) {
      return NextResponse.json(
        { success: false, message: 'قيمة الخصم يجب أن تكون أكبر من 0' },
        { status: 400 }
      );
    }

    // إنشاء كود الخصم
    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        validFrom: fromDate,
        validUntil: untilDate,
        isActive: isActive !== false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء كود الخصم بنجاح',
      coupon
    });

  } catch (error) {
    console.error('خطأ في إنشاء كود الخصم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء كود الخصم' },
      { status: 500 }
    );
  }
}
