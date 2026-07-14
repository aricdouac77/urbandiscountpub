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
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  parent?: string;
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Sneakers",
    nameEn: "Sneakers",
    slug: "sneakers",
    description: "Sneakers premium à prix discount.",
    descriptionEn: "Premium sneakers at discount prices.",
  },
  {
    name: "Running",
    nameEn: "Running",
    slug: "sneakers-running",
    description: "Amorti et performance pour la ville comme pour le sentier.",
    descriptionEn: "Cushioning and performance for the city and the trail alike.",
    parent: "sneakers",
  },
  {
    name: "Lifestyle",
    nameEn: "Lifestyle",
    slug: "sneakers-lifestyle",
    description: "Silhouettes intemporelles pour un usage quotidien.",
    descriptionEn: "Timeless silhouettes for everyday wear.",
    parent: "sneakers",
  },
  {
    name: "Vêtements",
    nameEn: "Clothing",
    slug: "vetements",
    description: "Streetwear et essentiels du quotidien.",
    descriptionEn: "Streetwear and everyday essentials.",
  },
  {
    name: "Hauts",
    nameEn: "Tops",
    slug: "vetements-hauts",
    description: "Sweats, t-shirts, chemises et vestes.",
    descriptionEn: "Sweatshirts, t-shirts, shirts and jackets.",
    parent: "vetements",
  },
  {
    name: "Bas",
    nameEn: "Bottoms",
    slug: "vetements-bas",
    description: "Pantalons cargo, joggers et shorts techniques.",
    descriptionEn: "Cargo pants, joggers and technical shorts.",
    parent: "vetements",
  },
  {
    name: "Ensembles",
    nameEn: "Sets & Outfits",
    slug: "vetements-ensembles",
    description: "Ensembles coordonnés prêts à porter, du casual au formel.",
    descriptionEn: "Ready-to-wear coordinated sets, from casual to formal.",
    parent: "vetements",
  },
  {
    name: "Accessoires",
    nameEn: "Accessories",
    slug: "accessoires",
    description: "Sacs, casquettes et petite maroquinerie.",
    descriptionEn: "Bags, caps and small leather goods.",
  },
  {
    name: "Chaussures",
    nameEn: "Shoes",
    slug: "chaussures",
    description: "Mocassins, derbies et souliers en cuir.",
    descriptionEn: "Loafers, derbies and leather shoes.",
  },
];

const COLLECTIONS = [
  {
    name: "Nouveautés",
    nameEn: "New Arrivals",
    slug: "nouveautes",
    isFeatured: true,
    image: "/images/pexels-hangers-1850082.jpg",
  },
  {
    name: "Meilleures ventes",
    nameEn: "Best Sellers",
    slug: "meilleures-ventes",
    isFeatured: true,
    image: "/images/stocksnap-blouse-2597205_1920.jpg",
  },
  {
    name: "Soldes",
    nameEn: "Sale",
    slug: "soldes",
    isFeatured: false,
    image: "/images/pexels-lorenzomessinaph-6772843-alt.jpg",
  },
  {
    name: "Édition limitée",
    nameEn: "Limited Edition",
    slug: "edition-limitee",
    isFeatured: true,
    image: "/images/pexels-kriss-32549950.jpg",
  },
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
  nameEn: string;
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
  materialsEn?: string;
  careInstructions?: string;
  careInstructionsEn?: string;
  description: string;
  descriptionEn: string;
  /** Real product image URLs, overriding the generated picsum placeholders. */
  images?: string[];
};

const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];

