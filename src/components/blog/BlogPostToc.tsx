"use client";

import { useEffect, useState } from "react";

import type { TocItem } from "@/lib/markdown-toc";
import { cn } from "@/lib/utils";

const LINK_BASE =
  "block border-l-2 -ml-px py-1.5 pl-3 text-[0.8125rem] leading-snug transition-colors";
const LINK_L3 = "pl-5 text-[0.78rem]";

function TocNav({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const onScroll = () => {
      const offset = 120;
      const probe = window.scrollY + offset;
      let current = items[0]?.id ?? null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                LINK_BASE,
                item.level === 3 && LINK_L3,
                isActive
                  ? "border-[#c17f59] font-medium text-nocturne"
                  : "border-transparent text-nocturne/50 hover:text-nocturne/75"
              )}
            >
              {item.text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

type Variant = "mobile" | "sidebar";

export function BlogPostToc({ items, variant }: { items: TocItem[]; variant: Variant }) {
  if (items.length === 0) return null;

  if (variant === "mobile") {
    return (
      <div className="mb-10 rounded-[var(--radius-md)] border border-nocturne/10 bg-sand/30 px-4 py-3 dark:bg-sand/25 lg:hidden">
        <p className="text-label text-nocturne/50">On this page</p>
        <div className="mt-3 max-h-[min(50vh,24rem)] overflow-y-auto [scrollbar-width:thin]">
          <TocNav items={items} />
        </div>
      </div>
    );
  }

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[5.25rem] max-h-[calc(100vh-6rem)] overflow-y-auto pb-10 [scrollbar-width:thin]"
    >
      <p className="text-label mb-3 text-nocturne/45">On this page</p>
      <TocNav items={items} />
    </nav>
  );
}
