import type { Locale } from "@/i18n/routing";

const FAQ_SECTIONS_FR = [
  {
    id: "commandes",
    title: "Commandes",
    items: [
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Un e-mail avec un lien de suivi vous est envoyé dès l'expédition. Vous pouvez aussi suivre votre commande à tout moment depuis la page Suivi de commande en renseignant votre numéro de commande et votre e-mail.",
      },
      {
        question: "Puis-je modifier ou annuler ma commande ?",
        answer:
          "Tant que la commande n'est pas expédiée, contactez notre service client au plus vite : nous ferons notre possible pour la modifier ou l'annuler.",
      },
      {
        question: "Que faire si un article est indisponible ?",
        answer:
          "Les stocks sont mis à jour en temps réel. Si un article devient indisponible après votre commande, notre équipe vous contacte pour un remboursement ou un échange.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Livraison",
    items: [
      {
        question: "Quels sont les délais de livraison ?",
        answer:
          "Livraison standard sous 3 à 5 jours ouvrés en France métropolitaine. Une option express est disponible au checkout pour une livraison sous 24 à 48h.",
      },
      {
        question: "La livraison est-elle gratuite ?",
        answer: "Oui, dès 50€ d'achat. En dessous, des frais de livraison de 4,90€ s'appliquent.",
      },
      {
        question: "Livrez-vous à l'international ?",
        answer:
          "Nous livrons actuellement en France métropolitaine, Belgique, Luxembourg et Suisse. D'autres pays seront ajoutés prochainement.",
      },
    ],
  },
  {
    id: "retours",
    title: "Retours & échanges",
    items: [
      {
        question: "Quelle est la politique de retour ?",
        answer:
          "Vous disposez de 30 jours après réception pour retourner un article non porté, dans son emballage d'origine, pour un remboursement ou un échange.",
      },
      {
        question: "Comment initier un retour ?",
        answer:
          "Rendez-vous dans votre espace compte, section Commandes, puis sélectionnez l'article à retourner. Notre équipe traite chaque demande sous 48h.",
      },
      {
        question: "Qui prend en charge les frais de retour ?",
        answer:
          "Les retours sont gratuits pour tout échange ou remboursement en France métropolitaine.",
      },
    ],
  },
  {
    id: "paiement",
    title: "Paiement",
    items: [
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Carte bancaire, Apple Pay et Google Pay via notre partenaire de paiement sécurisé Stripe.",
      },
      {
        question: "Le paiement est-il sécurisé ?",
        answer:
          "Oui, l'intégralité du paiement est traitée par Stripe, certifié PCI-DSS niveau 1. Nous ne stockons jamais vos données bancaires.",
      },
    ],
  },
] as const;

const FAQ_SECTIONS_EN = [
  {
    id: "commandes",
    title: "Orders",
    items: [
      {
        question: "How do I track my order?",
        answer:
          "An email with a tracking link is sent to you as soon as your order ships. You can also track your order at any time from the Order Tracking page by entering your order number and email.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer:
          "As long as the order hasn't shipped yet, contact our customer service as soon as possible: we'll do our best to modify or cancel it.",
      },
      {
        question: "What if an item is out of stock?",
        answer:
          "Stock is updated in real time. If an item becomes unavailable after your order, our team will contact you for a refund or exchange.",
      },
    ],
  },
  {
    id: "livraison",
    title: "Shipping",
    items: [
      {
        question: "What are the delivery times?",
        answer:
          "Standard shipping within 3 to 5 business days in mainland France. An express option is available at checkout for delivery within 24 to 48 hours.",
      },
      {
        question: "Is shipping free?",
        answer: "Yes, on orders over €50. Below that, a €4.90 shipping fee applies.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "We currently ship to mainland France, Belgium, Luxembourg and Switzerland. More countries will be added soon.",
      },
    ],
  },
  {
    id: "retours",
    title: "Returns & exchanges",
    items: [
      {
        question: "What is your return policy?",
        answer:
          "You have 30 days after receipt to return an unworn item, in its original packaging, for a refund or exchange.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Go to your account area, Orders section, then select the item to return. Our team processes every request within 48 hours.",
      },
      {
        question: "Who covers the return shipping costs?",
        answer: "Returns are free for any exchange or refund within mainland France.",
      },
    ],
  },
  {
    id: "paiement",
    title: "Payment",
    items: [
      {
        question: "What payment methods do you accept?",
        answer: "Credit card, Apple Pay and Google Pay via our secure payment partner Stripe.",
      },
      {
        question: "Is payment secure?",
        answer:
          "Yes, all payments are processed by Stripe, PCI-DSS Level 1 certified. We never store your banking details.",
      },
    ],
  },
] as const;

export function getFaqSections(locale: Locale) {
  return locale === "en" ? FAQ_SECTIONS_EN : FAQ_SECTIONS_FR;
}