const PRODUCTS: SeedProduct[] = [
  // ── Sneakers / Running ──
  {
    name: "Runner Court Low",
    nameEn: "Runner Court Low",
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
    materialsEn: "Full-grain leather upper, durable rubber sole",
    careInstructions: "Nettoyer avec un chiffon humide, ne pas laver en machine",
    careInstructionsEn: "Clean with a damp cloth, do not machine wash",
    description:
      "Une silhouette basse épurée en cuir pleine fleur, semelle en gomme durable et doublure respirante. Le compagnon quotidien pensé pour durer.",
    descriptionEn:
      "A clean low-top silhouette in full-grain leather, with a durable rubber sole and breathable lining. The everyday companion built to last.",
  },
  {
    name: "Trail Max 2.0",
    nameEn: "Trail Max 2.0",
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
    materialsEn: "Technical mesh upper, memory-foam EVA sole",
    description:
      "Amorti haute performance et grip renforcé pour la ville comme pour le sentier. Tige en mesh technique et maintien latéral optimisé.",
    descriptionEn:
      "High-performance cushioning and reinforced grip for the city and the trail alike. Technical mesh upper with optimized lateral support.",
  },
  {
    name: "Sprint Pro Knit",
    nameEn: "Sprint Pro Knit",
    slug: "sprint-pro-knit",
    category: "sneakers-running",
    collections: ["nouveautes"],
    brand: "Urban Original",
    basePrice: 99.9,
    isNewArrival: true,
    sizes: SHOE_SIZES.slice(0, 6),
    colors: [{ name: "Bleu Marine", hex: "#1B2A4A" }],
    materials: "Tricot respirant sans couture, semelle légère",
    materialsEn: "Seamless breathable knit, lightweight sole",
    description:
      "Conçue pour l'entraînement intensif, la Sprint Pro Knit offre un chaussant enveloppant et une respirabilité maximale grâce à sa tige tricotée sans couture.",
    descriptionEn:
      "Built for intensive training, the Sprint Pro Knit offers a sock-like fit and maximum breathability thanks to its seamless knit upper.",
  },

  // ── Sneakers / Lifestyle ──
  {
    name: "Classic Court White",
    nameEn: "Classic Court White",
    slug: "classic-court-white",
    category: "sneakers-lifestyle",
    collections: ["meilleures-ventes"],
    brand: "Urban Original",
    basePrice: 74.9,
    isBestSeller: true,
    sizes: SHOE_SIZES.slice(0, 6),
    colors: [{ name: "Blanc", hex: "#F5F5F5" }],
    materials: "Cuir souple, coutures renforcées",
    materialsEn: "Soft leather, reinforced stitching",
    description: "L'intemporelle sneaker blanche minimaliste. Cuir souple, coutures renforcées.",
    descriptionEn: "The timeless minimalist white sneaker. Soft leather, reinforced stitching.",
  },
  {
    name: "Sneaker Slip-On Knit",
    nameEn: "Slip-On Knit Sneaker",
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
    descriptionEn: "Laceless sneaker in stretch knit, lightweight memory-foam sole.",
  },
  {
    name: "Retro High Top",
    nameEn: "Retro High Top",
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
    materialsEn: "Nubuck leather, padded collar",
    description:
      "Silhouette montante inspirée des classiques des années 90, en cuir nubuck avec col matelassé pour un maintien optimal de la cheville.",
    descriptionEn:
      "A high-top silhouette inspired by '90s classics, in nubuck leather with a padded collar for optimal ankle support.",
  },

  // ── Vêtements / Hauts ──
  {
    name: "Hoodie Essential",
    nameEn: "Essential Hoodie",
    slug: "hoodie-essential",
    category: "vetements-hauts",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 59.9,
    compareAtPrice: 79.9,
    isBestSeller: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton 400g/m², 80% coton, 20% polyester",
    materialsEn: "400g/m² fleece, 80% cotton, 20% polyester",
    careInstructions: "Lavage machine 30°C, ne pas repasser le flocage",
    careInstructionsEn: "Machine wash at 30°C, do not iron over the print",
    description:
      "Sweat à capuche en molleton épais 400g/m², coupe oversize, poche kangourou. Le basique premium de la garde-robe urbaine.",
    descriptionEn:
      "Hoodie in thick 400g/m² fleece, oversized fit, kangaroo pocket. The premium basic of the urban wardrobe.",
  },
  {
    name: "Tee Oversize Structuré",
    nameEn: "Structured Oversize Tee",
    slug: "tee-oversize-structure",
    category: "vetements-hauts",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 34.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Coton lourd 240g/m²",
    materialsEn: "240g/m² heavyweight cotton",
    description: "T-shirt en coton lourd 240g, coupe droite structurée, col renforcé anti-détente.",
    descriptionEn:
      "T-shirt in 240g heavyweight cotton, structured straight fit, reinforced collar that won't stretch out.",
  },
  {
    name: "Crewneck Heavyweight",
    nameEn: "Heavyweight Crewneck",
    slug: "crewneck-heavyweight",
    category: "vetements-hauts",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 54.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton gratté 380g/m²",
    materialsEn: "380g/m² brushed fleece",
    description:
      "Sweat col rond épais, coupe droite, bords-côtes renforcés. Un essentiel pour la mi-saison.",
    descriptionEn:
      "Thick crewneck sweatshirt, straight fit, reinforced ribbing. A mid-season essential.",
  },
  {
    name: "Chemise Overshirt Utility",
    nameEn: "Utility Overshirt",
    slug: "chemise-overshirt-utility",
    category: "vetements-hauts",
    collections: ["nouveautes", "edition-limitee"],
    brand: "UrbanDiscount Label",
    basePrice: 69.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Coton sergé épais, poches plaquées",
    materialsEn: "Heavy cotton twill, patch pockets",
    description:
      "Surchemise workwear en coton sergé, poches plaquées et boutonnage complet. Se porte seule ou en surcouche.",
    descriptionEn:
      "Workwear overshirt in cotton twill, patch pockets and full button-through front. Worn alone or as a layering piece.",
  },
  {
    name: "Bomber Réversible",
    nameEn: "Reversible Bomber",
    slug: "bomber-reversible",
    category: "vetements-hauts",
    collections: ["soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 99.9,
    compareAtPrice: 149.9,
    sizes: APPAREL_SIZES,
    materials: "Doublure rembourrée, finitions bord-côte",
    materialsEn: "Padded lining, ribbed trims",
    description: "Blouson bomber réversible, doublure rembourrée, finitions bord-côte premium.",
    descriptionEn: "Reversible bomber jacket, padded lining, premium ribbed trims.",
  },

  // ── Vêtements / Ensembles ──
  {
    name: "Ensemble Formel Été Premium",
    nameEn: "The Summer Formals Men Set — Premium",
    slug: "ensemble-formel-ete-premium",
    category: "vetements-ensembles",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 134.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    colors: [
      { name: "Blanc", hex: "#F5F5F5" },
      { name: "Beige", hex: "#D8C9AE" },
    ],
    materials: "Chemise oxford texturée, pantalon lin-coton",
    materialsEn: "Textured oxford shirt, linen-cotton pants",
    description:
      "Ensemble chemise oxford texturée et pantalon en lin-coton, taillé pour le bureau comme les événements formels.",
    descriptionEn:
      "Textured oxford shirt paired with linen-cotton pants, cut for the office and formal events alike.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2026-06-05at3.06.05PM_b2845d9d-7791-44fb-9e70-14f4e0171efd.jpg?v=1781776066",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2026-06-05at3.04.30PM.png?v=1780659511",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2026-06-05at3.32.18PM.png?v=1780659512",
    ],
  },
  {
    name: "Ensemble Coordonné Weekend",
    nameEn: "The Weekend Co-ord Set",
    slug: "ensemble-coordonne-weekend",
    category: "vetements-ensembles",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 99.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    colors: [{ name: "Noir", hex: "#111111" }],
    materials: "Coton texturé premium",
    materialsEn: "Premium textured cotton",
    description:
      "Ensemble coordonné en coton texturé premium, pensé pour les brunchs et sorties du soir.",
    descriptionEn: "Premium textured cotton co-ord set, made for brunches and dinner dates.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/Weekend_Linen_Sets_Men.jpg?v=1766734399",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-09-29at11.08.22AM.png?v=1763625125",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-09-29at11.09.33AM.png?v=1766734399",
    ],
  },
  {
    name: "Ensemble Col Mao en Lin",
    nameEn: "Linen Ban Collar Co-ord Set",
    slug: "ensemble-col-mao-lin",
    category: "vetements-ensembles",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 99.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    colors: [{ name: "Sable", hex: "#C2B280" }],
    materials: "Lin premium texturé",
    materialsEn: "Premium textured linen",
    description:
      "Ensemble col Mao en lin premium, tenue idéale pour la plage et les destinations resort.",
    descriptionEn: "Premium linen ban-collar set, an ideal beach and resort outfit.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/5_546c45f2-810e-4454-8145-4e2d7f04a260.jpg?v=1775399560",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/2_b92b3e9b-13ee-4638-949b-3e90a52b3bca.jpg?v=1775399560",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/4_90316d74-972b-4d48-8008-e5b5eb421a92.jpg?v=1775399560",
    ],
  },
  {
    name: "Duo Denim Classique",
    nameEn: "Men's Denim Classic Duo",
    slug: "duo-denim-classique",
    category: "vetements-ensembles",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 98.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    colors: [
      { name: "Noir", hex: "#111111" },
      { name: "Bleu Glacier", hex: "#A9C4D8" },
    ],
    materials: "Denim et lin coupe slim",
    materialsEn: "Slim-fit denim and linen",
    description:
      "Duo chemise et jean coupe slim en denim et lin, pour sortir en club ou enchaîner les brunchs d'hiver.",
    descriptionEn:
      "Slim-fit shirt and jean duo in denim and linen, ready for a night out or winter brunches.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-11-18at5.40.44PM.png?v=1763538078",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-11-18at5.40.jpg?v=1763540859",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-11-19at12.14.39PM.png?v=1763540859",
    ],
  },
  {
    name: "Chemise Rayée & Pantalon Lin",
    nameEn: "Stripe Shirt & Linen Pants",
    slug: "chemise-rayee-pantalon-lin",
    category: "vetements-ensembles",
    collections: ["nouveautes", "edition-limitee"],
    brand: "UrbanDiscount Label",
    basePrice: 112.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Tissu premium rayé, lin",
    materialsEn: "Premium striped fabric, linen",
    description:
      "Chemise rayée en tissu premium à associer à un pantalon en lin, jean ou chino selon l'occasion.",
    descriptionEn:
      "Premium striped shirt to pair with linen pants, jeans or chinos depending on the occasion.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/set2.jpg?v=1768157734",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/set3grey_black.jpg?v=1768157734",
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/set4beige_beigelinen.jpg?v=1768157734",
    ],
  },
  {
    name: "Ensemble Premium & Chemises",
    nameEn: "Premium Co-ords & Shirts",
    slug: "ensemble-premium-chemises",
    category: "vetements-ensembles",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 104.9,
    isNewArrival: true,
    sizes: APPAREL_SIZES,
    materials: "Tissu premium",
    materialsEn: "Premium fabric",
    description:
      "Chemise en tissu premium à porter avec un jean, un pantalon en lin ou un chino pour un look polyvalent.",
    descriptionEn:
      "Premium fabric shirt to wear with jeans, linen pants or chinos for a versatile look.",
    images: [
      "https://cdn.shopify.com/s/files/1/0840/1390/8249/files/ScreenShot2025-11-16at2.59.24PM.png?v=1763638014",
    ],
  },

  // ── Vêtements / Bas ──
  {
    name: "Cargo Pant Technique",
    nameEn: "Technical Cargo Pant",
    slug: "cargo-pant-technique",
    category: "vetements-bas",
    collections: ["nouveautes", "soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 89.9,
    compareAtPrice: 109.9,
    isNewArrival: true,
    sizes: ["38", "40", "42", "44", "46"],
    materials: "Twill stretch, multipoches",
    materialsEn: "Stretch twill, multiple pockets",
    description:
      "Pantalon cargo en twill stretch, multipoches, cheville resserrée, coupe contemporaine.",
    descriptionEn:
      "Cargo pants in stretch twill, multiple pockets, tapered ankle, contemporary fit.",
  },
  {
    name: "Jogger Tapered Tech",
    nameEn: "Tapered Tech Jogger",
    slug: "jogger-tapered-tech",
    category: "vetements-bas",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 64.9,
    isBestSeller: true,
    sizes: APPAREL_SIZES,
    materials: "Molleton technique déperlant",
    materialsEn: "Water-repellent technical fleece",
    description:
      "Jogger fuselé en molleton technique déperlant, taille élastiquée, poches zippées sécurisées.",
    descriptionEn:
      "Tapered joggers in water-repellent technical fleece, elastic waistband, secure zip pockets.",
  },
  {
    name: "Short Cargo Utility",
    nameEn: "Utility Cargo Short",
    slug: "short-cargo-utility",
    category: "vetements-bas",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 49.9,
    isNewArrival: true,
    sizes: ["38", "40", "42", "44"],
    description: "Short cargo multipoches en coton ripstop, ceinture ajustable, coupe relâchée.",
    descriptionEn:
      "Multi-pocket cargo shorts in cotton ripstop, adjustable waist, relaxed fit.",
  },

  // ── Accessoires ──
  {
    name: "Casquette Signature",
    nameEn: "Signature Cap",
    slug: "casquette-signature",
    category: "accessoires",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 29.9,
    isBestSeller: true,
    sizes: ["Unique"],
    description:
      "Casquette 6 panneaux en coton brossé, broderie signature, sangle ajustable laiton.",
    descriptionEn:
      "6-panel cap in brushed cotton, signature embroidery, adjustable brass strap.",
  },
  {
    name: "Sac Banane Utility",
    nameEn: "Utility Belt Bag",
    slug: "sac-banane-utility",
    category: "accessoires",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 44.9,
    isNewArrival: true,
    sizes: ["Unique"],
    materials: "Nylon ripstop déperlant",
    materialsEn: "Water-repellent ripstop nylon",
    description:
      "Sac banane en nylon ripstop déperlant, compartiments multiples, bandoulière réglable.",
    descriptionEn:
      "Belt bag in water-repellent ripstop nylon, multiple compartments, adjustable strap.",
  },
  {
    name: "Ceinture Cuir Signature",
    nameEn: "Signature Leather Belt",
    slug: "ceinture-cuir-signature",
    category: "accessoires",
    collections: ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice: 39.9,
    isNewArrival: true,
    sizes: ["S/M", "L/XL"],
    materials: "Cuir pleine fleur, boucle laiton massif",
    materialsEn: "Full-grain leather, solid brass buckle",
    description: "Ceinture en cuir pleine fleur, boucle en laiton massif gravée du logo.",
    descriptionEn: "Full-grain leather belt, solid brass buckle engraved with the logo.",
  },
  {
    name: "Bonnet Côtelé",
    nameEn: "Ribbed Beanie",
    slug: "bonnet-cotele",
    category: "accessoires",
    collections: ["soldes"],
    brand: "UrbanDiscount Label",
    basePrice: 24.9,
    compareAtPrice: 32.9,
    sizes: ["Unique"],
    description: "Bonnet en maille côtelée épaisse, revers double épaisseur, patch signature.",
    descriptionEn: "Beanie in thick ribbed knit, double-thickness cuff, signature patch.",
  },
  {
    name: "Pack Chaussettes x3",
    nameEn: "3-Pack Socks",
    slug: "pack-chaussettes-x3",
    category: "accessoires",
    collections: ["meilleures-ventes"],
    brand: "UrbanDiscount Label",
    basePrice: 19.9,
    isBestSeller: true,
    sizes: ["39-42", "43-46"],
    description: "Lot de 3 paires de chaussettes en coton peigné renforcé, tige mi-haute.",
    descriptionEn: "Set of 3 pairs of socks in reinforced combed cotton, mid-calf length.",
  },
];

