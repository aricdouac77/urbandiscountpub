import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "@/components/icons/social-icons";
import { NewsletterForm } from "@/features/home/components/newsletter-form";

export function SiteFooter() {
  const t = useTranslations("footer");

  const FOOTER_LINKS = {
    boutique: [
      { label: t("shopSneakers"), href: "/categories/sneakers" },
      { label: t("shopClothing"), href: "/categories/vetements" },
      { label: t("shopAccessories"), href: "/categories/accessoires" },
      { label: t("shopNewArrivals"), href: "/collections/nouveautes" },
      { label: t("shopBestSellers"), href: "/collections/meilleures-ventes" },
    ],
    aide: [
      { label: t("helpFaq"), href: "/faq" },
      { label: t("helpOrderTracking"), href: "/suivi-commande" },
      { label: t("helpShipping"), href: "/faq#livraison" },
      { label: t("helpReturns"), href: "/faq#retours" },
      { label: t("helpContact"), href: "/contact" },
    ],
    entreprise: [
      { label: t("companyAbout"), href: "/a-propos" },
      { label: t("companyBlog"), href: "/blog" },
      { label: t("companyTerms"), href: "/cgv" },
      { label: t("companyPrivacy"), href: "/politique-de-confidentialite" },
    ],
  };

  return (
    <footer className="bg-muted/40 mt-24 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight">UrbanDiscount</p>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">{t("tagline")}</p>
            <div className="mt-6">
              <p className="text-sm font-medium">{t("stayInformed")}</p>
              <p className="text-muted-foreground mt-1 mb-3 text-sm">{t("newsletterHint")}</p>
              <NewsletterForm />
            </div>
          </div>

          <FooterColumn title={t("shopTitle")} links={FOOTER_LINKS.boutique} />
          <FooterColumn title={t("helpTitle")} links={FOOTER_LINKS.aide} />
          <FooterColumn title={t("companyTitle")} links={FOOTER_LINKS.entreprise} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground"
            >
              <InstagramIcon className="size-4" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-foreground"
            >
              <FacebookIcon className="size-4" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-muted-foreground hover:text-foreground"
            >
              <TwitterIcon className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-muted-foreground hover:text-foreground text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
