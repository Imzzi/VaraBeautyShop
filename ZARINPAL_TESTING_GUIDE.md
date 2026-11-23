# Vara Beauty - Zarinpal Gateway Sandbox Testing Guide

This guide walks you through testing the **Zarinpal v4 Payment Gateway** integration on Vara Beauty using the official **Zarinpal Sandbox Environment**.

---

## 1. Prerequisites & Environment Setup

In Sandbox mode, you do **not** need a real bank card, real money, or an approved Iranian merchant contract.

### Environment Variable Status
Check `.env` (or Vercel Environment Variables):
```bash
# Leave blank or set to 'sandbox' for test mode:
ZARINPAL_MERCHANT_ID=
# Ensure sandbox flag is true for test mode:
ZARINPAL_SANDBOX=true
```
When `ZARINPAL_MERCHANT_ID` is blank or `ZARINPAL_SANDBOX=true`, the backend automatically connects to:
- **API Endpoint**: `https://sandbox.zarinpal.com/pg/v4/payment/request.json`
- **Gateway Payment Screen**: `https://sandbox.zarinpal.com/pg/StartPay/{authority}`
- **Verification Endpoint**: `https://sandbox.zarinpal.com/pg/v4/payment/verify.json`

### Quick Diagnostic Check
Open your browser or run in terminal:
```bash
curl https://varabeauty.ir/api/payment/zarinpal/status
```
Expected response:
```json
{
  "success": true,
  "configured": true,
  "isSandbox": true
}
```

---

## 2. Scenario A: Successful Payment Flow

### Step 1: Add Product & Open Cart
1. Navigate to the shop (`/shop`) or any product page.
2. Select an item and click **افزودن به سبد خرید** (Add to Cart).
3. In the shopping cart drawer, click **تکمیل خرید و پرداخت** (Proceed to Checkout).

### Step 2: Customer Information
1. Enter customer details:
   - **نام و نام خانوادگی**: e.g., سارا رضایی
   - **شماره موبایل**: e.g., `09123456789`
   - **استان و شهر**: e.g., تهران
   - **آدرس پستی**: e.g., خیابان ولیعصر، پلاک ۱۰
   - **کد پستی**: e.g., `1234567890`
2. Select shipping method (e.g., پست پیشتاز).
3. Click **مرحله بعد: پرداخت و ثبت نهایی**.

### Step 3: Payment Method Selection
1. Under **روش پرداخت**, select **پرداخت آنلاین بانکی (شتاب)**.
2. The UI displays the verified channel:
   - Green indicator: `متصل به شاپرک`
   - Description: `درگاه زرین‌پال (شاپرک) - پشتیبانی از کلیه کارت‌های عضو شبکه بانکی شتاب`
   - SSL encryption guarantee badge.
3. Click the primary button: **پرداخت آنلاین [مبلغ] تومان**.
   - Button text changes to: `در حال انتقال به درگاه بانکی...`
   - The order is saved in the Turso database with status `pending_verification`.

### Step 4: Zarinpal Sandbox Simulation
The browser redirects to:
`https://sandbox.zarinpal.com/pg/StartPay/{Authority}`

On this test page, Zarinpal displays the simulated transaction details with two action buttons:
1. **پرداخت موفق** (Simulate Success / Green button)
2. **انصراف / لغو** (Simulate Cancel / Red or Grey button)

> **Action**: Click **پرداخت موفق** (Simulate Success).

### Step 5: Verification & Success Confirmation
1. Zarinpal redirects back to the store callback:
   `/api/payment/zarinpal/callback?Authority={token}&Status=OK`
2. The server:
   - Verifies the authority token with Zarinpal Sandbox API.
   - Updates the order in the Turso database:
     - `paymentStatus`: `'paid'`
     - `status`: `'processing'`
     - `refId`: Simulated reference code (e.g., `12345678`)
3. A sleek intermediate Persian confirmation screen appears for 2 seconds:
   - Heading: `پرداخت با موفقیت انجام شد`
   - Order number and Reference ID badge.
4. Auto-redirects back to the main storefront with query parameters `/?orderSuccess=true&orderNumber=...&refId=...`:
   - A green notification toast appears:
     ```
     پرداخت شما با موفقیت تایید شد. شماره سفارش: VARA-... (کد پیگیری: ...)
     ```
   - The shopping cart is automatically emptied.

### Step 6: Verify in Admin Panel
1. Go to the Admin CMS (`/vara-admin-panel` or `/admin` &rarr; Orders tab).
2. The order appears with:
   - Status: `در حال پردازش` (Processing)
   - Payment Badge: `پرداخت شده (درگاه آنلاین)` in green
   - Tracking Ref ID displayed next to the order details.

---

## 3. Scenario B: Cancelled or Failed Payment Flow

### Step 1: Initiate Checkout
Follow Steps 1 to 3 from Scenario A.

### Step 2: Simulate Cancellation
1. Once on the `sandbox.zarinpal.com/pg/StartPay/{Authority}` screen:
2. Click **انصراف / لغو پرداخت** (Simulate Cancellation).

### Step 3: Failure Handling & UI Feedback
1. Zarinpal redirects back to:
   `/api/payment/zarinpal/callback?Authority={token}&Status=NOK`
2. The server:
   - Marks the order in the database as `paymentStatus: 'failed'`.
3. An intermediate notice screen appears:
   - Heading: `پرداخت ناموفق یا انصراف` (Red tone)
   - Message: `تراکنش بانکی تکمیل نگردید یا توسط شما لغو شد.`
4. Auto-redirects back to the store with `/?orderFailed=true&reason=cancelled`:
   - A notification toast appears:
     ```
     تراکنش پرداخت توسط شما لغو شد.
     ```
   - **Cart Preservation**: The items in the shopping cart are **not** cleared, allowing the customer to try again without re-adding items.

---

## 4. Scenario C: Network Timeout & Error Recovery

If the gateway API takes longer than 8 seconds (e.g. slow connection or temporary API downtime):
1. The server's 8-second abort signal activates (`AbortSignal.timeout(8000)`).
2. The UI captures the error and displays a safe Persian fallback:
   `زمان اتصال به درگاه زرین‌پال به پایان رسید. لطفاً مجدداً تلاش کنید.`
3. The server avoids hanging or crashing Vercel serverless functions with 504 timeouts.

---

## 5. Transitioning from Sandbox to Production

When your live Zarinpal merchant account is verified:
1. Log in to `https://my.zarinpal.com`.
2. Copy your 36-character **Merchant ID** (e.g., `a1b2c3d4-e5f6-7890-abcd-1234567890ef`).
3. In your **Vercel Dashboard** &rarr; Project Settings &rarr; **Environment Variables**:
   ```bash
   ZARINPAL_MERCHANT_ID=a1b2c3d4-e5f6-7890-abcd-1234567890ef
   ZARINPAL_SANDBOX=false
   ```
4. Redeploy the project. All future transactions will route directly through live Shaparak banking gateways.