// ────────────────────────────────────────────────────────────
// Import en masse — collection "Ensembles & vêtements homme"
// ────────────────────────────────────────────────────────────

type ProductKind =
  | "sweatshirt"
  | "hoodie"
  | "jacket"
  | "tee"
  | "polo"
  | "denim-shirt"
  | "shirt"
  | "jean"
  | "denim-pant"
  | "denim-short"
  | "chino-short"
  | "chino-pant"
  | "jogger"
  | "cargo"
  | "set"
  | "loafer";

const KIND_TEMPLATES: Record<
  ProductKind,
  { category: string; sizes: string[]; fr: string; en: string; materialFr: string; materialEn: string }
> = {
  sweatshirt: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Sweat en molleton doux, coupe confortable pour un usage quotidien.",
    en: "Sweatshirt in soft fleece, comfortable fit for everyday wear.",
    materialFr: "Molleton coton",
    materialEn: "Cotton fleece",
  },
  hoodie: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Hoodie coupe slim en molleton doux, capuche doublée et poche kangourou.",
    en: "Slim-fit hoodie in soft fleece, lined hood and kangaroo pocket.",
    materialFr: "Molleton gratté",
    materialEn: "Brushed fleece",
  },
  jacket: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Veste en suédine, doublure intérieure et coupe structurée pour la mi-saison.",
    en: "Faux suede jacket, inner lining and structured fit for mid-season wear.",
    materialFr: "Suédine, doublure intérieure",
    materialEn: "Faux suede, inner lining",
  },
  tee: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "T-shirt oversize imprimé, coton doux et coupe décontractée.",
    en: "Printed oversize t-shirt, soft cotton and relaxed fit.",
    materialFr: "Coton peigné",
    materialEn: "Combed cotton",
  },
  polo: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Polo en piqué de coton, coupe ajustée pour un look soigné.",
    en: "Cotton piqué polo, fitted cut for a polished look.",
    materialFr: "Piqué de coton",
    materialEn: "Cotton piqué",
  },
  "denim-shirt": {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Chemise en denim souple, coupe droite, boutonnage complet.",
    en: "Soft denim shirt, straight fit, full button-through front.",
    materialFr: "Denim souple",
    materialEn: "Soft denim",
  },
  shirt: {
    category: "vetements-hauts",
    sizes: APPAREL_SIZES,
    fr: "Chemise coupe ajustée, tissu premium respirant.",
    en: "Fitted shirt, premium breathable fabric.",
    materialFr: "Tissu premium",
    materialEn: "Premium fabric",
  },
  jean: {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44", "46"],
    fr: "Jean coupe slim, denim stretch pour plus de liberté de mouvement.",
    en: "Slim-fit jeans, stretch denim for ease of movement.",
    materialFr: "Denim stretch",
    materialEn: "Stretch denim",
  },
  "denim-pant": {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44", "46"],
    fr: "Pantalon en denim, coupe droite et finitions soignées.",
    en: "Denim pants, straight cut and clean finishing.",
    materialFr: "Denim",
    materialEn: "Denim",
  },
  "denim-short": {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44"],
    fr: "Short en denim, coupe décontractée pour les journées chaudes.",
    en: "Denim shorts, relaxed fit for warm days.",
    materialFr: "Denim",
    materialEn: "Denim",
  },
  "chino-short": {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44"],
    fr: "Short chino en coton, coupe droite, ceinture ajustable.",
    en: "Cotton chino shorts, straight fit, adjustable waist.",
    materialFr: "Coton",
    materialEn: "Cotton",
  },
  "chino-pant": {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44", "46"],
    fr: "Pantalon chino en coton, coupe droite, polyvalent du bureau au weekend.",
    en: "Cotton chino pants, straight fit, versatile from office to weekend.",
    materialFr: "Coton",
    materialEn: "Cotton",
  },
  jogger: {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44", "46"],
    fr: "Jogger coupe fuselée, taille élastiquée et poches zippées.",
    en: "Tapered joggers, elastic waistband and zip pockets.",
    materialFr: "Molleton technique",
    materialEn: "Technical fleece",
  },
  cargo: {
    category: "vetements-bas",
    sizes: ["38", "40", "42", "44", "46"],
    fr: "Pantalon cargo multipoches, coupe relâchée, tissu résistant.",
    en: "Multi-pocket cargo pants, relaxed fit, durable fabric.",
    materialFr: "Coton ripstop",
    materialEn: "Ripstop cotton",
  },
  set: {
    category: "vetements-ensembles",
    sizes: APPAREL_SIZES,
    fr: "Ensemble coordonné imprimé, haut et bas assortis pour un look complet.",
    en: "Printed coordinated set, matching top and bottom for a complete look.",
    materialFr: "Coton imprimé",
    materialEn: "Printed cotton",
  },
  loafer: {
    category: "chaussures",
    sizes: SHOE_SIZES,
    fr: "Mocassin en suède naturel, semelle souple et légère.",
    en: "Natural suede loafer, flexible and lightweight sole.",
    materialFr: "Suède naturel",
    materialEn: "Natural suede",
  },
};

