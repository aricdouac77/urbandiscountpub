"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type SignOutButtonProps = Pick<ComponentProps<typeof Button>, "variant" | "className" | "size">;

export function SignOutButton({ variant = "outline", className, size }: SignOutButtonProps) {
  const router = useRouter();
  const t = useTranslations("auth");

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSignOut}>
      {t("signOut")}
    </Button>
  );
}
