import { CekTransaksiClient } from "./CekTransaksiClient";

export default async function CekTransaksiPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;
  return <CekTransaksiClient initialInvoice={invoice ?? ""} />;
}
