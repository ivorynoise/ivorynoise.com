import { getAllPosts } from "@/lib/posts";
import { getPostHref } from "@/lib/post-links";
import { site } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteItemLink(base: string, post: ReturnType<typeof getAllPosts>[number]): string {
  const h = getPostHref(post);
  if (h.startsWith("http://") || h.startsWith("https://")) return h;
  return `${base}${h.startsWith("/") ? h : `/${h}`}`;
}

export async function GET(request: Request) {
  const base = new URL(request.url).origin;
  const posts = getAllPosts();

  const channelTitle = `${site.name} — Writing`;
  const channelLink = `${base}/blog`;
  const channelDescription =
    "Technical, non-technical, and financial writing — internal notes and external links.";

  const itemsXml = posts
    .map((post) => {
      const link = absoluteItemLink(base, post);
      const pub = new Date(post.publishedAt).toUTCString();
      const guid = post.externalUrl?.trim() ? link : `${base}/blog/${post.slug}`;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(guid)}</guid>
      <pubDate>${pub}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
