import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blogs");

export type PostMeta = {
  slug: string;
  title: string;
  publishedAt: string;
  description?: string;
  tags?: string[];
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
        tags: data.tags ?? [],
        pinned: data.pinned ?? false,
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
    tags: data.tags ?? [],
    pinned: data.pinned ?? false,
    coverImage: data.coverImage,
    estimatedReadingTime: readingTime(content),
    content,
  };
}
