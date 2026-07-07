import type { Locale } from "@/i18n/routing";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  publishedAt: string;
  readingTime: string;
  category: string;
};

const BLOG_POSTS_FR: BlogPost[] = [
  {
    slug: "comment-bien-choisir-ses-sneakers",
    title: "Comment bien choisir ses sneakers en 2026",
    excerpt:
      "Amorti, maintien, matières : nos conseils pour choisir des sneakers adaptées à votre usage quotidien.",
    coverImage: "https://picsum.photos/seed/blog-sneakers/1200/700",
    publishedAt: "2026-01-15",
    readingTime: "5 min",
    category: "Guides",
    content: [
      "Choisir la bonne paire de sneakers ne se résume pas à une question de style. Entre l'amorti, le maintien latéral et la qualité des matières, plusieurs critères entrent en jeu pour un confort optimal au quotidien.",
      "Pour un usage urbain intensif, privilégiez une semelle en gomme durable et une tige respirante. Les modèles à mémoire de forme offrent un excellent compromis entre confort et style.",
      "Enfin, n'hésitez pas à consulter notre guide des tailles avant chaque achat : les standards varient parfois d'une marque à l'autre.",
    ],
  },
  {
    slug: "entretenir-son-hoodie-plus-longtemps",
    title: "5 astuces pour faire durer son hoodie plus longtemps",
    excerpt:
      "Lavage, séchage, rangement : les bons gestes pour préserver la qualité de vos sweats préférés.",
    coverImage: "https://picsum.photos/seed/blog-hoodie/1200/700",
    publishedAt: "2026-02-03",
    readingTime: "4 min",
    category: "Entretien",
    content: [
      "Un hoodie de qualité mérite un entretien adapté. Lavez-le à l'envers et à basse température pour préserver les couleurs et la texture du molleton.",
      "Évitez le sèche-linge autant que possible : un séchage à l'air libre limite le rétrécissement et la déformation de la coupe.",
      "Rangez vos sweats pliés plutôt que sur cintre pour éviter de déformer les épaules sur le long terme.",
    ],
  },
  {
    slug: "tendances-streetwear-2026",
    title: "Les tendances streetwear à suivre en 2026",
    excerpt:
      "Cargo pants, bombers réversibles, accessoires utilitaires : notre tour d'horizon des pièces phares de la saison.",
    coverImage: "https://picsum.photos/seed/blog-trends/1200/700",
    publishedAt: "2026-02-20",
    readingTime: "6 min",
    category: "Tendances",
    content: [
      "Le streetwear continue d'évoluer vers plus de fonctionnalité, avec des pièces inspirées du workwear et de l'outdoor.",
      "Les cargo pants techniques s'imposent comme un incontournable, tout comme les accessoires utilitaires (sacs banane, pochettes multipoches).",
      "Côté silhouettes, les coupes oversize structurées gagnent du terrain sur le total look ample, pour un rendu plus habillé.",
    ],
  },
];

const BLOG_POSTS_EN: BlogPost[] = [
  {
    slug: "comment-bien-choisir-ses-sneakers",
    title: "How to choose the right sneakers in 2026",
    excerpt:
      "Cushioning, support, materials: our tips for choosing sneakers suited to your everyday use.",
    coverImage: "https://picsum.photos/seed/blog-sneakers/1200/700",
    publishedAt: "2026-01-15",
    readingTime: "5 min",
    category: "Guides",
    content: [
      "Choosing the right pair of sneakers isn't just about style. Cushioning, lateral support and material quality all play a role in everyday comfort.",
      "For heavy urban use, favor a durable rubber sole and a breathable upper. Memory-foam models offer an excellent balance of comfort and style.",
      "Finally, don't hesitate to check our size guide before each purchase: sizing standards sometimes vary between brands.",
    ],
  },
  {
    slug: "entretenir-son-hoodie-plus-longtemps",
    title: "5 tips to make your hoodie last longer",
    excerpt:
      "Washing, drying, storage: the right habits to preserve the quality of your favorite sweatshirts.",
    coverImage: "https://picsum.photos/seed/blog-hoodie/1200/700",
    publishedAt: "2026-02-03",
    readingTime: "4 min",
    category: "Care",
    content: [
      "A quality hoodie deserves proper care. Wash it inside out at a low temperature to preserve the color and texture of the fleece.",
      "Avoid the tumble dryer as much as possible: air drying limits shrinkage and keeps the fit from deforming.",
      "Store your sweatshirts folded rather than on a hanger to avoid stretching the shoulders over time.",
    ],
  },
  {
    slug: "tendances-streetwear-2026",
    title: "Streetwear trends to watch in 2026",
    excerpt:
      "Cargo pants, reversible bombers, utility accessories: our roundup of the season's key pieces.",
    coverImage: "https://picsum.photos/seed/blog-trends/1200/700",
    publishedAt: "2026-02-20",
    readingTime: "6 min",
    category: "Trends",
    content: [
      "Streetwear keeps evolving toward more functionality, with pieces inspired by workwear and outdoor gear.",
      "Technical cargo pants are becoming a staple, as are utility accessories (belt bags, multi-pocket pouches).",
      "On the silhouette side, structured oversized cuts are gaining ground over the fully relaxed look, for a slightly more polished result.",
    ],
  },
];

export function getBlogPosts(locale: Locale) {
  return locale === "en" ? BLOG_POSTS_EN : BLOG_POSTS_FR;
}

export function getBlogPostBySlug(slug: string, locale: Locale) {
  return getBlogPosts(locale).find((post) => post.slug === slug) ?? null;
}
