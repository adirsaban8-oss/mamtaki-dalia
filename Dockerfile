# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────────────────────────────
# Mamtaki Dalia — Next.js 16 production image
# Multi-stage: deps → builder → runner. Uses Next's standalone output
# so the runner image only carries what the server needs.
# Base: Debian-slim (sharp native bindings work cleanly here, unlike Alpine).
# ─────────────────────────────────────────────────────────────────────

FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ── 1. Install dependencies ─────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ── 2. Build the app ───────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── 3. Lean runtime ────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# Copy public assets and Next's standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Railway / Vercel / etc. inject PORT at runtime; Next reads $PORT.
EXPOSE 3000

CMD ["node", "server.js"]
