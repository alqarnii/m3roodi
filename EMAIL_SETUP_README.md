# إعدادات البريد الإلكتروني - نظام نسيت كلمة السر

## المتطلبات

1. **Gmail Account**: حساب Gmail نشط
2. **App Password**: كلمة سر للتطبيقات (وليس كلمة السر العادية)

## خطوات الإعداد

### 1. إنشاء App Password في Gmail

1. اذهب إلى [Google Account Settings](https://myaccount.google.com/)
2. اختر "Security" (الأمان)
3. في قسم "Signing in to Google"، اختر "2-Step Verification"
4. في أسفل الصفحة، اختر "App passwords"
5. اختر "Mail" كتطبيق
6. انسخ كلمة السر التي تظهر لك

### 2. إعداد متغيرات البيئة

أضف المتغيرات التالية إلى ملف `.env.local`:

```env
# إعدادات البريد الإلكتروني
EMAIL_USER=m3roodi@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_APP_PASSWORD=your_app_password_here

# رابط التطبيق
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. تحديث قاعدة البيانات

قم بتشغيل الأمر التالي لتطبيق التغييرات على قاعدة البيانات:

```bash
npm run db:push
```

## ملاحظات مهمة

- **لا تستخدم كلمة السر العادية**: استخدم App Password فقط
- **تأكد من تفعيل 2-Step Verification**: مطلوب لإنشاء App Password
- **احتفظ بكلمة السر آمنة**: لا تشاركها مع أي شخص
- **اختبار النظام**: تأكد من عمل النظام قبل النشر

## استكشاف الأخطاء

### مشكلة: "Invalid login"
- تأكد من صحة App Password
- تأكد من تفعيل 2-Step Verification

### مشكلة: "Authentication failed"
- تحقق من صحة البريد الإلكتروني
- تأكد من أن App Password صحيح

### مشكلة: "Connection timeout"
- تحقق من اتصال الإنترنت
- تأكد من عدم حظر Gmail من قبل Firewall

## الأمان

- الرموز صالحة لمدة ساعة واحدة فقط
- يتم حذف الرموز المستخدمة تلقائياً
- يتم تشفير كلمات السر باستخدام bcrypt
- لا يتم تخزين كلمات السر العادية في قاعدة البيانات
