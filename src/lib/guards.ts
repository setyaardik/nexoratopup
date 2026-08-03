import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the session if the caller is an ADMIN, otherwise null. */
export async function requireAdminSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}
