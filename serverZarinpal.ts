/**
 * Zarinpal Payment Gateway v4 Integration for Vara Beauty
 * Supports both Production and Sandbox endpoints.
 * Currency handling: Toman (IRT) with safe integer math.
 */

export interface ZarinpalConfig {
  merchantId: string;
  isSandbox: boolean;
  callbackUrl?: string;
  proxyUrl?: string;
  proxySecret?: string;
}

export interface ZarinpalPaymentRequestParams {
  amountToman: number;
  description: string;
  callbackUrl: string;
  orderNumber: string;
  customerPhone?: string;
  customerEmail?: string;
}

export interface ZarinpalPaymentRequestResult {
  success: boolean;
  authority?: string;
  paymentUrl?: string;
  code?: number;
  message?: string;
  fee?: number;
}

export interface ZarinpalVerifyParams {
  authority: string;
  amountToman: number;
}

export interface ZarinpalVerifyResult {
  success: boolean;
  refId?: number | string;
  code?: number;
  cardPan?: string;
  cardHash?: string;
  feeType?: string;
  fee?: number;
  message?: string;
}

export class ZarinpalService {
  private static getGatewayUrl(isSandbox: boolean): string {
    return isSandbox ? 'https://sandbox.zarinpal.com/pg' : 'https://payment.zarinpal.com/pg';
  }

  private static getApiBaseUrl(config: ZarinpalConfig): string {
    if (!config.isSandbox && config.proxyUrl) {
      // Support both https://gw.domain.ir/zarinpal and https://gw.domain.ir
      const cleaned = config.proxyUrl
        .replace(/\/+$/, '')
        .replace(/\/pg(\/v4.*)?$/i, '');
      return `${cleaned}/pg`;
    }
    return this.getGatewayUrl(config.isSandbox);
  }

  private static getHeaders(config: ZarinpalConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (config.proxySecret && !config.isSandbox && config.proxyUrl && new URL(config.proxyUrl).protocol === 'https:') {
      headers['x-proxy-secret'] = config.proxySecret;
    }
    return headers;
  }

