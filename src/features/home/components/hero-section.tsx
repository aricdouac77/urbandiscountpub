import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden">
      <Image
        src="https://picsum.photos/seed/urbandiscount-hero/1920/1200"
        alt="Nouvelle collection UrbanDiscount"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="from-background/95 via-background/20 absolute inset-0 bg-gradient-to-t to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="text-brand mb-3 text-sm font-medium tracking-widest uppercase">
          Nouvelle collection
        </p>
        <h1 className="font-heading max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Le style urbain, sans compromis sur le prix.
        </h1>
        <p className="text-muted-foreground mt-4 max-w-md text-base">
          Sneakers, streetwear et accessoires sélectionnés pour leur qualité — à des prix qui ont du
          sens.
        </p>
        <div className="mt-8 flex gap-3">
          <Button size="lg" asChild>
            <Link href="/collections/nouveautes">Découvrir</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/collections/meilleures-ventes">Meilleures ventes</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
