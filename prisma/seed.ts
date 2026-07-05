import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function img(seed: string, width = 900, height = 1125) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

// ────────────────────────────────────────────────────────────
// Catégories (arborescence à deux niveaux)
// ────────────────────────────────────────────────────────────

type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  parent?: string;
};

const CATEGORIES: SeedCategory[] = [
  { name: "Sneakers", slug: "sneakers", description: "Sneakers premium à prix discount." },
  {
    name: "Running",
    slug: "sneakers-running",
    description: "Amorti et performance pour la ville comme pour le sentier.",
    parent: "sneakers",
  },
  {
    name: "Lifestyle",
    slug: "sneakers-lifestyle",
    description: "Silhouettes intemporelles pour un usage quotidien.",
    parent: "sneakers",
  },
  { name: "Vêtements", slug: "vetements", description: "Streetwear et essentiels du quotidien." },
  {
    name: "Hauts",
    slug: "vetements-hauts",
    description: "Sweats, t-shirts, chemises et vestes.",
    parent: "vetements",
  },
  {
    name: "Bas",
    slug: "vetements-bas",
    description: "Pantalons cargo, joggers et shorts techniques.",
    parent: "vetements",
  },
  {
    name: "Accessoires",
    slug: "accessoires",
    description: "Sacs, casquettes et petite maroquinerie.",
  },
];

const COLLECTIONS = [
  { name: "Nouveautés", slug: "nouveautes", isFeatured: true },
  { name: "Meilleures ventes", slug: "meilleures-ventes", isFeatured: true },
  { name: "Soldes", slug: "soldes", isFeatured: false },
  { name: "Édition limitée", slug: "edition-limitee", isFeatured: true },
] as const;

const COUPONS = [
  {
    code: "BIENVENUE10",
    type: "PERCENTAGE" as const,
    value: 10,
    minOrderTotal: null,
    maxUses: null,
  },
  {
    code: "LIVRAISON0",
    type: "FREE_SHIPPING" as const,
    value: 0,
    minOrderTotal: 30,
    maxUses: null,
  },
  {
    code: "SOLDES20",
    type: "PERCENTAGE" as const,
    value: 20,
    minOrderTotal: 80,
    maxUses: 200,
  },
  {
    code: "VIP15",
    type: "FIXED_AMOUNT" as const,
    value: 15,
    minOrderTotal: 100,
    maxUses: null,
  },
];

// ────────────────────────────────────────────────────────────
// Produits
// ────────────────────────────────────────────────────────────

type ColorDef = { name: string; hex: string };

type SeedProduct = {
  name: string;
  slug: string;
  category: string;
  collections: (typeof COLLECTIONS)[number]["slug"][];
  brand: string;
  basePrice: number;
  compareAtPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sizes: string[];
  colors?: ColorDef[];
  materials?: string;
  careInstructions?: string;
  description: string;
};

const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];

