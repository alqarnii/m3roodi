import { prisma } from '../src/lib/prisma';

async function testPrismaConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('فشل في الاتصال بقاعدة البيانات:', error);
    return false;
  }
}

async function testDatabase() {
  console.log('🧪 بدء اختبار قاعدة البيانات...\n');

  try {
    // اختبار الاتصال
    console.log('1️⃣ اختبار الاتصال...');
    const isConnected = await testPrismaConnection();
    if (!isConnected) {
      throw new Error('فشل في الاتصال بقاعدة البيانات');
    }
    console.log('✅ تم الاتصال بنجاح\n');

    // اختبار استعلام بسيط
    console.log('2️⃣ اختبار استعلام بسيط...');
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log('✅ إصدار PostgreSQL:', (result as any)[0]?.version, '\n');

    // اختبار جدول المستخدمين
    console.log('3️⃣ اختبار جدول المستخدمين...');
    const usersCount = await prisma.user.count();
    console.log('✅ عدد المستخدمين:', usersCount, '\n');

    // اختبار جدول الطلبات
    console.log('4️⃣ اختبار جدول الطلبات...');
    const requestsCount = await prisma.request.count();
    console.log('✅ عدد الطلبات:', requestsCount, '\n');

    // اختبار جدول المدفوعات
    console.log('5️⃣ اختبار جدول المدفوعات...');
    const paymentsCount = await prisma.payment.count();
    console.log('✅ عدد المدفوعات:', paymentsCount, '\n');

    // اختبار جدول الموظفين
    console.log('6️⃣ اختبار جدول الموظفين...');
    const employeesCount = await prisma.employee.count();
    console.log('✅ عدد الموظفين:', employeesCount, '\n');

    // اختبار إنشاء مستخدم جديد
    console.log('7️⃣ اختبار إنشاء مستخدم جديد...');
    const newUser = await prisma.user.create({
      data: {
        firstName: 'اختبار',
        lastName: 'مستخدم',
        email: 'test@example.com',
        phone: '0559999999',
        password: 'testpassword123'
      }
    });
    console.log('✅ تم إنشاء مستخدم جديد:', newUser.id, '\n');

    // اختبار حذف المستخدم التجريبي
    console.log('8️⃣ تنظيف البيانات التجريبية...');
    await prisma.user.delete({
      where: { id: newUser.id }
    });
    console.log('✅ تم حذف المستخدم التجريبي\n');

    console.log('🎉 جميع الاختبارات نجحت! قاعدة البيانات تعمل بشكل مثالي.');

  } catch (error) {
    console.error('❌ فشل في الاختبار:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبار
testDatabase();
