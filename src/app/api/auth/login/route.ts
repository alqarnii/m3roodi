import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      user: userWithoutPassword,
      token: 'temp-token-' + Date.now() // في التطبيق الحقيقي استخدم JWT
    });

  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
