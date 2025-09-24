import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPriceById } from '@/lib/pricing';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientName, 
      senderName, 
      idNumber, 
      phoneNumber 
    } = body;

    // التحقق من البيانات المطلوبة
    if (!recipientName || !senderName || !idNumber || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء طلب إرسال معروض جديد
    const newRequest = await prisma.request.create({
      data: {
        purpose: 'إرسال معروض حكومي',
        recipient: recipientName,
        description: `طلب إرسال معروض من ${senderName} إلى ${recipientName}`,
        applicantName: senderName,
        phone: phoneNumber,
        idNumber: idNumber,
        price: getPriceById('send-proposal'), // سعر الخدمة: 599 ريال
        status: 'PENDING',
        priority: 'MEDIUM'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ طلب إرسال المعروض بنجاح',
      data: {
        id: newRequest.id,
        orderNumber: `SP-${newRequest.id.toString().padStart(6, '0')}`,
        applicantName: newRequest.applicantName,
        recipient: newRequest.recipient,
        status: newRequest.status,
        price: Number(newRequest.price),
        createdAt: newRequest.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('خطأ في حفظ طلب إرسال المعروض:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في حفظ طلب إرسال المعروض',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
