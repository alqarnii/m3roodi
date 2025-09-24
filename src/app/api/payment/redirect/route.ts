import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, customerName, customerPhone, service } = body;

    // إعداد بيانات Tap Payments
    const tapPaymentData = {
      amount: amount, // المبلغ بالريال (بدون تحويل للهللات)
      currency: 'SAR',
      customer: {
        first_name: customerName.split(' ')[0] || customerName,
        last_name: customerName.split(' ').slice(1).join(' ') || '',
        email: `${customerPhone}@temp.com`, // email مؤقت
        phone: {
          country_code: '966',
          number: customerPhone.replace(/^0/, '') // إزالة الصفر من بداية الرقم
        }
      },
      source: {
        id: 'src_all' // جميع طرق الدفع (بطاقات، مدى، Apple Pay، Google Pay، إلخ)
      },
      // إعدادات إضافية لجميع طرق الدفع
      payment_methods: ['card', 'knet', 'amex', 'mada', 'apple_pay', 'google_pay'],
      // دعم Apple Pay و Google Pay
      apple_pay: {
        merchant_id: process.env.TAP_MERCHANT_ID,
        supported_networks: ['visa', 'mastercard', 'mada']
      },
      redirect: {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com'}/api/payment-redirect-handler?tap_order_id=${orderId}`
      },
      post: {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com'}/api/payment-webhook`
      },
      reference: {
        transaction: orderId,
        order: orderId
      },
      description: service,
      statement_descriptor: 'معروضي - إرسال معروض',
      metadata: {
        order_type: 'send_proposal',
        customer_phone: customerPhone,
        payment_methods: 'all'
      }
    };

    console.log('Tap Payment data:', tapPaymentData);

    // التحقق من وجود TAP_SECRET_KEY
    if (!process.env.TAP_SECRET_KEY) {
      throw new Error('TAP_SECRET_KEY غير موجود في المتغيرات البيئية');
    }

    console.log('Using TAP_SECRET_KEY:', process.env.TAP_SECRET_KEY.substring(0, 10) + '...');

    // إرسال البيانات لـ Tap Payments API
    const tapResponse = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TAP_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tapPaymentData)
    });

    const tapResult = await tapResponse.json();

    if (tapResponse.ok && tapResult.id) {
      // نجح إنشاء الدفع - توجيه المستخدم لبوابة الدفع
      // استخدام رابط الدفع الصحيح من Tap
      let paymentUrl;
      
      if (tapResult.transaction && tapResult.transaction.url) {
        // إذا كان Tap يوفر رابط دفع مباشر
        paymentUrl = tapResult.transaction.url;
      } else {
        // إنشاء رابط دفع باستخدام معرف العملية
        paymentUrl = `https://api.tap.company/v2/authorize/${tapResult.id}?public_key=${process.env.NEXT_PUBLIC_TAP_PUBLIC_KEY}`;
      }
      
      console.log('Payment URL created:', paymentUrl);
      
      return NextResponse.json({
        success: true,
        paymentUrl: paymentUrl,
        chargeId: tapResult.id,
        message: 'تم إنشاء رابط الدفع بنجاح'
      });
    } else {
      console.error('Tap API error:', tapResult);
      
      // معالجة أفضل للأخطاء
      if (tapResult.errors && tapResult.errors.length > 0) {
        const error = tapResult.errors[0];
        if (error.code === '2107') {
          throw new Error('خطأ في مصادقة Tap Payments - تأكد من صحة TAP_SECRET_KEY');
        } else {
          throw new Error(`خطأ في Tap Payments: ${error.description} (كود: ${error.code})`);
        }
      } else {
        throw new Error(tapResult.description || 'فشل في إنشاء رابط الدفع');
      }
    }

  } catch (error) {
    console.error('Payment redirect error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'حدث خطأ في إنشاء رابط الدفع' 
      },
      { status: 500 }
    );
  }
}
