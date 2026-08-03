export interface GameField {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: "text" | "select";
  options?: string[];
}

export interface ProductDTO {
  id: string;
  name: string;
  sku: string;
  sellPrice: number;
  resellerPrice: number | null;
  agenPrice: number | null;
  promoPrice: number | null;
  promoEndDate: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface GameDTO {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string | null;
  description: string | null;
  category: string;
  fields: GameField[];
  isActive: boolean;
  sortOrder: number;
  products?: ProductDTO[];
}

export interface GameListItemDTO {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  hasPromo: boolean;
  startingPrice: number | null;
}
