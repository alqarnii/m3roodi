import { prisma } from '../src/lib/prisma';

async function testUsersDisplay() {
  console.log('🧪 اختبار عرض المستخدمين في الواجهة...\n');

  try {
    // جلب جميع المستخدمين
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        idNumber: true,
        createdAt: true,
        updatedAt: true,
        requests: {
          select: {
            id: true,
            purpose: true,
            status: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 إجمالي المستخدمين: ${allUsers.length}\n`);

    // اختبار عرض كل مستخدم
    console.log('🔍 اختبار عرض كل مستخدم:');
    console.log('='.repeat(80));

    let displayableCount = 0;
    let errorCount = 0;

    allUsers.forEach((user, index) => {
      try {
        // محاكاة عرض الاسم
        const displayName = `${user.firstName} ${user.lastName || ''}`.trim();
        
        // محاكاة عرض الحرف الأول
        const firstChar = user.firstName.charAt(0);
        const lastChar = user.lastName ? user.lastName.charAt(0) : '';
        const initials = `${firstChar}${lastChar}`;
        
        // محاكاة عرض معلومات الاتصال
        const phoneDisplay = user.phone || 'غير محدد';
        const idNumberDisplay = user.idNumber || 'غير محدد';
        
        // محاكاة عرض عدد الطلبات
        const requestsCount = user.requests?.length || 0;
        
        // محاكاة عرض التواريخ
        const createdAtDisplay = user.createdAt.toLocaleString('ar-SA');
        const updatedAtDisplay = user.updatedAt.toLocaleString('ar-SA');

        console.log(`${index + 1}. المستخدم #${user.id}`);
        console.log(`   ✅ الاسم: ${displayName}`);
        console.log(`   ✅ الحروف الأولى: ${initials}`);
        console.log(`   ✅ البريد الإلكتروني: ${user.email}`);
        console.log(`   ✅ رقم الجوال: ${phoneDisplay}`);
        console.log(`   ✅ رقم الهوية: ${idNumberDisplay}`);
        console.log(`   ✅ عدد الطلبات: ${requestsCount}`);
        console.log(`   ✅ تاريخ التسجيل: ${createdAtDisplay}`);
        console.log(`   ✅ آخر تحديث: ${updatedAtDisplay}`);
        
        displayableCount++;
        
      } catch (error) {
        console.log(`${index + 1}. المستخدم #${user.id}`);
        console.log(`   ❌ خطأ في العرض: ${error instanceof Error ? error.message : String(error)}`);
        errorCount++;
      }
      
      console.log('-'.repeat(40));
    });

    // خلاصة الاختبار
    console.log('\n🎯 خلاصة الاختبار:');
    console.log(`   - إجمالي المستخدمين: ${allUsers.length}`);
    console.log(`   - المستخدمين القابلين للعرض: ${displayableCount}`);
    console.log(`   - المستخدمين مع أخطاء: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('✅ جميع المستخدمين يمكن عرضهم بنجاح في الواجهة');
    } else {
      console.log(`❌ ${errorCount} مستخدم لديه مشاكل في العرض`);
    }

    // اختبار إضافي للبيانات المفقودة
    console.log('\n🔍 فحص البيانات المفقودة:');
    
    const usersWithoutLastName = allUsers.filter(u => !u.lastName);
    const usersWithoutPhone = allUsers.filter(u => !u.phone);
    const usersWithoutIdNumber = allUsers.filter(u => !u.idNumber);
    
    console.log(`   - المستخدمين بدون اسم أخير: ${usersWithoutLastName.length}`);
    console.log(`   - المستخدمين بدون رقم جوال: ${usersWithoutPhone.length}`);
    console.log(`   - المستخدمين بدون هوية: ${usersWithoutIdNumber.length}`);
    
    if (usersWithoutLastName.length > 0) {
      console.log('\n⚠️  المستخدمين بدون اسم أخير:');
      usersWithoutLastName.forEach(user => {
        console.log(`   - المستخدم #${user.id}: ${user.firstName} (${user.email})`);
      });
    }

    // اختبار أن جميع المستخدمين لديهم البيانات الأساسية
    const usersWithBasicData = allUsers.filter(u => u.firstName && u.email);
    console.log(`\n✅ المستخدمين مع البيانات الأساسية: ${usersWithBasicData.length}/${allUsers.length}`);
    
    if (usersWithBasicData.length === allUsers.length) {
      console.log('🎉 جميع المستخدمين لديهم البيانات الأساسية المطلوبة للعرض');
    } else {
      console.log('⚠️  بعض المستخدمين يفتقدون البيانات الأساسية');
    }

  } catch (error) {
    console.error('❌ خطأ في الاختبار:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الاختبار
testUsersDisplay();
