"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const navLinks = [
  { href: "/",              label: "About",   external: false },
  { href: site.blog.href,  label: "Writing",  external: site.blog.external },
];

export function Header() {
  const pathname = usePathname();

  return (
    
    <header
      className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md"
      style={{ borderBottom: "var(--border)" }}
    >
      <div className="site-container flex h-16 items-center justify-between gap-4">
        
        <Link
          href="/"
          className="text-nocturne leading-none"
          style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 600 }}
        >
          {site.name}
        </Link>

        
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, external }) => {
            const active = !external && pathname === href;
            return (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={cn(
                  "px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "text-nocturne font-semibold underline underline-offset-4 decoration-nocturne/40"
                    : "text-nocturne/65 hover:text-nocturne"
                )}
              >
                {label}
              </Link>
            );
          })}

        </nav>
      </div>
    </header>
  );
}
