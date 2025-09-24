import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { code, amount } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الكوبون العادي أولاً
    let coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    let isReferralCode = false;
    let referralDiscount = 0;

    // إذا لم يوجد كوبون عادي، ابحث عن كود الإحالة
    if (!coupon) {
      const referral = await prisma.referral.findUnique({
        where: { discountCode: code.toUpperCase() }
      });

      if (referral && referral.isActive) {
        isReferralCode = true;
        // خصم ثابت 20 ريال لكود الإحالة
        referralDiscount = 20;
      }
    }

    if (!coupon && !isReferralCode) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم غير صحيح أو غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من حالة الكوبون العادي
    if (coupon && !coupon.isActive) {
      return NextResponse.json(
        { success: false, message: 'كود الخصم غير نشط' },
        { status: 400 }
      );
    }

    // التحقق من تاريخ الصلاحية للكوبون العادي
    if (coupon) {
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return NextResponse.json(
          { success: false, message: 'كود الخصم منتهي الصلاحية' },
          { status: 400 }
        );
      }
    }

    // حساب الخصم
    let discountAmount = 0;
    let discountType = 'FIXED';
    let discountValue = 0;

    if (isReferralCode) {
      discountAmount = referralDiscount;
      discountValue = referralDiscount;
    } else if (coupon) {
      if (coupon.discountType === 'PERCENTAGE') {
        discountAmount = Math.round((amount * Number(coupon.discountValue)) / 100);
        discountType = 'PERCENTAGE';
        discountValue = Number(coupon.discountValue);
      } else {
        discountAmount = Math.round(Number(coupon.discountValue));
        discountType = 'FIXED';
        discountValue = Number(coupon.discountValue);
      }
    }

    const finalAmount = Math.max(0, amount - discountAmount);

    return NextResponse.json({
      success: true,
      coupon: {
        id: isReferralCode ? 'referral' : coupon?.id,
        code: code.toUpperCase(),
        discountType: discountType,
        discountValue: discountValue,
        discountAmount: Math.round(discountAmount),
        originalAmount: Math.round(amount),
        finalAmount: Math.round(finalAmount),
        description: isReferralCode ? 'خصم الإحالة - شكراً لك على المشاركة!' : 'خصم خاص'
      }
    });

  } catch (error) {
    console.error('خطأ في التحقق من كود الخصم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في التحقق من كود الخصم' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