const PRODUCTS: SeedProduct[] = [
  // ── Sneakers / Running ──
  {
    name: "Runner Court Low",
    slug: "runner-court-low",
    category: "sneakers-running",
    collections: ["nouveautes", "meilleures-ventes"],
    brand: "Urban Original",
    basePrice: 89.9,
    compareAtPrice: 129.9,
    isFeatured: true,
    isBestSeller: true,
    sizes: SHOE_SIZES.slice(1, 7),
    colors: [
      { name: "Noir", hex: "#111111" },
      { name: "Blanc", hex: "#F5F5F5" },
    ],
    materials: "Tige en cuir pleine fleur, semelle en gomme durable",
    careInstructions: "Nettoyer avec un chiffon humide, ne pas laver en machine",
    description:
      "Une silhouette basse épurée en cuir pleine fleur, semelle en gomme durable et doublure respirante. Le compagnon quotidien pensé pour durer.",
  },
  {
    name: "Trail Max 2.0",
    slug: "trail-max-2-0",
    category: "sneakers-running",
    collections: ["nouveautes"],
    brand: "Urban Original",
    basePrice: 119.9,
    isNewArrival: true,
    sizes: SHOE_SIZES.slice(2, 8),
    colors: [
      { name: "Gris", hex: "#6B7280" },
      { name: "Orange", hex: "#C2410C" },
    ],
    materials: "Tige en mesh technique, semelle EVA à mémoire de forme",
    description:
      "Amorti haute performance et grip renforcé pour la ville comme pour le sentier. Tige en mesh technique et maintien latéral optimisé.",
  },
  {
    name: "Sprint Pro Knit",
    slug: "sprint-pro-knit",
    category: "sneakers-running",
    collections: ["nouveautes"],
    brand: "Urban Original",
    basePrice: 99.9,
    isNewArrival: true,
    sizes: SHOE_SIZES.slice(0, 6),
    colors: [{ name: "Bleu Marine", hex: "#1B2A4A" }],
    materials: "Tricot respirant sans couture, semelle légère",
    description:
      "Conçue pour l'entraînement intensif, la Sprint Pro Knit offre un chaussant enveloppant et une respirabilité maximale grâce à sa tige tricotée sans couture.",
  },

  // ── Sneakers / Lifestyle ──
  {
    name: "Classic Court White",
    slug: "classic-court-white",
    category: "sneakers-lifestyle",
    collections: ["meilleures-ventes"],
    brand: "Urban Original",
    basePrice: 74.9,
    isBestSeller: true,
    sizes: SHOE_SIZES.slice(0, 6),
    colors: [{ name: "Blanc", hex: "#F5F5F5" }],
    materials: "Cuir souple, coutures renforcées",
    description: "L'intemporelle sneaker blanche minimaliste. Cuir souple, coutures renforcées.",
  },
  {
    name: "Sneaker Slip-On Knit",
    slug: "sneaker-slip-on-knit",
    category: "sneakers-lifestyle",
    collections: ["soldes"],
    brand: "Urban Original",
    basePrice: 64.9,
    compareAtPrice: 89.9,
    sizes: SHOE_SIZES.slice(0, 5),
    colors: [{ name: "Noir", hex: "#111111" }],
    description:
      "Sneaker sans lacet en maille tricotée extensible, semelle légère à mémoire de forme.",
  },
  {
    name: "Retro High Top",
    slug: "retro-high-top",
    category: "sneakers-lifestyle",
    collections: ["edition-limitee"],
    brand: "Urban Original",
    basePrice: 109.9,
    compareAtPrice: 139.9,
    isFeatured: true,
    sizes: SHOE_SIZES.slice(1, 7),
    colors: [
      { name: "Bordeaux", hex: "#7C2D3E" },
      { name: "Vert Kaki", hex: "#4B5320" },
    ],
    materials: "Cuir nubuck, col matelassé",
    description:
      "Silhouette montante inspirée des classiques des années 90, en cuir nubuck avec col matelassé pour un maintien optimal de la cheville.",
  },

  // ── Vêtements / Hauts ──
  {
    name: "Hoodie Essential",
    slug: "hoodie-essential",
    category: "vetements-hauts",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 59.9,
    compareAtPrice: 79.9,
    isBestSeller: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton 400g/m², 80% coton, 20% polyester",
    careInstructions: "Lavage machine 30°C, ne pas repasser le flocage",
    description:
      "Sweat à capuche en molleton épais 400g/m², coupe oversize, poche kangourou. Le basique premium de la garde-robe urbaine.",
  },
  {
    name: "Tee Oversize Structuré",
    slug: "tee-oversize-structure",
    category: "vetements-hauts",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 34.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Coton lourd 240g/m²",
    description: "T-shirt en coton lourd 240g, coupe droite structurée, col renforcé anti-détente.",
  },
  {
    name: "Crewneck Heavyweight",
    slug: "crewneck-heavyweight",
    category: "vetements-hauts",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 54.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton gratté 380g/m²",
    description:
      "Sweat col rond épais, coupe droite, bords-côtes renforcés. Un essentiel pour la mi-saison.",
  },
  {
    name: "Chemise Overshirt Utility",
    slug: "chemise-overshirt-utility",
    category: "vetements-hauts",
    collections: ["nouveautes", "edition-limitee"],
    brand: "UrbanDiscount Label",
    basePrice: 69.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Coton sergé épais, poches plaquées",
    description:
      "Surchemise workwear en coton sergé, poches plaquées et boutonnage complet. Se porte seule ou en surcouche.",
  },
  {
    name: "Bomber Réversible",
    slug: "bomber-reversible",
    category: "vetements-hauts",
    collections: ["soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 99.9,
    compareAtPrice: 149.9,
    sizes: APPAREL_SIZES,
    materials: "Doublure rembourrée, finitions bord-côte",
    description: "Blouson bomber réversible, doublure rembourrée, finitions bord-côte premium.",
  },

  // ── Vêtements / Bas ──
  {
    name: "Cargo Pant Technique",
    slug: "cargo-pant-technique",
    category: "vetements-bas",
    collections: ["nouveautes", "soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 89.9,
    compareAtPrice: 109.9,
    isNewArrival: true,
    sizes: ["38", "40", "42", "44", "46"],
    materials: "Twill stretch, multipoches",
    description:
      "Pantalon cargo en twill stretch, multipoches, cheville resserrée, coupe contemporaine.",
  },
  {
    name: "Jogger Tapered Tech",
    slug: "jogger-tapered-tech",
    category: "vetements-bas",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 64.9,
    isBestSeller: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton technique déperlant",
    description:
      "Jogger fuselé en molleton technique déperlant, taille élastiquée, poches zippées sécurisées.",
  },
  {
    name: "Short Cargo Utility",
    slug: "short-cargo-utility",
    category: "vetements-bas",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 49.9,
    isNewArrival: true,
    sizes: ["38", "40", "42", "44"],
    description: "Short cargo multipoches en coton ripstop, ceinture ajustable, coupe relâchée.",
  },

  // ── Accessoires ──
  {
    name: "Casquette Signature",
    slug: "casquette-signature",
    category: "accessoires",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 29.9,
    isBestSeller: true,
    sizes: ["Unique"],
    description:
      "Casquette 6 panneaux en coton brossé, broderie signature, sangle ajustable laiton.",
  },
  {
    name: "Sac Banane Utility",
    slug: "sac-banane-utility",
    category: "accessoires",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 44.9,
    isNewArrival: true,
    sizes: ["Unique"],
    materials: "Nylon ripstop déperlant",
    description:
      "Sac banane en nylon ripstop déperlant, compartiments multiples, bandoulière réglable.",
  },
  {
    name: "Ceinture Cuir Signature",
    slug: "ceinture-cuir-signature",
    category: "accessoires",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 39.9,
    isNewArrival: true,
    sizes: ["S/M", "L/XL"],
    materials: "Cuir pleine fleur, boucle laiton massif",
    description: "Ceinture en cuir pleine fleur, boucle en laiton massif gravée du logo.",
  },
  {
    name: "Bonnet Côtelé",
    slug: "bonnet-cotele",
    category: "accessoires",
    collections: ["soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 24.9,
    compareAtPrice: 32.9,
    sizes: ["Unique"],
    description: "Bonnet en maille côtelée épaisse, revers double épaisseur, patch signature.",
  },
  {
    name: "Pack Chaussettes x3",
    slug: "pack-chaussettes-x3",
    category: "accessoires",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 19.9,
    isBestSeller: true,
    sizes: ["39-42", "43-46"],
    description: "Lot de 3 paires de chaussettes en coton peigné renforcé, tige mi-haute.",
  },
];

const REVIEWERS = [
  { name: "Léa M.", email: "lea.m@seed.urbandiscount.local" },
  { name: "Karim B.", email: "karim.b@seed.urbandiscount.local" },
  { name: "Sofia T.", email: "sofia.t@seed.urbandiscount.local" },
  { name: "Nathan P.", email: "nathan.p@seed.urbandiscount.local" },
  { name: "Camille R.", email: "camille.r@seed.urbandiscount.local" },
  { name: "Yanis D.", email: "yanis.d@seed.urbandiscount.local" },
] as const;

const REVIEW_COMMENTS = [
  {
    rating: 5,
    title: "Exactement comme espéré",
    comment: "Qualité au rendez-vous, coupe parfaite et livraison rapide. Je recommande.",
  },
  {
    rating: 4,
    title: "Très bon rapport qualité-prix",
    comment: "Bonne surprise pour ce prix, un détail en moins et c'était parfait.",
  },
  {
    rating: 5,
    title: "Un coup de cœur",
    comment:
      "Le produit est encore plus beau en vrai. Aucune hésitation pour la prochaine commande.",
  },
  {
    rating: 3,
    title: "Correct sans plus",
    comment: "Produit conforme à la description mais la finition pourrait être améliorée.",
  },
  {
    rating: 5,
    title: "Parfait du premier coup",
    comment: "Taille bien, matière agréable, je recommande à 100%.",
  },
] as const;

async function main() {
  console.log("Seeding database…");

  for (const coupon of COUPONS) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrderTotal: coupon.minOrderTotal,
        maxUses: coupon.maxUses,
        isActive: true,
      },
    });
  }

  const reviewerIds: string[] = [];
  for (const reviewer of REVIEWERS) {
    const user = await prisma.user.upsert({
      where: { email: reviewer.email },
      update: {},
      create: { name: reviewer.name, email: reviewer.email, emailVerified: true },
    });
    reviewerIds.push(user.id);
  }

  // Two passes: create parent categories first, then children (parentId FK).
  const categoryBySlug = new Map<string, string>();
  const topLevel = CATEGORIES.filter((c) => !c.parent);
  const children = CATEGORIES.filter((c) => c.parent);

  for (const [index, category] of topLevel.entries()) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: img(`category-${category.slug}`, 1200, 800),
        position: index,
      },
    });
    categoryBySlug.set(category.slug, record.id);
  }

  for (const [index, category] of children.entries()) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: img(`category-${category.slug}`, 1200, 800),
        position: index,
        parentId: categoryBySlug.get(category.parent!),
      },
    });
    categoryBySlug.set(category.slug, record.id);
  }

  const collectionBySlug = new Map<string, string>();
  for (const collection of COLLECTIONS) {
    const record = await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {},
      create: {
        name: collection.name,
        slug: collection.slug,
        isFeatured: collection.isFeatured,
        image: img(`collection-${collection.slug}`, 1200, 800),
      },
    });
    collectionBySlug.set(collection.slug, record.id);
  }

  for (const [productIndex, product] of PRODUCTS.entries()) {
    const colors = product.colors ?? [null];
    const variantCombinations = colors.flatMap((color) =>
      product.sizes.map((size) => ({ color, size })),
    );

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.description.slice(0, 90),
        brand: product.brand,
        status: "ACTIVE",
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        isFeatured: product.isFeatured ?? false,
        isBestSeller: product.isBestSeller ?? false,
        isNewArrival: product.isNewArrival ?? false,
        materials: product.materials,
        careInstructions: product.careInstructions,
        categoryId: categoryBySlug.get(product.category),
        collections: {
          create: product.collections.map((slug) => ({
            collection: { connect: { id: collectionBySlug.get(slug) } },
          })),
        },
        images: {
          create: [0, 1, 2].map((i) => ({
            url: img(`${product.slug}-${i}`),
            alt: `${product.name} — vue ${i + 1}`,
            position: i,
          })),
        },
        variants: {
          create: variantCombinations.map(({ color, size }, i) => ({
            sku: `${product.slug.toUpperCase()}-${color ? color.name.slice(0, 3).toUpperCase() + "-" : ""}${size}`,
            size,
            color: color?.name,
            colorHex: color?.hex,
            stock: 15 + ((productIndex + i) % 10) * 3,
            isDefault: i === 0,
          })),
        },
      },
    });

    const existingReviews = await prisma.review.count({ where: { productId: created.id } });
    if (existingReviews === 0) {
      const reviewCount = 2 + (productIndex % 4);
      for (let i = 0; i < reviewCount; i++) {
        const template = REVIEW_COMMENTS[(productIndex + i) % REVIEW_COMMENTS.length]!;
        await prisma.review.create({
          data: {
            productId: created.id,
            userId: reviewerIds[(productIndex + i) % reviewerIds.length]!,
            rating: template.rating,
            title: template.title,
            comment: template.comment,
            isVerifiedPurchase: true,
            status: "APPROVED",
          },
        });
      }
    }

    console.log(`  ✓ ${created.name} (${variantCombinations.length} variantes)`);
  }

  console.log("Seed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
