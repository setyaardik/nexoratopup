import { prisma } from "@/lib/prisma";
import { toGameListItem } from "@/lib/games";
import { getRoleBasePrice } from "@/lib/pricing";
import { HeroBanner } from "@/components/home/HeroBanner";
import { PromoSlider, type PromoBanner } from "@/components/home/PromoSlider";
import { GameGrid } from "@/components/home/GameGrid";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [games, promoProducts] = await Promise.all([
    prisma.game.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        products: {
          where: { isActive: true },
          select: { sellPrice: true, resellerPrice: true, agenPrice: true, promoPrice: true, promoEndDate: true },
        },
      },
    }),
    prisma.product.findMany({
      where: {
        isActive: true,
        promoPrice: { not: null },
        OR: [{ promoEndDate: null }, { promoEndDate: { gt: new Date() } }],
      },
      include: { game: true },
      take: 5,
    }),
  ]);

  const gameItems = games.map(toGameListItem);
  const promoBanners: PromoBanner[] = promoProducts.map((p) => ({
    gameSlug: p.game.slug,
    gameName: p.game.name,
    productName: p.name,
    originalPrice: getRoleBasePrice(p),
    promoPrice: p.promoPrice!,
  }));

  return (
    <div className="animate-[fadeInUp_0.5s_ease]">
      <HeroBanner />
      <PromoSlider banners={promoBanners} />
      <GameGrid initialGames={gameItems} query={q ?? ""} />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}
