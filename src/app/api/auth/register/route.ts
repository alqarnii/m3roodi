import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // التحقق من البيانات المطلوبة
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود المستخدم بالفعل
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المستخدم الجديد
    const newUser = await prisma.user.create({
      data: {
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        email,
        phone: '', // سيتم تحديثه لاحقاً
        password: hashedPassword
      }
    });

    // إرجاع بيانات المستخدم بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: userWithoutPassword,
      token: 'temp-token-' + Date.now() // في التطبيق الحقيقي استخدم JWT
    });

  } catch (error) {
    console.error('خطأ في إنشاء الحساب:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في إنشاء الحساب' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
