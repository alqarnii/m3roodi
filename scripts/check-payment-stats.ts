import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPaymentStats() {
  try {
    console.log('=== PAYMENT STATISTICS ANALYSIS ===\n');

    // إحصائيات الطلبات
    const totalRequests = await prisma.request.count();
    console.log(`📊 إجمالي الطلبات: ${totalRequests}`);

    // إحصائيات المدفوعات
    const totalPayments = await prisma.payment.count();
    console.log(`💰 إجمالي المدفوعات: ${totalPayments}`);

    // الطلبات بدون مدفوعات
    const requestsWithoutPayments = await prisma.request.findMany({
      where: {
        payments: {
          none: {}
        }
      },
      select: {
        id: true,
        applicantName: true,
        purpose: true,
        createdAt: true,
        status: true
      }
    });

    console.log(`\n❌ الطلبات بدون مدفوعات: ${requestsWithoutPayments.length}`);
    
    if (requestsWithoutPayments.length > 0) {
      console.log('\n📋 تفاصيل الطلبات بدون مدفوعات:');
      requestsWithoutPayments.slice(0, 10).forEach((request, index) => {
        console.log(`${index + 1}. ID: ${request.id} | ${request.applicantName} | ${request.purpose} | ${request.createdAt.toLocaleDateString('ar-SA')} | ${request.status}`);
      });
      
      if (requestsWithoutPayments.length > 10) {
        console.log(`... و ${requestsWithoutPayments.length - 10} طلب آخر`);
      }
    }

    // إحصائيات حالة المدفوعات
    const paymentStats = await prisma.payment.groupBy({
      by: ['paymentStatus'],
      _count: {
        id: true
      }
    });

    console.log('\n💳 إحصائيات حالة المدفوعات:');
    paymentStats.forEach(stat => {
      console.log(`- ${stat.paymentStatus}: ${stat._count.id} مدفوع`);
    });

    // الطلبات المعلقة (PENDING)
    const pendingRequests = await prisma.request.count({
      where: {
        status: 'PENDING'
      }
    });

    console.log(`\n⏳ الطلبات المعلقة: ${pendingRequests}`);

    // الطلبات المعلقة مع مدفوعات معلقة
    const pendingWithPendingPayment = await prisma.request.findMany({
      where: {
        status: 'PENDING',
        payments: {
          some: {
            paymentStatus: 'PENDING'
          }
        }
      },
      select: {
        id: true,
        applicantName: true,
        purpose: true,
        createdAt: true,
        payments: {
          select: {
            paymentStatus: true,
            paymentMethod: true,
            createdAt: true
          }
        }
      }
    });

    console.log(`\n🔄 الطلبات المعلقة مع مدفوعات معلقة: ${pendingWithPendingPayment.length}`);
    
    if (pendingWithPendingPayment.length > 0) {
      console.log('\n📋 تفاصيل الطلبات المعلقة مع مدفوعات معلقة:');
      pendingWithPendingPayment.slice(0, 5).forEach((request, index) => {
        console.log(`${index + 1}. ID: ${request.id} | ${request.applicantName} | ${request.purpose}`);
        console.log(`   المدفوعات: ${request.payments.map(p => `${p.paymentMethod} - ${p.paymentStatus}`).join(', ')}`);
        console.log(`   تاريخ الطلب: ${request.createdAt.toLocaleDateString('ar-SA')}`);
        console.log('');
      });
    }

    // تحليل آخر 7 أيام
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentRequests = await prisma.request.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    const recentPayments = await prisma.payment.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    console.log(`\n📅 آخر 7 أيام:`);
    console.log(`- طلبات جديدة: ${recentRequests}`);
    console.log(`- مدفوعات جديدة: ${recentPayments}`);
    console.log(`- معدل التحويل: ${recentRequests > 0 ? ((recentPayments / recentRequests) * 100).toFixed(1) : 0}%`);

  } catch (error) {
    console.error('خطأ في تحليل البيانات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPaymentStats();
