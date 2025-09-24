import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== جلب المستخدمين من قاعدة البيانات ===');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;

    // بناء شروط البحث
    const where: any = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { idNumber: { contains: search } }
      ];
    }
    
    // أولاً، نتحقق من العدد الإجمالي
    const totalCount = await prisma.user.count({ where });
    console.log('العدد الإجمالي للمستخدمين في قاعدة البيانات:', totalCount);
    
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        idNumber: true,
        createdAt: true,
        updatedAt: true,
        requests: {
          select: {
            id: true,
            purpose: true,
            status: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    console.log('عدد المستخدمين المجلوبين في هذه الصفحة:', users.length);
    console.log('المستخدمين:', users.map(u => ({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email })));
    
    // التحقق من أن العددين منطقيان
    if (totalCount > 0 && users.length === 0 && page === 1) {
      console.warn('⚠️ تحذير: يوجد مستخدمين في قاعدة البيانات لكن لم يتم جلب أي منهم!');
    }

    return NextResponse.json({
      success: true,
      users: users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المستخدمين' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
