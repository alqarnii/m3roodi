import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - تحديث كود الخصم
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const couponId = parseInt(params.id);
    
    if (isNaN(couponId)) {
      return NextResponse.json(
        { success: false, message: 'معرف كود الخصم غير صحيح' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      code,

       discountType,
      discountValue,
      validFrom,
      validUntil,
      isActive
    } = body;

    // التحقق من وجود كود الخصم
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من أن الكود غير موجود (إذا تم تغييره)
    if (code && code.toUpperCase() !== existingCoupon.code) {
      const duplicateCoupon = await prisma.coupon.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (duplicateCoupon) {
        return NextResponse.json(
          { success: false, message: 'كود الخصم موجود بالفعل' },
          { status: 400 }
        );
      }
    }

    // التحقق من صحة التواريخ
    if (validFrom && validUntil) {
      const fromDate = new Date(validFrom);
      const untilDate = new Date(validUntil);

      if (fromDate >= untilDate) {
        return NextResponse.json(
          { success: false, message: 'تاريخ البداية يجب أن يكون قبل تاريخ الانتهاء' },
          { status: 400 }
        );
      }
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

    // تحديث كود الخصم
    const updatedCoupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue }),
        ...(validFrom && { validFrom: new Date(validFrom) }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث كود الخصم بنجاح',
      coupon: updatedCoupon
    });

  } catch (error) {
    console.error('خطأ في تحديث كود الخصم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تحديث كود الخصم' },
      { status: 500 }
    );
  }
}

// DELETE - حذف كود الخصم
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const couponId = parseInt(params.id);
    
    if (isNaN(couponId)) {
      return NextResponse.json(
        { success: false, message: 'معرف كود الخصم غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من وجود كود الخصم
    const existingCoupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    });

    if (!existingCoupon) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم غير موجود' },
        { status: 404 }
      );
    }

    // حذف كود الخصم
    await prisma.coupon.delete({
      where: { id: couponId }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف كود الخصم بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف كود الخصم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حذف كود الخصم' },
      { status: 500 }
    );
  }
}
