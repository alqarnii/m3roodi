import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function disableAutomaticReminders() {
  try {
    console.log('🔄 جاري تعطيل التذكيرات التلقائية...');
    
    // Update or create reminder settings with isActive = false
    const settings = await prisma.reminderSettings.upsert({
      where: { id: 1 },
      update: {
        isActive: false,
        firstReminderHours: 24,
        secondReminderHours: 72,
        finalReminderHours: 168,
        maxRemindersPerDay: 50,
        reminderSubject: 'تذكير بدفع الطلب',
        reminderTemplate: null
      },
      create: {
        isActive: false,
        firstReminderHours: 24,
        secondReminderHours: 72,
        finalReminderHours: 168,
        maxRemindersPerDay: 50,
        reminderSubject: 'تذكير بدفع الطلب',
        reminderTemplate: null
      }
    });

    console.log('✅ تم تعطيل التذكيرات التلقائية بنجاح');
    console.log('📊 الإعدادات الحالية:', {
      id: settings.id,
      isActive: settings.isActive,
      firstReminderHours: settings.firstReminderHours,
      secondReminderHours: settings.secondReminderHours,
      finalReminderHours: settings.finalReminderHours,
      maxRemindersPerDay: settings.maxRemindersPerDay
    });

  } catch (error) {
    console.error('❌ خطأ في تعطيل التذكيرات التلقائية:', error);
  } finally {
    await prisma.$disconnect();
  }
}

disableAutomaticReminders();
