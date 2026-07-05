"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/lib/auth-client";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

// Client-rendered on purpose: reading the session here (instead of via a
// server call to headers()/cookies() in this component) keeps the rest of
// the shop layout/pages static & ISR-cacheable instead of forcing the whole
// route to render dynamically on every request.
export function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <Button variant="ghost" size="icon" aria-hidden className="opacity-0" />;
  }

  if (!session) {
    return (
      <Button variant="ghost" size="icon" aria-label="Se connecter" asChild>
        <Link href="/connexion">
          <User className="size-5" />
        </Link>
      </Button>
    );
  }

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Mon compte">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">{session.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/compte">Mon compte</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/compte/commandes">Mes commandes</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/wishlist">Ma liste d&apos;envies</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Administration</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <div className="px-1 py-1">
          <SignOutButton variant="ghost" size="sm" className="w-full justify-start px-2" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
