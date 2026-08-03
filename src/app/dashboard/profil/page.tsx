import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-bold text-text">Profil Saya</h1>
      <ProfileForm
        initialName={user!.name}
        email={user!.email}
        initialPhone={user!.phone ?? ""}
        referralCode={user!.referralCode}
      />
    </div>
  );
}
