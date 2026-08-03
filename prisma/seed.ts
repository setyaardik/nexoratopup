import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface ProductSeed {
  name: string;
  sku: string;
  sellPrice: number;
}

function tier(name: string, sku: string, sellPrice: number): ProductSeed {
  return { name, sku, sellPrice };
}

// buyPrice is what NEXORA pays VIPayment; sellPrice is what the customer pays.
// resellerPrice / agenPrice sit between buyPrice and sellPrice as tiered discounts.
function deriveMargins(sellPrice: number) {
  const buyPrice = Math.round((sellPrice * 0.86) / 100) * 100;
  const resellerPrice = Math.round((sellPrice * 0.97) / 100) * 100;
  const agenPrice = Math.round((sellPrice * 0.94) / 100) * 100;
  return { buyPrice, resellerPrice, agenPrice };
}

const games: {
  name: string;
  slug: string;
  image: string;
  banner: string;
  description: string;
  category: string;
  fields: Record<string, unknown>[];
  products: ProductSeed[];
}[] = [
  {
    name: "Mobile Legends: Bang Bang",
    slug: "mobile-legends",
    image: "/images/games/mobile-legends.jpg",
    banner: "/images/games/mobile-legends.jpg",
    description: "Top up Diamonds Mobile Legends: Bang Bang, proses instan 1-60 detik.",
    category: "mobile",
    fields: [
      { name: "userId", label: "User ID", placeholder: "Masukkan User ID", required: true },
      { name: "zoneId", label: "Zone ID", placeholder: "Masukkan Zone ID", required: true },
    ],
    products: [
      tier("5 Diamonds", "ML_5_DM", 2500),
      tier("12 Diamonds", "ML_12_DM", 4500),
      tier("19 Diamonds", "ML_19_DM", 7000),
      tier("28 Diamonds", "ML_28_DM", 10000),
      tier("44 Diamonds", "ML_44_DM", 15000),
      tier("59 Diamonds", "ML_59_DM", 19500),
      tier("86 Diamonds", "ML_86_DM", 22000),
      tier("172 Diamonds", "ML_172_DM", 43000),
      tier("257 Diamonds", "ML_257_DM", 64000),
      tier("344 Diamonds", "ML_344_DM", 85000),
      tier("429 Diamonds", "ML_429_DM", 106000),
      tier("514 Diamonds", "ML_514_DM", 127000),
      tier("706 Diamonds", "ML_706_DM", 170000),
      tier("878 Diamonds", "ML_878_DM", 210000),
      tier("2195 Diamonds", "ML_2195_DM", 510000),
    ],
  },
  {
    name: "Free Fire",
    slug: "free-fire",
    image: "/images/games/free-fire.webp",
    banner: "/images/games/free-fire.webp",
    description: "Top up Diamonds Free Fire termurah dan tercepat.",
    category: "mobile",
    fields: [{ name: "userId", label: "User ID", placeholder: "Masukkan User ID", required: true }],
    products: [
      tier("12 Diamonds", "FF_12_DM", 2200),
      tier("50 Diamonds", "FF_50_DM", 8000),
      tier("70 Diamonds", "FF_70_DM", 11000),
      tier("140 Diamonds", "FF_140_DM", 21500),
      tier("210 Diamonds", "FF_210_DM", 32000),
      tier("355 Diamonds", "FF_355_DM", 53000),
      tier("720 Diamonds", "FF_720_DM", 105000),
      tier("1450 Diamonds", "FF_1450_DM", 210000),
    ],
  },
  {
    name: "Genshin Impact",
    slug: "genshin-impact",
    image: "/images/games/genshin-impact.svg",
    banner: "/images/games/genshin-impact.svg",
    description: "Top up Genesis Crystal & Blessing of the Welkin Moon.",
    category: "mobile",
    fields: [
      { name: "userId", label: "User ID", placeholder: "Masukkan UID", required: true },
      {
        name: "serverId",
        label: "Server",
        placeholder: "Pilih Server",
        required: true,
        type: "select",
        options: ["Asia", "America", "Europe", "TW/HK/MO"],
      },
    ],
    products: [
      tier("60 Genesis Crystal", "GI_60_GC", 16000),
      tier("300 Genesis Crystal", "GI_300_GC", 79000),
      tier("980 Genesis Crystal", "GI_980_GC", 249000),
      tier("1980 Genesis Crystal", "GI_1980_GC", 479000),
      tier("3280 Genesis Crystal", "GI_3280_GC", 749000),
      tier("6480 Genesis Crystal", "GI_6480_GC", 1449000),
    ],
  },
  {
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    image: "/images/games/pubg-mobile.png",
    banner: "/images/games/pubg-mobile.png",
    description: "Top up UC PUBG Mobile langsung masuk ke akun.",
    category: "mobile",
    fields: [{ name: "userId", label: "User ID", placeholder: "Masukkan User ID", required: true }],
    products: [
      tier("60 UC", "PUBGM_60_UC", 15000),
      tier("325 UC", "PUBGM_325_UC", 75000),
      tier("660 UC", "PUBGM_660_UC", 149000),
      tier("1800 UC", "PUBGM_1800_UC", 379000),
      tier("3850 UC", "PUBGM_3850_UC", 749000),
      tier("8100 UC", "PUBGM_8100_UC", 1499000),
    ],
  },
  {
    name: "Valorant",
    slug: "valorant",
    image: "/images/games/valorant.webp",
    banner: "/images/games/valorant.webp",
    description: "Top up VP (Valorant Points) resmi & aman.",
    category: "pc",
    fields: [{ name: "userId", label: "Riot ID", placeholder: "namamu#tagline", required: true }],
    products: [
      tier("125 VP", "VAL_125_VP", 19000),
      tier("420 VP", "VAL_420_VP", 59000),
      tier("700 VP", "VAL_700_VP", 95000),
      tier("1750 VP", "VAL_1750_VP", 229000),
      tier("3650 VP", "VAL_3650_VP", 449000),
    ],
  },
  {
    name: "Honkai: Star Rail",
    slug: "honkai-star-rail",
    image: "/images/games/honkai-star-rail.svg",
    banner: "/images/games/honkai-star-rail.svg",
    description: "Top up Oneiric Shard Honkai: Star Rail.",
    category: "mobile",
    fields: [
      { name: "userId", label: "UID", placeholder: "Masukkan UID", required: true },
      {
        name: "serverId",
        label: "Server",
        placeholder: "Pilih Server",
        required: true,
        type: "select",
        options: ["Asia", "America", "Europe", "TW/HK/MO"],
      },
    ],
    products: [
      tier("60 Oneiric Shard", "HSR_60_OS", 16000),
      tier("300 Oneiric Shard", "HSR_300_OS", 79000),
      tier("980 Oneiric Shard", "HSR_980_OS", 249000),
      tier("1980 Oneiric Shard", "HSR_1980_OS", 479000),
      tier("3280 Oneiric Shard", "HSR_3280_OS", 749000),
    ],
  },
  {
    name: "Roblox",
    slug: "roblox",
    image: "/images/games/roblox.png",
    banner: "/images/games/roblox.png",
    description: "Top up Robux Roblox untuk membeli item favoritmu.",
    category: "pc",
    fields: [{ name: "userId", label: "Username", placeholder: "Masukkan Username Roblox", required: true }],
    products: [
      tier("80 Robux", "RBLX_80_RBX", 15000),
      tier("400 Robux", "RBLX_400_RBX", 72000),
      tier("800 Robux", "RBLX_800_RBX", 139000),
      tier("1700 Robux", "RBLX_1700_RBX", 289000),
      tier("4500 Robux", "RBLX_4500_RBX", 729000),
    ],
  },
  {
    name: "Steam Wallet",
    slug: "steam-wallet",
    image: "/images/games/steam-wallet.webp",
    banner: "/images/games/steam-wallet.webp",
    description: "Voucher Steam Wallet berbagai nominal, aktivasi instan.",
    category: "voucher",
    fields: [{ name: "email", label: "Email", placeholder: "Email tujuan voucher", required: true }],
    products: [
      tier("Rp 12.000", "STEAM_12K_IDR", 14000),
      tier("Rp 45.000", "STEAM_45K_IDR", 48000),
      tier("Rp 60.000", "STEAM_60K_IDR", 64000),
      tier("Rp 90.000", "STEAM_90K_IDR", 95000),
      tier("Rp 120.000", "STEAM_120K_IDR", 126000),
      tier("Rp 250.000", "STEAM_250K_IDR", 260000),
      tier("Rp 500.000", "STEAM_500K_IDR", 515000),
    ],
  },
  {
    name: "PlayStation (PSN)",
    slug: "playstation",
    image: "/images/games/playstation.svg",
    banner: "/images/games/playstation.svg",
    description: "Top up saldo PlayStation Network (PSN) Indonesia.",
    category: "console",
    fields: [{ name: "email", label: "Email PSN", placeholder: "Email akun PSN", required: true }],
    products: [
      tier("Rp 60.000", "PSN_60K_IDR", 64000),
      tier("Rp 150.000", "PSN_150K_IDR", 158000),
      tier("Rp 300.000", "PSN_300K_IDR", 314000),
      tier("Rp 600.000", "PSN_600K_IDR", 624000),
      tier("Rp 900.000", "PSN_900K_IDR", 929000),
    ],
  },
  {
    name: "Call of Duty Mobile",
    slug: "codm",
    image: "/images/games/codm.jpg",
    banner: "/images/games/codm.jpg",
    description: "Top up CP (CoD Points) Call of Duty Mobile.",
    category: "mobile",
    fields: [{ name: "userId", label: "Player ID", placeholder: "Masukkan Player ID (Open ID)", required: true }],
    products: [
      tier("80 CP", "CODM_80_CP", 15000),
      tier("420 CP", "CODM_420_CP", 75000),
      tier("880 CP", "CODM_880_CP", 149000),
      tier("2400 CP", "CODM_2400_CP", 389000),
      tier("5000 CP", "CODM_5000_CP", 749000),
    ],
  },
];

