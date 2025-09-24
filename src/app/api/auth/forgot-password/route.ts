import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // لا نريد إخبار المستخدم أن البريد الإلكتروني غير موجود لأسباب أمنية
      return NextResponse.json(
        { message: 'إذا كان البريد الإلكتروني مسجل لدينا، ستتلقى رابط إعادة تعيين كلمة السر قريباً' },
        { status: 200 }
      );
    }

    // إنشاء رمز تحقق من 6 أرقام
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // صالح لمدة 15 دقيقة

    // حفظ الرمز في قاعدة البيانات
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token: verificationCode,
        expiresAt,
      },
    });

    // إرسال بريد رمز التحقق
    await sendPasswordResetEmail(
      user.email,
      verificationCode,
      `${user.firstName} ${user.lastName}`
    );

    return NextResponse.json({
      message: 'تم إرسال رابط إعادة تعيين كلمة السر إلى بريدك الإلكتروني',
    });

  } catch (error) {
    console.error('خطأ في طلب إعادة تعيين كلمة السر:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
