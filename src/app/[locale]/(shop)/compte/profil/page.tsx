import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { requireUser } from "@/lib/auth-guards";
import { ProfileForm } from "@/features/account/components/profile-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account");
  return { title: t("profile") };
}

export default async function ProfilePage() {
  const session = await requireUser();

  return (
    <ProfileForm
      email={session.user.email}
      defaultValues={{ name: session.user.name, phone: session.user.phone ?? "" }}
    />
  );
}
