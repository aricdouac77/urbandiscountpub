import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { BLOG_POSTS, getBlogPostBySlug } from "@/features/content/data/blog-posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <SiteBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

      <p className="text-brand mt-6 text-sm font-medium tracking-wide uppercase">{post.category}</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      <p className="text-muted-foreground mt-3 text-sm">
        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(post.publishedAt))}{" "}
        · {post.readingTime} de lecture
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
