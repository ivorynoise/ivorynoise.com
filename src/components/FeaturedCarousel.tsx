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
import { getPostHref, isExternalPost } from "@/lib/post-links";
import { inlineLinkClass } from "@/lib/inline-link";
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
    external: isExternalPost(post),
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
  variant,
}: {
  post: PostMeta;
  interactive: boolean;
  isActive: boolean;
  dragBind: DragBind | null;
  variant: "default" | "minimal";
}) {
  const minimal = variant === "minimal";
  const imgWrapClass = minimal
    ? "relative overflow-hidden rounded-[var(--radius-md)] outline-none"
    : "relative overflow-hidden rounded-[var(--radius-sm)] outline-none";

  const imgFrame = minimal
    ? "h-[132px] w-full sm:h-[148px] md:h-[156px]"
    : "h-[200px] w-full sm:h-[220px] md:h-[248px]";

  const imgInner = (
    <>
      {post.coverImage ? (
        <img
          src={post.coverImage}
          alt=""
          className={`${imgFrame} object-cover`}
          draggable={false}
        />
      ) : (
        <div className={`${imgFrame} bg-sand/50`} aria-hidden />
      )}
      {interactive && isActive && !minimal ? (
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

  const href = getPostHref(post);
  const external = isExternalPost(post);
  const teaserClassName = minimal
    ? "group mt-5 block w-full text-left outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-nocturne/20 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    : "group mt-8 block max-w-2xl mx-auto outline-none focus-visible:ring-2 focus-visible:ring-nocturne/25 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

  const teaserInner = (
    <>
      <p
        className="text-nocturne/50 tabular-nums"
        style={{
          fontSize: minimal ? "var(--text-sm)" : "var(--text-xs)",
          letterSpacing: minimal ? "0.01em" : "0.02em",
        }}
      >
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        {post.estimatedReadingTime != null && !external ? (
          <>
            <span className="mx-1.5 text-nocturne/25" aria-hidden>
              ·
            </span>
            {post.estimatedReadingTime} min read
          </>
        ) : null}
        {external ? (
          <>
            <span className="mx-1.5 text-nocturne/25" aria-hidden>
              ·
            </span>
            <span>External</span>
          </>
        ) : null}
      </p>

      <h2
        className="mt-2.5 text-balance text-nocturne font-semibold leading-snug tracking-tight transition-colors group-hover:text-slate"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: minimal ? "var(--text-title)" : "clamp(1.375rem, 3.2vw, 2rem)",
        }}
      >
        {post.title}
      </h2>

      {post.description ? (
        <p
          className="mt-2 text-pretty text-nocturne/50 line-clamp-2"
          style={{ fontSize: "var(--text-sm)", lineHeight: 1.65 }}
        >
          {post.description}
        </p>
      ) : null}

      {minimal ? (
        <p
          className={cn(inlineLinkClass, "mt-4 group-hover:opacity-100")}
          style={{ fontSize: "var(--text-sm)" }}
        >
          {external ? "Open article →" : "Read →"}
        </p>
      ) : (
        <p
          className="mt-5 inline-block border-b border-nocturne/25 pb-px text-nocturne/70 transition-colors group-hover:border-nocturne/50 group-hover:text-nocturne"
          style={{ fontSize: "var(--text-sm)" }}
        >
          {external ? "Open link" : "Read"}
        </p>
      )}
    </>
  );

  return (
    <article className="w-full">
      {dragBind ? (
        <div className={imgWrapClass} {...dragBind}>
          {imgInner}
        </div>
      ) : (
        <div
          className={imgWrapClass}
          style={{
            border: "var(--border)",
            boxShadow: minimal ? "var(--shadow-sm)" : undefined,
          }}
        >
          {imgInner}
        </div>
      )}

      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={teaserClassName}
          onClick={() => capturePostClick(post)}
        >
          {teaserInner}
        </a>
      ) : (
        <Link href={href} className={teaserClassName} onClick={() => capturePostClick(post)}>
          {teaserInner}
        </Link>
      )}
    </article>
  );
}

export function FeaturedCarousel({
  posts,
  variant = "default",
}: {
  posts: PostMeta[];
  variant?: "default" | "minimal";
}) {
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
          boxShadow: variant === "minimal" ? "var(--shadow-sm)" : undefined,
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
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>

      {interactive ? (
        <div
          className={cn(
            "mt-6 flex w-full items-center justify-between gap-4",
            variant === "default" && "mx-auto mt-8 max-w-2xl gap-6"
          )}
        >
          <button
            type="button"
            aria-label="Previous featured post"
            className={cn(
              "rounded-[var(--radius-sm)] p-2 text-nocturne/40 transition-colors hover:bg-sand/50 hover:text-nocturne",
              variant === "minimal" ? "min-h-9 min-w-9" : "min-h-11 min-w-11"
            )}
            style={{ border: "var(--border)" }}
            onClick={() => go(-1)}
          >
            <ChevronLeft
              className={cn("mx-auto", variant === "minimal" ? "size-4" : "size-5")}
              strokeWidth={1.25}
            />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
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
                    ? variant === "minimal"
                      ? "h-1 w-6 bg-nocturne/40"
                      : "h-1.5 w-7 bg-nocturne/65"
                    : variant === "minimal"
                      ? "size-1 bg-nocturne/15 hover:bg-nocturne/30"
                      : "size-1.5 bg-nocturne/20 hover:bg-nocturne/35"
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next featured post"
            className={cn(
              "rounded-[var(--radius-sm)] p-2 text-nocturne/40 transition-colors hover:bg-sand/50 hover:text-nocturne",
              variant === "minimal" ? "min-h-9 min-w-9" : "min-h-11 min-w-11"
            )}
            style={{ border: "var(--border)" }}
            onClick={() => go(1)}
          >
            <ChevronRight
              className={cn("mx-auto", variant === "minimal" ? "size-4" : "size-5")}
              strokeWidth={1.25}
            />
          </button>
        </div>
      ) : null}
    </div>
  );
}
