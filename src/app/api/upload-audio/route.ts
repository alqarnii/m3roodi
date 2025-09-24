import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('بدء معالجة طلب رفع ملف صوتي');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    console.log('تم استلام البيانات:', {
      hasAudioFile: !!audioFile,
      fileType: audioFile?.type,
      fileSize: audioFile?.size,
      fileName: audioFile?.name
    });
    
    if (!audioFile) {
      console.error('لم يتم العثور على ملف صوتي في الطلب');
      return NextResponse.json(
        { success: false, message: 'لم يتم العثور على ملف صوتي' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    if (!audioFile.type.startsWith('audio/')) {
      console.error('نوع الملف غير صحيح:', audioFile.type);
      return NextResponse.json(
        { success: false, message: 'نوع الملف غير صحيح. يجب أن يكون ملف صوتي' },
        { status: 400 }
      );
    }

    // إنشاء اسم فريد للملف مع امتداد صحيح
    const timestamp = Date.now();
    const fileExtension = audioFile.type.includes('webm') ? 'webm' : 
                         audioFile.type.includes('mp4') ? 'mp4' : 'wav';
    const fileName = `recording_${timestamp}.${fileExtension}`;
    
    console.log('معلومات الملف:', {
      originalType: audioFile.type,
      fileExtension,
      fileName
    });

    // رفع الملف إلى Vercel Blob Storage
    console.log('جاري رفع الملف إلى Vercel Blob Storage...');
    const blob = await put(fileName, audioFile, {
      access: 'public', // الملف متاح للجميع
      addRandomSuffix: false, // لا نريد إضافة لاحقة عشوائية
    });
    
    console.log('تم رفع الملف بنجاح إلى Vercel Blob Storage:', {
      url: blob.url,
      pathname: blob.pathname
    });

    return NextResponse.json({
      success: true,
      message: 'تم رفع التسجيل الصوتي بنجاح',
      audioUrl: blob.url,
      fileName: fileName,
      fileSize: audioFile.size,
      blobId: blob.pathname
    });

  } catch (error) {
    console.error('خطأ في رفع التسجيل الصوتي:', error);
    
    // إرجاع رسالة خطأ أكثر تفصيلاً
    let errorMessage = 'فشل في رفع التسجيل الصوتي';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // تحديد رمز الحالة بناءً على نوع الخطأ
      if (error.message.includes('ENOSPC')) {
        errorMessage = 'لا توجد مساحة كافية على القرص';
        statusCode = 507; // Insufficient Storage
      } else if (error.message.includes('EACCES')) {
        errorMessage = 'لا توجد صلاحيات كافية لكتابة الملف';
        statusCode = 403; // Forbidden
      } else if (error.message.includes('ENOENT')) {
        errorMessage = 'المجلد غير موجود';
        statusCode = 404; // Not Found
      } else if (error.message.includes('BLOB_ACCESS_TOKEN')) {
        errorMessage = 'خطأ في إعدادات Vercel Blob Storage';
        statusCode = 500;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: error instanceof Error ? error.message : 'خطأ غير معروف',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}
