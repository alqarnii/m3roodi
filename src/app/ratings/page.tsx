'use client';


export default function RatingsPage() {
  const testimonials = [
    {
      name: "خالد الحارثي",
      text: "صراحة اشكرهم جزيل الشكر طلبت معروض وكان قوي، وتم ارسال الرسالة الى الجهة المختصة وتم التجاوب معي وطلعت بنتيجة الحمدلله ما ضاع تعبي، شكرا",
      rating: 5,
      service: "معروض طلب تجنيس"
    },
    {
      name: "Khalid Ziyad",
      text: "خدمة العملاء جيده جداً، خاصة على الواتس آب، التعاون كان جميل ومعاينة الخطاب قبل الإرسال والتعديل عليه كانت أكثر من رائعة، بانتظار النتيجة النهائية، مشكلة الخطاب أخذ وقت على أساس يجهز وينرسل، شاكر ومقدر خدماتكم وتعاونكم.",
      rating: 5,
      service: "معروض طلب وظيفة"
    },
    {
      name: "فيصل القرني",
      text: "بارك الله فيكم وفي جهودكم",
      rating: 5,
      service: "معروض طلب علاج"
    },
    {
      name: "عبدالله المطاوعه",
      text: "كتبوا لي معروض طلب تجنيس معيَّر جداً، وتم قبول معاملتي بفضل الله ثم بفضل جهودهم، أسأل الله أن يبارك فيهم، ويرزقهم، ويزيدهم علماً وفضلاً. جزاهم الله خير",
      rating: 5,
      service: "معروض طلب تجنيس"
    },
    {
      name: "محمد المطيري",
      text: "بفضل الله ثم موقع معروضي، تم قبول علاج والدتي في مستشفى الحرس الوطني. أشكر الله ثم المسؤولين في بلادنا الغالية، وكذلك موقع معروضي الذي أوصل رسالتي بطريقة مؤثرة عَجَّلت بقبول طلبي.",
      rating: 5,
      service: "معروض طلب علاج"
    },
    {
      name: "أحمد السلمي",
      text: "خدمة ممتازة وسعر معقول، تم قبول طلبي في وزارة التعليم خلال أسبوع واحد. أنصح الجميع بالتعامل معهم.",
      rating: 5,
      service: "معروض طلب ابتعاث"
    },
    {
      name: "سارة العتيبي",
      text: "أشكر فريق معروضي على الاحترافية العالية في كتابة معروض طلب سكن. تم قبول طلبي والحمدلله.",
      rating: 5,
      service: "معروض طلب سكن"
    },
    {
      name: "عبدالرحمن الشمري",
      text: "خدمة رائعة وسعر مناسب، تم قبول معروض طلب منحة أرض خلال شهر. أنصح الجميع بالتعامل معهم.",
      rating: 5,
      service: "معروض طلب منحة أرض"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            آراء عملائنا
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            تعرف على تجارب عملائنا مع خدماتنا واحصل على فكرة واضحة عن جودة عملنا
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            جميع آراء العملاء
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-blue-600 text-sm">
                    {testimonial.service}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
