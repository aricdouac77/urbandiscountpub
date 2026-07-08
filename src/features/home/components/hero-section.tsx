import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden">
      <Image
        src="/images/pexels-lorenzomessinaph-6772843.jpg"
        alt={t("heroKicker")}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="from-background/95 via-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-brand mb-3 text-sm font-medium tracking-widest uppercase">
          {t("heroKicker")}
        </p>
        <h1 className="font-heading max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md text-base">{t("heroSubtitle")}</p>
        <div className="mt-8 flex gap-3">
          <Button size="lg" asChild>
            <Link href="/collections/nouveautes">{t("heroCtaPrimary")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/collections/meilleures-ventes">{t("heroCtaSecondary")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
