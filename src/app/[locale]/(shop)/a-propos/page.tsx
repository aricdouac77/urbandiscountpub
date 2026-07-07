import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("product");
  const locale = await getLocale();
  return {
    title: t("aboutMetaTitle"),
    description: t("aboutMetaDescription"),
    alternates: { canonical: `/${locale}/a-propos` },
  };
}

export default async function AboutPage() {
  const t = await getTranslations("product");
  return (
    <div>
      <div className="relative h-80 w-full sm:h-96">
        <Image
          src="https://picsum.photos/seed/urbandiscount-about/1600/800"
          alt={t("aboutHeroAlt")}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-5xl">
            {t("aboutHero")}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("aboutHistoryTitle")}</h2>
          <p className="text-muted-foreground">{t("aboutHistoryBody")}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("aboutQualityTitle")}</h2>
          <p className="text-muted-foreground">{t("aboutQualityBody")}</p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("aboutValuesTitle")}</h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-2">
            <li>{t("aboutValue1")}</li>
            <li>{t("aboutValue2")}</li>
            <li>{t("aboutValue3")}</li>
            <li>{t("aboutValue4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">{t("aboutQuestionTitle")}</h2>
          <p className="text-muted-foreground">{t("aboutQuestionBody")}</p>
        </section>
      </div>
    </div>
  );
}
