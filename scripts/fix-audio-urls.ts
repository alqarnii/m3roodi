import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixAudioUrls() {
  try {
    console.log('بدء تنظيف روابط التسجيلات الصوتية...');
    
    // البحث عن جميع الطلبات التي تحتوي على تسجيلات صوتية
    const requests = await prisma.request.findMany({
      where: {
        voiceRecordingUrl: {
          not: null
        }
      },
      select: {
        id: true,
        voiceRecordingUrl: true
      }
    });
    
    console.log(`تم العثور على ${requests.length} طلب يحتوي على تسجيلات صوتية`);
    
    let fixedCount = 0;
    let blobCount = 0;
    
    for (const request of requests) {
      if (!request.voiceRecordingUrl) continue;
      
      const url = request.voiceRecordingUrl;
      
      // إذا كان الرابط blob URL، لا يمكن إصلاحه
      if (url.startsWith('blob:')) {
        console.log(`⚠️  الطلب #${request.id}: يحتوي على blob URL - لا يمكن إصلاحه`);
        blobCount++;
        continue;
      }
      
      // إصلاح الروابط التي تبدأ بـ /audio/
      if (url.startsWith('/audio/')) {
        const correctedUrl = url.replace('/audio/', '/uploads/audio/');
        
        try {
          await prisma.request.update({
            where: { id: request.id },
            data: { voiceRecordingUrl: correctedUrl }
          });
          
          console.log(`✅ تم إصلاح الطلب #${request.id}: ${url} → ${correctedUrl}`);
          fixedCount++;
        } catch (error) {
          console.error(`❌ فشل في إصلاح الطلب #${request.id}:`, error);
        }
      } else if (url.startsWith('/uploads/audio/')) {
        console.log(`✅ الطلب #${request.id}: الرابط صحيح بالفعل`);
      } else {
        console.log(`⚠️  الطلب #${request.id}: نوع رابط غير معروف: ${url}`);
      }
    }
    
    console.log('\n=== ملخص التنظيف ===');
    console.log(`إجمالي الطلبات: ${requests.length}`);
    console.log(`تم إصلاحها: ${fixedCount}`);
    console.log(`تحتوي على blob URL: ${blobCount}`);
    console.log(`صحيحة بالفعل: ${requests.length - fixedCount - blobCount}`);
    
    if (blobCount > 0) {
      console.log('\n⚠️  ملاحظة مهمة:');
      console.log('الطلبات التي تحتوي على blob URL لا يمكن إصلاحها تلقائياً');
      console.log('يجب إعادة رفع الملفات الصوتية من قبل المستخدمين');
    }
    
  } catch (error) {
    console.error('خطأ في تنظيف الروابط:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل السكريبت
fixAudioUrls()
  .then(() => {
    console.log('تم الانتهاء من تنظيف الروابط');
    process.exit(0);
  })
  .catch((error) => {
    console.error('فشل في تنظيف الروابط:', error);
    process.exit(1);
  });
