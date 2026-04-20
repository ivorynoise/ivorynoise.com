"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

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

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <>
      {navLinks.map(({ href, label, external }) => {
        const active = isActive(pathname, href, external);
        return (
          <Link
            key={label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={onNavigate}
            className={cn(
              "rounded-[var(--radius-sm)] px-2.5 py-1.5 text-sm transition-colors sm:px-3",
              active
                ? "text-nocturne font-semibold underline underline-offset-4 decoration-nocturne/40"
                : "text-nocturne/65 hover:text-nocturne",
              className
            )}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md relative"
      style={{ borderBottom: "var(--border)" }}
    >
      <div className="site-container flex h-14 min-h-14 items-center justify-between gap-2 sm:h-16 sm:min-h-16 sm:gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href="/"
            className="text-nocturne inline-block max-w-full truncate leading-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.15rem",
              fontWeight: 600,
            }}
          >
            {site.name}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <nav className="hidden items-center md:flex" aria-label="Primary">
            <NavLinks pathname={pathname} className="shrink-0" />
          </nav>
          <ThemeToggle />
          <button
            type="button"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] transition-colors md:hidden",
              "text-nocturne hover:border-nocturne/35 hover:bg-sand/70",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nocturne/25 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            )}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-x-0 top-14 z-40 h-[calc(100dvh-3.5rem)] bg-nocturne/25 sm:top-16 sm:h-[calc(100dvh-4rem)] md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <nav
            id="mobile-nav"
            className="absolute inset-x-0 top-full z-50 border-b bg-cream/95 shadow-md backdrop-blur-md md:hidden"
            style={{ borderBottom: "var(--border)" }}
            aria-label="Primary"
          >
            <div className="site-container flex flex-col py-2">
              <NavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
                className="block w-full px-3 py-3 text-base"
              />
            </div>
          </nav>
        </>
      ) : null}
    </header>
  );
}
