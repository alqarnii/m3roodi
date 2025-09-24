import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;
  
  // التحقق من النطاق وإعادة التوجيه إلى m3roodi.com
  if (hostname !== 'm3roodi.com' && hostname !== 'localhost') {
    // إعادة توجيه جميع النطاقات الأخرى إلى m3roodi.com
    const url = request.nextUrl.clone();
    url.hostname = 'm3roodi.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  // إضافة headers لحل مشكلة cache
  const response = NextResponse.next();
  
  // منع cache للملفات الديناميكية فقط
  if (pathname.startsWith('/api/') || pathname.includes('auth') || pathname.includes('admin')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  // لا نضيف Cache-Control للملفات الأخرى لتجنب التضارب

  // السماح بالوصول لصفحة الشكر بعد الدفع الإلكتروني بدون الرجوع للنموذج
  if (pathname.startsWith('/request-form/thank-you')) {
    const searchParams = request.nextUrl.searchParams;
    const requestNumber = searchParams.get('requestNumber');

    // يكفي توفر رقم الطلب. ستتولى الصفحة نفسها التحقق التفصيلي
    if (!requestNumber) {
      const errorUrl = new URL('/request-form/payment-failed', request.url);
      errorUrl.searchParams.set('error', 'لم يتم العثور على رقم الطلب');
      return NextResponse.redirect(errorUrl);
    }
  }

  // التحقق من الوصول لصفحة الدفع
  if (pathname === '/request-form/payment') {
    // التحقق من وجود بيانات طلب في localStorage (سيتم التحقق من جانب العميل)
    // هذا مجرد حماية إضافية
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
