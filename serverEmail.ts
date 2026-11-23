/**
 * Resend Transactional Email Service
 * Uses Resend official SDK to send high-deliverability transactional emails.
 * Fully compatible with Node.js & Vercel Serverless runtimes.
 */
import { Resend } from 'resend';

interface SendEmailParams {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export interface EmailLogItem {
  id: string;
  timestamp: string;
  toEmail: string;
  toName?: string;
  subject: string;
  status: 'success' | 'failed';
  error?: string;
  messageId?: string;
  durationMs: number;
}

// In-memory ring buffer for recent transmission logs
const recentEmailLogs: EmailLogItem[] = [];
const MAX_LOGS = 30;

function logEmailAttempt(item: EmailLogItem) {
  recentEmailLogs.unshift(item);
  if (recentEmailLogs.length > MAX_LOGS) {
    recentEmailLogs.pop();
  }
}

/**
 * Resolve the Resend API Key from various possible environment variables
 * (RESEND_API_KEY, VARA_RESEND_API_KEY, RESEND_API_KEY_VARA, VARA_API_KEY, or VARA)
 */
export function getResendApiKeyInfo(): { key: string | null; source: string | null; keyName: string } {
  const env = process.env;
  if (env.RESEND_API_KEY?.trim()) {
    return { key: env.RESEND_API_KEY.trim(), source: 'RESEND_API_KEY', keyName: 'vara' };
  }
  if (env.VARA_RESEND_API_KEY?.trim()) {
    return { key: env.VARA_RESEND_API_KEY.trim(), source: 'VARA_RESEND_API_KEY', keyName: 'vara' };
  }
  if (env.RESEND_API_KEY_VARA?.trim()) {
    return { key: env.RESEND_API_KEY_VARA.trim(), source: 'RESEND_API_KEY_VARA', keyName: 'vara' };
  }
  if (env.VARA_API_KEY?.trim()) {
    return { key: env.VARA_API_KEY.trim(), source: 'VARA_API_KEY', keyName: 'vara' };
  }
  if (env.VARA?.trim().startsWith('re_')) {
    return { key: env.VARA.trim(), source: 'VARA', keyName: 'vara' };
  }
  return { key: null, source: null, keyName: 'vara' };
}

// Lazy Resend client initialization with auto-invalidation when key changes
let cachedResendInstance: Resend | null = null;
let cachedApiKey: string | null = null;

function getResendClient(): Resend | null {
  const { key: apiKey } = getResendApiKeyInfo();
  if (!apiKey) return null;
  if (!cachedResendInstance || cachedApiKey !== apiKey) {
    cachedResendInstance = new Resend(apiKey);
    cachedApiKey = apiKey;
  }
  return cachedResendInstance;
}

export const ResendEmailService = {
  /**
   * Get recent email transmission logs
   */
  getLogs(): EmailLogItem[] {
    return [...recentEmailLogs];
  },

  /**
   * Check if Resend is configured with an API key
   */
  isConfigured(): boolean {
    const { key } = getResendApiKeyInfo();
    return Boolean(key && key.length > 0);
  },

  /**
   * Get sender details from environment or default (named "Vara")
   */
  getSender() {
    let rawEmail = process.env.RESEND_SENDER_EMAIL?.trim();
    // Default to verified custom domain mail@varabeauty.ir if empty or set to test sandbox
    if (!rawEmail || rawEmail === 'onboarding@resend.dev') {
      rawEmail = 'mail@varabeauty.ir';
    }
    // Sender display name defaults to "Vara Beauty Shop"
    const senderName = process.env.RESEND_SENDER_NAME?.trim() || 'Vara Beauty Shop';
    const formatted = rawEmail.includes('<') ? rawEmail : `${senderName} <${rawEmail}>`;
    return {
      name: senderName,
      email: rawEmail,
      formatted,
      isTestDomain: rawEmail.includes('resend.dev'),
    };
  },

  /**
   * Core function to send an email via Resend API
   */
  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const { toEmail, toName, subject, htmlContent, textContent } = params;
    const { key: apiKey, source: keySource } = getResendApiKeyInfo();
    const startTime = Date.now();
    const logId = 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    if (!apiKey) {
      const errorMsg = 'کلید Resend API (بنام vara) در متغیرهای محیطی تنظیم نشده است.';
      console.warn(`[Resend Email] RESEND_API_KEY is not configured. Email to <${toEmail}> was simulated:\nSubject: ${subject}`);
      logEmailAttempt({
        id: logId,
        timestamp: new Date().toISOString(),
        toEmail,
        toName,
        subject,
        status: 'failed',
        error: errorMsg,
        durationMs: Date.now() - startTime,
      });
      return {
        success: false,
        error: errorMsg,
      };
    }

    try {
      const resend = getResendClient();
      if (!resend) {
        throw new Error('مقدار کلید RESEND_API_KEY معتبر نیست');
      }

      const sender = this.getSender();
      const cleanToEmail = toEmail.trim().toLowerCase();

      const { data, error } = await resend.emails.send({
        from: sender.formatted,
        to: [cleanToEmail],
        subject,
        html: htmlContent,
        text: textContent || subject,
      });

      const durationMs = Date.now() - startTime;

      if (error) {
        let errorMsg = error.message || 'خطا در ارسال ایمیل توسط Resend';
        // Provide friendly Persian explanation for test domain restriction
        if (errorMsg.includes('testing emails to your own email') || errorMsg.includes('onboarding@resend.dev')) {
          errorMsg = `محدودیت تست Resend: در صورت استفاده از فرستنده آزمایشی (onboarding@resend.dev)، ایمیل فقط به آدرس اصلی حساب کاربری شما در Resend ارسال می‌شود. برای ارسال به همه کاربران، دامنه اختصاصی خود را در resend.com/domains تایید فرمایید. (${error.message})`;
        } else if (errorMsg.includes('API key is invalid')) {
          errorMsg = `کلید Resend API نامعتبر است یا منقضی شده است. لطفاً کلید جدید تولید شده با نام vara را در تنظیمات وارد فرمایید.`;
        }

        console.error(`[Resend Email Error] Failed to send email to <${toEmail}>:`, errorMsg);
        logEmailAttempt({
          id: logId,
          timestamp: new Date().toISOString(),
          toEmail,
          toName,
          subject,
          status: 'failed',
          error: errorMsg,
          durationMs: Date.now() - startTime,
        });
        return { success: false, error: errorMsg };
      }

      const messageId = data?.id || 'resend_' + Date.now();
      console.log(`[Resend Email] Successfully sent email to <${toEmail}> from "${sender.formatted}" (messageId: ${messageId})`);
      logEmailAttempt({
        id: logId,
        timestamp: new Date().toISOString(),
        toEmail,
        toName,
        subject,
        status: 'success',
        messageId,
        durationMs,
      });
      return { success: true, messageId };
    } catch (err: any) {
      const errorMsg = err.message || 'خطای اتصال به سرورهای Resend';
      console.error(`[Resend Email Error] Network or runtime exception:`, err);
      logEmailAttempt({
        id: logId,
        timestamp: new Date().toISOString(),
        toEmail,
        toName,
        subject,
        status: 'failed',
        error: errorMsg,
        durationMs: Date.now() - startTime,
      });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Diagnostic test: query Resend API and verify credentials & domains
   */
  async getDiagnostics(): Promise<any> {
    const { key: apiKey, source: keySource } = getResendApiKeyInfo();
    const sender = this.getSender();
    const apiKeyPresent = Boolean(apiKey && apiKey.length > 5);

    let maskedKey = 'تنظیم نشده (خالی)';
    if (apiKeyPresent && apiKey) {
      if (apiKey.length > 10) {
        maskedKey = apiKey.slice(0, 6) + '...' + apiKey.slice(-4);
      } else {
        maskedKey = '******';
      }
    }

    const diag = {
      timestamp: new Date().toISOString(),
      provider: 'Resend',
      keyName: 'vara',
      configured: apiKeyPresent,
      apiKeyPresent,
      apiKeySource: keySource || 'RESEND_API_KEY',
      apiKeyMasked: maskedKey,
      sender,
      isTestDomain: sender.isTestDomain,
      domains: [] as any[],
      hasVerifiedDomain: false,
      keyPermission: 'unknown' as 'full_access' | 'sending_only' | 'unknown',
      apiPingStatus: 'unknown' as 'ok' | 'error' | 'not_configured',
      apiPingError: null as string | null,
      note: null as string | null,
      recentLogs: this.getLogs(),
    };

    if (!apiKeyPresent) {
      diag.apiPingStatus = 'not_configured';
      diag.apiPingError = 'متغیر RESEND_API_KEY یا کلید vara تنظیم نشده است.';
      return diag;
    }

    try {
      const resend = getResendClient();
      if (!resend) {
        diag.apiPingStatus = 'error';
        diag.apiPingError = 'کلاینت Resend در دسترس نیست.';
        return diag;
      }

      // Check registered domains on Resend
      const domainsResult = await resend.domains.list();

      if (domainsResult.error) {
        const errMsg = domainsResult.error.message || '';
        // Resend API keys created with "Sending access" return this specific response
        // which confirms the key is authentic, valid, and fully authorized to send emails!
        if (errMsg.toLowerCase().includes('restricted to only send emails')) {
          diag.apiPingStatus = 'ok';
          diag.keyPermission = 'sending_only';
          diag.apiPingError = null;
          diag.note = 'کلید معتبر است و دسترسی امن ارسال ایمیل (Sending Access) با نام vara فعال می‌باشد.';
          return diag;
        }

        if (errMsg.includes('API key is invalid')) {
          diag.apiPingStatus = 'error';
          diag.apiPingError = 'کلید Resend API نامعتبر است. لطفاً کلید جدید با نام vara را در متغیرهای محیطی یا تنظیمات وارد فرمایید.';
          return diag;
        }

        diag.apiPingStatus = 'error';
        diag.apiPingError = errMsg || 'عدم دسترسی به Resend API با این کلید';
        return diag;
      }

      diag.apiPingStatus = 'ok';
      diag.keyPermission = 'full_access';
      const domainList = domainsResult.data?.data || (domainsResult.data as any) || [];
      diag.domains = Array.isArray(domainList) ? domainList : [];
      diag.hasVerifiedDomain = diag.domains.some((d: any) => d.status === 'verified');
      diag.note = 'کلید vara معتبر است و دسترسی کامل به Resend برقرار می‌باشد.';

      return diag;
    } catch (err: any) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('restricted to only send emails')) {
        diag.apiPingStatus = 'ok';
        diag.keyPermission = 'sending_only';
        diag.apiPingError = null;
        diag.note = 'کلید معتبر است و دسترسی امن ارسال ایمیل (Sending Access) با نام vara فعال می‌باشد.';
        return diag;
      }

      diag.apiPingStatus = 'error';
      diag.apiPingError = errMsg || 'خطای شبکه در اتصال به Resend API';
      return diag;
    }
  },

