"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter, type NewsletterActionState } from "@/actions/newsletter.actions";

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);
  const t = useTranslations("home");

  return (
    <form action={formAction} className="w-full max-w-sm">
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder={t("newsletterEmailPlaceholder")}
          className="bg-background"
          aria-label={t("newsletterEmailLabel")}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "..." : t("newsletterSubscribe")}
        </Button>
      </div>
      {state.status !== "idle" && (
        <p
          className={`mt-2 text-sm ${state.status === "success" ? "text-muted-foreground" : "text-destructive"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
