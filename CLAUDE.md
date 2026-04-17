# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ivory Noise is a personal portfolio and blog site built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. It uses file-based Markdown content (no CMS/database), PostHog analytics, and deploys via Docker to a Harbor registry.

## Development Setup
- Node Version: 22 (v22.x)
- Package Manager: npm (Dockerfile and package-lock.json; pnpm-lock.yaml also present)
- Secret Manager: Pre-authenticated Infisical CLI

## Environment Variables
- `BREVO_API_KEY` - Brevo API Key to authenticate Newsletter service
- `BREVO_LIST_ID` - Brevo LIST key to add users to the newsletter
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` — Required for analytics (also passed as Docker build arg)
- `NEXT_PUBLIC_POSTHOG_HOST` — Optional, defaults to `https://us.i.posthog.com`

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
- `/api/newsletter` — POST endpoint for Brevo newsletter signup

### Analytics (PostHog)
- Client-side: `posthog-js` initialized in `instrumentation-client.ts`
- Server-side: `posthog-node` in `src/lib/posthog-server.ts` for newsletter events
- `TrackedLink` component wraps links with event capture
- API requests proxied through Next.js rewrites (`/ingest/*` → PostHog)
- Key events: `cta_clicked`, `social_link_clicked`, `blog_post_clicked`, `newsletter_submitted` (client-side), `newsletter_subscribed` (server-side, after successful Brevo signup)

### Components
- `src/components/ui/` — Base UI (`@base-ui/react`) primitives (Button, Input, Label), wired via shadcn-style `components.json`
- `src/components/` — Feature components (Header, Footer, BlogCard, NewsletterForm, SocialLinks, TrackedLink, FeaturedCarousel, PinnedBlogCarousel, ThemeToggle)
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

Docker multi-stage build (Node 24-alpine) with standalone Next.js output. `build.sh` builds and pushes to `central-harbor.ext.synthlane.com/internal/ivorynoise-com`. CI runs via GitHub Actions (`.github/workflows/ivory-noise-fe.yml`) with manual dispatch, supporting dev/prod environments.

## Project-Specific Gotchas
- Never read anything inside .ignore/ directory

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes