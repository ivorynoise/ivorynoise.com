# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ivory Noise is a personal portfolio and blog site built with Astro 7 (static output), TypeScript, and Tailwind CSS v4. No React. It uses file-based Markdown content (no CMS/database) and PostHog analytics.

## Development Setup
- Node Version: 22.12+
- Package Manager: npm

## Environment Variables
None. The PostHog project token is public and set in `src/layouts/Base.astro`.

## Commands

```bash
npm run dev       # Local dev server on port 4321
npm run build     # Static build to dist/
npm run preview   # Serve dist/ locally
npm run check     # astro check (types + .astro files)
```

No test framework is configured.

## Architecture

### Content System
Blog posts are Markdown files in `content/blogs/`, loaded as the `blog` content collection (`src/content.config.ts`, schema: title, date, description, tags, externalUrl). `src/lib/posts.ts` provides `getAllPosts()`, `getPostHref()` and `readingTime()` (200 words/min). Posts with `externalUrl` get a redirect page at `/blog/<slug>`.

### Routing
- `/` — Home/about page (hero, background, philosophy, expertise sections)
- `/blog` — Blog listing
- `/blog/[slug]` — Individual post; Markdown via Astro's `unified()` processor + `rehype-highlight` (config in `astro.config.mjs`)
- `/rss.xml` — RSS feed (`src/pages/rss.xml.ts`)
- `/reading` — Curated reading list (data from `src/data/reading.ts`)
- `/books` — Book list (data from `src/data/books.ts`)

### Analytics (PostHog)
- Client-side only: `posthog-js` initialized in `src/layouts/Base.astro`, sending via the managed reverse proxy on `t.<domain>` (t.deepakaggarwal.me / t.ivorynoise.com)
- Only initializes on production hostnames (deepakaggarwal.me, ivorynoise.com), so localhost and preview deploys are never tracked
- Key event: `social_link_clicked` (any link with `data-social`)

### Components
- `src/layouts/Base.astro` — HTML shell, theme init, PostHog
- `src/components/` — Header, Footer, ThemeToggle, Icon (inline lucide SVGs), blog/Toc; interactivity is plain `<script>` tags
- `src/data/` — Static TypeScript data files: `reading.ts` (reading list), `books.ts` (books)

### Design System (src/styles/global.css)
Custom CSS variables define the entire design language:
- **Colors**: `--color-nocturne` (dark), `--color-slate`, `--color-sand`, `--color-cream` (light), `--color-forest` (green accent), `--color-mauve`
- **Fluid type scale**: `--text-hero` through `--text-label` using `clamp()`
- **Layout**: `--max-w: 74rem`, `--px` for responsive padding, `--section-py` for vertical rhythm
- **Motion**: `--dur-fast/base/slow` timing tokens, `fade-up`/`fade-in`/`soft-float` keyframe animations
- **Prose styles**: `.prose-content` class for Markdown rendering

### Path Aliases
`@/*` maps to `./src/*` (configured in tsconfig.json).


## Build & Deploy

Static build to `dist/` (`build.format: "file"`, so URLs have no trailing slash). Cloudflare Workers Builds deploys on push to `main` using `wrangler.jsonc` (build command lives there); other branches get preview versions.

## Project-Specific Gotchas
- Never read anything inside .ignore/ directory

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes