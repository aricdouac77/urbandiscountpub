import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { getBlogPosts, getBlogPostBySlug } from "@/features/content/data/blog-posts";
import { routing, type Locale } from "@/i18n/routing";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({ slug: post.slug })),
  );
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/${locale}/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const t = await getTranslations("blog");

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: t("metaTitle"), href: "/blog" }, { label: post.title }]} />

      <p className="text-brand mt-6 text-sm font-medium tracking-wide uppercase">{post.category}</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-sm">
        {new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
          dateStyle: "long",
        }).format(new Date(post.publishedAt))}{" "}
        · {t("readingTime", { time: post.readingTime })}
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Image src={post.coverImage} alt={post.title} fill priority className="object-cover" />
      </div>

      <div className="mt-8 space-y-5 text-sm leading-relaxed">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
