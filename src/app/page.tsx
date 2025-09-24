'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';


export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const testimonials = [
    {
      name: "خالد الحارثي",
      text: "صراحة اشكرهم جزيل الشكر طلبت معروض وكان قوي، وتم ارسال الرسالة الى الجهة المختصة وتم التجاوب معي وطلعت بنتيجة الحمدلله ما ضاع تعبي، شكرا",
      rating: 5
    },
    {
      name: "Khalid Ziyad",
      text: "خدمة العملاء جيده جداً، خاصة على الواتس آب، التعاون كان جميل ومعاينة الخطاب قبل الإرسال والتعديل عليه كانت أكثر من رائعة، بانتظار النتيجة النهائية، مشكلة الخطاب أخذ وقت على أساس يجهز وينرسل، شاكر ومقدر خدماتكم وتعاونكم.",
      rating: 5
    },
    {
      name: "فيصل القرني",
      text: "بارك الله فيكم وفي جهودكم",
      rating: 5
    },
    {
      name: "عبدالله المطاوعه",
      text: "كتبوا لي معروض طلب تجنيس معيَّر جداً، وتم قبول معاملتي بفضل الله ثم بفضل جهودهم، أسأل الله أن يبارك فيهم، ويرزقهم، ويزيدهم علماً وفضلاً. جزاهم الله خير",
      rating: 5
    },
    {
      name: "محمد المطيري",
      text: "بفضل الله ثم موقع معروضي، تم قبول علاج والدتي في مستشفى الحرس الوطني. أشكر الله ثم المسؤولين في بلادنا الغالية، وكذلك موقع معروضي الذي أوصل رسالتي بطريقة مؤثرة عَجَّلت بقبول طلبي.",
      rating: 5
    }
  ];
  
  const services = [
    { title: 'كتابة طلب مساعدة مالية', slug: 'financial-assistance', img: '/moneyord.webp', price: 199 },
    { title: 'كتابة معروض سداد دين', slug: 'debt-payment', img: '/sdaddin.webp', price: 199 },
    { title: 'كتابة خطاب طلب نقل', slug: 'request-transfer', img: '/naql.webp', price: 199 },
    { title: 'كتابة معروض طلب تجنيس', slug: 'naturalization', img: '/tjanes.webp', price: 350 },
    { title: 'كتابة معروض طلب علاج', slug: 'treatment', img: '/3lag.png', price: 150 },
    { title: 'كتابة طلب استرحام', slug: 'pardon-request', img: '/astrhma.png', price: 199 },
    { title: 'كتابة معروض طلب زواج من اجنبية', slug: 'marry-foreigner', img: '/wifes.webp', price: 300 },
    { title: 'كتابة معروض طلب وظيفة', slug: 'job-request', img: '/wzfh.webp', price: 199 },
    { title: 'كتابة خطاب شكوى', slug: 'complaint', img: '/shwkot.png', price: 250 },
    { title: 'كتابة معروض خاص', slug: 'custom-letter', img: '/kas.png', price: 350 },
    { title: 'كتابة معروض للديوان الملكي', slug: 'royal-court', img: '/diwan.webp', price: 350 },
    { title: 'كتابة معروض طلب سكن', slug: 'housing', img: '/skn.png', price: 199 },
    { title: 'طلب دراسة او ابتعاث', slug: 'study-scholarship', img: '/talbdrash.png', price: 199 },
    { title: 'كتابة طلب إعفاء من المخالفات المرورية', slug: 'traffic-fines-exemption', img: '/mkalfah.webp', price: 199 },
    { title: 'كتابة خطاب مشهد', slug: 'certificate-letter', img: '/mashad.png', price: 199 },
    { title: 'كتابة معروض طلب منحة ارض', slug: 'land-grant', img: '/manah.png', price: 199 },
  ];

  // No authentication checks - direct access to services
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // معالجة رسائل الخطأ من URL
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);




  // دالة للتعامل مع النقر على الأزرار - توجيه إلى الواتساب
  const handleButtonClick = (type: 'custom' | 'ready') => {
    // توجيه مباشر إلى الواتساب
    const phoneNumber = '966551117720';
    const message = 'مرحباً اريد طلب معروض';
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };


  return (
    <div className="min-h-screen" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .testimonial-card {
          animation: slideIn 0.5s ease-out;
        }

        /* Swiper Custom Styles */
        .testimonials-swiper {
          padding: 20px 0;
        }

        .testimonials-swiper .swiper-slide {
          height: auto;
        }

        .testimonials-swiper .swiper-pagination-bullet {
          background: #d1d5db;
          opacity: 1;
          width: 12px;
          height: 12px;
        }

        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #2563eb;
          transform: scale(1.2);
        }

        .testimonials-swiper .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
      {/* Hero Section with Image Banner */}
      <section className="relative text-white w-full overflow-hidden h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
        {/* Background Image Container */}
        <div className="relative z-0 w-full h-full">
          <img
            src="/loaz.png"
            alt="Hero Banner - خدمات احترافية لكتابة وإرسال المعاريض"
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            style={{ 
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            onError={(e) => {
              console.error('Image failed to load:', e);
              // Fallback to background color
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-2xl leading-tight" style={{ fontFamily: 'Tajawal, sans-serif', textShadow: '3px 3px 10px rgba(0,0,0,0.9)' }}>
            موقع معروضي
            </h1>
            <p className="text-xl sm:text-lg md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 text-white drop-shadow-2xl max-w-4xl mx-auto leading-relaxed font-medium px-2" style={{ fontFamily: 'Tajawal, sans-serif', textShadow: '3px 3px 8px rgba(0,0,0,0.9)' }}>
            لكتابة الخطابات القوية و مؤثرة
            </p>
                        <div className="flex justify-center items-center">
              <div className="text-center">
                <button 
                  onClick={() => handleButtonClick('custom')}

                  className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-4 rounded-xl font-bold text-lg sm:text-base md:text-lg text-white overflow-hidden transition-all duration-500 ease-out hover:scale-105 hover:shadow-2xl transform-gpu disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white/60" 
                  style={{ fontFamily: 'Tajawal, sans-serif', backgroundColor: '#1e40af' }}
                >
                  {/* Background gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Button content */}
                  <span className="relative z-10">
                    <span>طلب كتابة معروض</span>
                  </span>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
                </button>
                <p className="text-lg sm:text-base md:text-base lg:text-lg xl:text-xl mb-4 sm:mb-6 text-white drop-shadow-2xl max-w-4xl mx-auto leading-relaxed font-medium px-2 mt-6" style={{ fontFamily: 'Tajawal, sans-serif', textShadow: '3px 3px 8px rgba(0,0,0,0.9)' }}>
                  يحقق هدفك بعون الله
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
          خدمات كتابة المعاريض
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <button
                key={s.slug}
                onClick={() => router.push(`/services/${s.slug}`)}
                className="group bg-gradient-to-b from-white to-gray-50 rounded-2xl border border-gray-200 shadow hover:shadow-lg transition overflow-hidden text-right"
              >
                <div className="w-full h-48 sm:h-72 bg-white overflow-hidden flex items-center justify-center p-3">
                  <img src={s.img} alt={s.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4">
                  <div className="text-sm sm:text-lg font-bold text-gray-900 mb-2">{s.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700 font-extrabold">{s.price} ريال</span>
                    <span className="text-sm text-blue-600 group-hover:underline">التفاصيل</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="pt-8 pb-20" style={{ background: '#56a5de' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16 ibm-plex-arabic-bold">
            مميزات معاريضنا وخطاباتنا الاحترافية
          </h2>
          
          {/* Single Container for all features */}
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8 mb-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Features list on the left */}
              <div className="w-full order-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">معروض قوي ومؤثر</h3>
                      <p className="text-gray-700 arabic-text">نكتب لك معروض قوي ومؤثر يركز على تحقيق هدفك</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">مشورة التوجيه</h3>
                      <p className="text-gray-700 arabic-text">امكانية المشورة بتوجيه الخطاب إلى جهة معينة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">تعديلات مجانية</h3>
                      <p className="text-gray-700 arabic-text">يمكن عمل تعديلات و اضافات بعد استلامك للخطاب مجانا</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">معروض فريد ومميز</h3>
                      <p className="text-gray-700 arabic-text">كل معروض نبدأ فيه من الصفر غير مكرر وفريد بذاته</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">جميع أنواع الخطابات</h3>
                      <p className="text-gray-700 arabic-text">كتابة اي معروض او خطاب شخصي ، تجاري ، اداري</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 ibm-plex-arabic-bold">نصائح المرفقات</h3>
                      <p className="text-gray-700 arabic-text">نوصيك بالمرفقات التي تعزز من قوة خطاب</p>
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
          </div>

        </div>
      </section>

      {/* Testimonials Swiper Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12" style={{ fontFamily: 'Tajawal, sans-serif' }}>
           آراء عملائنا الكرام
            </h2>
          
          {/* Swiper Carousel */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            grabCursor={true}
            touchRatio={1}
            touchAngle={45}
            threshold={5}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full"
                  style={{
                    fontFamily: 'Tajawal, sans-serif',
                    minHeight: '320px'
                  }}
                >
                  {/* Stars */}
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current mx-1" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-black text-right leading-relaxed mb-4 text-sm md:text-base font-bold">
                    {testimonial.text}
                  </p>
                  
                  {/* Customer Name */}
                  <div className="text-left border-t border-gray-100 pt-3">
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      - {testimonial.name}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots Only */}
          <div className="flex justify-center mt-8">
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>


      <Toaster />
    </div>
  );
}
