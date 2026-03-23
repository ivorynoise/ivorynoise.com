export type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  pinned?: boolean;
  publishedAt: string;
  description?: string;
  tags?: string[];
  body?: unknown;
  estimatedReadingTime?: number;
};
