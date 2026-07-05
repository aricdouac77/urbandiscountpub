import type { Metadata } from "next";
import { requireUser } from "@/lib/auth-guards";
import { ProfileForm } from "@/features/account/components/profile-form";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfilePage() {
  const session = await requireUser();

  return (
    <ProfileForm
      email={session.user.email}
      defaultValues={{ name: session.user.name, phone: session.user.phone ?? "" }}
    />
  );
}
