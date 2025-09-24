import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPaymentReminderEmail, testEmailConnection } from '@/lib/email';


export async function GET(request: NextRequest) {
  try {
    console.log('🕐 بدء تشغيل نظام التذكيرات التلقائية...');
    console.log('⏰ الوقت:', new Date().toLocaleString('ar-SA'));

    // التحقق من أن الطلب يأتي من cron job أو admin
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'm3roodi-cron-2024';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ 
        success: false, 
        message: 'غير مصرح بالوصول' 
      }, { status: 401 });
    }

    const results = await processAutomaticReminders();
    
    return NextResponse.json({
      success: true,
      message: 'تم تشغيل نظام التذكيرات بنجاح',
      data: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ خطأ في نظام التذكيرات التلقائية:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في نظام التذكيرات',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // اختبار اتصال البريد الإلكتروني
    if (body.testEmail) {
      console.log('🧪 طلب اختبار اتصال البريد الإلكتروني...');
      const testResult = await testEmailConnection();
      return NextResponse.json(testResult);
    }

    // نفس الوظيفة للـ GET ولكن يمكن استدعاؤها من cron jobs
    return GET(request);
  } catch (error) {
    console.error('❌ خطأ في POST cron reminders:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في معالجة الطلب',
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  }
}

async function processAutomaticReminders() {
  const results = {
    firstReminders: { sent: 0, failed: 0, details: [] as any[] },
    secondReminders: { sent: 0, failed: 0, details: [] as any[] },
    finalReminders: { sent: 0, failed: 0, details: [] as any[] },
    totalProcessed: 0
  };

  try {
    // Get reminder settings
    const settings = await prisma.reminderSettings.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!settings || !settings.isActive) {
      console.log('⚠️ نظام التذكيرات معطل أو غير موجود');
      return results;
    }

    // Check daily limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayReminders = await prisma.paymentReminder.count({
      where: {
        sentAt: {
          gte: today
        }
      }
    });

    if (todayReminders >= settings.maxRemindersPerDay) {
      console.log(`⚠️ تم الوصول للحد الأقصى اليومي: ${todayReminders}/${settings.maxRemindersPerDay}`);
      return results;
    }

    // 1. التذكير الأول
    const firstReminderResults = await sendFirstReminders(settings.firstReminderHours);
    results.firstReminders = firstReminderResults;

    // 2. التذكير الثاني
    const secondReminderResults = await sendSecondReminders(settings.secondReminderHours);
    results.secondReminders = secondReminderResults;

    // 3. التذكير النهائي
    const finalReminderResults = await sendFinalReminders(settings.finalReminderHours);
    results.finalReminders = finalReminderResults;

    results.totalProcessed = 
      results.firstReminders.sent + results.firstReminders.failed +
      results.secondReminders.sent + results.secondReminders.failed +
      results.finalReminders.sent + results.finalReminders.failed;

    console.log('📊 ملخص التذكيرات:');
    console.log(`- التذكير الأول: ${results.firstReminders.sent} نجح، ${results.firstReminders.failed} فشل`);
    console.log(`- التذكير الثاني: ${results.secondReminders.sent} نجح، ${results.secondReminders.failed} فشل`);
    console.log(`- التذكير النهائي: ${results.finalReminders.sent} نجح، ${results.finalReminders.failed} فشل`);
    console.log(`- إجمالي المعالجة: ${results.totalProcessed}`);

    return results;

  } catch (error) {
    console.error('❌ خطأ في معالجة التذكيرات:', error);
    throw error;
  }
}

async function sendFirstReminders(hours: number = 24) {
  const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  const unpaidRequests = await prisma.request.findMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: hoursAgo
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
    },
    include: {
      user: true,
      payments: true
    }
  });

  console.log(`📧 التذكير الأول: ${unpaidRequests.length} طلب`);

  const results = { sent: 0, failed: 0, details: [] as any[] };

  for (const request of unpaidRequests) {
    try {
      const emailResult = await sendPaymentReminderEmail(
        request.user?.email || '',
        request.user?.firstName || request.applicantName || 'عميلنا العزيز',
        request.id.toString(),
        request.purpose
      );

      await prisma.paymentReminder.create({
        data: {
          requestId: request.id,
          userId: request.userId || 0,
          email: request.user?.email || '',
          phone: request.user?.phone || request.phone || '',
          userName: request.user?.firstName || request.applicantName || 'عميلنا العزيز',
          reminderType: 'FIRST_REMINDER',
          status: emailResult.success ? 'DELIVERED' : 'FAILED',
          notes: emailResult.success ? 'تذكير أولي تلقائي' : 'فشل في إرسال التذكير الأولي'
        }
      });

      if (emailResult.success) {
        results.sent++;
        console.log(`✅ تم إرسال التذكير الأول للطلب ${request.id}`);
      } else {
        results.failed++;
        console.log(`❌ فشل في إرسال التذكير الأول للطلب ${request.id}`);
      }

      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: emailResult.success ? 'success' : 'failed',
        message: emailResult.success ? 'تم إرسال التذكير الأول' : 'فشل في إرسال التذكير الأول'
      });

    } catch (error) {
      console.error(`❌ خطأ في التذكير الأول للطلب ${request.id}:`, error);
      results.failed++;
      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: 'error',
        message: 'خطأ في معالجة التذكير الأول'
      });
    }
  }

  return results;
}

