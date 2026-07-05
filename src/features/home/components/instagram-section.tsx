import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/social-icons";

const POSTS = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  imageUrl: `https://picsum.photos/seed/urbandiscount-insta-${i}/500/500`,
}));

export function InstagramSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">Suivez-nous sur Instagram</h2>
        <Link
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
        >
          <InstagramIcon className="size-4" />
          @urbandiscount
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {POSTS.map((post) => (
          <Link
            key={post.id}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={post.imageUrl}
              alt="Publication Instagram UrbanDiscount"
              fill
              sizes="(min-width: 640px) 16vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
