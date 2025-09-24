import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordChangedEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';


export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'رمز التحقق وكلمة السر الجديدة مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من قوة كلمة السر
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'كلمة السر يجب أن تكون 8 أحرف على الأقل' },
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

    // تشفير كلمة السر الجديدة
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // تحديث كلمة السر في قاعدة البيانات
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // تحديث حالة الرمز إلى مستخدم
    await prisma.passwordResetToken.update({
      where: { token },
      data: { used: true },
    });

    // إرسال بريد تأكيد تغيير كلمة السر
    await sendPasswordChangedEmail(
      resetToken.email,
      `${resetToken.user.firstName} ${resetToken.user.lastName}`
    );

    return NextResponse.json({
      message: 'تم تغيير كلمة السر بنجاح',
    });

  } catch (error) {
    console.error('خطأ في إعادة تعيين كلمة السر:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