type RawImportItem = {
  title: string;
  titleEn: string;
  kind: ProductKind;
  priceAED: number;
  discountPct?: number;
  image: string;
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toEuroPrice(priceAED: number) {
  const rounded = Math.floor(priceAED) + (priceAED % 1 >= 0.5 ? 0.5 : 0) || priceAED;
  return Number.isInteger(rounded) ? rounded - 0.1 : rounded;
}

const RAW_IMPORT: RawImportItem[] = [
  { title: "Mocassin Old Money en Suède", titleEn: "Old Money Suede Loafers", kind: "loafer", priceAED: 145.0, image: "files/IMG_2136.jpg" },
  { title: "Jean Coupe Slim Cropped - Délavé Vintage", titleEn: "Slim Cropped Fit Jeans - Vintage Wash", kind: "jean", priceAED: 65.5, image: "files/ScreenShot2026-06-07at1.27.16PM.png" },
  { title: "Short en Jean Homme - Lot de 2", titleEn: "Men Denim Jorts/Shorts - Buy2Get1", kind: "denim-short", priceAED: 65.0, image: "files/FinalDirtyBlue.jpg" },

  { title: "Sweat Parental Advisory - Noir", titleEn: "Parental Advisory Sweatshirt - Black", kind: "sweatshirt", priceAED: 70.0, image: "products/1706.jpg" },
  { title: "Sweat Imprimé All Over - Bleu Marine", titleEn: "All Over Printed Dark Blue Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/image_c1761983-004f-4ed2-a1e9-ee0e25fdbcb8.jpg" },
  { title: "Sweat Imprimé All Over - Bordeaux", titleEn: "All Over Printed Maroon Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/1709.jpg" },
  { title: "Veste en Suédine - Noire", titleEn: "Faux Suede Leather Jacket - Black", kind: "jacket", priceAED: 75.0, image: "products/362.jpg" },
  { title: "Veste en Suédine - Caramel", titleEn: "Faux Suede Leather Jacket Caramel - 40% Off", kind: "jacket", priceAED: 45.0, discountPct: 40, image: "products/358.jpg" },
  { title: "Hoodie Slim Fit Vibing On Music", titleEn: "Vibing On Music Slim Fit Hoodie", kind: "hoodie", priceAED: 70.0, image: "products/0508_739539ed-58b5-4fb7-82bb-1c25aeb0af3c.jpg" },
  { title: "Hoodie Slim Fit Team Green", titleEn: "Team Green Slim Fit Hoodie", kind: "hoodie", priceAED: 65.0, image: "products/0511.jpg" },
  { title: "Hoodie Slim Fit Black Not Over", titleEn: "Black Not Over Slim Fit Hoodie", kind: "hoodie", priceAED: 65.0, image: "products/0512.jpg" },
  { title: "Sweat Basique Gris", titleEn: "Basic Sweatshirt Grey", kind: "sweatshirt", priceAED: 65.0, image: "products/0475.jpg" },
  { title: "Sweat Gris Essentiel", titleEn: "Basic Grey Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/1636.jpg" },
  { title: "Veste en Suédine - Olive", titleEn: "Faux Suede Leather Jacket - Olive", kind: "jacket", priceAED: 75.0, image: "products/360.jpg" },
  { title: "Pantalon Chino Vert Olive", titleEn: "Chino Pants Olive Green - 0553", kind: "chino-pant", priceAED: 29.0, image: "products/0553_590c0469-7adf-4d3a-ba40-370a8fa927e1.jpg" },
  { title: "Pantalon Chino Noir", titleEn: "Chino Pants Black - 0554", kind: "chino-pant", priceAED: 59.0, image: "products/0554.jpg" },
  { title: "Polo Black Rose", titleEn: "Black Rose Polo Shirt - 0655", kind: "polo", priceAED: 75.0, image: "products/image_4b37ff8d-628f-4db5-8806-23e81641e8ca.jpg" },
  { title: "Jean Déchiré Bleu Moyen", titleEn: "Mid Blue Ripped Jeans -DEPA.0748", kind: "jean", priceAED: 49.0, image: "products/0748.jpg" },
  { title: "Jogger Motif Imprimé", titleEn: "Patterned Jogger Trouser", kind: "jogger", priceAED: 85.0, image: "products/c_1.jpg" },
  { title: "T-Shirt Oversize Col Montant Half Paint", titleEn: "High Neck Oversize Half Paint T-Shirt", kind: "tee", priceAED: 67.0, image: "products/image_1f923fb4-1223-424f-a2bf-a13ff51d8cc8.jpg" },
  { title: "T-Shirt Oversize Imprimé - Jaune", titleEn: "Oversize Selected Print T-Shirt Yellow - 50% Off", kind: "tee", priceAED: 37.5, discountPct: 50, image: "products/image_0a586e5e-fe0a-44ed-acd2-c6867c50074c.jpg" },
  { title: "Jogger Zippé Gris Chiné", titleEn: "Heather Grey Zip Slim Fit Jogger Pants", kind: "jogger", priceAED: 75.0, image: "products/0332_e82b4d80-bb0e-4c58-a97b-35b94ad6e697.jpg" },

  { title: "Jean Carrot Bleu Encre", titleEn: "Carrot Blue Jeans Ink Blue - 0228", kind: "jean", priceAED: 67.0, image: "products/0228.jpg" },
  { title: "Pantalon en Denim - DP230", titleEn: "DP230", kind: "denim-pant", priceAED: 89.0, image: "products/dp230.jpg" },
  { title: "Pantalon en Denim - DP245", titleEn: "DP245", kind: "denim-pant", priceAED: 65.0, image: "products/Dp245.jpg" },
  { title: "Jean Gris Foncé", titleEn: "Dark Grey Denim Jeans - 0249", kind: "jean", priceAED: 87.0, image: "products/0249a.jpg" },
  { title: "Short en Jean Délavé - Noir", titleEn: "Black Faded - Slim Fit Denim Shorts", kind: "denim-short", priceAED: 55.0, image: "products/black.jpg" },
  { title: "Short en Jean Délavé - Gris", titleEn: "Grey Bleach Wash - Slim Fit Denim Shorts", kind: "denim-short", priceAED: 55.0, image: "products/0279a.jpg" },
  { title: "Chemise en Denim - Gris", titleEn: "Denim Shirt - Grey", kind: "denim-shirt", priceAED: 75.0, image: "products/0292.jpg" },
  { title: "Chemise en Denim - Bleu Classique", titleEn: "Denim Shirt - Classic Blue", kind: "denim-shirt", priceAED: 75.0, image: "products/0293.jpg" },
  { title: "Chemise en Denim - Noire", titleEn: "Denim Shirt - Black", kind: "denim-shirt", priceAED: 75.0, image: "products/0294.jpg" },
  { title: "Chemise Slim Fit Gris Taupe", titleEn: "Slim Fit Shirt - Mud Grey", kind: "shirt", priceAED: 99.0, image: "products/0305.jpg" },
  { title: "Chemise en Denim - Bleu Clair", titleEn: "Denim Shirt - Light Blue", kind: "denim-shirt", priceAED: 75.0, image: "products/0370.jpg" },
  { title: "Chemise en Denim - Bleu Sale", titleEn: "Denim Shirt - Dirty Blue", kind: "denim-shirt", priceAED: 75.0, image: "products/0371.jpg" },
  { title: "Chemise en Denim - Bleu Oxford", titleEn: "Denim Shirt - Oxford Blue", kind: "denim-shirt", priceAED: 80.0, image: "products/0375.jpg" },
  { title: "Short Chino - Moutarde", titleEn: "Chino Shorts - Mustard", kind: "chino-short", priceAED: 45.0, image: "products/Mustard.jpg" },
  { title: "Short Chino - Vert Olive", titleEn: "Chino Shorts - Olive Green", kind: "chino-short", priceAED: 45.0, image: "products/olivegreen_2076f825-5a6c-487e-a209-61ced335beca.jpg" },
  { title: "Pantalon en Denim Uni - Bleu Glacier", titleEn: "Denim Pant Plain - Ice Blue / 0430", kind: "denim-pant", priceAED: 40.0, image: "products/430.jpg" },
  { title: "Pantalon en Denim - Gris Clair", titleEn: "Denim Pant - Light Grey / 0433", kind: "denim-pant", priceAED: 87.0, image: "products/0433.jpg" },
  { title: "Pantalon en Denim Slim - Noir Jais", titleEn: "Denim Pant Slim Fit - Jet Black / 0439", kind: "denim-pant", priceAED: 62.0, image: "products/0439.jpg" },
  { title: "Pantalon en Denim Délavé - Bleu Sale", titleEn: "Denim Pant Faded - Dirty Blue / 0447", kind: "denim-pant", priceAED: 87.0, image: "products/447.jpg" },
  { title: "Sweat Basique Laine & Coton", titleEn: "Wool & Cotton Basic Sweatshirt", kind: "sweatshirt", priceAED: 50.0, image: "products/0474.jpg" },
  { title: "Pantalon Chino Gris", titleEn: "Chino Pants Grey - 0552", kind: "chino-pant", priceAED: 29.0, image: "products/0552.jpg" },
  { title: "Pantalon Cargo Camouflage Gris", titleEn: "Cargo Pants - Grey Camouflage", kind: "cargo", priceAED: 55.0, image: "products/529.jpg" },
  { title: "Pantalon Cargo Camouflage Vert", titleEn: "Cargo Pants - Camouflage Green", kind: "cargo", priceAED: 55.0, image: "products/384_bd61919e-6228-4f50-8ee8-ad08ca0849e1.jpg" },
  { title: "Ensemble Imprimé Coordonné", titleEn: "Printed Sets - PRSE584", kind: "set", priceAED: 65.0, image: "products/IMG_6324.jpg" },
  { title: "Jogger en Denim - Bleu Foncé", titleEn: "Denim Jogger Dark Blue - 0638", kind: "jogger", priceAED: 75.0, image: "products/0638.jpg" },
  { title: "Jogger en Denim - Bleu Moyen", titleEn: "Denim Jogger Mid Blue - 0639", kind: "jogger", priceAED: 75.0, image: "products/0639.jpg" },
  { title: "Jogger en Denim - Bleu Clair", titleEn: "Denim Jogger Light Blue - 0641", kind: "jogger", priceAED: 75.0, image: "products/0641.jpg" },

  { title: "Sweat Logo Embossé Vert", titleEn: "Green Embossed Logo Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/0773.jpg" },
  { title: "Sweat Polaire à Carreaux Noir & Rouge", titleEn: "Black & Red Check Fleece Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/0774.jpg" },
  { title: "Sweat Vintage Bleu Foncé", titleEn: "Dark Blue Vintage Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/0775.jpg" },
  { title: "Sweat Polaire Patch Cuir - Bleu Foncé", titleEn: "Fleece With Leather Patch Sweatshirt - Dark Blue", kind: "sweatshirt", priceAED: 75.0, image: "products/0776.jpg" },
  { title: "Sweat Polaire Patch Cuir", titleEn: "Fleece Sweatshirt With Leather Patch", kind: "sweatshirt", priceAED: 65.0, image: "products/0778.jpg" },
  { title: "Sweat Anthracite", titleEn: "Charcoal Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/0779.jpg" },
  { title: "Sweat Nomadic Journey Vert", titleEn: "Nomadic Journey Green Sweatshirt", kind: "sweatshirt", priceAED: 65.0, image: "products/0780.jpg" },
  { title: "T-Shirt American - Blanc", titleEn: "American T-Shirts - White 0786", kind: "tee", priceAED: 39.0, image: "products/0786.jpg" },
  { title: "T-Shirt Oversize - Blanc", titleEn: "Oversize T-Shirts - White 0787", kind: "tee", priceAED: 29.0, image: "products/0787.jpg" },
  { title: "T-Shirt American - Noir", titleEn: "American T-Shirts - Black 0792", kind: "tee", priceAED: 39.0, image: "products/0792.jpg" },
  { title: "T-Shirt Oversize Rick Waves", titleEn: "Rick Waves Oversize T-Shirts", kind: "tee", priceAED: 45.0, image: "products/0794.jpg" },
  { title: "T-Shirt Oversize - Blanc 0801", titleEn: "Oversize T-Shirts - White 0801", kind: "tee", priceAED: 45.0, image: "products/0801.jpg" },
  { title: "T-Shirt Poche Colorblock", titleEn: "Blocked Front pocket Tee - 1416", kind: "tee", priceAED: 45.0, image: "products/1416.jpg" },
  { title: "T-Shirt Poche Gris", titleEn: "Grey Front Pocket Tee - 1418", kind: "tee", priceAED: 45.0, image: "products/6_9ceeb888-d5d5-448f-8078-9ba19b2e6d2b.jpg" },
  { title: "Jogger Gris Chiné", titleEn: "Heather Grey Slim Fit Jogger Pant", kind: "jogger", priceAED: 55.0, image: "products/2040.jpg" },
  { title: "Short en Jean Vert", titleEn: "Denim Shorts - Green 2055", kind: "denim-short", priceAED: 55.0, image: "products/2055.jpg" },
  { title: "Short en Jean Déchiré Blanc", titleEn: "Denim Shorts Ripped - White", kind: "denim-short", priceAED: 55.0, image: "products/0682.jpg" },
  { title: "Short Chino - Orange Clair", titleEn: "Chino Shorts - Light Orange", kind: "chino-short", priceAED: 55.0, image: "products/lightorange.jpg" },
  { title: "Short Chino - Vert Nuit", titleEn: "Chino Shorts - Night Green", kind: "chino-short", priceAED: 55.0, image: "products/nightgreen.jpg" },
  { title: "Chemise en Denim - Bleu Enfer", titleEn: "Denim Shirt - Hell Blue", kind: "denim-shirt", priceAED: 75.0, image: "products/0373.jpg" },
  { title: "Chemise en Denim - Bleu Encre", titleEn: "Denim Shirt - Ink Blue", kind: "denim-shirt", priceAED: 80.0, image: "products/2063.jpg" },
  { title: "Chemise en Denim - Bleu Foncé 2066", titleEn: "Denim Shirt Dark Blue - 2066", kind: "denim-shirt", priceAED: 80.0, image: "products/2066.jpg" },
  { title: "T-Shirt Oversize Imprimé Clipper", titleEn: "Oversize Clipper Printed T-Shirt - 40% Off", kind: "tee", priceAED: 51.0, discountPct: 40, image: "files/yaleblueb.jpg" },

  { title: "Sweat LCOST x KEITH", titleEn: "LCOST x KEITH Sweatshirt - 50% Off", kind: "sweatshirt", priceAED: 47.0, discountPct: 50, image: "files/image_9b54121d-b87b-4758-929b-b75e96032447.jpg" },
  { title: "Sweat Griffé Bleu", titleEn: "Branded Sweatshirt Blue - 50% Off", kind: "sweatshirt", priceAED: 47.0, discountPct: 50, image: "files/493.jpg" },
  { title: "Hoodie Griffé Anthracite", titleEn: "Branded Hoodie Charcoal - 50% Off", kind: "hoodie", priceAED: 47.0, discountPct: 50, image: "files/Charcoal.jpg" },
  { title: "Hoodie Griffé Bleu", titleEn: "Branded Hoodie Blue - 50% Off", kind: "hoodie", priceAED: 47.0, discountPct: 50, image: "files/image_c35e4de5-088f-47c2-a141-2a40a06211b6.jpg" },
  { title: "Sweat Texturé Fines Rayures Bleu", titleEn: "Micro Textured Line French Blue - 50% Off", kind: "sweatshirt", priceAED: 45.0, discountPct: 50, image: "files/FRSH233_1.jpg" },
];

const usedSlugs = new Set(PRODUCTS.map((p) => p.slug));

for (const item of RAW_IMPORT) {
  const template = KIND_TEMPLATES[item.kind];
  const basePrice = toEuroPrice(item.priceAED);
  const compareAtPrice = item.discountPct
    ? Math.round((basePrice / (1 - item.discountPct / 100)) * 10) / 10
    : undefined;

  let slug = slugify(item.titleEn);
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${slugify(item.titleEn)}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);

  const imageUrl = `https://cdn.shopify.com/s/files/1/0840/1390/8249/${item.image}`;

  PRODUCTS.push({
    name: item.title,
    nameEn: item.titleEn,
    slug,
    category: template.category,
    collections: item.discountPct ? ["soldes"] : ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice,
    compareAtPrice,
    isNewArrival: !item.discountPct,
    sizes: template.sizes,
    materials: template.materialFr,
    materialsEn: template.materialEn,
    description: `${item.title.replace(/\s*-\s*\d+$/, "")}. ${template.fr}`,
    descriptionEn: `${item.titleEn.replace(/\s*-\s*\d+$/, "").replace(/\s*-\s*\d+% Off$/i, "")}. ${template.en}`,
    images: [imageUrl],
  });
}

