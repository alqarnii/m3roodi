#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});

async function testDatabaseConnection() {
  console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'مُعرّف' : 'غير مُعرّف');
  
  try {
    // اختبار الاتصال
    await prisma.$connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // اختبار استعلام بسيط
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as postgres_version`;
    const dbInfo = (result as any)[0];
    
    console.log('🕐 وقت قاعدة البيانات:', dbInfo?.current_time);
    console.log('🐘 إصدار PostgreSQL:', dbInfo?.postgres_version);
    
    // اختبار عدد الجداول
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📊 عدد الجداول:', (tableCount as any)[0]?.count);
    
    // اختبار جدول المستخدمين
    try {
      const userCount = await prisma.user.count();
      console.log('👥 عدد المستخدمين:', userCount);
    } catch (error) {
      console.log('⚠️  لا يمكن الوصول لجدول المستخدمين:', error instanceof Error ? error.message : 'خطأ غير معروف');
    }
    
    // اختبار جدول الطلبات
    try {
      const requestCount = await prisma.request.count();
      console.log('📝 عدد الطلبات:', requestCount);
    } catch (error) {
      console.log('⚠️  لا يمكن الوصول لجدول الطلبات:', error instanceof Error ? error.message : 'خطأ غير معروف');
    }
    
    console.log('🎉 جميع الاختبارات نجحت!');
    
  } catch (error) {
    console.error('❌ فشل في الاتصال بقاعدة البيانات:');
    console.error('نوع الخطأ:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('رسالة الخطأ:', error instanceof Error ? error.message : 'خطأ غير معروف');
    
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      console.error('💡 تأكد من تعيين متغير DATABASE_URL في Vercel');
    } else if (error instanceof Error && error.message.includes('connection')) {
      console.error('💡 تأكد من صحة رابط قاعدة البيانات');
    } else if (error instanceof Error && error.message.includes('authentication')) {
      console.error('💡 تأكد من صحة بيانات المصادقة');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبار
testDatabaseConnection().catch(console.error);
