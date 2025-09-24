import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'رمز التحقق مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الرمز في قاعدة البيانات
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: 'رمز التحقق غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من انتهاء صلاحية الرمز
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'انتهت صلاحية رمز التحقق' },
        { status: 400 }
      );
    }

    // التحقق من استخدام الرمز مسبقاً
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'تم استخدام رمز التحقق مسبقاً' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      email: resetToken.email,
      message: 'رمز التحقق صحيح',
    });

  } catch (error) {
    console.error('خطأ في التحقق من رمز إعادة تعيين كلمة السر:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
