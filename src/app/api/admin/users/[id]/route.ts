import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            requests: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        idNumber: user.idNumber,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        _count: user._count
      }
    });

  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في جلب بيانات المستخدم' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            requests: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // إذا كان المستخدم لديه طلبات، نقوم بإزالة العلاقة فقط
    if (user._count.requests > 0) {
      // إزالة العلاقة بين المستخدم والطلبات
      await prisma.request.updateMany({
        where: { userId: userId },
        data: { userId: null }
      });
      
      console.log(`تم إزالة العلاقة بين المستخدم ${userId} و ${user._count.requests} طلب`);
    }

    // حذف المستخدم
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: `تم حذف المستخدم بنجاح${user._count.requests > 0 ? ` مع إزالة العلاقة مع ${user._count.requests} طلب` : ''}`
    });

  } catch (error) {
    console.error('خطأ في حذف المستخدم:', error);
    return NextResponse.json(
      { success: false, message: 'حدث خطأ في حذف المستخدم' },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
