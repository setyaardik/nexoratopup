import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiOk, apiError } from "@/lib/api-response";
import { toGameDTO } from "@/lib/games";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "MEMBER";

  const game = await prisma.game.findUnique({
    where: { slug, isActive: true },
    include: {
      products: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!game) {
    return apiError("Game tidak ditemukan", 404);
  }

  return apiOk(toGameDTO(game, role));
}
