export interface TripayPaymentChannel {
  group: string;
  code: string;
  name: string;
  type: "direct" | "redirect";
  fee_merchant: { flat: number; percent: number };
  fee_customer: { flat: number; percent: number };
  total_fee: { flat: number; percent: string };
  minimum_fee: number | null;
  maximum_fee: number | null;
  icon_url: string;
  active: boolean;
}

export interface TripayCreateTransactionParams {
  method: string;
  merchantRef: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderItems: { sku: string; name: string; price: number; quantity: number }[];
  callbackUrl: string;
  returnUrl: string;
  expiredMinutes?: number;
}

export interface TripayCreateTransactionResult {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_name: string;
  amount: number;
  status: string;
  checkout_url: string;
  qr_url?: string;
  pay_code?: string;
  expired_time: number;
}

export interface TripayCallbackPayload {
  reference: string;
  merchant_ref: string;
  payment_method: string;
  payment_method_code: string;
  total_amount: number;
  fee_merchant: number;
  fee_customer: number;
  total_fee: number;
  amount_received: number;
  is_closed_payment: 0 | 1;
  status: "PAID" | "EXPIRED" | "FAILED" | "UNPAID" | "REFUND";
  paid_at: number | null;
}
