import crypto from "crypto";
import type {
  VIPaymentBalance,
  VIPaymentOrderResult,
  VIPaymentProduct,
  VIPaymentStatusResult,
  VIPaymentValidateResult,
} from "@/types/vipayment";

/**
 * Wrapper around the VIPayment / VIP-Reseller H2H game-topup API.
 *
 * Endpoint shapes below follow the documented VIP-Reseller H2H convention
 * (POST {baseUrl}/game-feature, sign = md5(api_id + api_key), `type` selects
 * the operation). No live credentials were available while building this —
 * verify field names against your actual VIPayment account docs and adjust
 * `request()`/parameter names here if they differ.
 */

export class VIPaymentError extends Error {}

interface VIPaymentConfig {
  apiKey: string;
  apiId: string;
  baseUrl: string;
}

export class VIPaymentAPI {
  private apiKey: string;
  private apiId: string;
  private baseUrl: string;

  constructor(config?: Partial<VIPaymentConfig>) {
    this.apiKey = config?.apiKey ?? process.env.VIPAYMENT_API_KEY ?? "";
    this.apiId = config?.apiId ?? process.env.VIPAYMENT_API_ID ?? "";
    this.baseUrl = config?.baseUrl ?? process.env.VIPAYMENT_API_URL ?? "https://vip-reseller.co.id/api";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiId);
  }

  private sign(): string {
    return crypto.createHash("md5").update(`${this.apiId}${this.apiKey}`).digest("hex");
  }

  private async request<T>(type: string, params: Record<string, string> = {}): Promise<T> {
    if (!this.isConfigured()) {
      throw new VIPaymentError(
        "VIPayment belum dikonfigurasi. Set VIPAYMENT_API_KEY dan VIPAYMENT_API_ID di .env"
      );
    }

    const body = new URLSearchParams({
      key: this.apiKey,
      id: this.apiId,
      sign: this.sign(),
      type,
      ...params,
    });

    const res = await fetch(`${this.baseUrl}/game-feature`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    let json: { result?: boolean; message?: string; data?: T };
    try {
      json = await res.json();
    } catch {
      throw new VIPaymentError(`VIPayment mengembalikan respons yang tidak valid (${res.status})`);
    }

    if (!res.ok || json.result === false) {
      throw new VIPaymentError(json.message ?? `Permintaan VIPayment gagal (${res.status})`);
    }

    return json.data as T;
  }

  /** List all available game-topup products/services. */
  async getProducts(filterType: "game" = "game"): Promise<VIPaymentProduct[]> {
    return this.request<VIPaymentProduct[]>("services", { filter_type: filterType });
  }

  async getProductDetail(sku: string): Promise<VIPaymentProduct> {
    const products = await this.getProducts();
    const found = products.find((p) => p.code === sku);
    if (!found) throw new VIPaymentError(`Produk dengan SKU ${sku} tidak ditemukan di VIPayment`);
    return found;
  }

  /** Remaining deposit balance on the VIPayment account. */
  async checkBalance(): Promise<VIPaymentBalance> {
    return this.request<VIPaymentBalance>("profile");
  }

  /** Submit a top-up order. `target` is the game user ID, optionally combined with zone/server. */
  async createOrder(
    sku: string,
    target: string,
    customData?: Record<string, string>
  ): Promise<VIPaymentOrderResult> {
    return this.request<VIPaymentOrderResult>("order", {
      service: sku,
      data_no: target,
      ...customData,
    });
  }

  async checkOrderStatus(orderId: string): Promise<VIPaymentStatusResult> {
    return this.request<VIPaymentStatusResult>("status", { trxid: orderId });
  }

  /**
   * Validate a game account and resolve its in-game username, when the
   * upstream game supports it. Not every game/product on VIPayment exposes
   * nickname lookups, so failures degrade to `{ valid: false }` instead of
   * throwing — callers should treat that as "skip validation for this game".
   */
  async validateGameId(game: string, userId: string, zoneId?: string): Promise<VIPaymentValidateResult> {
    try {
      return await this.request<VIPaymentValidateResult>("get-nickname", {
        game,
        data: zoneId ? `${userId}|${zoneId}` : userId,
      });
    } catch {
      return { valid: false };
    }
  }
}

export const vipayment = new VIPaymentAPI();
