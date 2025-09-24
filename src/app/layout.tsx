import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatus from "@/components/NetworkStatus";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "معروضي | لكتابة الخطابات القوية والمؤثرة",
  description: "بخبرة 25 سنة في كتابة الخطابات، نكتب لك معروض قوي ومؤثر يحقق هدفك بعون الله. خدمات معاريض احترافية للديوان الملكي والوزارات.",
  keywords: [
    "معروض",
    "معروضي",
    "كتابة معروض",
    "معاريض",
    "معرض",
    "معروض للديوان الملكي",
    "كتابة خطاب",
    "معروض احترافي",
    "خدمات معاريض",
    "كتابة معروض قوي",
    "معروض مؤثر",
    "صياغة معروض",
    "معروض سعودي",
    "كتابة معروض باللغة العربية",
    "معروض للوزارات",
    "معروض حكومي",
    "كتابة معروض احترافي",
    "معروض قوي ومؤثر",
    "طلب مساعدة مالية",
    "كتابة طلب تجنيس",
    "كتابة خطاب شكوى",
    "معروض للديوان الملكي"
  ],
  authors: [{ name: "معروضي", url: "https://m3roodi.com" }],
  creator: "معروضي",
  publisher: "معروضي",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://m3roodi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "معروضي | لكتابة الخطابات القوية والمؤثرة",
    description: "معروضي - خدمات كتابة وإرسال المعاريض والخطابات الاحترافية. نكتب لك معروض قوي ومؤثر يضمن لك تحقيق هدفك.",
    url: 'https://m3roodi.com',
    siteName: 'معروضي',
    locale: 'ar_SA',
    type: 'website',
    images: [
      {
        url: '/m3r.jpeg',
        width: 1200,
        height: 630,
        alt: 'معروضي - خدمات كتابة المعاريض الاحترافية',
      },
      {
        url: '/m3roodic.jpg',
        width: 1200,
        height: 630,
        alt: 'معروضي - خدمات كتابة المعاريض الاحترافية',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "معروضي | لكتابة الخطابات القوية والمؤثرة",
    description: "معروضي - خدمات كتابة وإرسال المعاريض والخطابات الاحترافية",
    images: ['/m3r.jpeg', '/m3roodic.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // أضف كود التحقق من Google Search Console
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
        <meta httpEquiv="Pragma" content="public" />
        <meta httpEquiv="Expires" content="31536000" />
        
        {/* علامات SEO مهمة */}
        <meta name="author" content="معروضي" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* عنوان الصفحة المحدد */}
        <meta name="title" content="معروضي | لكتابة الخطابات القوية والمؤثرة" />
        <meta property="og:title" content="معروضي | لكتابة الخطابات القوية والمؤثرة" />
        <meta name="twitter:title" content="معروضي | لكتابة الخطابات القوية والمؤثرة" />
        
        {/* علامات جغرافية */}
        <meta name="geo.region" content="SA" />
        <meta name="geo.country" content="Saudi Arabia" />
        <meta name="geo.placename" content="Riyadh" />
        
        {/* علامات الأعمال */}
        <meta name="business:contact_data:street_address" content="Riyadh, Saudi Arabia" />
        <meta name="business:contact_data:locality" content="Riyadh" />
        <meta name="business:contact_data:region" content="Riyadh" />
        <meta name="business:contact_data:country_name" content="Saudi Arabia" />
        <meta name="business:contact_data:phone_number" content="+966551117720" />
        <meta name="business:contact_data:email" content="m3roodi@gmail.com" />
        
        {/* علامات التواصل الاجتماعي */}
        <meta property="og:site_name" content="معروضي" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:type" content="website" />
        
        {/* علامات Twitter */}
        <meta name="twitter:site" content="@m3roodi" />
        <meta name="twitter:creator" content="@m3roodi" />
        
        {/* علامات إضافية */}
        <meta name="theme-color" content="#56a5de" />
        <meta name="msapplication-TileColor" content="#56a5de" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="معروضي" />
        
        {/* DNS Prefetch and Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Resource Hints for Performance */}
        <link rel="preload" href="/m3r.jpeg" as="image" type="image/jpeg" />
        <link rel="preload" href="/m3roodic.jpg" as="image" type="image/jpeg" />
        
        {/* Critical CSS Inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: 'Tajawal', sans-serif; }
            .arabic-text { direction: rtl; text-align: right; }
            .ibm-plex-arabic-bold { font-family: 'IBM Plex Sans Arabic', sans-serif; font-weight: 700; }
          `
        }} />
        
        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Additional Images for Search Engines */}
        <link rel="image_src" href="/m3r.jpeg" />
        <link rel="image_src" href="/m3roodic.jpg" />
        <meta property="og:image" content="/m3r.jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="معروضي - خدمات كتابة المعاريض الاحترافية" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Schema Markup for Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "معروضي",
              "alternateName": "معروضي لكتابة المعاريض",
              "url": "https://m3roodi.com",
              "description": "بخبرة 25 سنة في كتابة الخطابات، نكتب لك معروض قوي ومؤثر يحقق هدفك بعون الله",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://m3roodi.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "معروضي",
                "url": "https://m3roodi.com",
                "logo": "https://m3roodi.com/m3r.jpeg",
                "description": "خدمات كتابة المعاريض والخطابات الاحترافية",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+966551117720",
                  "contactType": "customer service",
                  "availableLanguage": "Arabic"
                },
                "sameAs": [
                  "https://www.instagram.com/m3roodi/",
                  "https://x.com/M3roodi",
                  "https://www.tiktok.com/@m3roodi",
                  "https://www.youtube.com/@m3roodivip670",
                  "https://www.facebook.com/m3roodi/"
                ]
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "الرئيسية",
                    "item": "https://m3roodi.com"
                  }
                ]
              }
            })
          }}
        />
        
        {/* Additional Schema for Sitelinks */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "name": "خدمات معروضي",
              "description": "خدمات كتابة المعاريض والخطابات الاحترافية",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "كتابة معروض للديوان الملكي",
                  "url": "https://m3roodi.com/request-form",
                  "description": "كتابة معروض احترافي للديوان الملكي"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "طلب مساعدة مالية",
                  "url": "https://m3roodi.com/services/financial-assistance",
                  "description": "كتابة معروض طلب مساعدة مالية"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "كتابة طلب تجنيس",
                  "url": "https://m3roodi.com/services/naturalization",
                  "description": "كتابة معروض طلب تجنيس"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "كتابة خطاب شكوى",
                  "url": "https://m3roodi.com/services/complaint",
                  "description": "كتابة خطاب شكوى احترافي"
                }
              ]
            })
          }}
        />
        
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          <NetworkStatus />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
