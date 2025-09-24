import { PrismaClient } from '@prisma/client';

// إنشاء عميل Prisma واحد للتطبيق بأكمله
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

// في بيئة التطوير، احفظ العميل في globalThis
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// دالة لإغلاق الاتصال
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// دالة لاختبار الاتصال
export async function testPrismaConnection() {
  try {
    await prisma.$connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    
    // اختبار استعلام بسيط
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('🕐 وقت قاعدة البيانات:', (result as any)[0]?.current_time);
    
    return true;
  } catch (error) {
    console.error('❌ فشل في الاتصال بقاعدة البيانات:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
