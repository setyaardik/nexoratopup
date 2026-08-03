import { XCircle } from "lucide-react";
import { STATUS_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types/transaction";

const FAILED_STATUSES: TransactionStatus[] = ["FAILED", "EXPIRED", "REFUNDED"];

export function StatusTracker({ status }: { status: TransactionStatus }) {
  if (FAILED_STATUSES.includes(status)) {
    return (
      <div className="flex flex-col items-center gap-2 py-6">
        <XCircle className="size-10 text-danger" />
        <p className="text-sm font-bold text-danger">
          {status === "FAILED" ? "Transaksi Gagal" : status === "EXPIRED" ? "Pembayaran Kedaluwarsa" : "Dana Dikembalikan"}
        </p>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center justify-between py-6">
      {STATUS_STEPS.map((step, i) => {
        const reached = i <= currentIndex;
        const active = i === currentIndex;
        return (
          <div key={step.key} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  reached ? "gradient-bg border-transparent text-white" : "border-white/15 text-text-muted",
                  active && "status-dot-active"
                )}
              >
                {i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={cn("mx-1 h-0.5 flex-1", i < currentIndex ? "bg-primary" : "bg-white/10")} />
              )}
            </div>
            <span className={cn("mt-2 text-[11px] font-semibold", reached ? "text-text" : "text-text-muted")}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
