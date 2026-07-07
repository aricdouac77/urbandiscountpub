import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ContactForm } from "@/features/contact/components/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("product");
  const locale = await getLocale();
  return {
    title: t("contactTitle"),
    description: t("contactMeta"),
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage() {
  const t = await getTranslations("product");
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("contactTitle")}
      </h1>
      <p className="text-muted-foreground mt-2 text-sm">{t("contactSubtitle")}</p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
