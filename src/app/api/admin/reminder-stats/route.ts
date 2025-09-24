import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    // إجمالي التذكيرات
    const totalReminders = await prisma.paymentReminder.count();

    // التذكيرات المرسلة اليوم
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sentToday = await prisma.paymentReminder.count({
      where: {
        sentAt: {
          gte: today
        }
      }
    });

    // الطلبات المعلقة غير المدفوعة
    const pendingRequests = await prisma.request.count({
      where: {
        status: 'PENDING',
        payments: {
          none: {
            paymentStatus: 'COMPLETED'
          }
        }
      }
    });

    // معدل النجاح (التذكيرات المرسلة بنجاح)
    const successfulReminders = await prisma.paymentReminder.count({
      where: {
        status: 'DELIVERED'
      }
    });

    const successRate = totalReminders > 0 ? Math.round((successfulReminders / totalReminders) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalReminders,
        sentToday,
        pendingRequests,
        successRate
      }
    });

  } catch (error) {
    console.error('Error fetching reminder stats:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب إحصائيات التذكيرات'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