  public static getConfig(): ZarinpalConfig {
    // Strip quotes, spaces, or invisible characters from env var
    const rawMerchant = (process.env.ZARINPAL_MERCHANT_ID || '')
      .replace(/["'\s\u200B-\u200D\uFEFF]/g, '')
      .trim();
    const sandboxEnv = (process.env.ZARINPAL_SANDBOX || '').trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawMerchant);
    const isSandbox = sandboxEnv === 'true' || rawMerchant.toLowerCase() === 'sandbox' || !isUuid;

    // In sandbox mode, Zarinpal accepts a 36-char test UUID
    const merchantId = isUuid ? rawMerchant : '4ced0a14-4062-11e6-b77c-000c295eb8fc';

    const proxyUrl = (process.env.ZARINPAL_PROXY_URL || '')
      .replace(/["'\s\u200B-\u200D\uFEFF]/g, '')
      .trim();
    const proxySecret = (process.env.ZARINPAL_PROXY_SECRET || '').trim();

    return {
      merchantId,
      isSandbox,
      proxyUrl: proxyUrl || undefined,
      proxySecret: proxySecret || undefined,
    };
  }

  /**
   * Request payment authority and generate StartPay gateway redirect URL
   */
  public static async requestPayment(
    params: ZarinpalPaymentRequestParams
  ): Promise<ZarinpalPaymentRequestResult> {
    const config = this.getConfig();
    const apiBaseUrl = this.getApiBaseUrl(config);
    const gatewayUrl = this.getGatewayUrl(config.isSandbox);
    const requestEndpoint = `${apiBaseUrl}/v4/payment/request.json`;

    // Integer math: ensure whole number of Tomans
    const amountInTomans = Math.round(params.amountToman);
    if (amountInTomans < 1000) {
      return {
        success: false,
        message: 'مبلغ تراکنش باید حداقل ۱,۰۰۰ تومان باشد.',
      };
    }

    const payload = {
      merchant_id: config.merchantId,
      amount: amountInTomans,
      currency: 'IRT', // Iranian Toman in Zarinpal v4
      description: params.description || `سفارش شماره ${params.orderNumber} در فروشگاه ورا بیوتی`,
      callback_url: params.callbackUrl,
      metadata: {
        mobile: params.customerPhone || undefined,
        email: params.customerEmail || undefined,
        order_id: params.orderNumber,
      },
    };

    try {
      const response = await fetch(requestEndpoint, {
        method: 'POST',
        headers: this.getHeaders(config),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      const data = await response.json();
      const code = data?.data?.code ?? data?.errors?.code;
      const authority = data?.data?.authority;

      // Zarinpal Code 100: Operation Success
      if (response.ok && code === 100 && authority) {
        // Always redirect the customer browser directly to Zarinpal's official StartPay URL
        const paymentUrl = `${gatewayUrl}/StartPay/${authority}`;
        return {
          success: true,
          authority,
          paymentUrl,
          code,
          fee: data?.data?.fee,
        };
      }

      // Return a simple generic error without exposing internal server or IP details
      return {
        success: false,
        code,
        message: 'خطا در اتصال به درگاه پرداخت. لطفاً مجدداً تلاش کنید.',
      };
    } catch (err: any) {
      console.warn('[Zarinpal Request Warning]:', err?.message || err);
      const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout');
      return {
        success: false,
        message: isTimeout 
          ? 'زمان اتصال به درگاه زرین‌پال به پایان رسید. لطفاً مجدداً تلاش کنید.' 
          : (err?.message || 'خطای شبکه در اتصال به درگاه زرین‌پال.'),
      };
    }
  }

  /**
   * Verify completed payment transaction using Authority
   */
  public static async verifyPayment(
    params: ZarinpalVerifyParams
  ): Promise<ZarinpalVerifyResult> {
    const config = this.getConfig();
    const apiBaseUrl = this.getApiBaseUrl(config);
    const verifyEndpoint = `${apiBaseUrl}/v4/payment/verify.json`;

    const amountInTomans = Math.round(params.amountToman);

    const payload = {
      merchant_id: config.merchantId,
      amount: amountInTomans,
      authority: params.authority,
    };

    try {
      const response = await fetch(verifyEndpoint, {
        method: 'POST',
        headers: this.getHeaders(config),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(25000),
      });

      const data = await response.json();
      const code = data?.data?.code ?? data?.errors?.code;
      const refId = data?.data?.ref_id;

      // Code 100: Verified successfully
      // Code 101: Transaction was already verified
      if (response.ok && (code === 100 || code === 101) && refId != null && String(refId).length > 0) {
        return {
          success: true,
          refId,
          code,
          cardPan: data?.data?.card_pan,
          cardHash: data?.data?.card_hash,
          feeType: data?.data?.fee_type,
          fee: data?.data?.fee,
          message: code === 101 ? 'تراکنش قبلاً با موفقیت تایید شده است.' : 'پرداخت با موفقیت انجام و تایید شد.',
        };
      }

      const errorMsg = this.getZarinpalErrorMessage(code) || data?.errors?.message || 'تایید تراکنش ناموفق بود یا توسط کاربر لغو گردید.';
      return {
        success: false,
        code,
        message: errorMsg,
      };
    } catch (err: any) {
      console.error('[Zarinpal Verify Error]:', err);
      const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('timeout');
      return {
        success: false,
        message: isTimeout
          ? 'زمان تایید تراکنش در درگاه زرین‌پال به پایان رسید. لطفاً مجدداً استعلام نمایید.'
          : (err?.message || 'خطا در تایید تراکنش در درگاه زرین‌پال.'),
      };
    }
  }

  /**
   * Persian translation for standard Zarinpal status codes
   */
  private static getZarinpalErrorMessage(code?: number): string {
    switch (code) {
      case -9:
        return 'خطای اعتبار سنجی اطلاعات ارسالی به درگاه';
      case -10:
        return 'آی‌پی یا مرچنت‌کد ارسالی به زرین‌پال نامعتبر است';
      case -11:
        return 'مرچنت‌کد فعال نیست یا پذیرنده تایید نشده است';
      case -12:
        return 'تلاش بیش از حد در یک بازه زمانی کوتاه';
      case -15:
        return 'ترمینال پرداخت کاربر تعلیق شده است';
      case -16:
        return 'سطح تایید پذیرنده پایین‌تر از سطح نقره‌ای است';
      case -30:
        return 'اجازه دسترسی به تسویه اشتراکی شناور ندارید';
      case -31:
        return 'حساب بانکی تسویه حساب تنظیم نشده است';
      case -32:
        return 'مبلغ ارسالی با مبلغ تسویه تسهیم همخوانی ندارد';
      case -33:
        return 'درصدهای تسهیم وارد شده صحیح نیست';
      case -34:
        return 'مبلغ از سقف مجاز روزانه تراکنش بیشتر است';
      case -35:
        return 'تعداد ارقام شماره شبا نادرست است';
      case -40:
        return 'پارامترهای ارسالی به متد معتبر نیست';
      case -50:
        return 'مبلغ پرداخت شده با مبلغ اعلامی همخوانی ندارد';
      case -51:
        return 'تراکنش ناموفق بود یا کاربر از پرداخت انصراف داد';
      case -52:
        return 'خطای غیرمنتظره در سرور بانک رخ داده است';
      case -53:
        return 'پرداخت متعلق به این درگاه یا مرچنت نیست';
      case -54:
        return 'اتوریتی (Authority) تراکنش منقضی شده است';
      case 101:
        return 'تراکنش پیش‌تر با موفقیت تایید شده است';
      default:
        return '';
    }
  }
}
