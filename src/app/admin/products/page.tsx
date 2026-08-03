import { prisma } from "@/lib/prisma";
import { ProductsTable } from "./ProductsTable";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { game: { select: { name: true } } },
    orderBy: [{ game: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text">Kelola Produk</h1>
        <p className="mt-1 text-sm text-text-muted">Atur harga jual, harga reseller/agen, dan status produk.</p>
      </div>
      <ProductsTable initialProducts={products} />
    </div>
  );
}
