import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWebhook() {
  try {
    console.log('=== اختبار Webhook الدفع ===');
    
    // بيانات اختبار
    const testData = {
      status: 'CAPTURED',
      reference: { 
        transaction: 'RF' + Date.now().toString().slice(-8)
      },
      metadata: {
        orderNumber: 'RF' + Date.now().toString().slice(-8),
        requestType: 'new_request',
        customerName: 'أحمد محمد',
        customerEmail: 'ahmed@test.com',
        purpose: 'طلب معروض',
        recipient: 'وزارة التجارة',
        applicantName: 'أحمد محمد',
        phone: '0501234567',
        idNumber: '1234567890',
        description: 'طلب معروض للاختبار'
      }
    };

    console.log('بيانات الاختبار:', JSON.stringify(testData, null, 2));

    // استدعاء webhook
    const response = await fetch('http://localhost:3000/api/payment-webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('نتيجة Webhook:', result);

    if (response.ok) {
      console.log('✅ Webhook يعمل بشكل صحيح');
      
      // التحقق من إنشاء الطلب
      const orderNumber = testData.reference.transaction;
      const payment = await prisma.payment.findFirst({
        where: { transactionId: orderNumber },
        include: { request: true }
      });

      if (payment) {
        console.log('✅ تم إنشاء الدفع:', payment);
        console.log('✅ تم إنشاء الطلب:', payment.request);
      } else {
        console.log('❌ لم يتم إنشاء الدفع أو الطلب');
      }
    } else {
      console.log('❌ Webhook فشل:', result);
    }

  } catch (error) {
    console.error('خطأ في اختبار Webhook:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل الاختبار
testWebhook();
