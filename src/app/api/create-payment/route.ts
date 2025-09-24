import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('=== CREATE PAYMENT API - RECEIVED DATA ===', body);
    const { amount, orderNumber, customerName, customerEmail, purpose, recipient, requestData, existingRequestId } = body;

    // تحديد URL التوجيه بناءً على نوع الخدمة
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   'https://m3roodi.com';
    
    // استخدام webhook فقط - لا نستخدم redirect URL
    // سيتم إنشاء الطلب عبر webhook بعد تأكيد الدفع
    const redirectUrl = `${baseUrl}/request-form/payment-redirect?status=pending&orderNumber=${orderNumber}`;
    
    console.log('=== REDIRECT URL CREATED ===');
    console.log('Base URL:', baseUrl);
    console.log('Order Number:', orderNumber);
    console.log('Full Redirect URL:', redirectUrl);

    // بيانات بوابة تاب - استخدام متغيرات البيئة فقط
    const tapCredentials = {
      secretKey: process.env.TAP_SECRET_KEY,
      publicKey: process.env.NEXT_PUBLIC_TAP_PUBLIC_KEY,
      merchantId: process.env.TAP_MERCHANT_ID,
      username: process.env.TAP_USERNAME,
      password: process.env.TAP_PASSWORD,
      apiKey: process.env.TAP_API_KEY
    };

    // التحقق من وجود جميع المتغيرات المطلوبة
    if (!tapCredentials.secretKey || !tapCredentials.publicKey || !tapCredentials.merchantId) {
      console.error('=== MISSING ENVIRONMENT VARIABLES ===');
      console.error('Secret Key:', !!tapCredentials.secretKey);
      console.error('Public Key:', !!tapCredentials.publicKey);
      console.error('Merchant ID:', !!tapCredentials.merchantId);
      
      return NextResponse.json({
        success: false,
        message: 'إعدادات الدفع غير مكتملة - يرجى التحقق من متغيرات البيئة'
      }, { status: 500 });
    }

    // إنشاء بيانات الدفع
    const paymentData = {
      amount: amount,
      currency: 'SAR',
      customer: {
        first_name: customerName,
        email: customerEmail,
        phone: {
          country_code: '966',
          number: '500000000'
        }
      },
      source: {
        id: 'src_all'
      },
      redirect: {
        url: redirectUrl
      },
      post: {
        // استخدام Webhook دائماً في الإنتاج
        url: `${baseUrl}/api/payment-webhook`
      },
      reference: {
        transaction: orderNumber
      },
      description: `دفع معروض - ${orderNumber}`,
      metadata: {
        orderNumber: orderNumber,
        customerName: customerName,
        customerEmail: customerEmail,
        purpose: purpose || '',
        recipient: recipient || '',
        requestType: requestData ? 'new_request' : 'ready_template',
        // إضافة معرف الطلب المحفوظ مسبقاً إذا كان موجوداً
        existingRequestId: existingRequestId || null,
        // إضافة جميع البيانات المطلوبة لإنشاء الطلب
        applicantName: requestData?.applicantName || customerName,
        phone: requestData?.phone || '500000000',
        idNumber: requestData?.idNumber || null,
        attachments: requestData?.attachments || null,
        voiceRecordingUrl: requestData?.voiceRecording || null,
        description: requestData?.description || 'تم إنشاء الطلب بعد تأكيد الدفع'
      }
    };

    console.log('=== PAYMENT DATA SENT TO TAP ===');
    console.log('Payment data:', JSON.stringify(paymentData, null, 2));
    console.log('Base URL:', baseUrl);
    console.log('Webhook URL:', `${baseUrl}/api/payment-webhook`);

    // إرسال طلب إنشاء الدفع إلى بوابة تاب
    console.log('=== SENDING TO TAP API ===');
    console.log('Secret Key:', tapCredentials.secretKey.substring(0, 10) + '...');
    console.log('Payment Data:', JSON.stringify(paymentData, null, 2));
    
    const response = await fetch('https://api.tap.company/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tapCredentials.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    console.log('=== TAP API RESPONSE STATUS ===', response.status);

    const result = await response.json();
    console.log('=== TAP API RESPONSE ===', result);

    if (!response.ok) {
      console.error('=== TAP API ERROR ===', result);
      return NextResponse.json({
        success: false,
        message: `خطأ في بوابة الدفع: ${result.message || 'خطأ غير معروف'}`,
        error: result
      }, { status: 400 });
    }

    if (result.status === 'INITIATED') {
      // لا ننشئ الطلب هنا - سيتم إنشاؤه عبر Webhook بعد إتمام الدفع
      console.log('=== PAYMENT INITIATED - WAITING FOR WEBHOOK ===');
      console.log('Payment URL:', result.transaction.url);
      console.log('Charge ID:', result.id);
      console.log('Order Number:', orderNumber);

      return NextResponse.json({
        success: true,
        paymentUrl: result.transaction.url,
        chargeId: result.id,
        orderNumber: orderNumber
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'فشل في إنشاء عملية الدفع',
        error: result
      });
    }

  } catch (error) {
    console.error('خطأ في إنشاء الدفع:', error);
    
    // رسائل خطأ محددة بدلاً من رسالة عامة
    let errorMessage = 'حدث خطأ في إنشاء عملية الدفع';
    
    if (error instanceof Error) {
      if (error.message.includes('إعدادات الدفع غير مكتملة')) {
        errorMessage = 'إعدادات الدفع غير مكتملة، يرجى التواصل مع الدعم الفني';
      } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        errorMessage = 'مشكلة في الاتصال مع بوابة الدفع، يرجى المحاولة مرة أخرى';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'مشكلة في معالجة البيانات، يرجى المحاولة مرة أخرى';
      } else {
        errorMessage = `خطأ تقني: ${error.message}`;
      }
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    }, { status: 500 });
  }
}