// ────────────────────────────────────────────────────────────
// Import en masse — collection "Femme"
// ────────────────────────────────────────────────────────────

const WOMEN_RAW_IMPORT: RawImportItem[] = [
  { title: "Mocassin Suédine Charme d'Été — Old Money", titleEn: "Women Summer Charm Suede Loafers — Old Money Collection", kind: "loafer", priceAED: 145.0, image: "files/cover_1f8ed232-c2cb-4881-9192-d79ee2567d41.jpg" },
  { title: "Mocassin Slip-on en Suède — Old Money", titleEn: "Women Slip-on Loafers in Suede — Old Money Collection", kind: "loafer", priceAED: 145.0, image: "files/jenneb_ua_1781983923_3923887959404434728_47968264684_1.jpg" },
  { title: "Mocassin Lady Old Money en Suède", titleEn: "Old Money Suede Lady Loafers", kind: "loafer", priceAED: 145.0, image: "files/coverbrown.png" },
  { title: "Pantalon Gaufré Été", titleEn: "Waffle Summer Trousers", kind: "chino-pant", priceAED: 41.0, image: "files/teapink.jpg" },
  { title: "Ensemble Caviar", titleEn: "Women Caviar Co-ord Set", kind: "set", priceAED: 55.0, discountPct: 40, image: "files/ScreenShot2026-05-05at7.04.06PM.png" },
  { title: "Ensemble Twilight", titleEn: "Women Twilight Co-ord Set", kind: "set", priceAED: 36.0, discountPct: 70, image: "files/blue_fd85c42f-582c-4fcb-96e4-9993e9c55d65.jpg" },
  { title: "Ensemble Fleuri Manches 3/4", titleEn: "Flower Quarter Sleeved Set", kind: "set", priceAED: 36.0, discountPct: 70, image: "files/582b_7318fc7e-ab85-4d65-9b90-77207dacea33.jpg" },
  { title: "Hoodie Mickey Blanc", titleEn: "Mickey Hoodie White", kind: "hoodie", priceAED: 58.0, discountPct: 40, image: "files/WhatsAppImage2022-01-26at6.45.42PM_2.jpg" },
  { title: "Ensemble Tee Smiley & Palazzo", titleEn: "Smiley Tee & Palazzo", kind: "set", priceAED: 49.0, discountPct: 50, image: "files/592.jpg" },
  { title: "Ensemble Loungewear", titleEn: "Women Lounge Wear Co-ord", kind: "set", priceAED: 85.0, image: "files/Aqua_Pink.jpg" },
];

