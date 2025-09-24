import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // جلب بيانات المستخدم
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
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
    await prisma.$disconnect();
  }
}
