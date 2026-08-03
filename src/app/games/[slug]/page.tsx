import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toGameDTO } from "@/lib/games";
import { getPaymentChannelOptions } from "@/lib/payment";
import { GameHeader } from "@/components/game/GameHeader";
import { GameDetailClient } from "@/components/game/GameDetailClient";

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "MEMBER";

  const [gameRow, channels] = await Promise.all([
    prisma.game.findUnique({
      where: { slug, isActive: true },
      include: { products: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
    }),
    getPaymentChannelOptions(),
  ]);

  if (!gameRow) notFound();

  const game = toGameDTO(gameRow, role);
  const hasPromo = (game.products ?? []).some((p) => p.promoPrice != null);

  return (
    <div className="pb-4">
      <GameHeader game={game} hasPromo={hasPromo} />
      <GameDetailClient
        game={game}
        channels={channels}
        walletBalance={session?.user?.balance}
        customerName={session?.user?.name}
        customerEmail={session?.user?.email}
      />
    </div>
  );
}
