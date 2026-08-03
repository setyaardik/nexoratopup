export interface VIPaymentProduct {
  code: string;
  name: string;
  category: string;
  type: string;
  price: {
    basic?: string;
    premium?: string;
  };
  status: "available" | "empty";
  note?: string;
}

export interface VIPaymentOrderResult {
  trxid: string;
  status: "pending" | "processing" | "success" | "error";
  data: {
    id: string;
    service: string;
    target: string;
    price: string;
  };
  message: string;
}

export interface VIPaymentStatusResult {
  trxid: string;
  status: "pending" | "processing" | "success" | "error";
  note: string;
  target: string;
  serial_number?: string;
}

export interface VIPaymentBalance {
  balance: number;
}

export interface VIPaymentValidateResult {
  valid: boolean;
  username?: string;
}
