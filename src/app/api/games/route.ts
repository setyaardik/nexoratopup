import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiOk } from "@/lib/api-response";
import { toGameListItem } from "@/lib/games";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const games = await prisma.game.findMany({
    where: {
      isActive: true,
      ...(category && category !== "all" ? { category } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        select: { sellPrice: true, resellerPrice: true, agenPrice: true, promoPrice: true, promoEndDate: true },
      },
    },
  });

  return apiOk(games.map(toGameListItem));
}
