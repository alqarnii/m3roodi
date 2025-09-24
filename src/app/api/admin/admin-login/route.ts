import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // التحقق من بيانات تسجيل الدخول
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, message: 'إعدادات المدير غير متوفرة' },
        { status: 500 }
      );
    }

    // التحقق من صحة بيانات تسجيل الدخول
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          username: adminUsername,
          role: 'مدير رئيسي',
          isAdmin: true
        }
      });
    }

    // بيانات تسجيل الدخول غير صحيحة
    return NextResponse.json(
      { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
      { status: 401 }
    );

  } catch (error) {
    console.error('خطأ في تسجيل دخول المدير:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  }
}
