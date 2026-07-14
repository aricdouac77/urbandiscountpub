import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InstagramIcon } from "@/components/icons/social-icons";

export function InstagramSection() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">{t("instagramTitle")}</h2>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
        >
          <InstagramIcon className="size-4" />
          @urbandiscount
        </Link>
      </div>
    </section>
  );
}
