import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const reminders = await prisma.manualReminder.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.manualReminder.count();

    return NextResponse.json({
      success: true,
      data: reminders,
      total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching manual reminders:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب التذكيرات اليدوية'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
