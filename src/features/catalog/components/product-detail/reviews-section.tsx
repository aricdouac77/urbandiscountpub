import { useTranslations } from "next-intl";
import { Star, BadgeCheck } from "lucide-react";
import type { ProductReviewData } from "@/features/catalog/types/product-detail";

function StarRating({ rating, size = "size-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-brand text-brand"
              : "text-muted-foreground fill-transparent"
          }`}
        />
      ))}
    </div>
  );
}

type ReviewsSectionProps = {
  averageRating: number;
  reviewCount: number;
  reviews: ProductReviewData[];
};

export function ReviewsSection({ averageRating, reviewCount, reviews }: ReviewsSectionProps) {
  const t = useTranslations("product");

  return (
    <section id="avis" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <h2 className="text-2xl font-semibold sm:text-3xl">{t("reviewsTitle")}</h2>
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="size-5" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}/5</span>
            <span className="text-muted-foreground text-sm">
              {t("reviewCount", { count: reviewCount })}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t("noReviewsYet")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center justify-between">
                <StarRating rating={review.rating} />
                {review.isVerifiedPurchase && (
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <BadgeCheck className="size-3.5" />
                    {t("verifiedPurchase")}
                  </span>
                )}
              </div>
              {review.title && <p className="mt-2 text-sm font-medium">{review.title}</p>}
              <p className="text-muted-foreground mt-1 text-sm">{review.comment}</p>
              <p className="mt-2 text-xs font-medium">{review.authorName}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
