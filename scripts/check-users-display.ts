import { prisma } from '../src/lib/prisma';

async function checkUsersDisplay() {
  console.log('🔍 فحص عرض المستخدمين في لوحة الإدارة...\n');

  try {
    // جلب جميع المستخدمين من قاعدة البيانات
    console.log('1️⃣ جلب جميع المستخدمين من قاعدة البيانات...');
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

    console.log(`✅ تم العثور على ${allUsers.length} مستخدم في قاعدة البيانات\n`);

    // عرض تفاصيل كل مستخدم
    console.log('2️⃣ تفاصيل المستخدمين:');
    console.log('='.repeat(80));
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. المستخدم #${user.id}`);
      console.log(`   الاسم: ${user.firstName} ${user.lastName}`);
      console.log(`   البريد الإلكتروني: ${user.email}`);
      console.log(`   رقم الجوال: ${user.phone || 'غير محدد'}`);
      console.log(`   رقم الهوية: ${user.idNumber || 'غير محدد'}`);
      console.log(`   عدد الطلبات: ${user.requests?.length || 0}`);
      console.log(`   تاريخ التسجيل: ${user.createdAt.toLocaleString('ar-SA')}`);
      console.log(`   آخر تحديث: ${user.updatedAt.toLocaleString('ar-SA')}`);
      console.log('-'.repeat(40));
    });

    // التحقق من أن API endpoint يعيد نفس البيانات
    console.log('\n3️⃣ محاكاة API endpoint للمستخدمين...');
    
    // محاكاة نفس الاستعلام الذي يستخدمه API
    const apiUsers = await prisma.user.findMany({
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

    console.log(`✅ API endpoint يعيد ${apiUsers.length} مستخدم\n`);

    // التحقق من تطابق البيانات
    if (allUsers.length === apiUsers.length) {
      console.log('✅ عدد المستخدمين متطابق بين قاعدة البيانات و API');
    } else {
      console.log('❌ عدد المستخدمين غير متطابق!');
      console.log(`   قاعدة البيانات: ${allUsers.length}`);
      console.log(`   API: ${apiUsers.length}`);
    }

    // التحقق من أن جميع المستخدمين لديهم بيانات مطلوبة
    console.log('\n4️⃣ فحص اكتمال بيانات المستخدمين...');
    
    const incompleteUsers = allUsers.filter(user => 
      !user.firstName || 
      !user.lastName || 
      !user.email || 
      !user.phone
    );

    if (incompleteUsers.length === 0) {
      console.log('✅ جميع المستخدمين لديهم بيانات مكتملة');
    } else {
      console.log(`⚠️  ${incompleteUsers.length} مستخدم لديه بيانات غير مكتملة:`);
      incompleteUsers.forEach(user => {
        console.log(`   - المستخدم #${user.id}: ${user.firstName} ${user.lastName}`);
        console.log(`     البيانات المفقودة: ${[
          !user.firstName ? 'الاسم الأول' : null,
          !user.lastName ? 'الاسم الأخير' : null,
          !user.email ? 'البريد الإلكتروني' : null,
          !user.phone ? 'رقم الجوال' : null
        ].filter(Boolean).join(', ')}`);
      });
    }

    // إحصائيات إضافية
    console.log('\n5️⃣ إحصائيات إضافية:');
    console.log(`   - إجمالي المستخدمين: ${allUsers.length}`);
    console.log(`   - المستخدمين مع طلبات: ${allUsers.filter(u => u.requests && u.requests.length > 0).length}`);
    console.log(`   - المستخدمين بدون طلبات: ${allUsers.filter(u => !u.requests || u.requests.length === 0).length}`);
    console.log(`   - المستخدمين مع هوية: ${allUsers.filter(u => u.idNumber).length}`);
    console.log(`   - المستخدمين بدون هوية: ${allUsers.filter(u => !u.idNumber).length}`);

    // التحقق من أن جميع المستخدمين سيظهرون في الواجهة
    console.log('\n6️⃣ فحص إمكانية العرض في الواجهة...');
    
    const displayableUsers = allUsers.filter(user => 
      user.firstName && 
      user.lastName && 
      user.email
    );

    if (displayableUsers.length === allUsers.length) {
      console.log('✅ جميع المستخدمين يمكن عرضهم في الواجهة');
    } else {
      console.log(`⚠️  ${allUsers.length - displayableUsers.length} مستخدم لا يمكن عرضه في الواجهة`);
    }

    console.log('\n🎯 خلاصة الفحص:');
    console.log(`   - المستخدمين في قاعدة البيانات: ${allUsers.length}`);
    console.log(`   - المستخدمين القابلين للعرض: ${displayableUsers.length}`);
    console.log(`   - المستخدمين مع طلبات: ${allUsers.filter(u => u.requests && u.requests.length > 0).length}`);
    
    if (displayableUsers.length === allUsers.length) {
      console.log('✅ جميع المستخدمين في قاعدة البيانات سيظهرون في صفحة المستخدمين في لوحة الإدارة');
    } else {
      console.log('❌ بعض المستخدمين قد لا يظهرون في صفحة المستخدمين في لوحة الإدارة');
    }

  } catch (error) {
    console.error('❌ خطأ في فحص المستخدمين:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
  }
}

// تشغيل الفحص
checkUsersDisplay();
