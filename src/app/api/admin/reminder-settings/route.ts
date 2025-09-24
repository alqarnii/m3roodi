import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.reminderSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.reminderSettings.create({
        data: {
          firstReminderHours: 24,
          secondReminderHours: 72,
          finalReminderHours: 168,
          isActive: true,
          maxRemindersPerDay: 50,
          reminderSubject: 'تذكير بدفع الطلب',
          reminderTemplate: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error('Error fetching reminder settings:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب إعدادات التذكيرات'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Update or create settings
    const settings = await prisma.reminderSettings.upsert({
      where: { id: 1 },
      update: {
        firstReminderHours: body.firstReminderHours || 24,
        secondReminderHours: body.secondReminderHours || 72,
        finalReminderHours: body.finalReminderHours || 168,
        isActive: body.isActive !== undefined ? body.isActive : true,
        maxRemindersPerDay: body.maxRemindersPerDay || 50,
        reminderSubject: body.reminderSubject || 'تذكير بدفع الطلب',
        reminderTemplate: body.reminderTemplate || null
      },
      create: {
        firstReminderHours: body.firstReminderHours || 24,
        secondReminderHours: body.secondReminderHours || 72,
        finalReminderHours: body.finalReminderHours || 168,
        isActive: body.isActive !== undefined ? body.isActive : true,
        maxRemindersPerDay: body.maxRemindersPerDay || 50,
        reminderSubject: body.reminderSubject || 'تذكير بدفع الطلب',
        reminderTemplate: body.reminderTemplate || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
      data: settings
    });

  } catch (error) {
    console.error('Error updating reminder settings:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في حفظ الإعدادات'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
