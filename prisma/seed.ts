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
];

const COLLECTIONS = [
  { name: "Nouveautés", nameEn: "New Arrivals", slug: "nouveautes", isFeatured: true },
  {
    name: "Meilleures ventes",
    nameEn: "Best Sellers",
    slug: "meilleures-ventes",
    isFeatured: true,
  },
  { name: "Soldes", nameEn: "Sale", slug: "soldes", isFeatured: false },
  {
    name: "Édition limitée",
    nameEn: "Limited Edition",
    slug: "edition-limitee",
    isFeatured: true,
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
      update: { nameEn: collection.nameEn },
      create: {
        name: collection.name,
        nameEn: collection.nameEn,
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
