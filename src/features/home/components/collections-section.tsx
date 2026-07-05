import Image from "next/image";
import Link from "next/link";
import type { CollectionCardData } from "@/features/catalog/queries/get-home-sections";

export function CollectionsSection({ collections }: { collections: CollectionCardData[] }) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-semibold sm:text-3xl">Nos collections</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl"
          >
            <Image
              src={collection.imageUrl}
              alt={collection.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute bottom-5 left-5 text-lg font-semibold text-white">
              {collection.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
