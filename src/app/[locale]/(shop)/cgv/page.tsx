import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  const locale = await getLocale();
  return {
    title: t("cgvTitle"),
    alternates: { canonical: `/${locale}/cgv` },
  };
}

const SECTIONS_FR = [
  {
    title: "1. Objet",
    body: "Les présentes conditions générales de vente régissent les ventes de produits réalisées sur le site UrbanDiscount entre la société UrbanDiscount et tout client particulier ou professionnel.",
  },
  {
    title: "2. Prix",
    body: "Les prix sont indiqués en euros, toutes taxes comprises. UrbanDiscount se réserve le droit de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en vigueur au moment de la validation de la commande.",
  },
  {
    title: "3. Commande",
    body: "Toute commande passée sur le site suppose l'acceptation sans réserve des présentes conditions générales de vente. La confirmation de commande vaut acceptation des présentes conditions.",
  },
  {
    title: "4. Paiement",
    body: "Le règlement s'effectue en ligne par carte bancaire, Apple Pay ou Google Pay via notre prestataire de paiement sécurisé Stripe. La commande est considérée comme validée après confirmation du paiement.",
  },
  {
    title: "5. Livraison",
    body: "Les délais de livraison sont indiqués à titre indicatif lors du passage de commande. La livraison est gratuite dès 50€ d'achat, des frais de 4,90€ s'appliquant en deçà.",
  },
  {
    title: "6. Droit de rétractation",
    body: "Conformément à la législation en vigueur, le client dispose d'un délai de 30 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motif. Les articles doivent être retournés non portés, dans leur emballage d'origine.",
  },
  {
    title: "7. Garanties",
    body: "Tous les produits vendus bénéficient de la garantie légale de conformité et de la garantie légale contre les vices cachés, conformément aux dispositions du Code de la consommation et du Code civil.",
  },
  {
    title: "8. Litiges",
    body: "En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.",
  },
] as const;

const SECTIONS_EN = [
  {
    title: "1. Purpose",
    body: "These general terms and conditions of sale govern product sales made on the UrbanDiscount website between UrbanDiscount and any individual or business customer.",
  },
  {
    title: "2. Prices",
    body: "Prices are shown in euros, all taxes included. UrbanDiscount reserves the right to change its prices at any time; products are billed based on the rates in effect at the time the order is confirmed.",
  },
  {
    title: "3. Orders",
    body: "Any order placed on the site implies unreserved acceptance of these general terms and conditions of sale. Order confirmation constitutes acceptance of these terms.",
  },
  {
    title: "4. Payment",
    body: "Payment is made online by credit card, Apple Pay or Google Pay via our secure payment provider Stripe. The order is considered confirmed once payment is confirmed.",
  },
  {
    title: "5. Shipping",
    body: "Delivery times are provided for guidance when placing an order. Shipping is free on orders over €50; a €4.90 fee applies below that.",
  },
  {
    title: "6. Right of withdrawal",
    body: "In accordance with applicable law, the customer has 30 days from receipt of their order to exercise their right of withdrawal, without having to justify a reason. Items must be returned unworn, in their original packaging.",
  },
  {
    title: "7. Warranties",
    body: "All products sold benefit from the legal warranty of conformity and the legal warranty against hidden defects, in accordance with the provisions of the Consumer Code and the Civil Code.",
  },
  {
    title: "8. Disputes",
    body: "In the event of a dispute, an amicable solution will be sought before any legal action. Failing that, French courts shall have sole jurisdiction.",
  },
] as const;

export default async function CgvPage() {
  const t = await getTranslations("legal");
  const locale = (await getLocale()) as Locale;
  const sections = locale === "en" ? SECTIONS_EN : SECTIONS_FR;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("cgvTitle")}
        </h1>
        <p className="text-muted-foreground mt-2">{t("lastUpdated")}</p>
      </div>

      {sections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-2 text-lg font-semibold">{section.title}</h2>
          <p className="text-muted-foreground">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
