import crypto from "crypto";
import type {
  TripayCreateTransactionParams,
  TripayCreateTransactionResult,
  TripayPaymentChannel,
} from "@/types/payment";

/**
 * Wrapper around the Tripay payment gateway (https://tripay.co.id/developer).
 * Signing conventions:
 *  - transaction/create: signature = HMAC_SHA256(merchant_code + merchant_ref + amount, private_key)
 *  - callback verification: X-Callback-Signature header = HMAC_SHA256(rawRequestBody, private_key)
 */

export class PaymentError extends Error {}

interface TripayConfig {
  apiKey: string;
  privateKey: string;
  merchantCode: string;
  mode: "sandbox" | "production";
}

export class TripayAPI {
  private apiKey: string;
  private privateKey: string;
  private merchantCode: string;
  private baseUrl: string;

  constructor(config?: Partial<TripayConfig>) {
    this.apiKey = config?.apiKey ?? process.env.TRIPAY_API_KEY ?? "";
    this.privateKey = config?.privateKey ?? process.env.TRIPAY_PRIVATE_KEY ?? "";
    this.merchantCode = config?.merchantCode ?? process.env.TRIPAY_MERCHANT_CODE ?? "";
    const mode = config?.mode ?? (process.env.TRIPAY_MODE === "production" ? "production" : "sandbox");
    this.baseUrl = mode === "production" ? "https://tripay.co.id/api" : "https://tripay.co.id/api-sandbox";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.privateKey && this.merchantCode);
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    if (!this.isConfigured()) {
      throw new PaymentError(
        "Tripay belum dikonfigurasi. Set TRIPAY_API_KEY, TRIPAY_PRIVATE_KEY, dan TRIPAY_MERCHANT_CODE di .env"
      );
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        ...(init?.headers ?? {}),
      },
    });

    let json: { success?: boolean; message?: string; data?: T };
    try {
      json = await res.json();
    } catch {
      throw new PaymentError(`Tripay mengembalikan respons yang tidak valid (${res.status})`);
    }

    if (!res.ok || json.success === false) {
      throw new PaymentError(json.message ?? `Permintaan Tripay gagal (${res.status})`);
    }

    return json.data as T;
  }

  private createTransactionSignature(merchantRef: string, amount: number): string {
    return crypto
      .createHmac("sha256", this.privateKey)
      .update(this.merchantCode + merchantRef + amount)
      .digest("hex");
  }

  /** All enabled payment channels (QRIS, e-wallet, VA, minimarket, ...) for this merchant. */
  async getPaymentChannels(): Promise<TripayPaymentChannel[]> {
    return this.request<TripayPaymentChannel[]>("/merchant/payment-channel", { method: "GET" });
  }

  async createTransaction(params: TripayCreateTransactionParams): Promise<TripayCreateTransactionResult> {
    const signature = this.createTransactionSignature(params.merchantRef, params.amount);

    const body = {
      method: params.method,
      merchant_ref: params.merchantRef,
      amount: params.amount,
      customer_name: params.customerName,
      customer_email: params.customerEmail,
      customer_phone: params.customerPhone,
      order_items: params.orderItems.map((item) => ({
        sku: item.sku,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      expired_time: Math.floor(Date.now() / 1000) + (params.expiredMinutes ?? 60) * 60,
      signature,
    };

    return this.request<TripayCreateTransactionResult>("/transaction/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async getTransactionDetail(reference: string): Promise<TripayCreateTransactionResult> {
    return this.request<TripayCreateTransactionResult>(
      `/transaction/detail?reference=${encodeURIComponent(reference)}`,
      { method: "GET" }
    );
  }

  /** Verify the `X-Callback-Signature` header against the raw callback body. */
  verifyCallbackSignature(rawBody: string, signatureHeader: string | null): boolean {
    if (!signatureHeader || !this.privateKey) return false;
    const expected = crypto.createHmac("sha256", this.privateKey).update(rawBody).digest("hex");
    const expectedBuf = Buffer.from(expected);
    const receivedBuf = Buffer.from(signatureHeader);
    if (expectedBuf.length !== receivedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, receivedBuf);
  }
}

export const tripay = new TripayAPI();

function classifyGroup(group: string): "E-Wallet" | "QRIS" | "Virtual Account" | "Minimarket" {
  const g = group.toLowerCase();
  if (g.includes("qris")) return "QRIS";
  if (g.includes("virtual")) return "Virtual Account";
  if (g.includes("retail") || g.includes("convenience") || g.includes("minimarket")) return "Minimarket";
  return "E-Wallet";
}

/** Live Tripay payment channels, or `FALLBACK_PAYMENT_CHANNELS` if Tripay isn't configured/reachable. */
export async function getPaymentChannelOptions() {
  const { FALLBACK_PAYMENT_CHANNELS } = await import("@/lib/constants");
  if (!tripay.isConfigured()) return FALLBACK_PAYMENT_CHANNELS;

  try {
    const channels = await tripay.getPaymentChannels();
    return channels
      .filter((c) => c.active)
      .map((c) => ({ code: c.code, name: c.name, group: classifyGroup(c.group) }));
  } catch {
    return FALLBACK_PAYMENT_CHANNELS;
  }
}
