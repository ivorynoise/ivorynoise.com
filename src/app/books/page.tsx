import type { Metadata } from "next";
import { books, booksByCategory, type BookEntry } from "@/data/books";
import { inlineLinkClass } from "@/lib/inline-link";

export const metadata: Metadata = {
  title: "Bookshelf | Deepak Aggarwal",
  description: "Technical and non-technical reading — curated bookshelf.",
};

const MAX_W = "42rem";

function BookRow({ book }: { book: BookEntry }) {
  return (
    <li className="font-sans text-pretty text-nocturne">
      {book.tag ? (
        <span className="font-mono text-[0.75rem] text-[#a63d40]">
          [{book.tag}]{` `}
        </span>
      ) : null}
      <span className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48">
        {book.year}
      </span>
      <span className="text-nocturne/30">{` : `}</span>
      <a
        href={book.url}
        target="_blank"
        rel="noopener noreferrer"
        className={inlineLinkClass}
      >
        {book.title}
      </a>
      <span className="text-nocturne/45">{` · ${book.author}`}</span>
    </li>
  );
}

function BookSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: BookEntry[];
}) {
  if (items.length === 0) return null;

  return (
    <section
      className="mt-8 scroll-mt-20 first:mt-6"
      id={id}
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="font-sans text-sm font-semibold uppercase tracking-[0.06em] text-nocturne/55"
      >
        {title}
        <span className="font-normal tabular-nums text-nocturne/40">{` (${items.length})`}</span>
      </h2>
      <ul className="mt-3 list-disc space-y-[0.35rem] pl-4 marker:text-nocturne/25">
        {items.map((book) => (
          <BookRow key={`${book.title}-${book.author}`} book={book} />
        ))}
      </ul>
    </section>
  );
}

export default function BooksPage() {
  const total = books.length;
  const technical = booksByCategory("technical");
  const nonTechnical = booksByCategory("non-technical");

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
              Bookshelf
              <span
                className="font-sans font-normal tabular-nums text-nocturne/45"
                style={{ fontSize: "clamp(0.9rem, 1.35vw, 1.05rem)" }}
              >
                {` (${total})`}
              </span>
            </h1>

            <p className="mt-5 font-sans text-pretty">
              Technical and non-technical books worth your time.
            </p>

            <hr className="mt-8 border-0 border-t border-nocturne/[0.1]" />
          </header>

          <BookSection id="technical" title="Technical" items={technical} />
          <BookSection
            id="non-technical"
            title="Non-technical"
            items={nonTechnical}
          />
        </div>
      </div>
    </section>
  );
}
