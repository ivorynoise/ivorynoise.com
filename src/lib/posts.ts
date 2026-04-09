import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { BlogCategory } from "./post-taxonomy";

const POSTS_DIR = path.join(process.cwd(), "content/blogs");

export type { BlogCategory };

/** YAML front matter keys — any one set truthy surfaces the post under "Featured" on /blog (checked in this order). */
const HIGHLIGHT_KEYS = ["highlight", "pinned", "featured"] as const;

function isTruthyFrontmatter(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "string") {
    const s = value.toLowerCase().trim();
    return s === "true" || s === "yes" || s === "1";
  }
  return false;
}

function readHighlightFromMatter(data: Record<string, unknown>): boolean {
  for (const key of HIGHLIGHT_KEYS) {
    if (isTruthyFrontmatter(data[key])) return true;
  }
  return false;
}

function readCategoryFromMatter(data: Record<string, unknown>): BlogCategory {
  const v = data.category;
  if (v === "technical" || v === "non-technical" || v === "financial") return v;
  return "non-technical";
}

function readExternalUrl(data: Record<string, unknown>): string | undefined {
  const v = data.externalUrl ?? data.external_url;
  if (typeof v !== "string" || !v.trim()) return undefined;
  return v.trim();
}

export type PostMeta = {
  slug: string;
  title: string;
  publishedAt: string;
  description?: string;
  /** Optional byline for list + pinned rows */
  author?: string;
  tags?: string[];
  category: BlogCategory;
  /** If set, featured and list links open this URL; `/blog/[slug]` redirects here. */
  externalUrl?: string;
  /** Featured / pinned post (from front matter: `highlight`, `pinned`, or `featured`). */
  pinned?: boolean;
  coverImage?: string;
  estimatedReadingTime?: number;
};

export type PostFull = PostMeta & { content: string };

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function slugFromFile(filename: string): string {
  return filename.replace(/\.md$/, "");
}


/** Pinned / featured posts (same front matter flags as `pinned` on `PostMeta`). */
export function getPinnedPosts(): PostMeta[] {
  return getAllPosts().filter((p) => p.pinned);
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug: slugFromFile(filename),
        title: data.title ?? slugFromFile(filename),
        publishedAt: data.date ?? new Date().toISOString(),
        description: data.description,
        author: typeof data.author === "string" ? data.author.trim() || undefined : undefined,
        tags: data.tags ?? [],
        category: readCategoryFromMatter(data as Record<string, unknown>),
        externalUrl: readExternalUrl(data as Record<string, unknown>),
        pinned: readHighlightFromMatter(data as Record<string, unknown>),
        coverImage: data.coverImage,
        estimatedReadingTime: readingTime(content),
      } satisfies PostMeta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}


export function getPostBySlug(slug: string): PostFull | null {
  const filepath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    publishedAt: data.date ?? new Date().toISOString(),
    description: data.description,
    author: typeof data.author === "string" ? data.author.trim() || undefined : undefined,
    tags: data.tags ?? [],
    category: readCategoryFromMatter(data as Record<string, unknown>),
    externalUrl: readExternalUrl(data as Record<string, unknown>),
    pinned: readHighlightFromMatter(data as Record<string, unknown>),
    coverImage: data.coverImage,
    estimatedReadingTime: readingTime(content),
    content,
  };
}
