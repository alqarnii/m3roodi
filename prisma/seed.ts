import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء ملء قاعدة البيانات...\n');

  try {
    // إنشاء مستخدمين تجريبيين
    console.log('1️⃣ إنشاء مستخدمين تجريبيين...');
    const user1 = await prisma.user.upsert({
      where: { email: 'ahmed@example.com' },
      update: {},
      create: {
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed@example.com',
        phone: '0551111111',
        idNumber: '123456789012345',
        password: 'password123'
      }
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'fatima@example.com' },
      update: {},
      create: {
        firstName: 'فاطمة',
        lastName: 'علي',
        email: 'fatima@example.com',
        phone: '0552222222',
        idNumber: '987654321098765',
        password: 'password123'
      }
    });

    console.log('✅ تم إنشاء المستخدمين:', user1.id, user2.id, '\n');

    // إنشاء طلبات تجريبية
    console.log('2️⃣ إنشاء طلبات تجريبية...');
    const request1 = await prisma.request.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: user1.id,
        purpose: 'طلب مساعدة مالية',
        recipient: 'وزارة الشؤون الاجتماعية',
        description: 'أحتاج مساعدة مالية لعلاج طفلي',
        applicantName: 'أحمد محمد',
        phone: '0551111111',
        idNumber: '123456789012345',
        price: 199.00,
        status: 'PENDING'
      }
    });

    const request2 = await prisma.request.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: user2.id,
        purpose: 'طلب تجنيس',
        recipient: 'وزارة الداخلية',
        description: 'طلب تجنيس لزوجي الأجنبي',
        applicantName: 'فاطمة علي',
        phone: '0552222222',
        idNumber: '987654321098765',
        price: 350.00,
        status: 'IN_PROGRESS'
      }
    });

    console.log('✅ تم إنشاء الطلبات:', request1.id, request2.id, '\n');

    // إنشاء مدفوعات تجريبية
    console.log('3️⃣ إنشاء مدفوعات تجريبية...');
    const payment1 = await prisma.payment.create({
      data: {
        requestId: request1.id,
        amount: 199.00,
        paymentMethod: 'BANK_TRANSFER',
        paymentStatus: 'COMPLETED',
        bankReference: 'REF123456',
        paymentDate: new Date()
      }
    });

    const payment2 = await prisma.payment.create({
      data: {
        requestId: request2.id,
        amount: 350.00,
        paymentMethod: 'ELECTRONIC',
        paymentStatus: 'PENDING'
      }
    });

    console.log('✅ تم إنشاء المدفوعات:', payment1.id, payment2.id, '\n');



    // إنشاء تعديلات تجريبية
    console.log('5️⃣ إنشاء تعديلات تجريبية...');
    const modification1 = await prisma.modification.create({
      data: {
        requestId: request1.id,
        modificationType: 'تعديل العنوان',
        description: 'تغيير عنوان المستلم',
        status: 'COMPLETED',
        isFree: true,
        completedAt: new Date()
      }
    });

    console.log('✅ تم إنشاء التعديل:', modification1.id, '\n');

    // إنشاء متابعات تجريبية
    console.log('6️⃣ إنشاء متابعات تجريبية...');
    const followUp1 = await prisma.followUp.create({
      data: {
        requestId: request2.id,
        agentName: 'أحمد المعقب',
        visitCount: 2,
        notes: 'تم التواصل مع المسؤول',
        nextVisitDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // بعد أسبوع
        status: 'ACTIVE'
      }
    });

    console.log('✅ تم إنشاء المتابعة:', followUp1.id, '\n');

    console.log('🎉 تم ملء قاعدة البيانات بنجاح!');
    console.log('\n📊 الإحصائيات:');
    console.log('- المستخدمين:', await prisma.user.count());
    console.log('- الطلبات:', await prisma.request.count());
    console.log('- المدفوعات:', await prisma.payment.count());
    console.log('- التعديلات:', await prisma.modification.count());
    console.log('- المتابعات:', await prisma.followUp.count());

  } catch (error) {
    console.error('❌ خطأ في ملء قاعدة البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
