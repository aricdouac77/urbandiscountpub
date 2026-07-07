import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getBlogPosts } from "@/features/content/data/blog-posts";
import { routing, type Locale } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/faq",
  "/contact",
  "/a-propos",
  "/cgv",
  "/politique-de-confidentialite",
  "/blog",
  "/suivi-commande",
  "/connexion",
  "/inscription",
];

function localizedEntries(
  route: string,
  options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${baseUrl}/${locale}${route}`]),
  ) as Record<Locale, string>;

  return routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}${route}`,
    alternates: { languages },
    ...options,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    localizedEntries(route, {
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.6,
    }),
  );

  const productEntries: MetadataRoute.Sitemap = products.flatMap((product) =>
    localizedEntries(`/produits/${product.slug}`, {
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }),
  );

  const categoryEntries: MetadataRoute.Sitemap = categories.flatMap((category) =>
    localizedEntries(`/categories/${category.slug}`, {
      lastModified: category.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const collectionEntries: MetadataRoute.Sitemap = collections.flatMap((collection) =>
    localizedEntries(`/collections/${collection.slug}`, {
      lastModified: collection.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  return [
    ...staticEntries,
    ...productEntries,
    ...categoryEntries,
    ...collectionEntries,
    ...blogEntries,
  ];
}
