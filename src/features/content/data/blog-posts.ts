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

export const BLOG_POSTS: BlogPost[] = [
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

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}
