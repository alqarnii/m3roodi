// استخدام fetch المدمج في Node.js

async function testAPI() {
  try {
    console.log('اختبار API محلي...');
    
    // اختبار API محلي
    const localResponse = await fetch('http://localhost:3000/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderNumber: 'RF73',
        customerEmail: 'test@test.com'
      }),
    });

    if (localResponse.ok) {
      const localResult = await localResponse.json();
      console.log('✅ API محلي يعمل:', localResult);
    } else {
      console.log('❌ API محلي فشل:', localResponse.status, localResponse.statusText);
    }

    // اختبار API إنتاجي
    try {
      const prodResponse = await fetch('https://m3roodi.com/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber: 'RF73',
          customerEmail: 'test@test.com'
        }),
      });

      if (prodResponse.ok) {
        const prodResult = await prodResponse.json();
        console.log('✅ API إنتاجي يعمل:', prodResult);
      } else {
        console.log('❌ API إنتاجي فشل:', prodResponse.status, prodResponse.statusText);
      }
    } catch (prodError: unknown) {
      console.log('❌ خطأ في API إنتاجي:', prodError instanceof Error ? prodError.message : String(prodError));
    }

  } catch (error) {
    console.error('خطأ في الاختبار:', error);
  }
}

testAPI();
