import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="text-muted-foreground mt-2">Dernière mise à jour : janvier 2026</p>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">1. Données collectées</h2>
        <p className="text-muted-foreground">
          Nous collectons les données que vous nous transmettez directement (nom, e-mail, adresse
          postale, téléphone) lors de la création d&apos;un compte, d&apos;une commande ou
          d&apos;une prise de contact, ainsi que des données techniques liées à votre navigation.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">2. Finalités du traitement</h2>
        <p className="text-muted-foreground">
          Vos données sont utilisées pour traiter vos commandes, gérer votre compte client, vous
          contacter dans le cadre du service après-vente, et, avec votre consentement, vous adresser
          notre newsletter.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">3. Base légale</h2>
        <p className="text-muted-foreground">
          Le traitement de vos données repose sur l&apos;exécution du contrat de vente, le respect
          de nos obligations légales et, pour la newsletter, votre consentement explicite.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">4. Destinataires des données</h2>
        <p className="text-muted-foreground">
          Vos données peuvent être transmises à nos prestataires techniques (hébergement, paiement,
          livraison) strictement dans le cadre de l&apos;exécution de nos services. Nous ne vendons
          jamais vos données à des tiers.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">5. Durée de conservation</h2>
        <p className="text-muted-foreground">
          Les données liées à votre compte sont conservées pendant la durée de la relation
          commerciale, puis archivées conformément aux obligations légales de conservation comptable
          et fiscale.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">6. Vos droits</h2>
        <p className="text-muted-foreground">
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de
          suppression, de limitation et de portabilité de vos données, ainsi que d&apos;un droit
          d&apos;opposition. Vous pouvez exercer ces droits en nous contactant via notre page de
          contact.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">7. Cookies</h2>
        <p className="text-muted-foreground">
          Notre site utilise des cookies strictement nécessaires à son fonctionnement (panier,
          session, préférence de thème) ainsi que des cookies de mesure d&apos;audience, soumis à
          votre consentement.
        </p>
      </section>
    </div>
  );
}
