import Link from "next/link";

import { inlineLinkClass } from "@/lib/inline-link";
import { getPostHref, isExternalPost } from "@/lib/post-links";
import type { PostMeta } from "@/lib/posts";
import { getPinnedPosts } from "@/lib/posts";
import { cn } from "@/lib/utils";

function formatListDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  /** Tighter top margin under the blog index header rule. */
  compact?: boolean;
};

function PinnedRow({ post }: { post: PostMeta }) {
  const href = getPostHref(post);
  const external = isExternalPost(post);

  return (
    <li className="font-sans text-pretty text-nocturne">
      <time
        className="font-mono text-[0.8125rem] tabular-nums text-nocturne/48"
        dateTime={post.publishedAt}
      >
        {formatListDate(post.publishedAt)}
      </time>
      <span className="text-nocturne/30">{` : `}</span>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={inlineLinkClass}
        >
          {post.title}
        </a>
      ) : (
        <Link href={href} className={inlineLinkClass}>
          {post.title}
        </Link>
      )}
    </li>
  );
}

export function PinnedPostsSection({ compact }: Props) {
  const pinned = getPinnedPosts();
  if (pinned.length === 0) return null;

  return (
    <section
      className={cn(compact ? "mt-6" : "mt-10")}
      aria-labelledby="pinned-posts-heading"
    >
      <div className="w-full" style={{ maxWidth: "var(--max-w)" }}>
        <p
          id="pinned-posts-heading"
          className="text-label mb-3 text-nocturne/45"
        >
          Pinned
        </p>
        <ul className="list-disc space-y-1.5 pl-4 marker:text-nocturne/22">
          {pinned.map((post) => (
            <PinnedRow key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}
