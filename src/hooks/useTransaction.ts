import { useCallback, useEffect, useState } from "react";
import type { TransactionDTO, TransactionStatus } from "@/types/transaction";

const TERMINAL_STATUSES = new Set<TransactionStatus>(["SUCCESS", "FAILED", "REFUNDED", "EXPIRED"]);

/** Fetches a transaction by invoice ID and polls until it reaches a terminal status. */
export function useTransaction(invoiceId: string | null, options: { pollIntervalMs?: number } = {}) {
  const pollIntervalMs = options.pollIntervalMs ?? 5000;
  const [transaction, setTransaction] = useState<TransactionDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = useCallback(async (): Promise<TransactionDTO | null> => {
    if (!invoiceId) return null;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/transaction/status?invoiceId=${encodeURIComponent(invoiceId)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message ?? "Transaksi tidak ditemukan");
        setTransaction(null);
        return null;
      }
      setError(null);
      setTransaction(json.data);
      return json.data as TransactionDTO;
    } catch {
      setError("Gagal memuat status transaksi");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (!invoiceId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = async () => {
      const result = await fetchStatus();
      if (cancelled) return;
      if (!result || !TERMINAL_STATUSES.has(result.status)) {
        timer = setTimeout(tick, pollIntervalMs);
      }
    };
    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [invoiceId, fetchStatus, pollIntervalMs]);

  return { transaction, error, isLoading, refetch: fetchStatus };
}
