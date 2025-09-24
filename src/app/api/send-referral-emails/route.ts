import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emails, discountCode } = body;

    if (!emails || !Array.isArray(emails) || emails.length !== 5) {
      return NextResponse.json({
        success: false,
        message: 'يجب إدخال 5 عناوين بريد إلكتروني'
      }, { status: 400 });
    }

    if (!discountCode) {
      return NextResponse.json({
        success: false,
        message: 'كود الخصم مطلوب'
      }, { status: 400 });
    }

    // Validate all emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emails.filter(email => !emailRegex.test(email.trim()));
    
    if (invalidEmails.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'يجب أن تكون جميع عناوين البريد الإلكتروني صحيحة'
      }, { status: 400 });
    }

    // Check for temporary email domains
    const tempDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
      'temp-mail.org', 'throwaway.email', 'getnada.com', 'maildrop.cc',
      'yopmail.com', 'tempail.com', 'sharklasers.com', 'guerrillamail.info',
      'pokemail.net', 'spam4.me', 'bccto.me', 'chacuo.net', 'dispostable.com',
      'mailnesia.com', 'mailcatch.com', 'inboxalias.com', 'mailmetrash.com',
      'trashmail.net', 'spamgourmet.com', 'spam.la', 'binkmail.com',
      'bobmail.info', 'chammy.info', 'devnullmail.com', 'letthemeatspam.com',
      'mailin8r.com', 'mailinator2.com', 'notmailinator.com', 'reallymymail.com',
      'sogetthis.com', 'spamhereplease.com', 'superrito.com', 'thisisnotmyrealemail.com',
      'tradermail.info', 'veryrealemail.com', 'wegwerfmail.de', 'wegwerfmail.net',
      'wegwerfmail.org', 'wegwerfmailadresse.de', 'wegwerpmailadres.nl'
    ];

    const hasTempEmail = emails.some(email => {
      const domain = email.split('@')[1]?.toLowerCase();
      return tempDomains.includes(domain || '');
    });

    if (hasTempEmail) {
      return NextResponse.json({
        success: false,
        message: 'لا يمكن استخدام عناوين البريد الإلكتروني المؤقتة'
      }, { status: 400 });
    }

    // Create referral record in database
    const referralRecord = await prisma.referral.create({
      data: {
        discountCode: discountCode,
        referredEmails: emails,
        isActive: true,
        createdAt: new Date()
      }
    });

    // Send emails to all referred addresses
    const emailPromises = emails.map(async (email, index) => {
      try {
        const emailContent = `
          <div dir="rtl" style="font-family: 'Tajawal', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                🎉 مرحباً بك في معروضي
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                خدمة كتابة المعاريض الرسمية الاحترافية
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px; background: #ffffff;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #374151; font-size: 24px; margin: 0 0 15px 0;">
                  صديقك دعاك إلى هذا الموقع: 👥
                </h2>
                <p style="color: #6b7280; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
                  <strong>معروضي لكتابة الخطابات:</strong> <a href="https://m3roodi.com/" style="color: #2563eb; text-decoration: none;">https://m3roodi.com/</a>
                </p>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                  تريد خطابًا قويًا ومؤثرًا إلى أي مسؤول، سواء كان هدفك من الخطاب:
                </p>
              </div>

              <!-- Features -->
              <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin: 25px 0;">
                <h3 style="color: #1f2937; font-size: 20px; margin: 0 0 20px 0; text-align: center;">
                  لماذا معروضي؟ ✨
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: right;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #10b981; font-size: 20px;">✓</span>
                    <span style="color: #374151; font-size: 14px;">كتابة احترافية</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #10b981; font-size: 20px;">✓</span>
                    <span style="color: #374151; font-size: 14px;">تسليم سريع</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #10b981; font-size: 20px;">✓</span>
                    <span style="color: #374151; font-size: 14px;">أسعار مناسبة</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #10b981; font-size: 20px;">✓</span>
                    <span style="color: #374151; font-size: 14px;">دعم مستمر</span>
                  </div>
                </div>
              </div>

              <!-- Services List -->
              <div style="margin: 25px 0;">
                <div style="background: #f8fafc; padding: 25px; border-radius: 10px; text-align: right;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">طلب نقل</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">طلب مساعدة</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">طلب تجنيس</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">طلب زواج من أجنبية</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">طلب سداد دين</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">استرحام</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #10b981; font-size: 18px;">✅</span>
                    <span style="color: #374151; font-size: 16px; font-weight: 500;">أو أي طلب كان</span>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div style="text-align: center; margin: 25px 0; padding: 20px; background: #f0f9ff; border-radius: 10px; border: 2px solid #0ea5e9;">
                <p style="color: #0c4a6e; font-size: 16px; line-height: 1.6; margin: 0; font-weight: 500;">
                  موقع معروضي لكتابة الخطابات يكتب لك أفضل صيغة لأي موضوع يساعد على قبول طلبك بعون الله.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://m3roodi.com" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: #ffffff; text-decoration: none; padding: 15px 30px; 
                          border-radius: 8px; font-weight: bold; font-size: 16px;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                  اطلب خطابك الآن من معروضي: https://m3roodi.com/
                </a>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  تم إرسال هذه الرسالة بناءً على دعوة من صديقك
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 5px 0 0 0;">
                  إذا لم تكن مهتماً، يمكنك تجاهل هذه الرسالة
                </p>
              </div>
            </div>
          </div>
        `;

        await sendEmail({
          to: email.trim(),
          subject: '🎉 دعوة خاصة: احصل على معروضك الاحترافي من معروضي',
          html: emailContent
        });

        console.log(`Referral email sent successfully to: ${email}`);
        return { success: true, email };
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        return { success: false, email, error: error instanceof Error ? error.message : 'Unknown error' };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    const successfulEmails = results.filter(r => r.success).length;
    const failedEmails = results.filter(r => !r.success);

    console.log(`Referral emails sent: ${successfulEmails}/5`);
    if (failedEmails.length > 0) {
      console.log('Failed emails:', failedEmails);
    }

    return NextResponse.json({
      success: true,
      message: `تم إرسال ${successfulEmails} رسالة بنجاح`,
      data: {
        discountCode,
        referralId: referralRecord.id,
        successfulEmails,
        failedEmails: failedEmails.length
      }
    });

  } catch (error) {
    console.error('Error sending referral emails:', error);
    return NextResponse.json({
      success: false,
      message: 'حدث خطأ في إرسال الرسائل'
    }, { status: 500 });
  } finally {
    // لا نحتاج إلى $disconnect في Next.js API routes
  }
}
