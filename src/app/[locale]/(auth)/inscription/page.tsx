import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: `${t("signUpTitle")} | UrbanDiscount`,
    description: t("signUpSubtitle"),
  };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t("signUpTitle")}</CardTitle>
          <CardDescription>
            {t("haveAccount")}{" "}
            <Link href="/connexion" className="text-foreground underline underline-offset-4">
              {t("signIn")}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
