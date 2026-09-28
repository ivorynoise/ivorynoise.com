# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ivory Noise is a personal portfolio and blog site built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. It uses file-based Markdown content (no CMS/database) and PostHog analytics.

## Development Setup
- Node Version: 22 (v22.x)
- Package Manager: npm
- Secret Manager: Pre-authenticated Infisical CLI

## Environment Variables
None. The PostHog project token is public and set in `instrumentation-client.ts`.

## Commands

```bash
infisical run --env=prod -- npm run dev       # Local dev server on port 3000
infisical run --env=prod -- npm run build     # Production build
infisical run --env=prod -- npm run start     # Start production server
infisical run --env=prod -- npm run lint      # ESLint (next/core-web-vitals + typescript)
```

No test framework is configured.

## Architecture

### Content System
Blog posts are Markdown files in `content/blogs/` with YAML frontmatter (title, date, description, tags, pinned, coverImage). `src/lib/posts.ts` provides `getAllPosts()` and `getPostBySlug()` which parse these files with `gray-matter`. Blog post pages use `generateStaticParams()` for static generation at build time. Reading time is auto-calculated at 200 words/min.

### Routing
- `/` — Home/about page (hero, background, philosophy, expertise sections)
- `/blog` — Blog listing with featured (pinned) posts and archive
- `/blog/[slug]` — Individual post rendered with `react-markdown` + `remark-gfm` + `rehype-highlight`
- `/reading` — Curated reading list (data from `src/data/reading.ts`)
- `/books` — Book list (data from `src/data/books.ts`)

### Analytics (PostHog)
- Client-side only: `posthog-js` initialized in `instrumentation-client.ts`, sending directly to `us.i.posthog.com`
- Only initializes on production hostnames (deepakaggarwal.me, ivorynoise.com), so localhost and preview deploys are never tracked
- Key event: `social_link_clicked`

### Components
- `src/components/` — Feature components (Header, Footer, SocialLinks, ThemeToggle, blog/)
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging
- `src/data/` — Static TypeScript data files: `reading.ts` (reading list), `books.ts` (books)

### Design System (globals.css)
Custom CSS variables define the entire design language:
- **Colors**: `--color-nocturne` (dark), `--color-slate`, `--color-sand`, `--color-cream` (light), `--color-forest` (green accent), `--color-mauve`
- **Fluid type scale**: `--text-hero` through `--text-label` using `clamp()`
- **Layout**: `--max-w: 74rem`, `--px` for responsive padding, `--section-py` for vertical rhythm
- **Motion**: `--dur-fast/base/slow` timing tokens, `fade-up`/`fade-in`/`soft-float` keyframe animations
- **Prose styles**: `.prose-content` class for Markdown rendering

### Path Aliases
`@/*` maps to `./src/*` (configured in tsconfig.json).


## Build & Deploy

Static export (`output: "export"`) to `out/`. Cloudflare Workers Builds deploys on push to `main` using `wrangler.jsonc` (build command lives there); other branches get preview versions.

## Project-Specific Gotchas
- Never read anything inside .ignore/ directory

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes