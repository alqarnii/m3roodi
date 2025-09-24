#!/usr/bin/env tsx

/**
 * Script لفحص متغيرات البيئة في Vercel
 * استخدم هذا Script لمعرفة ما إذا كانت متغيرات البيئة مُعرّفة بشكل صحيح
 */

console.log('🔍 فحص متغيرات البيئة في Vercel...\n');

// متغيرات قاعدة البيانات
console.log('📊 متغيرات قاعدة البيانات:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ مُعرّف' : '❌ غير مُعرّف');
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  const isNeon = url.includes('neon.tech');
  const hasSSL = url.includes('sslmode=require');
  console.log('  - نوع قاعدة البيانات:', isNeon ? 'Neon PostgreSQL' : 'غير معروف');
  console.log('  - SSL مُفعّل:', hasSSL ? '✅ نعم' : '❌ لا');
}

// متغيرات Prisma
console.log('\n🔧 متغيرات Prisma:');
console.log('PRISMA_GENERATE_DATAPROXY:', process.env.PRISMA_GENERATE_DATAPROXY || 'غير مُعرّف');
console.log('PRISMA_CLI_BINARY_TARGETS:', process.env.PRISMA_CLI_BINARY_TARGETS || 'غير مُعرّف');

// متغيرات التطبيق
console.log('\n🌐 متغيرات التطبيق:');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'غير مُعرّف');
console.log('NODE_ENV:', process.env.NODE_ENV || 'غير مُعرّف');

// متغيرات Vercel
console.log('\n🚀 متغيرات Vercel:');
console.log('VERCEL_REGION:', process.env.VERCEL_REGION || 'غير مُعرّف');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'غير مُعرّف');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'غير مُعرّف');

// متغيرات الدفع
console.log('\n💳 متغيرات الدفع:');
console.log('TAP_SECRET_KEY:', process.env.TAP_SECRET_KEY ? '✅ مُعرّف' : '❌ غير مُعرّف');
console.log('NEXT_PUBLIC_TAP_PUBLIC_KEY:', process.env.NEXT_PUBLIC_TAP_PUBLIC_KEY ? '✅ مُعرّف' : '❌ غير مُعرّف');
console.log('TAP_MERCHANT_ID:', process.env.TAP_MERCHANT_ID ? '✅ مُعرّف' : '❌ غير مُعرّف');

// متغيرات البريد الإلكتروني
console.log('\n📧 متغيرات البريد الإلكتروني:');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'غير مُعرّف');
console.log('SMTP_PORT:', process.env.SMTP_PORT || 'غير مُعرّف');
console.log('SMTP_USER:', process.env.SMTP_USER ? '✅ مُعرّف' : '❌ غير مُعرّف');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ مُعرّف' : '❌ غير مُعرّف');

// فحص التوصيات
console.log('\n💡 التوصيات:');

if (!process.env.DATABASE_URL) {
  console.log('❌ يجب إضافة DATABASE_URL في Vercel Environment Variables');
}

if (!process.env.PRISMA_GENERATE_DATAPROXY) {
  console.log('⚠️  يُنصح بإضافة PRISMA_GENERATE_DATAPROXY=false');
}

if (!process.env.PRISMA_CLI_BINARY_TARGETS) {
  console.log('⚠️  يُنصح بإضافة PRISMA_CLI_BINARY_TARGETS=rhel-openssl-3.0.x');
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.log('⚠️  يجب إضافة NEXT_PUBLIC_APP_URL=https://m3roodi.com');
}

console.log('\n✅ انتهى الفحص');
