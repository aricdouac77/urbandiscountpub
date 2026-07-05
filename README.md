# UrbanDiscount

Boutique e-commerce premium — Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma 7, Stripe.

## Stack

| Domaine            | Techno                                              |
| ------------------ | ---------------------------------------------------- |
| Framework          | Next.js 15 (App Router, Server Components)           |
| UI                 | React 19, Tailwind CSS v4, shadcn/ui                  |
| Animations         | Framer Motion                                         |
| Formulaires        | React Hook Form + Zod                                 |
| État client        | Zustand                                               |
| Data fetching      | TanStack Query                                        |
| Base de données    | PostgreSQL (Neon) + Prisma 7 (driver adapter `pg`)     |
| Paiement           | Stripe                                                |
| Médias             | Cloudinary                                            |
| Auth               | Better Auth                                           |
| Cache / Rate limit | Upstash Redis                                         |
| Email              | Resend                                                |
| Hébergement        | Vercel (+ Docker pour self-host optionnel)             |

## Démarrage

```bash
cp .env.example .env      # renseigner les variables (DB, Stripe, Cloudinary, ...)
npm install
npm run docker:dev        # Postgres (port 5433) + Redis (port 6379) en local
npm run prisma:migrate
npm run dev
```

> Le port `5433` est utilisé pour Postgres en local (au lieu de `5432`) afin d'éviter tout conflit avec une éventuelle instance PostgreSQL déjà installée sur la machine. En production, `DATABASE_URL`/`DIRECT_URL` pointent vers Neon (port standard `5432`, TLS).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` / `npm run start` — build et run production
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run typecheck` — vérification TypeScript stricte
- `npm run format` / `npm run format:check` — Prettier
- `npm run prisma:migrate` / `npm run prisma:studio` — gestion du schéma
- `npm run db:seed` — peuplement de données de démonstration

## Architecture

```
src/
  app/          routes App Router (pages, layouts, route handlers)
  components/   composants UI réutilisables (dont shadcn/ui)
  features/     modules métier (produits, panier, checkout, compte...)
  hooks/        hooks React réutilisables
  lib/          clients & helpers transverses (prisma, utils, auth...)
  services/     accès aux APIs externes (Stripe, Cloudinary, Resend...)
  actions/      Server Actions
  server/       logique serveur (db, auth, cache, email)
  generated/    code généré (client Prisma) — non versionné
prisma/         schéma et migrations
emails/         templates d'emails transactionnels (React Email)
```

## Déploiement

Le site est optimisé pour **Vercel** (Edge/Serverless Functions, ISR, Image Optimization, Data Cache). Un `Dockerfile` et un `docker-compose.yml` sont fournis pour le développement local et un éventuel self-hosting, mais ne sont pas nécessaires pour déployer sur Vercel.

### 1. Base de données (Neon)

1. Créer un projet sur [neon.tech](https://neon.tech) (offre gratuite, scale-to-zero).
2. Récupérer la chaîne de connexion pooled (`DATABASE_URL`) et directe (`DIRECT_URL`).
3. Appliquer les migrations depuis votre machine avant le premier déploiement :
   ```bash
   DATABASE_URL="<url-neon>" npx prisma migrate deploy
   ```

### 2. Dépôt Git

```bash
git add -A
git commit -m "Initial deployment"
git remote add origin <url-du-depot>
git push -u origin master
```

### 3. Import sur Vercel

1. [vercel.com/new](https://vercel.com/new) → importer le dépôt Git.
2. Le framework Next.js est détecté automatiquement (aucune configuration `vercel.json` requise).
3. Renseigner les variables d'environnement (voir `.env.example`) dans **Project Settings → Environment Variables** :

   | Variable | Requise | Notes |
   |---|---|---|
   | `DATABASE_URL`, `DIRECT_URL` | ✅ | Neon |
   | `NEXT_PUBLIC_APP_URL` | ✅ | URL Vercel de production |
   | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | ✅ | `openssl rand -base64 32` |
   | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Recommandé | sans elles, le checkout reste fonctionnel mais sans paiement réel |
   | `CLOUDINARY_*` | Recommandé | sans elles, les images de démo (picsum.photos) restent utilisées |
   | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Recommandé | sans elles, rate limiting et cache admin désactivés (dégradation silencieuse) |
   | `RESEND_API_KEY`, `EMAIL_FROM`, `SUPPORT_EMAIL` | Recommandé | sans elles, le formulaire de contact affiche un message d'erreur explicite |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optionnel | connexion Google |

4. Déployer. Le `postinstall` (`prisma generate`) s'exécute automatiquement avant le build.
5. Configurer le webhook Stripe pour pointer vers `https://<domaine>/api/webhooks/stripe`, puis reporter le secret de signature dans `STRIPE_WEBHOOK_SECRET`.
6. (Optionnel) Peupler le catalogue de démonstration :
   ```bash
   DATABASE_URL="<url-neon>" npm run db:seed
   ```

### CI

Un workflow GitHub Actions (`.github/workflows/ci.yml`) exécute à chaque push/PR : installation, migrations sur un Postgres éphémère, lint, typecheck et build — indépendamment du déploiement Vercel.

### Self-hosting (Docker)

`next build` interroge la base au moment du build (pages produits statiques, sitemap) : `DATABASE_URL` doit donc être fournie en argument de build, en plus du `.env` au runtime.

```bash
docker build --build-arg DATABASE_URL="$DATABASE_URL" --build-arg DIRECT_URL="$DIRECT_URL" -t urbandiscount .
docker run -p 3000:3000 --env-file .env urbandiscount
```