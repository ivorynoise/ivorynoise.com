import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/blogs" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** If set, links open this URL and `/blog/<slug>` redirects here. */
    externalUrl: z.url().optional(),
  }),
});

export const collections = { blog };
