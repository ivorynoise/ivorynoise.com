# Ivory Noise

A modern, minimalist portfolio and writing site for Deepak Aggarwal (Cofounder & CTO, Synthlane Technologies). Built with Astro, TypeScript, and Tailwind CSS.

## Features

- **About & Bio:** Custom landing page with profile, philosophy, and core expertise.
- **Blog System:** File-based Markdown blog (`content/blogs/*.md`) with featured posts, archive, and custom table support.
- **Minimal, Editorial UI:** Custom color palette, Playfair Display & Source Sans 3 fonts, and subtle animations.
- **No CMS:** All content is local, no Sanity or external CMS dependencies.
- **Fully Responsive:** Mobile-first, accessible, and fast.

## Tech Stack

- [Astro](https://astro.build/) (static output, content collections)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [rehype-highlight](https://github.com/rehypejs/rehype-highlight) (code highlighting)
- [Lucide](https://lucide.dev/) icons, inlined as SVG

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to view the site.

## Content & Customization

- **Blog posts:** Add Markdown files to `content/blogs/`. Front matter is YAML between `---` lines. Common fields:
  - `title`, `date` (ISO string), `description`, `tags` (array), optional `coverImage` (URL).
  - **Feature at top of /blog** — set any one of `highlight: true`, `pinned: true`, or `featured: true` (strings like `"true"` also work). Featured posts render in the grid above “All posts”, ordered by `date` like the rest.
- **Profile image:** Place your image at `public/images/deepak.jpg`.
- **Favicon:** Place your SVG favicon as `src/app/icon.svg`.

---
