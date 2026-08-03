import { Card } from "@/components/ui/Card";

const TESTIMONIALS = [
  { name: "Andra P.", game: "Mobile Legends", quote: "Diamond masuk kurang dari 1 menit, harga juga paling murah dibanding tempat lain!" },
  { name: "Siti R.", game: "Free Fire", quote: "Udah langganan di sini, prosesnya cepat banget dan CS-nya responsif." },
  { name: "Budi S.", game: "Genshin Impact", quote: "Top up Genesis Crystal aman dan langsung masuk, gak pakai drama." },
  { name: "Kevin W.", game: "Valorant", quote: "VP nya langsung kepotong, checkout gampang tinggal pilih QRIS." },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#c9a15a]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c9a15a]">Testimoni</span>
        <span className="h-px w-10 bg-[#c9a15a]" />
      </div>
      <h2 className="mt-3 text-center font-heading text-3xl font-semibold text-text">Apa Kata Mereka</h2>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <Card
            key={t.name}
            className="p-6 transition-colors duration-300 hover:border-[rgba(201,161,90,0.4)]"
          >
            <div className="mb-3 text-[13px] tracking-[0.2em] text-[#c9a15a]">★★★★★</div>
            <p className="mb-5 text-sm leading-relaxed text-text/90">&ldquo;{t.quote}&rdquo;</p>
            <div className="border-t border-[rgba(201,161,90,0.14)] pt-4">
              <div className="font-heading text-base font-semibold text-text">{t.name}</div>
              <div className="mt-0.5 text-xs text-text-muted">{t.game}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
