import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPriceById } from '@/lib/pricing';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      templateId,
      templateName,
      customerName,
      customerEmail,
      customerPhone,
      additionalNotes
    } = body;

    // التحقق من البيانات المطلوبة
    if (!templateId || !templateName || !customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء طلب قالب جاهز جديد
    const newRequest = await prisma.request.create({
      data: {
        purpose: `صيغة جاهزة - ${templateName}`,
        recipient: 'صيغة جاهزة',
        description: `طلب صيغة جاهزة: ${templateName}${additionalNotes ? ` - ملاحظات: ${additionalNotes}` : ''}`,
        applicantName: customerName,
        phone: customerPhone,
        price: getPriceById('ready-template'), // سعر القالب الجاهز: 49 ريال
        status: 'PENDING',
        priority: 'MEDIUM',
        // إضافة metadata للتمييز
        notes: JSON.stringify({
          templateId,
          templateName,
          customerEmail,
          additionalNotes,
          orderType: 'ready_template'
        })
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ طلب الصيغة الجاهزة بنجاح',
      data: {
        id: newRequest.id,
        orderNumber: `RT-${newRequest.id.toString().padStart(6, '0')}`,
        templateName: templateName,
        customerName: customerName,
        status: newRequest.status,
        price: Number(newRequest.price),
        createdAt: newRequest.createdAt.toISOString().split('T')[0]
      }
    });

  } catch (error) {
    console.error('خطأ في حفظ طلب الصيغة الجاهزة:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في حفظ طلب الصيغة الجاهزة',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
