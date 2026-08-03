import { Zap, Wallet, ShieldCheck, Clock } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Proses Instan", desc: "Diamond & voucher masuk 1-60 detik setelah pembayaran berhasil." },
  { icon: Wallet, title: "Harga Termurah", desc: "Harga bersaing untuk semua game, update setiap hari." },
  { icon: ShieldCheck, title: "Aman & Terpercaya", desc: "Transaksi terenkripsi dan dipantau selama 24 jam." },
  { icon: Clock, title: "Layanan 24 Jam", desc: "Customer service siap membantu kapan saja kamu butuh." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-surface-3 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-[#c9a15a]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">
            Mengapa Kami
          </span>
          <span className="h-px w-10 bg-[#c9a15a]" />
        </div>
        <h2 className="mt-3 text-center font-heading text-3xl font-semibold text-text">
          Kenapa Pilih Nexora<span className="italic text-[#dfc48f]">Game</span>?
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="card-surface rounded-2xl p-6 text-center transition-colors duration-300 hover:border-[rgba(201,161,90,0.4)]"
            >
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-[rgba(201,161,90,0.4)] text-[#dfc48f]">
                <f.icon className="size-6" />
              </div>
              <div className="mb-2 font-heading text-lg font-semibold text-text">{f.title}</div>
              <div className="text-xs leading-relaxed text-text-muted">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
