'use client';

import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Tajawal, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              الشروط والأحكام
            </h1>
            <p className="text-lg text-gray-600">
              يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا
            </p>
          </div>

          {/* Terms Content */}
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg">
              <p className="text-blue-800 text-lg leading-relaxed">
                نتمنى أن يحوز خطابنا الذي نكتبه من أجلك على رضاك وان يحقق لك الهدف الذي تريده و لكتابة خطاب او معروض لموضوعك فإنه يجب عليك أن توافق على الشروط التالية وهي الشروط والأحكام الروتينية المتفق عليها والمطبقة مع عملائنا حيال كتابة الخطابات .
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">الموافقة على الشروط</h3>
                <p className="text-gray-700 leading-relaxed">
                  بطلبك الخطاب أو المعروض أو متابعة المعاملات تعتبر موافق على هذه الشروط
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">استرداد المبلغ</h3>
                <p className="text-gray-700 leading-relaxed">
                  لا يمكن استرداد المبلغ المدفوع للمعروض بعد الدفع فالمبلغ يعتبر غير مسترد
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">مدة التسليم</h3>
                <p className="text-gray-700 leading-relaxed">
                  يتم استلام المعروض في فترة من 3 إلى 5 أيام من تاريخ دفع قيمته و تعبئة النموذج
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">المسؤولية عن المعلومات</h3>
                <p className="text-gray-700 leading-relaxed">
                  سيتم الكتابة بناء على المعلومات المدخلة من قبلكم ولا نتحمل أي خطأ في المعلومات نتيجة الإدخال الخاطئ من مزود البيانات من قبلكم
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">رفض العمل</h3>
                <p className="text-gray-700 leading-relaxed">
                  يجوز لنا رفض أي عمل دون إبداء أسباب و في حال العميل دفع المبلغ قبل علمه رفضنا فسيتم إعادة المبلغ له .
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">التعديلات المجانية</h3>
                <p className="text-gray-700 leading-relaxed">
                  يتاح للعميل التعديل على المعروض خلال 3 أيام مجانا من تاريخ الاستلام و مدة تنفيذ كل تعديل هي 1 يوم او حسب الوقت المتاح للتعديل
                </p>
                <p className="text-gray-700 leading-relaxed mt-2">
                  عدد طلبات التعديل و الاضافة الأقصى المجانية هي 6 طلبات تعديل او اضافة .
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">التعديلات المدفوعة</h3>
                <p className="text-gray-700 leading-relaxed">
                  اي طلب تعديلات بعد مرور 3 أيام تعتبر تعديلات بمقابل ( يجب دفع ثمنها )
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">رسوم الإرسال</h3>
                <p className="text-gray-700 leading-relaxed">
                  القيمة المتفق عليها هي قيمة الخطاب و في حال الرغبة بإرسال الخطاب من طرفنا سيتم اضافة 400 ريال هي أجور المندوبين و الطباعة الارسال عبر البريد السعودي الممتاز .
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">متابعة الخطابات</h3>
                <p className="text-gray-700 leading-relaxed">
                  لا نتابع الخطابات المرسلة من طرفنا دورنا هو كتابة الخطاب و ارساله في حال طلب العميل ارساله ومن ثم تزويد العميل برقم الارسالية وهو يتابعها مع الجهة المرسلة عليها .
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">المسؤولية القانونية</h3>
                <p className="text-gray-700 leading-relaxed">
                  لا نتحمل أي مسؤولية تجاه الخطاب الذي نكتبه لك فقد تمت كتابته بناء على طلبك و بحسب المعلومات المعطاة منك
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">طلبات التعديل</h3>
                <p className="text-gray-700 leading-relaxed">
                  جميع طلبات التعديل ترسل الى رقم الواتس اب المراسل عليه موضح فيها نوع التعديل بالظبط
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">ضمان النتائج</h3>
                <p className="text-gray-700 leading-relaxed">
                  لا نتحمل أي مسؤولية إذا حقق الخطاب هدفك أم لم يحققه فنحن نبذل جهودنا في خطاب يشرح حالتك و النتائج بتوفيق الله
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">متابعة المعاملات</h3>
                <p className="text-gray-700 leading-relaxed">
                  في حال طلب متابعة المعاملة، سنقوم بتوجيه المعقبين لمتابعة المعاملة ومحاولة تحريكها و إنجازها. و سنبذل قصارى جهدنا لتحقيق هدفك، ولكن ذلك لا يعني ضمان قبول المعاملة. نحن سوف نعمل بافضل الطرق و نبذل الأسباب و بالله التوفيق
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">الوكالة</h3>
                <p className="text-gray-700 leading-relaxed">
                  بعض المعاملات تتطلب وجود وكالة، لذا في البداية سيتم إرسال المعقب لمتابعة المعاملة بدون وكالة. ولكن إذا احتاج الأمر إلى وكالة، فيجب أن يتم عمل وكالة للمعقب ليتمكن من متابعتها - ستكون الوكالة على موضوع المعاملة فقط
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">عدد مرات المتابعة</h3>
                <p className="text-gray-700 leading-relaxed">
                  عدد مرات المتابعة الحضورية للمعاملة هو عشر زيارات لكل طلب. وفي حال استنفاد هذه الزيارات العشر، يجب عمل طلب متابعة جديد لاستمرار متابعة المعاملة.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">معلومات التواصل</h3>
                <p className="text-gray-700 leading-relaxed">
                  لأي استفسارات و ملاحظات راسلنا على <span className="font-semibold text-blue-600">0551781111</span> و من خارج السعودية على <span className="font-semibold text-blue-600">00966551781111</span>
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg transition-colors shadow-lg"
            >
              للرجوع للموقع معروضي اضغط هنا
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
