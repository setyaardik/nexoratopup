import type { TransactionStatus } from "@/types/transaction";

export const SITE_NAME = "NEXORA GAME";

export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  PENDING: "Menunggu Pembayaran",
  PAID: "Sudah Dibayar",
  PROCESSING: "Sedang Diproses",
  SUCCESS: "Berhasil",
  FAILED: "Gagal",
  REFUNDED: "Dikembalikan",
  EXPIRED: "Kedaluwarsa",
};

export const TRANSACTION_STATUS_COLOR: Record<TransactionStatus, string> = {
  PENDING: "text-warning",
  PAID: "text-cyan",
  PROCESSING: "text-cyan",
  SUCCESS: "text-success",
  FAILED: "text-danger",
  REFUNDED: "text-text-muted",
  EXPIRED: "text-danger",
};

export const STATUS_STEPS: { key: TransactionStatus; label: string }[] = [
  { key: "PENDING", label: "Pending" },
  { key: "PAID", label: "Dibayar" },
  { key: "PROCESSING", label: "Diproses" },
  { key: "SUCCESS", label: "Selesai" },
];

export const GAME_CATEGORIES = [
  { value: "all", label: "Semua" },
  { value: "mobile", label: "Mobile" },
  { value: "pc", label: "PC" },
  { value: "console", label: "Console" },
  { value: "voucher", label: "Voucher" },
] as const;

export interface PaymentChannelOption {
  code: string;
  name: string;
  group: "E-Wallet" | "QRIS" | "Virtual Account" | "Minimarket";
}

/**
 * Shown when Tripay isn't configured yet (no live credentials) so the
 * checkout UI still demonstrates the full payment method selection —
 * replaced at runtime by `tripay.getPaymentChannels()` once configured.
 */
export const FALLBACK_PAYMENT_CHANNELS: PaymentChannelOption[] = [
  { code: "QRIS", name: "QRIS (Semua E-Wallet)", group: "QRIS" },
  { code: "DANA", name: "DANA", group: "E-Wallet" },
  { code: "SHOPEEPAY", name: "ShopeePay", group: "E-Wallet" },
  { code: "BCAVA", name: "BCA Virtual Account", group: "Virtual Account" },
  { code: "BNIVA", name: "BNI Virtual Account", group: "Virtual Account" },
  { code: "BRIVA", name: "BRI Virtual Account", group: "Virtual Account" },
  { code: "MANDIRIVA", name: "Mandiri Virtual Account", group: "Virtual Account" },
  { code: "INDOMARET", name: "Indomaret", group: "Minimarket" },
  { code: "ALFAMART", name: "Alfamart", group: "Minimarket" },
];

export const RESELLER_TIERS = [
  {
    name: "Member",
    discount: "Harga normal",
    perks: ["Proses instan 24 jam", "Cek transaksi realtime", "Support customer service"],
  },
  {
    name: "Reseller",
    discount: "Hemat hingga 5%",
    perks: ["Harga khusus reseller di semua produk", "Deposit saldo untuk transaksi cepat", "Prioritas support"],
  },
  {
    name: "Agen",
    discount: "Hemat hingga 10%",
    perks: ["Harga agen termurah", "Limit transaksi lebih tinggi", "Akun manager khusus"],
  },
];
