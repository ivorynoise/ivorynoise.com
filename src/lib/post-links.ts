/** Pure helpers safe for client components (no `fs`). */

export type PostLinkFields = {
  slug: string;
  externalUrl?: string;
};

export function getPostHref(post: PostLinkFields): string {
  const u = post.externalUrl?.trim();
  if (u) return u;
  return `/blog/${post.slug}`;
}

export function isExternalPost(post: PostLinkFields): boolean {
  return Boolean(post.externalUrl?.trim());
}
