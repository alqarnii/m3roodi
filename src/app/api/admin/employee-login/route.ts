import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن الموظف باستخدام اسم المستخدم أو البريد الإلكتروني
    const employee = await prisma.employee.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username }
        ],
        canAccessAdmin: true, // التأكد من أن الموظف لديه صلاحية الوصول للإدارة
        isActive: true // التأكد من أن الموظف نشط
      }
    });

    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور (في التطبيق الحقيقي يجب تشفير كلمة المرور)
    if (employee.password !== password) {
      return NextResponse.json(
        { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // إرجاع بيانات الموظف (بدون كلمة المرور)
    const { password: _, ...employeeWithoutPassword } = employee;

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      employee: employeeWithoutPassword
    });

  } catch (error) {
    console.error('خطأ في تسجيل دخول الموظف:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في تسجيل الدخول' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