async function sendSecondReminders(hours: number = 72) {
  const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  const unpaidRequests = await prisma.request.findMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: hoursAgo
      },
      payments: {
        none: {
          paymentStatus: 'COMPLETED'
        }
      },
      AND: [
        {
          paymentReminders: {
            some: {
              reminderType: 'FIRST_REMINDER',
              status: 'DELIVERED'
            }
          }
        },
        {
          paymentReminders: {
            none: {
              reminderType: 'SECOND_REMINDER'
            }
          }
        }
      ]
    },
    include: {
      user: true,
      payments: true
    }
  });

  console.log(`📧 التذكير الثاني: ${unpaidRequests.length} طلب`);

  const results = { sent: 0, failed: 0, details: [] as any[] };

  for (const request of unpaidRequests) {
    try {
      const emailResult = await sendPaymentReminderEmail(
        request.user?.email || '',
        request.user?.firstName || request.applicantName || 'عميلنا العزيز',
        request.id.toString(),
        request.purpose
      );

      await prisma.paymentReminder.create({
        data: {
          requestId: request.id,
          userId: request.userId || 0,
          email: request.user?.email || '',
          phone: request.user?.phone || request.phone || '',
          userName: request.user?.firstName || request.applicantName || 'عميلنا العزيز',
          reminderType: 'SECOND_REMINDER',
          status: emailResult.success ? 'DELIVERED' : 'FAILED',
          notes: emailResult.success ? 'تذكير ثانوي تلقائي' : 'فشل في إرسال التذكير الثانوي'
        }
      });

      if (emailResult.success) {
        results.sent++;
        console.log(`✅ تم إرسال التذكير الثاني للطلب ${request.id}`);
      } else {
        results.failed++;
        console.log(`❌ فشل في إرسال التذكير الثاني للطلب ${request.id}`);
      }

      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: emailResult.success ? 'success' : 'failed',
        message: emailResult.success ? 'تم إرسال التذكير الثاني' : 'فشل في إرسال التذكير الثاني'
      });

    } catch (error) {
      console.error(`❌ خطأ في التذكير الثاني للطلب ${request.id}:`, error);
      results.failed++;
      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: 'error',
        message: 'خطأ في معالجة التذكير الثاني'
      });
    }
  }

  return results;
}

async function sendFinalReminders(hours: number = 168) {
  const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
  
  const unpaidRequests = await prisma.request.findMany({
    where: {
      status: 'PENDING',
      createdAt: {
        lt: hoursAgo
      },
      payments: {
        none: {
          paymentStatus: 'COMPLETED'
        }
      },
      AND: [
        {
          paymentReminders: {
            some: {
              reminderType: 'SECOND_REMINDER',
              status: 'DELIVERED'
            }
          }
        },
        {
          paymentReminders: {
            none: {
              reminderType: 'FINAL_REMINDER'
            }
          }
        }
      ]
    },
    include: {
      user: true,
      payments: true
    }
  });

  console.log(`📧 التذكير النهائي: ${unpaidRequests.length} طلب`);

  const results = { sent: 0, failed: 0, details: [] as any[] };

  for (const request of unpaidRequests) {
    try {
      const emailResult = await sendPaymentReminderEmail(
        request.user?.email || '',
        request.user?.firstName || request.applicantName || 'عميلنا العزيز',
        request.id.toString(),
        request.purpose
      );

      await prisma.paymentReminder.create({
        data: {
          requestId: request.id,
          userId: request.userId || 0,
          email: request.user?.email || '',
          phone: request.user?.phone || request.phone || '',
          userName: request.user?.firstName || request.applicantName || 'عميلنا العزيز',
          reminderType: 'FINAL_REMINDER',
          status: emailResult.success ? 'DELIVERED' : 'FAILED',
          notes: emailResult.success ? 'تذكير نهائي تلقائي' : 'فشل في إرسال التذكير النهائي'
        }
      });

      if (emailResult.success) {
        results.sent++;
        console.log(`✅ تم إرسال التذكير النهائي للطلب ${request.id}`);
      } else {
        results.failed++;
        console.log(`❌ فشل في إرسال التذكير النهائي للطلب ${request.id}`);
      }

      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: emailResult.success ? 'success' : 'failed',
        message: emailResult.success ? 'تم إرسال التذكير النهائي' : 'فشل في إرسال التذكير النهائي'
      });

    } catch (error) {
      console.error(`❌ خطأ في التذكير النهائي للطلب ${request.id}:`, error);
      results.failed++;
      results.details.push({
        requestId: request.id,
        email: request.user?.email,
        status: 'error',
        message: 'خطأ في معالجة التذكير النهائي'
      });
    }
  }

  return results;
}
