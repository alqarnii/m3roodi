import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNotes } = body;

    // التحقق من صحة الحالة
    const validStatuses = ['PENDING', 'REVIEWED', 'RESPONDED', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'حالة غير صحيحة' },
        { status: 400 }
      );
    }

    // تحديث النصيحة
    const updatedFeedback = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: {
        ...(status && { status }),
        ...(adminNotes !== undefined && { adminNotes }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      message: 'تم تحديث النصيحة بنجاح',
      feedback: updatedFeedback
    });

  } catch (error) {
    console.error('خطأ في تحديث النصيحة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // حذف النصيحة
    await prisma.feedback.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: 'تم حذف النصيحة بنجاح'
    });

  } catch (error) {
    console.error('خطأ في حذف النصيحة:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
