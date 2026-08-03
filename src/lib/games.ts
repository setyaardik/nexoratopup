import { getEffectivePrice, getRoleBasePrice, isPromoActive, type PriceableProduct, type PricingRole } from "@/lib/pricing";
import type { GameDTO, GameField, GameListItemDTO } from "@/types/game";

interface GameWithProducts {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  products: PriceableProduct[];
}

/** Shared by /api/games and the server-rendered home page so both list the catalog identically. */
export function toGameListItem(game: GameWithProducts): GameListItemDTO {
  const prices = game.products.map((p) => getEffectivePrice(p));
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    image: game.image,
    category: game.category,
    hasPromo: game.products.some(isPromoActive),
    startingPrice: prices.length ? Math.min(...prices) : null,
  };
}

interface FullProduct extends PriceableProduct {
  id: string;
  name: string;
  sku: string;
  isActive: boolean;
  sortOrder: number;
}

interface FullGame {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string | null;
  description: string | null;
  category: string;
  fields: unknown;
  isActive: boolean;
  sortOrder: number;
  products: FullProduct[];
}

/** Shared by /api/games/[slug] and the game detail page. */
export function toGameDTO(game: FullGame, role: PricingRole = "MEMBER"): GameDTO {
  return {
    id: game.id,
    name: game.name,
    slug: game.slug,
    image: game.image,
    banner: game.banner,
    description: game.description,
    category: game.category,
    fields: game.fields as GameField[],
    isActive: game.isActive,
    sortOrder: game.sortOrder,
    products: game.products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      sellPrice: getRoleBasePrice(p, role),
      resellerPrice: p.resellerPrice,
      agenPrice: p.agenPrice,
      promoPrice: isPromoActive(p) ? p.promoPrice : null,
      promoEndDate: p.promoEndDate ? new Date(p.promoEndDate).toISOString() : null,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    })),
  };
}
