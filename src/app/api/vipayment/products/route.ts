import { apiOk, apiError } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/guards";
import { vipayment, VIPaymentError } from "@/lib/vipayment";

/** Admin-only: pull the live product/price catalog from VIPayment for review before syncing into our own Product table. */
export async function GET() {
  if (!(await requireAdminSession())) return apiError("Tidak diizinkan", 403);

  if (!vipayment.isConfigured()) {
    return apiError("VIPayment belum dikonfigurasi. Set VIPAYMENT_API_KEY dan VIPAYMENT_API_ID di .env", 503);
  }

  try {
    const products = await vipayment.getProducts();
    return apiOk(products);
  } catch (error) {
    if (error instanceof VIPaymentError) return apiError(error.message, 502);
    throw error;
  }
}
