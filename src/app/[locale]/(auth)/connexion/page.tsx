import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: `${t("signInTitle")} | UrbanDiscount`,
    description: t("signInSubtitle"),
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
          <CardDescription>
            {t("noAccount")}{" "}
            <Link href="/inscription" className="text-foreground underline underline-offset-4">
              {t("createAccount")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
