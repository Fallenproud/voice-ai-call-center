# License Server Dockerfile for Velora Voice™

FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 license
RUN adduser --system --uid 1001 license

# Copy built application
COPY --from=builder --chown=license:license /app/dist ./dist
COPY --from=builder --chown=license:license /app/node_modules ./node_modules
COPY --from=builder --chown=license:license /app/package*.json ./

USER license

EXPOSE 3002

CMD ["node", "dist/index.js"]