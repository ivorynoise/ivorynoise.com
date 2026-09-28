import type { APIRoute } from "astro";
import { getAllPosts, getPostHref } from "@/lib/posts";
import { site } from "@/lib/site";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async () => {
  const base = site.url;
  const posts = await getAllPosts();

  const itemsXml = posts
    .map((post) => {
      const href = getPostHref(post);
      const link = href.startsWith("http") ? href : `${base}${href}`;
      const pub = new Date(post.data.date).toUTCString();
      const { description } = post.data;
      return `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      ${description ? `<description>${escapeXml(description)}</description>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${site.name} — Writing`)}</title>
    <link>${escapeXml(`${base}/blog`)}</link>
    <description>${escapeXml("Technical, non-technical, and financial writing — internal notes and external links.")}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
