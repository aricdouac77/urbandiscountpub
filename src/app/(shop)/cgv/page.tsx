import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  alternates: { canonical: "/cgv" },
};

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Conditions générales de vente
        </h1>
        <p className="text-muted-foreground mt-2">Dernière mise à jour : janvier 2026</p>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">1. Objet</h2>
        <p className="text-muted-foreground">
          Les présentes conditions générales de vente régissent les ventes de produits réalisées sur
          le site UrbanDiscount entre la société UrbanDiscount et tout client particulier ou
          professionnel.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">2. Prix</h2>
        <p className="text-muted-foreground">
          Les prix sont indiqués en euros, toutes taxes comprises. UrbanDiscount se réserve le droit
          de modifier ses prix à tout moment, les produits étant facturés sur la base des tarifs en
          vigueur au moment de la validation de la commande.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">3. Commande</h2>
        <p className="text-muted-foreground">
          Toute commande passée sur le site suppose l&apos;acceptation sans réserve des présentes
          conditions générales de vente. La confirmation de commande vaut acceptation des présentes
          conditions.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">4. Paiement</h2>
        <p className="text-muted-foreground">
          Le règlement s&apos;effectue en ligne par carte bancaire, Apple Pay ou Google Pay via
          notre prestataire de paiement sécurisé Stripe. La commande est considérée comme validée
          après confirmation du paiement.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">5. Livraison</h2>
        <p className="text-muted-foreground">
          Les délais de livraison sont indiqués à titre indicatif lors du passage de commande. La
          livraison est gratuite dès 50€ d&apos;achat, des frais de 4,90€ s&apos;appliquant en deçà.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">6. Droit de rétractation</h2>
        <p className="text-muted-foreground">
          Conformément à la législation en vigueur, le client dispose d&apos;un délai de 30 jours à
          compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir
          à justifier de motif. Les articles doivent être retournés non portés, dans leur emballage
          d&apos;origine.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">7. Garanties</h2>
        <p className="text-muted-foreground">
          Tous les produits vendus bénéficient de la garantie légale de conformité et de la garantie
          légale contre les vices cachés, conformément aux dispositions du Code de la consommation
          et du Code civil.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">8. Litiges</h2>
        <p className="text-muted-foreground">
          En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À
          défaut, les tribunaux français seront seuls compétents.
        </p>
      </section>
    </div>
  );
}
