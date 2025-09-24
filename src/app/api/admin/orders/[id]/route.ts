import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    const body = await request.json();
    
    // التحقق من وجود الطلب
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // تحديث الطلب
    const updatedRequest = await prisma.request.update({
      where: { id: requestId },
      data: {
        ...body,
        // تحديث تاريخ التعديل
        updatedAt: new Date()
      },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            position: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      data: {
        id: updatedRequest.id,
        applicantName: updatedRequest.applicantName,
        purpose: updatedRequest.purpose,
        recipient: updatedRequest.recipient,
        status: updatedRequest.status,
        priority: updatedRequest.priority,
        price: Number(updatedRequest.price),
        phone: updatedRequest.phone,
        idNumber: updatedRequest.idNumber,
        description: updatedRequest.description,
        createdAt: updatedRequest.createdAt.toISOString().split('T')[0],
        updatedAt: updatedRequest.updatedAt.toISOString().split('T')[0],
        assignedTo: updatedRequest.assignedTo ? `${updatedRequest.assignedTo.firstName} ${updatedRequest.assignedTo.lastName}` : null
      }
    });

  } catch (error) {
    console.error('خطأ في تحديث الطلب:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في تحديث الطلب',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
            position: true
          }
        },
        payments: {
          select: {
            amount: true,
            paymentStatus: true,
            paymentMethod: true
          }
        }
      }
    });

    if (!request) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: request.id,
        applicantName: request.applicantName,
        purpose: request.purpose,
        recipient: request.recipient,
        description: request.description,
        status: request.status,
        priority: request.priority,
        price: Number(request.price),
        phone: request.phone,
        idNumber: request.idNumber,
        createdAt: request.createdAt.toISOString().split('T')[0],
        deliveryDate: request.deliveryDate ? request.deliveryDate.toISOString().split('T')[0] : null,
        assignedTo: request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.lastName}` : null,
        totalPaid: request.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0),
        paymentStatus: request.payments.length > 0 ? 
          request.payments.every((p: any) => p.paymentStatus === 'COMPLETED') ? 'مكتمل' : 'جزئي' : 'غير مدفوع',
        paymentMethod: request.payments.length > 0 ? 
          request.payments[0].paymentMethod === 'BANK_TRANSFER' ? 'تحويل بنكي' : 
          request.payments[0].paymentMethod === 'ELECTRONIC' ? 'دفع إلكتروني' : 'غير محدد' : 'غير محدد'
      }
    });

  } catch (error) {
    console.error('خطأ في جلب الطلب:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في جلب الطلب',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const requestId = parseInt(params.id);
    
    // التحقق من وجود الطلب
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        payments: true
      }
    });

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, message: 'الطلب غير موجود' },
        { status: 404 }
      );
    }

    // حذف المدفوعات المرتبطة بالطلب أولاً
    if (existingRequest.payments.length > 0) {
      await prisma.payment.deleteMany({
        where: { requestId: requestId }
      });
    }

    // حذف المتابعات المرتبطة بالطلب
    await prisma.followUp.deleteMany({
      where: { requestId: requestId }
    });

    // حذف التعديلات المرتبطة بالطلب
    await prisma.modification.deleteMany({
      where: { requestId: requestId }
    });

    // حذف تذكيرات الدفع المرتبطة بالطلب
    await prisma.paymentReminder.deleteMany({
      where: { requestId: requestId }
    });

    // حذف الطلب
    await prisma.request.delete({
      where: { id: requestId }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف الطلب وجميع البيانات المرتبطة به بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف الطلب:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'فشل في حذف الطلب',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
