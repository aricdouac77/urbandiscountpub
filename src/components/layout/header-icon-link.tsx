import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderIconLinkProps = {
  href: string;
  label: string;
  count?: number;
  children: React.ReactNode;
};

export function HeaderIconLink({ href, label, count, children }: HeaderIconLinkProps) {
  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={label} asChild>
      <Link href={href}>
        {children}
        {Boolean(count) && (
          <span
            className={cn(
              "bg-brand text-brand-foreground absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium",
            )}
          >
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
