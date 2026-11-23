/**
 * NextPay Payment Gateway Integration for Vara Beauty
 * Official NextPay REST API (https://nextpay.org)
 * Works natively on Vercel Serverless without requiring a static outbound IPv4.
 * Currency handling: Toman (IRT) with safe integer math.
 */

export interface NextPayConfig {
  apiKey: string;
  isConfigured: boolean;
}

export interface NextPayPaymentRequestParams {
  amountToman: number;
  orderNumber: string;
  callbackUrl: string;
  customerPhone?: string;
  description?: string;
}

export interface NextPayPaymentRequestResult {
  success: boolean;
  transId?: string;
  paymentUrl?: string;
  code?: number;
  message?: string;
}

export interface NextPayVerifyParams {
  transId: string;
  amountToman: number;
}

export interface NextPayVerifyResult {
  success: boolean;
  refId?: string;
  code?: number;
  cardHolder?: string;
  customerPhone?: string;
  message?: string;
}

export class NextPayService {
  private static readonly BASE_URL = 'https://nextpay.org/nx/gateway';

  public static getConfig(): NextPayConfig {
    const rawKey = (process.env.NEXTPAY_API_KEY || '')
      .replace(/["'\s\u200B-\u200D\uFEFF]/g, '')
      .trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawKey);

    return {
      apiKey: rawKey,
      isConfigured: isUuid || rawKey.length > 10,
    };
  }

  /**
   * Step 1: Request transaction token (`trans_id`) from NextPay
   * Note: In NextPay's API, `code === -1` indicates successful token creation.
   */
  public static async requestPayment(
    params: NextPayPaymentRequestParams
  ): Promise<NextPayPaymentRequestResult> {
    const config = this.getConfig();
    if (!config.isConfigured) {
      return {
        success: false,
        code: -32,
        message: 'کلید API درگاه نکست‌پی (NEXTPAY_API_KEY) در متغیرهای محیطی سرور تنظیم نشده است.',
      };
    }

    const amountInTomans = Math.round(params.amountToman);
    if (amountInTomans < 1000) {
      return {
        success: false,
        message: 'مبلغ تراکنش باید حداقل ۱,۰۰۰ تومان باشد.',
      };
    }

    const payload: Record<string, any> = {
      api_key: config.apiKey,
      order_id: params.orderNumber,
      amount: amountInTomans,
      callback_uri: params.callbackUrl,
      currency: 'IRT',
    };

    if (params.customerPhone) {
      payload.customer_phone = params.customerPhone;
    }
    if (params.description) {
      payload.custom_json_fields = JSON.stringify({
        description: params.description,
        order_number: params.orderNumber,
      });
    }

    try {
      const response = await fetch(`${this.BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      const data: any = await response.json();
      const code = Number(data?.code);
      const transId = data?.trans_id ? String(data.trans_id).trim() : '';

      // In NextPay API, code === -1 means the token was generated Ready for Payment
      if (response.ok && code === -1 && transId) {
        return {
          success: true,
          transId,
          paymentUrl: `${this.BASE_URL}/payment/${transId}`,
          code,
        };
      }

      const errorMsg = this.getNextPayErrorMessage(code) || 'خطا در ایجاد تراکنش در درگاه نکست‌پی.';
      return {
        success: false,
        code,
        message: errorMsg,
      };
    } catch (err: any) {
      console.warn('[NextPay Request Warning]:', err?.message || err);
      const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout');
      return {
        success: false,
        message: isTimeout
          ? 'زمان اتصال به درگاه نکست‌پی به پایان رسید. لطفاً مجدداً تلاش کنید.'
          : (err?.message || 'خطای شبکه در اتصال به درگاه نکست‌پی.'),
      };
    }
  }

  /**
   * Step 2: Verify transaction using `trans_id` and authoritative order `amount`
   * Note: In NextPay's API, `code === 0` indicates successful payment verification.
   */
  public static async verifyPayment(
    params: NextPayVerifyParams
  ): Promise<NextPayVerifyResult> {
    const config = this.getConfig();
    if (!config.isConfigured) {
      return {
        success: false,
        code: -32,
        message: 'کلید API درگاه نکست‌پی (NEXTPAY_API_KEY) تنظیم نشده است.',
      };
    }

    const amountInTomans = Math.round(params.amountToman);

    const payload = {
      api_key: config.apiKey,
      trans_id: params.transId,
      amount: amountInTomans,
      currency: 'IRT',
    };

    try {
      const response = await fetch(`${this.BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      const data: any = await response.json();
      const code = data?.code === '0' ? 0 : data?.code;

      // In NextPay API, code === 0 means Payment Successful & Verified
      if (response.ok && code === 0 && data?.Shaparak_Ref_Id) {
        const refId = String(data.Shaparak_Ref_Id);
        return {
          success: true,
          refId,
          code,
          cardHolder: data?.card_holder,
          customerPhone: data?.customer_phone,
          message: 'پرداخت با موفقیت انجام و تایید شد.',
        };
      }

      const errorMsg = this.getNextPayErrorMessage(code) || 'تایید تراکنش ناموفق بود یا توسط کاربر لغو گردید.';
      return {
        success: false,
        code,
        message: errorMsg,
      };
    } catch (err: any) {
      console.error('[NextPay Verify Error]:', err);
      const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout');
      return {
        success: false,
        message: isTimeout
          ? 'زمان تایید تراکنش در درگاه نکست‌پی به پایان رسید.'
          : (err?.message || 'خطا در تایید تراکنش در درگاه نکست‌پی.'),
      };
    }
  }

  /**
   * Official NextPay status codes translation in Persian
   */
  public static getNextPayErrorMessage(code?: number): string {
    switch (code) {
      case 0:
        return 'پرداخت با موفقیت تکمیل گردید.';
      case -1:
        return 'تراکنش آماده پرداخت است.';
      case -2:
        return 'پرداخت توسط کاربر لغو شد یا با خطا در بانک مواجه گردید.';
      case -3:
        return 'در حال انتظار جواب بانک.';
      case -4:
        return 'پرداخت توسط کاربر لغو گردید.';
      case -20:
        return 'کلید API ارسال نشده است.';
      case -21:
        return 'شناسه تراکنش (trans_id) ارسال نشده است.';
      case -22:
        return 'مبلغ تراکنش ارسال نشده است.';
      case -23:
        return 'آدرس بازگشت (callback_uri) ارسال نشده است.';
      case -24:
        return 'مبلغ تراکنش نامعتبر است.';
      case -25:
        return 'تراکنش قبلاً انجام و ارسال شده است (غیرقابل تکرار).';
      case -26:
        return 'توکن تراکنش ارسال نشده است.';
      case -27:
        return 'شماره سفارش (order_id) نامعتبر است.';
      case -30:
        return 'مبلغ تراکنش کمتر از حداقل مجاز (۱,۰۰۰ تومان) است.';
      case -32:
        return 'آدرس بازگشت (callback_uri) یا دامنه با درگاه ثبت‌شده در پنل نکست‌پی مطابقت ندارد.';
      case -33:
        return 'کلید مجوزدهی (API Key) درگاه نکست‌پی نامعتبر است.';
      case -34:
        return 'کد تراکنش در سمت نکست‌پی صحیح نیست.';
      case -35:
        return 'نوع کلید مجوزدهی (API Key) صحیح نیست.';
      case -36:
        return 'شماره سفارش ارسال نشد یا بیش از حد طولانی است.';
      case -37:
        return 'شماره تراکنش یافت نشد.';
      case -38:
        return 'توکن ارسالی موجود نیست.';
      case -39:
        return 'کلید مجوزدهی در پنل نکست‌پی موجود نیست.';
      case -40:
        return 'پارامترهای کلید مجوزدهی نامعتبر است.';
      case -41:
        return 'خطا در دریافت پارامتر، شماره شناسایی صحت اعتبار که از بانک ارسال شده موجود نیست.';
      case -42:
        return 'سیستم پرداخت دچار مشکل شده است.';
      case -43:
        return 'درگاه پرداختی برای انجام درخواست یافت نشد.';
      case -44:
        return 'پاسخ دریافت شده از بانک نامعتبر است.';
      case -45:
        return 'سیستم پرداخت درگاه در حال حاضر غیرفعال است.';
      case -46:
        return 'درخواست نامعتبر است.';
      case -47:
        return 'کلید مجوزدهی یافت نشد یا حذف شده است.';
      case -48:
        return 'نرخ کمیسیون تعیین نشده است.';
      case -49:
        return 'تراکنش مورد نظر تکراری است.';
      case -50:
        return 'حساب کاربری برای صندوق مالی یافت نشد.';
      case -51:
        return 'شناسه کاربری در سیستم یافت نشد.';
      case -52:
        return 'حساب کاربری تایید نشده است.';
      case -60:
        return 'ایمیل ثبت نشده است.';
      case -61:
        return 'کد ملی ثبت نشده است.';
      case -62:
        return 'کد پستی ثبت نشده است.';
      case -63:
        return 'آدرس پستی ثبت نشده است.';
      case -64:
        return 'توضیحات کامل نیست.';
      case -65:
        return 'نام و نام خانوادگی ثبت نشده است.';
      case -66:
        return 'تلفن ثابت ثبت نشده است.';
      case -67:
        return 'نام کاربری کامل نیست.';
      case -73:
        return 'آدرس بازگشت (callback_uri) دارای خطا بوده یا بسیار طولانی است.';
      case -80:
        return 'تراکنش با خطا مواجه شده است.';
      case -81:
        return 'خطای داخلی در سرور شاپرک.';
      case -82:
        return 'خطای تایید تراکنش بانکی.';
      case -90:
        return 'تراکنش قبلاً با موفقیت تایید شده است.';
      default:
        return '';
    }
  }
}
