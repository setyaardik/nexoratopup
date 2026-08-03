"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/utils";

interface OrderSummaryProps {
  gameName: string;
  productName: string | null;
  accountLabel: string | null;
  paymentLabel: string | null;
  total: number | null;
  onSubmit: () => void;
  submitting: boolean;
  disabled: boolean;
}

export function OrderSummary({
  gameName,
  productName,
  accountLabel,
  paymentLabel,
  total,
  onSubmit,
  submitting,
  disabled,
}: OrderSummaryProps) {
  return (
    <>
      {/* Desktop inline summary */}
      <Card className="hidden p-5 sm:p-6 md:block">
        <h2 className="mb-4 font-heading text-base font-bold text-text">Ringkasan Pesanan</h2>
        <dl className="flex flex-col gap-2.5 text-sm">
          <Row label="Game" value={gameName} />
          <Row label="Nominal" value={productName ?? "-"} />
          <Row label="Akun" value={accountLabel ?? "-"} />
          <Row label="Pembayaran" value={paymentLabel ?? "-"} />
        </dl>
        <div className="my-4 border-t border-white/10" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-muted">Total</span>
          <span className="font-heading text-lg font-extrabold text-text">
            {total != null ? formatRupiah(total) : "-"}
          </span>
        </div>
        <Button className="mt-5 w-full" size="lg" disabled={disabled} isLoading={submitting} onClick={onSubmit}>
          Beli Sekarang
        </Button>
      </Card>

      {/* Mobile sticky bar */}
      <div className="card-surface fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-[rgba(201,161,90,0.16)] p-4 md:hidden">
        <div>
          <div className="text-xs text-text-muted">Total</div>
          <div className="font-heading text-base font-extrabold text-text">
            {total != null ? formatRupiah(total) : "-"}
          </div>
        </div>
        <Button disabled={disabled} isLoading={submitting} onClick={onSubmit}>
          Beli Sekarang
        </Button>
      </div>
      <div className="h-20 md:hidden" />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right font-medium text-text">{value}</dd>
    </div>
  );
}
