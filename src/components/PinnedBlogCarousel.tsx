"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getPostHref, isExternalPost } from "@/lib/post-links";
import type { PostMeta } from "@/lib/posts";
import { BLOG_CATEGORY_LABEL } from "@/lib/post-taxonomy";
import { cn } from "@/lib/utils";

const PER_PAGE = 3;

function formatCardDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PinnedCard({ post }: { post: PostMeta }) {
  const href = getPostHref(post);
  const external = isExternalPost(post);
  const category = BLOG_CATEGORY_LABEL[post.category];

  const cardClass = cn(
    "group flex h-full min-h-0 flex-col rounded-[var(--radius-lg)] border border-transparent bg-cream/0 p-3 outline-none -m-3",
    "transition-[transform,box-shadow,border-color,background-color] duration-[var(--dur-base)] ease-[var(--ease)]",
    "hover:-translate-y-1 hover:border-nocturne/[0.1] hover:bg-cream/80 hover:shadow-[var(--shadow-md)]",
    "focus-visible:ring-2 focus-visible:ring-nocturne/25 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
  );

  const imageBlock = (
    <div
      className="relative w-full shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-sand/55 ring-0 ring-transparent transition-[box-shadow,ring] duration-[var(--dur-base)] ease-[var(--ease)] group-hover:shadow-inner group-hover:ring-2 group-hover:ring-nocturne/12"
      style={{ aspectRatio: "1 / 1" }}
    >
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt=""
          className="h-full w-full object-cover transition-[transform,filter] duration-[var(--dur-slow)] ease-[var(--ease)] group-hover:scale-[1.04] group-hover:brightness-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-sand/80 to-sand/40 transition-transform duration-[var(--dur-slow)] ease-[var(--ease)] group-hover:scale-[1.02]" aria-hidden />
      )}
    </div>
  );

  const meta = (
    <p
      className="mt-auto pt-3 text-nocturne/50 transition-colors duration-[var(--dur-fast)] group-hover:text-nocturne/60"
      style={{ fontSize: "var(--text-sm)", lineHeight: 1.5 }}
    >
      <span className="font-medium text-nocturne/65 group-hover:text-nocturne/75">{category}</span>
      <span className="mx-1.5 font-normal text-nocturne/25" aria-hidden>
        ·
      </span>
      <time dateTime={post.publishedAt} className="font-normal tabular-nums text-nocturne/45">
        {formatCardDate(post.publishedAt)}
      </time>
    </p>
  );

  const title = (
    <h2
      className="line-clamp-4 text-pretty font-semibold leading-snug tracking-tight text-nocturne transition-colors duration-[var(--dur-fast)] group-hover:text-slate"
      style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
    >
      {post.title}
    </h2>
  );

  const textColumn = (
    <div className="flex min-h-0 flex-1 flex-col pt-3">
      {title}
      {meta}
    </div>
  );

  if (external) {
    return (
      <article className="flex h-full min-h-0 flex-col">
        <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {imageBlock}
          {textColumn}
        </a>
      </article>
    );
  }

  return (
    <article className="flex h-full min-h-0 flex-col">
      <Link href={href} className={cardClass}>
        {imageBlock}
        {textColumn}
      </Link>
    </article>
  );
}

export function PinnedBlogCarousel({ posts }: { posts: PostMeta[] }) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const maxPage = totalPages - 1;
  const multiPage = totalPages > 1;

  const [prevBounds, setPrevBounds] = useState({ maxPage, postCount: posts.length });
  if (maxPage !== prevBounds.maxPage || posts.length !== prevBounds.postCount) {
    setPrevBounds({ maxPage, postCount: posts.length });
    setPage((p) => Math.min(p, maxPage));
  }

  const clampedPage = Math.min(page, maxPage);
  const slice = posts.slice(clampedPage * PER_PAGE, clampedPage * PER_PAGE + PER_PAGE);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(maxPage, p + 1));
  }, [maxPage]);

  useEffect(() => {
    if (!multiPage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPage((p) => Math.max(0, p - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPage((p) => Math.min(maxPage, p + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxPage, multiPage]);

  if (posts.length === 0) return null;

  const canPrev = clampedPage > 0;
  const canNext = clampedPage < totalPages - 1;

  return (
    <div className="w-full" role="region" aria-label="Pinned posts" aria-live="polite">
      <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {slice.map((post) => (
          <PinnedCard key={post.slug} post={post} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous pinned posts"
          disabled={!multiPage || !canPrev}
          onClick={goPrev}
          className={cn(
            "flex size-11 items-center justify-center rounded-[var(--radius-md)] transition-all duration-[var(--dur-fast)]",
            "border border-nocturne/15 bg-sand/40 text-nocturne/70 shadow-[var(--shadow-sm)]",
            multiPage && canPrev
              ? "hover:border-nocturne/20 hover:bg-sand/70 hover:text-nocturne hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
              : "cursor-not-allowed opacity-45 shadow-none"
          )}
        >
          <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
        <span
          className="min-w-[5rem] text-center tabular-nums text-nocturne/55"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {clampedPage + 1} / {totalPages}
        </span>
        <button
          type="button"
          aria-label="Next pinned posts"
          disabled={!multiPage || !canNext}
          onClick={goNext}
          className={cn(
            "flex size-11 items-center justify-center rounded-[var(--radius-md)] transition-all duration-[var(--dur-fast)]",
            "border border-nocturne/15 bg-sand/40 text-nocturne/70 shadow-[var(--shadow-sm)]",
            multiPage && canNext
              ? "hover:border-nocturne/20 hover:bg-sand/70 hover:text-nocturne hover:shadow-[var(--shadow-md)] active:scale-[0.98]"
              : "cursor-not-allowed opacity-45 shadow-none"
          )}
        >
          <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </div>
  );
}
