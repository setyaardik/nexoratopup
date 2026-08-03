"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UserIdForm } from "@/components/game/UserIdForm";
import { ProductGrid } from "@/components/game/ProductGrid";
import { PaymentMethods } from "@/components/game/PaymentMethods";
import { OrderSummary } from "@/components/game/OrderSummary";
import type { GameDTO } from "@/types/game";
import type { PaymentChannelOption } from "@/lib/constants";

interface GameDetailClientProps {
  game: GameDTO;
  channels: PaymentChannelOption[];
  walletBalance?: number;
  customerName?: string | null;
  customerEmail?: string | null;
}

export function GameDetailClient({
  game,
  channels,
  walletBalance,
  customerName,
  customerEmail,
}: GameDetailClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [values, setValues] = useState<Record<string, string>>({});
  const [validating, setValidating] = useState(false);
  const [validatedUsername, setValidatedUsername] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isGuest = !customerEmail;
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const products = game.products ?? [];
  const selectedProduct = products.find((p) => p.id === selectedProductId) ?? null;

  function handleFieldChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setValidatedUsername(null);
    setValidationError(null);
  }

  async function handleValidate() {
    setValidating(true);
    setValidationError(null);
    try {
      const res = await fetch(`/api/games/${game.slug}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: values.userId, zoneId: values.zoneId }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setValidationError(json.message ?? "Gagal memvalidasi akun");
        return;
      }
      setValidatedUsername(json.data.username ?? "Terverifikasi");
    } catch {
      setValidationError("Gagal memvalidasi akun, coba lagi");
    } finally {
      setValidating(false);
    }
  }

  const requiredFilled = game.fields.every((f) => !f.required || values[f.name]?.trim());
  const guestInfoFilled = !isGuest || (guestName.trim().length >= 2 && /\S+@\S+\.\S+/.test(guestEmail));
  const canSubmit =
    requiredFilled && guestInfoFilled && !!selectedProductId && !!selectedPayment && !submitting;

  const accountLabel = useMemo(() => {
    const parts = game.fields.map((f) => values[f.name]).filter(Boolean);
    return parts.length ? parts.join(" / ") : null;
  }, [game.fields, values]);

  const paymentLabel = useMemo(() => {
    if (!selectedPayment) return null;
    if (selectedPayment === "saldo") return "Saldo NEXORA";
    return channels.find((c) => c.code === selectedPayment)?.name ?? selectedPayment;
  }, [selectedPayment, channels]);

  async function handleSubmit() {
    if (!canSubmit || !selectedProduct || !selectedPayment) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/transaction/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          gameAccount: values,
          paymentMethod: selectedPayment,
          customerName: customerName ?? guestName,
          customerEmail: customerEmail ?? guestEmail,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast(json.message ?? "Gagal membuat transaksi", "error");
        return;
      }
      if (json.data.paymentUrl) {
        window.location.href = json.data.paymentUrl;
        return;
      }
      showToast("Pembayaran berhasil, pesanan sedang diproses", "success");
      router.push(`/cek-transaksi?invoice=${json.data.invoiceId}`);
    } catch {
      showToast("Terjadi kesalahan, coba lagi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 pb-8 pt-6 md:grid-cols-3 md:px-8">
      <div className="flex flex-col gap-6 md:col-span-2">
        <UserIdForm
          fields={game.fields}
          values={values}
          onChange={handleFieldChange}
          onValidate={handleValidate}
          validating={validating}
          validatedUsername={validatedUsername}
          validationError={validationError}
        />
        {isGuest && (
          <Card className="p-5 sm:p-6">
            <h2 className="mb-4 font-heading text-base font-bold text-text">Data Pemesan</h2>
            <p className="mb-4 text-xs text-text-muted">
              Dipakai untuk invoice pembayaran & informasi transaksi.{" "}
              <span className="font-semibold text-text">Masuk</span> agar tidak perlu isi ulang tiap transaksi.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nama Pemesan"
                placeholder="Nama kamu"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
              <Input
                label="Email Pemesan"
                type="email"
                placeholder="kamu@email.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
              />
            </div>
          </Card>
        )}
        <ProductGrid products={products} selectedId={selectedProductId} onSelect={setSelectedProductId} />
        <PaymentMethods
          channels={channels}
          selected={selectedPayment}
          onSelect={setSelectedPayment}
          walletBalance={walletBalance}
        />
      </div>

      <div className="md:col-span-1">
        <OrderSummary
          gameName={game.name}
          productName={selectedProduct?.name ?? null}
          accountLabel={accountLabel}
          paymentLabel={paymentLabel}
          total={selectedProduct ? (selectedProduct.promoPrice ?? selectedProduct.sellPrice) : null}
          onSubmit={handleSubmit}
          submitting={submitting}
          disabled={!canSubmit}
        />
      </div>
    </div>
  );
}