for (const item of WOMEN_RAW_IMPORT) {
  const template = KIND_TEMPLATES[item.kind];
  const basePrice = toEuroPrice(item.priceAED);
  const compareAtPrice = item.discountPct
    ? Math.round((basePrice / (1 - item.discountPct / 100)) * 10) / 10
    : undefined;

  let slug = slugify(item.titleEn);
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${slugify(item.titleEn)}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);

  const imageUrl = `https://cdn.shopify.com/s/files/1/0840/1390/8249/${item.image}`;

  PRODUCTS.push({
    name: item.title,
    nameEn: item.titleEn,
    slug,
    category: template.category,
    collections: item.discountPct ? ["soldes"] : ["nouveautes"],
    brand: "UrbanDiscount Label",
    basePrice,
    compareAtPrice,
    isNewArrival: !item.discountPct,
    sizes: template.sizes,
    materials: template.materialFr,
    materialsEn: template.materialEn,
    description: `${item.title.replace(/\s*—\s*\d+$/, "")}. ${template.fr}`,
    descriptionEn: `${item.titleEn.replace(/\s*—\s*\d+$/, "")}. ${template.en}`,
    images: [imageUrl],
  });
}

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

// Reviews are seed/demo content, kept French-only for now (no localized
// storage in the Review model) — the storefront UI chrome around them is
// translated, but review text itself isn't part of the Phase 2 content scope.

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
      update: { nameEn: category.nameEn, descriptionEn: category.descriptionEn },
      create: {
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description,
        descriptionEn: category.descriptionEn,
        image: img(`category-${category.slug}`, 1200, 800),
        position: index,
      },
    });
    categoryBySlug.set(category.slug, record.id);
  }

  for (const [index, category] of children.entries()) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { nameEn: category.nameEn, descriptionEn: category.descriptionEn },
      create: {
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description,
        descriptionEn: category.descriptionEn,
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
      update: { nameEn: collection.nameEn, image: collection.image },
      create: {
        name: collection.name,
        nameEn: collection.nameEn,
        slug: collection.slug,
        isFeatured: collection.isFeatured,
        image: collection.image,
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
      update: {
        nameEn: product.nameEn,
        descriptionEn: product.descriptionEn,
        shortDescriptionEn: product.descriptionEn.slice(0, 90),
        materialsEn: product.materialsEn,
        careInstructionsEn: product.careInstructionsEn,
      },
      create: {
        name: product.name,
        nameEn: product.nameEn,
        slug: product.slug,
        description: product.description,
        descriptionEn: product.descriptionEn,
        shortDescription: product.description.slice(0, 90),
        shortDescriptionEn: product.descriptionEn.slice(0, 90),
        brand: product.brand,
        status: "ACTIVE",
        basePrice: product.basePrice,
        compareAtPrice: product.compareAtPrice,
        isFeatured: product.isFeatured ?? false,
        isBestSeller: product.isBestSeller ?? false,
        isNewArrival: product.isNewArrival ?? false,
        materials: product.materials,
        materialsEn: product.materialsEn,
        careInstructions: product.careInstructions,
        careInstructionsEn: product.careInstructionsEn,
        categoryId: categoryBySlug.get(product.category),
        collections: {
          create: product.collections.map((slug) => ({
            collection: { connect: { id: collectionBySlug.get(slug) } },
          })),
        },
        images: {
          create: (product.images ?? [0, 1, 2].map((i) => img(`${product.slug}-${i}`))).map(
            (url, i) => ({
              url,
              alt: `${product.name} — vue ${i + 1}`,
              position: i,
            }),
          ),
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

    // Images aren't part of the upsert `update` clause (nested create only
    // applies on insert), so re-sync them explicitly on every run — this
    // lets us swap in real product photos for already-seeded products.
    const desiredImages = product.images ?? [0, 1, 2].map((i) => img(`${product.slug}-${i}`));
    await prisma.productImage.deleteMany({ where: { productId: created.id } });
    await prisma.productImage.createMany({
      data: desiredImages.map((url, i) => ({
        productId: created.id,
        url,
        alt: `${product.name} — vue ${i + 1}`,
        position: i,
      })),
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
