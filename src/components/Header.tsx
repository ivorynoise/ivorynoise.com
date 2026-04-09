"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/blog", label: "Blogs", external: false },
  { href: "/books", label: "Books", external: false },
  {
    href: site.reading.href,
    label: "Reading",
    external: site.reading.external,
  },
] as const;

function isActive(pathname: string, href: string, external: boolean) {
  if (external) return false;
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md"
      style={{ borderBottom: "var(--border)" }}
    >
      <div className="site-container flex h-14 min-h-14 items-center justify-between gap-3 sm:h-16 sm:min-h-16">
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <Link
            href="/"
            className="truncate text-nocturne leading-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            {site.name}
          </Link>
        </div>

        <nav
          className="flex min-w-0 max-w-full flex-1 items-center justify-end gap-0.5 overflow-x-auto sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Primary"
        >
          {navLinks.map(({ href, label, external }) => {
            const active = isActive(pathname, href, external);
            return (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={cn(
                  "shrink-0 rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors sm:px-3",
                  active
                    ? "text-nocturne font-semibold underline underline-offset-4 decoration-nocturne/40"
                    : "text-nocturne/65 hover:text-nocturne",
                )}
              >
                {label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
