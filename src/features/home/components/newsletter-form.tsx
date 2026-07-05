"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter, type NewsletterActionState } from "@/actions/newsletter.actions";

const initialState: NewsletterActionState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <div className="flex gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="vous@exemple.com"
          className="bg-background"
          aria-label="Adresse e-mail"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "..." : "S'inscrire"}
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
