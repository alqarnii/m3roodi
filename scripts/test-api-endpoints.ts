#!/usr/bin/env tsx

/**
 * Script لاختبار API endpoints في Vercel
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com';

async function testEndpoint(url: string, name: string) {
  try {
    console.log(`🔍 اختبار ${name}...`);
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: نجح (${response.status})`);
      if (data.database) {
        console.log(`   قاعدة البيانات: ${data.database.connected ? 'متصل' : 'غير متصل'}`);
      }
    } else {
      console.log(`❌ ${name}: فشل (${response.status})`);
      console.log(`   الخطأ: ${data.error || data.message || 'غير معروف'}`);
    }
  } catch (error) {
    console.log(`❌ ${name}: خطأ في الاتصال`);
    console.log(`   التفاصيل: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
  }
  console.log('');
}

async function testAllEndpoints() {
  console.log('🚀 بدء اختبار API endpoints...\n');
  
  // اختبار Health Check
  await testEndpoint(`${BASE_URL}/api/health`, 'Health Check');
  
  // اختبار endpoints أخرى (اختيارية)
  const endpoints = [
    { url: `${BASE_URL}/api/feedback`, name: 'Feedback API' },
    { url: `${BASE_URL}/api/admin/users`, name: 'Admin Users API' },
  ];
  
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint.url, endpoint.name);
  }
  
  console.log('✅ انتهى اختبار جميع الـ endpoints');
}

// تشغيل الاختبارات
testAllEndpoints().catch(console.error);
