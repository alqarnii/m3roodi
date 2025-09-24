import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearSeedData() {
  console.log('🗑️ بدء حذف البيانات التجريبية...\n');

  try {
    // حذف البيانات بالترتيب الصحيح (حسب العلاقات)
    console.log('1️⃣ حذف المتابعات...');
    await prisma.followUp.deleteMany();
    console.log('✅ تم حذف المتابعات');

    console.log('2️⃣ حذف التعديلات...');
    await prisma.modification.deleteMany();
    console.log('✅ تم حذف التعديلات');

    console.log('3️⃣ حذف المدفوعات...');
    await prisma.payment.deleteMany();
    console.log('✅ تم حذف المدفوعات');

    console.log('4️⃣ حذف الطلبات...');
    await prisma.request.deleteMany();
    console.log('✅ تم حذف الطلبات');

    console.log('5️⃣ حذف المستخدمين...');
    await prisma.user.deleteMany();
    console.log('✅ تم حذف المستخدمين');

    console.log('6️⃣ حذف الموظفين...');
    await prisma.employee.deleteMany();
    console.log('✅ تم حذف الموظفين');

    console.log('\n🎉 تم حذف جميع البيانات التجريبية بنجاح!');
    console.log('\n📊 قاعدة البيانات الآن فارغة وجاهزة للطلبات الحقيقية');

  } catch (error) {
    console.error('❌ خطأ في حذف البيانات:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearSeedData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
