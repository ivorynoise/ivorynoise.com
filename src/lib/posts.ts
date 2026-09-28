import { type CollectionEntry, getCollection } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Newest first. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection("blog");
  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

export function getPostHref(post: Post): string {
  return post.data.externalUrl ?? `/blog/${post.id}`;
}

/** Minutes at 200 words/min. */
export function readingTime(body = ""): number {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
}
