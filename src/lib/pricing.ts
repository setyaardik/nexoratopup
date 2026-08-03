export interface PriceableProduct {
  sellPrice: number;
  resellerPrice: number | null;
  agenPrice: number | null;
  promoPrice: number | null;
  promoEndDate: Date | string | null;
}

export type PricingRole = "MEMBER" | "RESELLER" | "AGEN" | "ADMIN";

export function isPromoActive(product: PriceableProduct): boolean {
  if (product.promoPrice == null) return false;
  if (!product.promoEndDate) return true;
  return new Date(product.promoEndDate).getTime() > Date.now();
}

/** The role's normal (pre-promo) price for this product. */
export function getRoleBasePrice(product: PriceableProduct, role: PricingRole = "MEMBER"): number {
  return role === "RESELLER"
    ? product.resellerPrice ?? product.sellPrice
    : role === "AGEN"
      ? product.agenPrice ?? product.sellPrice
      : product.sellPrice;
}

/**
 * Single source of truth for "what does this customer pay for this product
 * right now" — used by the product grid and transaction creation so the
 * price shown always matches the price charged.
 */
export function getEffectivePrice(product: PriceableProduct, role: PricingRole = "MEMBER"): number {
  const roleBase = getRoleBasePrice(product, role);
  if (isPromoActive(product) && product.promoPrice! < roleBase) {
    return product.promoPrice!;
  }
  return roleBase;
}
