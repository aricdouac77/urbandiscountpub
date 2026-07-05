import Link from "next/link";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "@/components/icons/social-icons";
import { NewsletterForm } from "@/features/home/components/newsletter-form";

const FOOTER_LINKS = {
  boutique: [
    { label: "Sneakers", href: "/categories/sneakers" },
    { label: "Vêtements", href: "/categories/vetements" },
    { label: "Accessoires", href: "/categories/accessoires" },
    { label: "Nouveautés", href: "/collections/nouveautes" },
    { label: "Meilleures ventes", href: "/collections/meilleures-ventes" },
  ],
  aide: [
    { label: "FAQ", href: "/faq" },
    { label: "Suivi de commande", href: "/suivi-commande" },
    { label: "Livraison", href: "/faq#livraison" },
    { label: "Retours", href: "/faq#retours" },
    { label: "Contact", href: "/contact" },
  ],
  entreprise: [
    { label: "À propos", href: "/a-propos" },
    { label: "Blog", href: "/blog" },
    { label: "Conditions générales de vente", href: "/cgv" },
    { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-muted/40 mt-24 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-heading text-xl font-semibold tracking-tight">UrbanDiscount</p>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm">
              Sneakers et streetwear premium à prix juste. Sélection pointue, qualité durable.
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium">Restez informé·e</p>
              <p className="text-muted-foreground mt-1 mb-3 text-sm">
                Nouveautés et offres en avant-première.
              </p>
              <NewsletterForm />
            </div>
          </div>

          <FooterColumn title="Boutique" links={FOOTER_LINKS.boutique} />
          <FooterColumn title="Aide" links={FOOTER_LINKS.aide} />
          <FooterColumn title="Entreprise" links={FOOTER_LINKS.entreprise} />
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} UrbanDiscount. Tous droits réservés.
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
