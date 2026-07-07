"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { getWishlistIds, toggleWishlistItem } from "@/actions/wishlist.actions";
import { useSession } from "@/lib/auth-client";

const WISHLIST_QUERY_KEY = ["wishlist-ids"];

export function useWishlistIds() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getWishlistIds,
    enabled: Boolean(session),
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations("wishlist");

  return useMutation({
    mutationFn: (productId: string) => toggleWishlistItem(productId),
    onMutate: async (productId) => {
      if (!session) return { previous: undefined };

      await queryClient.cancelQueries({ queryKey: WISHLIST_QUERY_KEY });
      const previous = queryClient.getQueryData<string[]>(WISHLIST_QUERY_KEY) ?? [];
      const next = previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId];
      queryClient.setQueryData(WISHLIST_QUERY_KEY, next);

      return { previous };
    },
    onError: (_error, _productId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, context.previous);
      }
    },
    onSuccess: (result) => {
      if (result.requiresAuth) {
        toast.error(t("signInRequired"));
        router.push("/connexion");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
}
