import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // استخراج المعاملات من URL
    const tapStatus = searchParams.get('tap_status');
    const tapOrderId = searchParams.get('tap_order_id');
    const tapChargeId = searchParams.get('tap_charge_id');
    const tapResult = searchParams.get('tap_result');
    
    console.log('Payment redirect handler received:', {
      tapStatus,
      tapOrderId,
      tapChargeId,
      tapResult
    });

    // تحديد حالة الدفع
    let paymentStatus = 'unknown';
    let redirectUrl = '';
    
    if (tapStatus === 'success' || tapResult === 'SUCCESS') {
      paymentStatus = 'success';
      
      // التحقق من الدفع في قاعدة البيانات قبل التوجيه
      if (tapOrderId) {
        try {
          const payment = await prisma.payment.findFirst({
            where: {
              transactionId: tapOrderId,
              paymentStatus: 'COMPLETED'
            },
            include: {
              request: {
                include: {
                  user: true
                }
              }
            }
          });

          if (payment) {
            console.log('Payment verified in database:', payment.id);
            // الدفع مؤكد في قاعدة البيانات - توجيه لصفحة النجاح مع تفاصيل الدفع
            const user = payment.request?.user;
            const request = payment.request;
            
            // بناء URL مع تفاصيل الدفع
            const thankYouParams = new URLSearchParams({
              paymentMethod: 'electronic',
              requestNumber: tapOrderId,
              verified: 'true',
              name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
              email: user?.email || '',
              purpose: request?.purpose || '',
              recipient: request?.recipient || ''
            });

            // إضافة مبلغ الدفع
            if (payment.amount) {
              thankYouParams.set('finalAmount', payment.amount.toString());
            }

            redirectUrl = `/request-form/thank-you?${thankYouParams.toString()}`;
          } else {
            console.log('Payment not found in database, redirecting to verification page');
            // الدفع غير مؤكد - توجيه لصفحة التحقق
            redirectUrl = `/request-form/payment-redirect?orderNumber=${tapOrderId}&status=pending&fromGateway=true`;
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          // في حالة الخطأ، توجيه لصفحة التحقق
          redirectUrl = `/request-form/payment-redirect?orderNumber=${tapOrderId}&status=pending&fromGateway=true`;
        }
      } else {
        // لا يوجد رقم طلب - توجيه لصفحة فشل الدفع
        redirectUrl = `/request-form/payment-failed?error=${encodeURIComponent('رقم الطلب غير صحيح')}`;
      }
    } else if (tapStatus === 'failed' || tapResult === 'FAILED' || tapResult === 'DECLINED') {
      paymentStatus = 'failed';
      redirectUrl = `/request-form/payment-failed?error=${encodeURIComponent('فشل في إتمام عملية الدفع')}&orderNumber=${tapOrderId}`;
    } else if (tapStatus === 'cancelled' || tapResult === 'CANCELLED') {
      paymentStatus = 'cancelled';
      redirectUrl = `/request-form/payment-failed?error=${encodeURIComponent('تم إلغاء عملية الدفع')}&orderNumber=${tapOrderId}&cancelled=true`;
    } else {
      // حالة غير معروفة - توجيه لصفحة فشل الدفع
      paymentStatus = 'unknown';
      redirectUrl = `/request-form/payment-failed?error=${encodeURIComponent('حالة دفع غير معروفة')}&orderNumber=${tapOrderId}`;
    }

    console.log(`Payment status: ${paymentStatus}, redirecting to: ${redirectUrl}`);

    // توجيه المستخدم للصفحة المناسبة
    return NextResponse.redirect(new URL(redirectUrl, request.url));

  } catch (error) {
    console.error('Payment redirect handler error:', error);
    
    // في حالة حدوث خطأ، توجيه لصفحة فشل الدفع
    const errorRedirectUrl = `/request-form/payment-failed?error=${encodeURIComponent('حدث خطأ في معالجة الدفع')}`;
    return NextResponse.redirect(new URL(errorRedirectUrl, request.url));
  }
}
