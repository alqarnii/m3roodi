import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch automatic reminders
    const automaticLogs = await prisma.paymentReminder.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        sentAt: 'desc'
      },
      select: {
        id: true,
        requestId: true,
        email: true,
        userName: true,
        reminderType: true,
        status: true,
        sentAt: true,
        notes: true
      }
    });

    // Fetch manual reminders
    const manualLogs = await prisma.manualReminder.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        sentAt: 'desc'
      },
      select: {
        id: true,
        requestId: true,
        email: true,
        name: true,
        subject: true,
        status: true,
        sentAt: true,
        createdAt: true
      }
    });

    // Combine and format both types of logs
    const combinedLogs = [
      ...automaticLogs.map(log => ({
        id: `auto_${log.id}`,
        requestId: log.requestId,
        email: log.email,
        userName: log.userName,
        reminderType: log.reminderType,
        status: log.status,
        sentAt: log.sentAt,
        notes: log.notes,
        type: 'automatic'
      })),
      ...manualLogs.map(log => ({
        id: `manual_${log.id}`,
        requestId: log.requestId,
        email: log.email,
        userName: log.name,
        reminderType: 'MANUAL_REMINDER',
        status: log.status,
        sentAt: log.sentAt,
        notes: log.subject,
        type: 'manual'
      }))
    ];

    // Sort by sentAt date (most recent first)
    combinedLogs.sort((a, b) => {
      const dateA = a.sentAt ? new Date(a.sentAt) : new Date(0);
      const dateB = b.sentAt ? new Date(b.sentAt) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    // Apply pagination
    const paginatedLogs = combinedLogs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedLogs,
      total: combinedLogs.length
    });

  } catch (error) {
    console.error('Error fetching reminder logs:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب سجل التذكيرات'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
