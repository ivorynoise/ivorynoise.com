# syntax=docker/dockerfile:1.4
ARG TARGETPLATFORM=linux/amd64
FROM --platform=$TARGETPLATFORM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@8.15.5 --activate
RUN apk update && apk add --no-cache libc6-compat

FROM base AS deps
WORKDIR /app
COPY package.json ./
RUN npm install 

FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM base AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
	&& adduser --system --uid 1001 nextjs \
	&& mkdir -p /app/.next/cache \
	&& chown -R nextjs:nodejs /app/.next
USER nextjs
# Copy Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
