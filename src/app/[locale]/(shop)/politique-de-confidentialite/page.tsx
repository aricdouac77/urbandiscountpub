import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal");
  const locale = await getLocale();
  return {
    title: t("privacyTitle"),
    alternates: { canonical: `/${locale}/politique-de-confidentialite` },
  };
}

const SECTIONS_FR = [
  {
    title: "1. Données collectées",
    body: "Nous collectons les données que vous nous transmettez directement (nom, e-mail, adresse postale, téléphone) lors de la création d'un compte, d'une commande ou d'une prise de contact, ainsi que des données techniques liées à votre navigation.",
  },
  {
    title: "2. Finalités du traitement",
    body: "Vos données sont utilisées pour traiter vos commandes, gérer votre compte client, vous contacter dans le cadre du service après-vente, et, avec votre consentement, vous adresser notre newsletter.",
  },
  {
    title: "3. Base légale",
    body: "Le traitement de vos données repose sur l'exécution du contrat de vente, le respect de nos obligations légales et, pour la newsletter, votre consentement explicite.",
  },
  {
    title: "4. Destinataires des données",
    body: "Vos données peuvent être transmises à nos prestataires techniques (hébergement, paiement, livraison) strictement dans le cadre de l'exécution de nos services. Nous ne vendons jamais vos données à des tiers.",
  },
  {
    title: "5. Durée de conservation",
    body: "Les données liées à votre compte sont conservées pendant la durée de la relation commerciale, puis archivées conformément aux obligations légales de conservation comptable et fiscale.",
  },
  {
    title: "6. Vos droits",
    body: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation et de portabilité de vos données, ainsi que d'un droit d'opposition. Vous pouvez exercer ces droits en nous contactant via notre page de contact.",
  },
  {
    title: "7. Cookies",
    body: "Notre site utilise des cookies strictement nécessaires à son fonctionnement (panier, session, préférence de thème) ainsi que des cookies de mesure d'audience, soumis à votre consentement.",
  },
] as const;

const SECTIONS_EN = [
  {
    title: "1. Data collected",
    body: "We collect the data you provide us directly (name, email, postal address, phone number) when creating an account, placing an order or contacting us, as well as technical data related to your browsing.",
  },
  {
    title: "2. Purposes of processing",
    body: "Your data is used to process your orders, manage your customer account, contact you as part of after-sales service, and, with your consent, send you our newsletter.",
  },
  {
    title: "3. Legal basis",
    body: "The processing of your data is based on the performance of the sales contract, compliance with our legal obligations and, for the newsletter, your explicit consent.",
  },
  {
    title: "4. Data recipients",
    body: "Your data may be shared with our technical service providers (hosting, payment, shipping) strictly within the scope of providing our services. We never sell your data to third parties.",
  },
  {
    title: "5. Retention period",
    body: "Data related to your account is kept for the duration of the business relationship, then archived in accordance with legal accounting and tax retention obligations.",
  },
  {
    title: "6. Your rights",
    body: "In accordance with the GDPR, you have the right to access, rectify, delete, limit and port your data, as well as a right to object. You can exercise these rights by contacting us via our contact page.",
  },
  {
    title: "7. Cookies",
    body: "Our site uses cookies strictly necessary for its operation (cart, session, theme preference) as well as audience measurement cookies, subject to your consent.",
  },
] as const;

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("legal");
  const locale = (await getLocale()) as Locale;
  const sections = locale === "en" ? SECTIONS_EN : SECTIONS_FR;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("privacyTitle")}
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
