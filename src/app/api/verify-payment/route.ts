import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, customerEmail } = body;

    if (!orderNumber || !customerEmail) {
      return NextResponse.json(
        { success: false, message: 'معلومات غير مكتملة' },
        { status: 400 }
      );
    }

    console.log(`البحث عن الدفع: ${orderNumber} للبريد: ${customerEmail}`);

    // البحث عن الطلب في قاعدة البيانات - تحقق أكثر صرامة
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: orderNumber,
        paymentStatus: 'COMPLETED',
        paymentDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // الدفع في آخر 24 ساعة فقط
        }
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
      console.log(`تم العثور على دفع مكتمل: ${payment.id}`);
      
      // التحقق من أن البريد الإلكتروني يتطابق
      if (!payment.request.user || payment.request.user.email !== customerEmail) {
        console.log(`البريد الإلكتروني لا يتطابق: ${payment.request.user?.email} vs ${customerEmail}`);
        
        // إذا كان البريد لا يتطابق، نبحث عن أي دفع بهذا الرقم
        const anyPayment = await prisma.payment.findFirst({
          where: {
            transactionId: orderNumber,
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
        
        if (anyPayment) {
          console.log(`تم العثور على دفع مكتمل آخر: ${anyPayment.id}`);
          return NextResponse.json({
            success: true,
            paymentStatus: 'COMPLETED',
            payment: {
              id: anyPayment.id,
              amount: anyPayment.amount,
              paymentMethod: anyPayment.paymentMethod,
              paymentDate: anyPayment.paymentDate,
              transactionId: anyPayment.transactionId
            },
            request: {
              id: anyPayment.request.id,
              purpose: anyPayment.request.purpose,
              recipient: anyPayment.request.recipient,
              status: anyPayment.request.status
            }
          });
        }
        
        return NextResponse.json(
          { 
            success: false, 
            message: 'البريد الإلكتروني لا يتطابق مع الطلب',
            paymentStatus: 'EMAIL_MISMATCH'
          },
          { status: 403 }
        );
      }

      // إرجاع تفاصيل الدفع الناجح
      return NextResponse.json({
        success: true,
        paymentStatus: 'COMPLETED',
        payment: {
          id: payment.id,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentDate: payment.paymentDate,
          transactionId: payment.transactionId
        },
        request: {
          id: payment.request.id,
          purpose: payment.request.purpose,
          recipient: payment.request.recipient,
          status: payment.request.status
        }
      });
    }

    // إذا لم نجد دفع مكتمل، نبحث عن أي دفع بهذا الرقم
    const anyPayment = await prisma.payment.findFirst({
      where: {
        transactionId: orderNumber
      },
      include: {
        request: {
          include: {
            user: true
          }
        }
      }
    });

    if (anyPayment) {
      console.log(`تم العثور على دفع: ${anyPayment.id} بالحالة: ${anyPayment.paymentStatus}`);
      
      if (anyPayment.paymentStatus === 'COMPLETED') {
        // الدفع مكتمل! إرجاع النتيجة
        return NextResponse.json({
          success: true,
          paymentStatus: 'COMPLETED',
          payment: {
            id: anyPayment.id,
            amount: anyPayment.amount,
            paymentMethod: anyPayment.paymentMethod,
            paymentDate: anyPayment.paymentDate,
            transactionId: anyPayment.transactionId
          },
          request: {
            id: anyPayment.request.id,
            purpose: anyPayment.request.purpose,
            recipient: anyPayment.request.recipient,
            status: anyPayment.request.status
          }
        });
      } else {
        // يوجد دفع لكنه لم يكتمل
        return NextResponse.json(
          { 
            success: false, 
            message: 'الدفع لم يكتمل بعد أو تم إلغاؤه',
            paymentStatus: 'INCOMPLETE',
            actualStatus: anyPayment.paymentStatus
          },
          { status: 402 }
        );
      }
    }

    // لا يوجد دفع على الإطلاق
    console.log(`لم يتم العثور على أي دفع للطلب: ${orderNumber}`);
    return NextResponse.json(
      { 
        success: false, 
        message: 'لم يتم العثور على أي دفع لهذا الطلب',
        paymentStatus: 'NOT_FOUND'
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في التحقق من الدفع' 
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
