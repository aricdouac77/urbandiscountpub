import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="bg-foreground text-background relative overflow-hidden rounded-2xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="px-8 py-12 sm:px-12 lg:py-20">
            <p className="text-sm font-medium tracking-widest uppercase opacity-70">
              Offre limitée
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Jusqu&apos;à -30% sur une sélection
            </h2>
            <p className="mt-3 max-w-sm opacity-80">
              Profitez de nos meilleures réductions sur les sneakers et le streetwear, tant que les
              stocks durent.
            </p>
            <Button variant="secondary" size="lg" className="mt-6" asChild>
              <Link href="/collections/soldes">Voir les soldes</Link>
            </Button>
          </div>
          <div className="relative hidden aspect-[4/3] lg:block">
            <Image
              src="https://picsum.photos/seed/urbandiscount-promo/1000/750"
              alt="Sélection en promotion"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
