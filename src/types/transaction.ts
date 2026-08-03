export type TransactionStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "EXPIRED";

export interface GameAccount {
  [fieldName: string]: string;
}

export interface TransactionDTO {
  id: string;
  invoiceId: string;
  gameAccount: GameAccount;
  amount: number;
  paymentMethod: string;
  paymentRef: string | null;
  paymentUrl: string | null;
  vipaymentRef: string | null;
  status: TransactionStatus;
  paidAt: string | null;
  processedAt: string | null;
  completedAt: string | null;
  failedReason: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    sellPrice: number;
    game: {
      id: string;
      name: string;
      slug: string;
      image: string;
    };
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
