export const FAQ_SECTIONS = [
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
