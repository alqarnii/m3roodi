import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testReminderSystem() {
  try {
    console.log('🧪 اختبار نظام التذكيرات...\n');

    // 1. فحص الطلبات المعلقة
    const pendingRequests = await prisma.request.findMany({
      where: {
        status: 'PENDING',
        payments: {
          none: {
            paymentStatus: 'COMPLETED'
          }
        }
      },
      include: {
        user: true,
        payments: true,
        paymentReminders: true
      }
    });

    console.log(`📊 الطلبات المعلقة: ${pendingRequests.length}`);
    
    if (pendingRequests.length > 0) {
      console.log('\n📋 تفاصيل الطلبات المعلقة:');
      pendingRequests.forEach((request, index) => {
        console.log(`${index + 1}. ID: ${request.id}`);
        console.log(`   المستخدم: ${request.user?.firstName || request.applicantName}`);
        console.log(`   البريد: ${request.user?.email || 'غير محدد'}`);
        console.log(`   الغرض: ${request.purpose}`);
        console.log(`   السعر: ${request.price} ريال`);
        console.log(`   تاريخ الإنشاء: ${request.createdAt.toLocaleString('ar-SA')}`);
        console.log(`   التذكيرات المرسلة: ${request.paymentReminders.length}`);
        console.log('');
      });
    }

    // 2. فحص التذكيرات المرسلة
    const totalReminders = await prisma.paymentReminder.count();
    const todayReminders = await prisma.paymentReminder.count({
      where: {
        sentAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    console.log(`📧 إجمالي التذكيرات: ${totalReminders}`);
    console.log(`📧 التذكيرات اليوم: ${todayReminders}`);

    // 3. فحص معدل النجاح
    const successfulReminders = await prisma.paymentReminder.count({
      where: {
        status: 'DELIVERED'
      }
    });

    const successRate = totalReminders > 0 ? Math.round((successfulReminders / totalReminders) * 100) : 0;
    console.log(`📈 معدل النجاح: ${successRate}%`);

    // 4. فحص التذكيرات حسب النوع
    const firstReminders = await prisma.paymentReminder.count({
      where: { reminderType: 'FIRST_REMINDER' }
    });
    const secondReminders = await prisma.paymentReminder.count({
      where: { reminderType: 'SECOND_REMINDER' }
    });
    const finalReminders = await prisma.paymentReminder.count({
      where: { reminderType: 'FINAL_REMINDER' }
    });

    console.log('\n📊 التذكيرات حسب النوع:');
    console.log(`- التذكير الأول: ${firstReminders}`);
    console.log(`- التذكير الثاني: ${secondReminders}`);
    console.log(`- التذكير النهائي: ${finalReminders}`);

    // 5. فحص الطلبات التي تحتاج تذكير
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const needsFirstReminder = await prisma.request.findMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: twentyFourHoursAgo
        },
        payments: {
          none: {
            paymentStatus: 'COMPLETED'
          }
        },
        paymentReminders: {
          none: {
            reminderType: 'FIRST_REMINDER'
          }
        }
      }
    });

    console.log(`\n⏰ الطلبات التي تحتاج تذكير أولي: ${needsFirstReminder.length}`);

    if (needsFirstReminder.length > 0) {
      console.log('\n📋 تفاصيل الطلبات التي تحتاج تذكير:');
      needsFirstReminder.forEach((request, index) => {
        console.log(`${index + 1}. ID: ${request.id} - ${request.applicantName} - ${request.purpose}`);
      });
    }

    console.log('\n✅ تم اختبار النظام بنجاح!');

  } catch (error) {
    console.error('❌ خطأ في اختبار النظام:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testReminderSystem();
