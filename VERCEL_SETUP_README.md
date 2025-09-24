# دليل إعداد Vercel لقاعدة البيانات

## المشكلة
الموقع لا يتصل بقاعدة البيانات في Vercel رغم أن الإعدادات صحيحة في localhost.

## الحلول المطبقة

### 1. تحديث Health Check Endpoint
تم تحديث `/api/health` لاختبار الاتصال بقاعدة البيانات وإظهار معلومات مفصلة.

### 2. تحديث vercel.json
تم إضافة متغيرات البيئة المطلوبة لـ Prisma:
```json
{
  "build": {
    "env": {
      "PRISMA_GENERATE_DATAPROXY": "false",
      "PRISMA_CLI_BINARY_TARGETS": "rhel-openssl-3.0.x"
    }
  }
}
```

### 3. إضافة Script لاختبار قاعدة البيانات
```bash
npm run db:test
```

## خطوات إعداد Vercel

### 1. إضافة Environment Variables في Vercel Dashboard

اذهب إلى Vercel Dashboard → Project Settings → Environment Variables وأضف:

```
DATABASE_URL=postgresql://neondb_owner:npg_tmI9UoFzMad3@ep-shy-queen-ab66pid5-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NEXT_PUBLIC_APP_URL=https://m3roodi.com
PRISMA_GENERATE_DATAPROXY=false
PRISMA_CLI_BINARY_TARGETS=rhel-openssl-3.0.x
```

### 2. إضافة متغيرات الدفع (إذا لم تكن موجودة)
```
TAP_SECRET_KEY=your_secret_key
NEXT_PUBLIC_TAP_PUBLIC_KEY=your_public_key
TAP_MERCHANT_ID=your_merchant_id
TAP_USERNAME=your_username
TAP_PASSWORD=your_password
TAP_API_KEY=your_api_key
```

### 3. إضافة متغيرات البريد الإلكتروني
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. إعادة النشر
بعد إضافة جميع المتغيرات:
1. اذهب إلى Deployments
2. اضغط على "Redeploy" للـ latest deployment
3. أو ادفع تغييرات جديدة إلى GitHub

## اختبار الاتصال

### 1. اختبار Health Check
اذهب إلى: `https://m3roodi.com/api/health`

يجب أن ترى:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "time": "2024-01-30T10:00:00.000Z",
    "url": "configured"
  }
}
```

### 2. اختبار محلي
```bash
npm run db:test
```

## استكشاف الأخطاء

### إذا كان Health Check يُظهر خطأ:
1. تأكد من صحة `DATABASE_URL`
2. تأكد من أن قاعدة البيانات متاحة
3. تأكد من إضافة جميع متغيرات Prisma

### إذا كان Build يفشل:
1. تأكد من إضافة `PRISMA_GENERATE_DATAPROXY=false`
2. تأكد من إضافة `PRISMA_CLI_BINARY_TARGETS=rhel-openssl-3.0.x`

### إذا كان الاتصال بطيء:
1. تأكد من استخدام connection pooling
2. تأكد من أن قاعدة البيانات في نفس المنطقة

## ملاحظات مهمة

1. **لا تضع DATABASE_URL في الكود** - استخدم Environment Variables فقط
2. **تأكد من إعادة النشر** بعد إضافة المتغيرات
3. **اختبر Health Check** للتأكد من الاتصال
4. **استخدم Prisma Studio** للتحقق من البيانات: `npm run db:studio`
