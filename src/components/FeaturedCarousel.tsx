"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import posthog from "posthog-js";

import type { PostMeta } from "@/lib/posts";
import { cn } from "@/lib/utils";

const SWIPE_COMMIT_PX = 56;
const TAP_MAX_MS = 400;
const TAP_MAX_MOVE = 12;
const EDGE_TAP_RATIO = 0.28;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function capturePostClick(post: PostMeta) {
  posthog.capture("blog_post_clicked", {
    slug: post.slug,
    title: post.title,
    card_type: "featured_carousel",
  });
}

type DragBind = {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  style: React.CSSProperties;
};

function FeaturedSlide({
  post,
  interactive,
  isActive,
  dragBind,
}: {
  post: PostMeta;
  interactive: boolean;
  isActive: boolean;
  dragBind: DragBind | null;
}) {
  const imgWrapClass =
    "relative overflow-hidden rounded-[var(--radius-sm)] outline-none";

  const imgInner = (
    <>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt=""
          className="h-[200px] w-full object-cover sm:h-[220px] md:h-[248px]"
          draggable={false}
        />
      ) : (
        <div
          className="h-[200px] w-full bg-sand/60 sm:h-[220px] md:h-[248px]"
          aria-hidden
        />
      )}
      {interactive && isActive ? (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[28%] bg-gradient-to-r from-nocturne/[0.07] to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[28%] bg-gradient-to-l from-nocturne/[0.07] to-transparent"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute bottom-2 left-1/2 max-w-[90%] -translate-x-1/2 text-center text-nocturne/30"
            style={{ fontSize: "0.62rem", letterSpacing: "0.08em" }}
            aria-hidden
          >
            Swipe · tap sides
          </span>
        </>
      ) : null}
    </>
  );

  return (
    <article className="w-full">
      {dragBind ? (
        <div className={imgWrapClass} {...dragBind}>
          {imgInner}
        </div>
      ) : (
        <div className={imgWrapClass} style={{ border: "var(--border)" }}>
          {imgInner}
        </div>
      )}

      <Link
        href={`/blog/${post.slug}`}
        className="group mt-8 block max-w-2xl mx-auto outline-none focus-visible:ring-2 focus-visible:ring-forest/30 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        onClick={() => capturePostClick(post)}
      >
        <p
          className="text-nocturne/45"
          style={{ fontSize: "var(--text-xs)", letterSpacing: "0.02em" }}
        >
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.estimatedReadingTime != null ? (
            <>
              <span className="mx-2 text-nocturne/25" aria-hidden>
                ·
              </span>
              {post.estimatedReadingTime} min
            </>
          ) : null}
        </p>

        <h2
          className="mt-3 text-balance text-nocturne font-medium leading-snug tracking-tight transition-colors group-hover:text-forest"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.375rem, 3.2vw, 2rem)",
          }}
        >
          {post.title}
        </h2>

        {post.description ? (
          <p
            className="mt-3 text-pretty text-nocturne/50 line-clamp-2"
            style={{ fontSize: "var(--text-sm)", lineHeight: 1.7 }}
          >
            {post.description}
          </p>
        ) : null}

        <p
          className="mt-5 inline-block border-b border-nocturne/25 pb-px text-nocturne/70 transition-colors group-hover:border-nocturne/50 group-hover:text-nocturne"
          style={{ fontSize: "var(--text-sm)" }}
        >
          Read
        </p>
      </Link>
    </article>
  );
}

export function FeaturedCarousel({ posts }: { posts: PostMeta[] }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [pointerActive, setPointerActive] = useState(false);

  const count = posts.length;

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  const dragOrigin = useRef(0);
  const dragPointerId = useRef<number | null>(null);
  const movedPastTap = useRef(false);
  const tapStartTime = useRef(0);

  const settleDrag = useCallback(() => {
    setDragX(0);
    setPointerActive(false);
    dragPointerId.current = null;
    movedPastTap.current = false;
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (count < 2) return;
      dragOrigin.current = e.clientX;
      tapStartTime.current = typeof performance !== "undefined" ? performance.now() : Date.now();
      movedPastTap.current = false;
      dragPointerId.current = e.pointerId;
      setPointerActive(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [count]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragPointerId.current !== e.pointerId) return;
    const dx = e.clientX - dragOrigin.current;
    if (Math.abs(dx) > TAP_MAX_MOVE) movedPastTap.current = true;
    setDragX(dx);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragPointerId.current !== e.pointerId) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* released */
      }

      const dx = e.clientX - dragOrigin.current;
      const rect = e.currentTarget.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const w = rect.width;

      const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      const tapMs = now - tapStartTime.current;

      if (movedPastTap.current && Math.abs(dx) >= SWIPE_COMMIT_PX) {
        go(dx > 0 ? -1 : 1);
      } else if (!movedPastTap.current && tapMs < TAP_MAX_MS && w > 0) {
        if (localX < w * EDGE_TAP_RATIO) go(-1);
        else if (localX > w * (1 - EDGE_TAP_RATIO)) go(1);
      }

      settleDrag();
    },
    [go, settleDrag]
  );

  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (count < 2) return;
      if (ev.key === "ArrowLeft") go(-1);
      if (ev.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, go]);

  if (count === 0) return null;

  const interactive = count > 1;

  const dragBind: DragBind | null = interactive
    ? {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel: onPointerUp,
        style: {
          border: "var(--border)",
          touchAction: "none",
          cursor: pointerActive
            ? Math.abs(dragX) > 8
              ? ("grabbing" as const)
              : ("grab" as const)
            : ("grab" as const),
        },
      }
    : null;

  return (
    <div
      className="w-full"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured writing"
      aria-live="polite"
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "flex ease-[cubic-bezier(0.25,0.1,0.25,1)]",
            !pointerActive && "motion-reduce:transition-none motion-reduce:duration-0",
            !pointerActive && "duration-500"
          )}
          style={{
            transform: `translate3d(calc(-${index * 100}% + ${dragX}px), 0, 0)`,
          }}
        >
          {posts.map((post) => (
            <div
              key={post.slug}
              className="w-full shrink-0"
              aria-hidden={posts[index]?.slug !== post.slug}
            >
              <FeaturedSlide
                post={post}
                interactive={interactive}
                isActive={post.slug === posts[index]?.slug}
                dragBind={dragBind}
              />
            </div>
          ))}
        </div>
      </div>

      {interactive ? (
        <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between gap-6">
          <button
            type="button"
            aria-label="Previous featured post"
            className="min-h-11 min-w-11 rounded-[var(--radius-sm)] p-2 text-nocturne/35 transition-colors hover:bg-sand/40 hover:text-nocturne/90"
            style={{ border: "var(--border)" }}
            onClick={() => go(-1)}
          >
            <ChevronLeft className="mx-auto size-5" strokeWidth={1.25} />
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Slides"
          >
            {posts.map((post, i) => (
              <button
                key={post.slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${post.title}`}
                className={cn(
                  "rounded-full transition-[width,background-color] duration-300",
                  i === index
                    ? "h-1.5 w-7 bg-nocturne/65"
                    : "size-1.5 bg-nocturne/20 hover:bg-nocturne/35"
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next featured post"
            className="min-h-11 min-w-11 rounded-[var(--radius-sm)] p-2 text-nocturne/35 transition-colors hover:bg-sand/40 hover:text-nocturne/90"
            style={{ border: "var(--border)" }}
            onClick={() => go(1)}
          >
            <ChevronRight className="mx-auto size-5" strokeWidth={1.25} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