// Products flagged as flash-sale promos for the /promo page and home banner.
const PROMO_SKUS: Record<string, { promoPrice: number; days: number }> = {
  ML_86_DM: { promoPrice: 19500, days: 3 },
  FF_140_DM: { promoPrice: 18900, days: 3 },
  PUBGM_325_UC: { promoPrice: 69000, days: 5 },
};

async function main() {
  console.log("Seeding games & products...");

  for (let i = 0; i < games.length; i++) {
    const g = games[i];
    const game = await prisma.game.upsert({
      where: { slug: g.slug },
      update: {
        name: g.name,
        image: g.image,
        banner: g.banner,
        description: g.description,
        category: g.category,
        fields: g.fields as Prisma.InputJsonValue,
        sortOrder: i,
      },
      create: {
        name: g.name,
        slug: g.slug,
        image: g.image,
        banner: g.banner,
        description: g.description,
        category: g.category,
        fields: g.fields as Prisma.InputJsonValue,
        sortOrder: i,
      },
    });

    for (let j = 0; j < g.products.length; j++) {
      const p = g.products[j];
      const { buyPrice, resellerPrice, agenPrice } = deriveMargins(p.sellPrice);
      const promo = PROMO_SKUS[p.sku];

      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          gameId: game.id,
          buyPrice,
          sellPrice: p.sellPrice,
          resellerPrice,
          agenPrice,
          promoPrice: promo?.promoPrice ?? null,
          promoEndDate: promo ? new Date(Date.now() + promo.days * 24 * 60 * 60 * 1000) : null,
          sortOrder: j,
        },
        create: {
          name: p.name,
          sku: p.sku,
          gameId: game.id,
          buyPrice,
          sellPrice: p.sellPrice,
          resellerPrice,
          agenPrice,
          promoPrice: promo?.promoPrice ?? null,
          promoEndDate: promo ? new Date(Date.now() + promo.days * 24 * 60 * 60 * 1000) : null,
          sortOrder: j,
        },
      });
    }
  }

  console.log("Seeding admin user...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nexoragame.id";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Nexora Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      referralCode: "NEXORAADMIN",
    },
  });

  console.log("Seeding default settings...");
  const settings: Record<string, string> = {
    site_name: "NEXORA GAME",
    whatsapp_cs: "6281234567890",
    maintenance_mode: "false",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log(`Done. Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
