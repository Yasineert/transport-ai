FROM node:18-alpine AS base

# Install dependencies for pnpm
RUN apk add --no-cache libc6-compat
RUN corepack enable

# Set working directory
WORKDIR /app

# Install dependencies
FROM base AS dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build the Next.js application
FROM dependencies AS build
COPY . .
RUN pnpm build

# Production image
FROM base AS production
WORKDIR /app

ENV NODE_ENV production

# Copy only necessary files
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

USER node

EXPOSE 3000

# Create health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 