import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/features/content/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, conseils d'entretien et tendances streetwear par UrbanDiscount.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Guides, conseils d&apos;entretien et tendances streetwear.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
            <div className="bg-muted relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <p className="text-brand mt-3 text-xs font-medium tracking-wide uppercase">
              {post.category}
            </p>
            <h2 className="mt-1 text-base font-medium group-hover:underline">{post.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{post.excerpt}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                new Date(post.publishedAt),
              )}{" "}
              · {post.readingTime} de lecture
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
