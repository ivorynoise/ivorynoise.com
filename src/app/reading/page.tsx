import type { Metadata } from "next";

import {
  readingItems,
  readingByCategory,
  readingSections,
  type ReadingItem,
} from "@/data/reading";
import { inlineLinkClass } from "@/lib/inline-link";

export const metadata: Metadata = {
  title: "Reading | Deepak Aggarwal",
  description: "Research papers and insightful blogs — technical and non-technical reading.",
};

const MAX_W = "42rem";

function formatListDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ReadingRow({ item }: { item: ReadingItem }) {
  const meta = [item.author, item.source].filter(Boolean).join(" · ");

  return (
    <li className="font-sans text-pretty text-[0.875rem] leading-snug text-nocturne">
      {item.date ? (
        <>
          <time className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48" dateTime={item.date}>
            {formatListDate(item.date)}
          </time>
          <span className="text-nocturne/30">{` : `}</span>
        </>
      ) : (
        <>
          <span className="font-mono text-[0.8125rem] tabular-nums text-nocturne/38">—</span>
          <span className="text-nocturne/30">{` : `}</span>
        </>
      )}
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={inlineLinkClass}>
        {item.title}
      </a>
      {meta ? <span className="text-nocturne/45">{` · ${meta}`}</span> : null}
    </li>
  );
}

function ReadingSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: ReadingItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8 scroll-mt-20 first:mt-6" id={id} aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="font-sans text-sm font-semibold uppercase tracking-[0.06em] text-nocturne/55"
      >
        {title}
        <span className="font-normal tabular-nums text-nocturne/40">{` (${items.length})`}</span>
      </h2>
      <ul className="mt-3 list-disc space-y-[0.35rem] pl-4 marker:text-nocturne/25">
        {items.map((item, i) => (
          <ReadingRow key={`${item.title}-${item.url}-${i}`} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function ReadingPage() {
  const total = readingItems.length;

  return (
    <section style={{ paddingBlock: "clamp(2rem, 5vw, 3.25rem)" }}>
      <div className="site-container w-full">
        <div className="w-full" style={{ maxWidth: MAX_W }}>
        <header>
          <h1
            className="text-balance font-semibold leading-[1.1] tracking-tight text-nocturne"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.45rem, 3.2vw, 1.95rem)",
            }}
          >
            Reading list
            <span
              className="font-sans font-normal tabular-nums text-nocturne/45"
              style={{ fontSize: "clamp(0.9rem, 1.35vw, 1.05rem)" }}
            >
              {` (${total})`}
            </span>
          </h1>

          <p
            className="mt-5 font-sans text-pretty text-nocturne/68"
            style={{ fontSize: "0.875rem", lineHeight: 1.58 }}
          >
            Papers, guides, and posts worth your time. Optional date, author, or source live in{" "}
            <code className="rounded bg-sand/70 px-1 py-px font-mono text-[0.8em] text-nocturne/70">
              reading.ts
            </code>
            .
          </p>

          <hr className="mt-8 border-0 border-t border-nocturne/[0.1]" />
        </header>

        {readingSections.map((section) => (
          <ReadingSection
            key={section.id}
            id={section.id}
            title={section.title}
            items={readingByCategory(section.category)}
          />
        ))}
        </div>
      </div>
    </section>
  );
}
