import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez l'histoire et les valeurs d'UrbanDiscount.",
  alternates: { canonical: "/a-propos" },
};

export default function AboutPage() {
  return (
    <div>
      <div className="relative h-80 w-full sm:h-96">
        <Image
          src="https://picsum.photos/seed/urbandiscount-about/1600/800"
          alt="L'équipe UrbanDiscount"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
          <h1 className="font-heading text-3xl font-semibold text-white sm:text-5xl">
            Le style urbain, sans compromis
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16 text-sm leading-relaxed sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-3 text-xl font-semibold">Notre histoire</h2>
          <p className="text-muted-foreground">
            UrbanDiscount est né d&apos;un constat simple : la mode streetwear de qualité était
            devenue inaccessible pour la plupart des passionnés de sneakers et de vêtements urbains.
            Nous avons décidé de créer une boutique qui sélectionne rigoureusement chaque produit
            pour sa qualité et son design, tout en négociant directement avec les fabricants pour
            proposer des prix justes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Notre engagement qualité</h2>
          <p className="text-muted-foreground">
            Chaque référence de notre catalogue est testée par notre équipe avant d&apos;être mise
            en vente. Nous travaillons avec des matières durables et des ateliers respectueux des
            normes sociales et environnementales.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Nos valeurs</h2>
          <ul className="text-muted-foreground list-inside list-disc space-y-2">
            <li>Transparence sur nos prix et nos marges</li>
            <li>Qualité durable plutôt que mode jetable</li>
            <li>Service client réactif et humain</li>
            <li>Livraison rapide et retours simplifiés</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Une question ?</h2>
          <p className="text-muted-foreground">
            Notre équipe est disponible du lundi au vendredi pour répondre à toutes vos questions
            via notre page de contact.
          </p>
        </section>
      </div>
    </div>
  );
}
