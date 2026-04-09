export type BlogCategory = "technical" | "non-technical" | "financial";

export const BLOG_CATEGORY_ORDER: readonly BlogCategory[] = [
  "technical",
  "non-technical",
  "financial",
];

export const BLOG_CATEGORY_LABEL: Record<BlogCategory, string> = {
  technical: "Technical",
  "non-technical": "Non-technical",
  financial: "Financial",
};