  /**
   * Send Email Verification Code to user
   */
  async sendVerificationCode(toEmail: string, code: string, displayName?: string) {
    const name = displayName || 'همراه گرامی';
    const subject = 'کد تایید حساب کاربری ورا بیوتی شاپ (Vara Beauty Shop)';
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f8f9; font-family: Tahoma, 'Segoe UI', Arial, sans-serif; color: #2B2927; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f8f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eef0f2;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #2B2927; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">VARA BEAUTY SHOP</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 15px; font-size: 16px; color: #2B2927;">سلام ${name}،</h2>
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.7; color: #5a5f65;">
                از عضویت شما در ورا بیوتی شاپ (Vara Beauty Shop) سپاسگزاریم. جهت تایید و فعال‌سازی حساب کاربری خود، لطفاً کد تایید زیر را در سامانه وارد نمایید:
              </p>
              
              <!-- Verification Code Box -->
              <div style="background-color: #eff2f4; border: 1px dashed #b8b8b9; border-radius: 14px; padding: 18px; text-align: center; margin: 25px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2B2927; font-family: monospace, Courier, sans-serif; display: inline-block; direction: ltr;">
                  ${code}
                </span>
                <p style="margin: 8px 0 0; font-size: 11px; color: #788089;">این کد تا ۱۰ دقیقه دیگر معتبر است.</p>
              </div>

              <p style="margin: 0 0 10px; font-size: 12px; color: #788089; line-height: 1.6;">
                اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #fafbfc; border-top: 1px solid #f0f2f4; text-align: center; font-size: 11px; color: #949c91;">
              © ورا بیوتی شاپ (Vara Beauty Shop)
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      toEmail,
      toName: displayName,
      subject,
      htmlContent,
      textContent: `کد تایید حساب کاربری شما در ورا بیوتی شاپ (Vara Beauty Shop): ${code}`,
    });
  },

  /**
   * Send Password Reset Link & Code to user
   */
  async sendPasswordResetEmail(toEmail: string, tempCode: string, resetLink?: string, displayName?: string) {
    const name = displayName || 'کاربر گرامی';
    const subject = 'درخواست بازیابی رمز عبور در ورا بیوتی شاپ (Vara Beauty Shop)';
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f8f9; font-family: Tahoma, 'Segoe UI', Arial, sans-serif; color: #2B2927; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f8f9; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eef0f2;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #2B2927; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">VARA BEAUTY SHOP</h1>
              <p style="margin: 5px 0 0; font-size: 11px; opacity: 0.8; letter-spacing: 2px;">امنیت حساب کاربری</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 15px; font-size: 16px; color: #2B2927;">سلام ${name}،</h2>
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.7; color: #5a5f65;">
                درخواستی برای بازنشانی رمز عبور حساب کاربری شما در ورا بیوتی شاپ (Vara Beauty Shop) دریافت شده است. با استفاده از کد زیر می‌توانید نسبت به تنظیم رمز عبور جدید اقدام فرمایید:
              </p>
              
              <!-- Code Box -->
              <div style="background-color: #eff2f4; border: 1px dashed #b8b8b9; border-radius: 14px; padding: 18px; text-align: center; margin: 25px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2B2927; font-family: monospace, Courier, sans-serif; display: inline-block; direction: ltr;">
                  ${tempCode}
                </span>
                <p style="margin: 8px 0 0; font-size: 11px; color: #788089;">این کد موقت به مدت ۱۵ دقیقه معتبر خواهد بود.</p>
              </div>

              ${
                resetLink
                  ? `<div style="text-align: center; margin: 25px 0;">
                      <a href="${resetLink}" style="background-color: #454a4f; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: bold; display: inline-block;">
                        ورود به سامانه و تغییر رمز
                      </a>
                    </div>`
                  : ''
              }

              <p style="margin: 0 0 10px; font-size: 12px; color: #E05A6F; line-height: 1.6;">
                نکته امنیتی: اگر این درخواست توسط شما ثبت نشده است، رمز عبور خود را تغییر ندهید؛ حساب شما در امنیت است.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #fafbfc; border-top: 1px solid #f0f2f4; text-align: center; font-size: 11px; color: #949c91;">
              © ورا بیوتی شاپ (Vara Beauty Shop) — پشتیبانی و حریم خصوصی
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      toEmail,
      toName: displayName,
      subject,
      htmlContent,
      textContent: `کد بازنشانی رمز عبور شما در ورا بیوتی شاپ (Vara Beauty Shop): ${tempCode}`,
    });
  },

  /**
   * Send Order Confirmation receipt to customer
   */
  async sendOrderConfirmation(order: {
    orderNumber: string;
    totalAmount: number;
    customer?: { name?: string; email?: string; phone?: string; address?: string };
    items?: Array<{ nameFa?: string; quantity?: number; price?: number; sizeLabel?: string }>;
    paymentMethod?: string;
  }) {
    const toEmail = order.customer?.email;
    if (!toEmail) return { success: false, error: 'Customer email not provided' };

    const customerName = order.customer?.name || 'همراه گرامی';
    const totalToman = (order.totalAmount || 0).toLocaleString('fa-IR');
    const subject = `تایید ثبت سفارش ${order.orderNumber} در فروشگاه ورا بیوتی`;

    const itemsHtml = (order.items || [])
      .map(
        (it) => `
        <tr style="border-bottom: 1px solid #f0f2f4;">
          <td style="padding: 10px 0; font-size: 13px; color: #2B2927;">
            ${it.nameFa || 'محصول'} ${it.sizeLabel ? `(${it.sizeLabel})` : ''}
          </td>
          <td style="padding: 10px 0; font-size: 13px; text-align: center; color: #788089;">
            ${it.quantity || 1} عدد
          </td>
          <td style="padding: 10px 0; font-size: 13px; text-align: left; color: #2B2927; font-weight: bold;">
            ${((it.price || 0) * (it.quantity || 1)).toLocaleString('fa-IR')} تومان
          </td>
        </tr>
      `
      )
      .join('');

    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f8f9; font-family: Tahoma, 'Segoe UI', Arial, sans-serif; direction: rtl; text-align: right;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eef0f2;">
          <tr>
            <td style="padding: 25px; text-align: center; background-color: #2B2927; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">VARA BEAUTY SHOP</h1>
              <p style="margin: 5px 0 0; font-size: 11px; opacity: 0.8;">تاییدیه و فاکتور رسمی سفارش</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 25px;">
              <h2 style="margin: 0 0 10px; font-size: 15px; color: #2B2927;">سلام ${customerName}،</h2>
              <p style="margin: 0 0 20px; font-size: 13px; line-height: 1.7; color: #5a5f65;">
                سفارش شما با شماره <strong>${order.orderNumber}</strong> با موفقیت ثبت شد و در صف پردازش و بسته‌بندی قرار گرفت.
              </p>

              <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef0f2; color: #788089; font-size: 12px;">
                    <th style="padding: 8px 0; text-align: right;">شرح کالا</th>
                    <th style="padding: 8px 0; text-align: center;">تعداد</th>
                    <th style="padding: 8px 0; text-align: left;">مبلغ کل</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div style="background-color: #f7f8f9; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; color: #2B2927;">
                  <span>مبلغ قابل پرداخت / پرداخت شده:</span>
                  <span>${totalToman} تومان</span>
                </div>
              </div>

              <p style="margin: 0; font-size: 12px; color: #788089; line-height: 1.6;">
                به محض تحویل بسته به شرکت پست، کد رهگیری مرسوله از طریق پیامک برای شما ارسال خواهد شد.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 15px 25px; background-color: #fafbfc; border-top: 1px solid #f0f2f4; text-align: center; font-size: 11px; color: #949c91;">
              فروشگاه تخصصی محصولات زیبایی و مراقبت پوست ورا بیوتی
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    return this.sendEmail({
      toEmail,
      toName: customerName,
      subject,
      htmlContent,
      textContent: `سفارش ${order.orderNumber} به مبلغ ${totalToman} تومان با موفقیت ثبت گردید.`,
    });
  },
};
