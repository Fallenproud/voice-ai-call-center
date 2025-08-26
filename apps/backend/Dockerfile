# Backend Dockerfile for Velora Voice™

FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
COPY package*.json ./
RUN npm ci --only=production

# Build stage
FROM base AS builder
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 backend
RUN adduser --system --uid 1001 backend

# Copy built application
COPY --from=builder --chown=backend:backend /app/dist ./dist
COPY --from=builder --chown=backend:backend /app/node_modules ./node_modules
COPY --from=builder --chown=backend:backend /app/package*.json ./
COPY --from=builder --chown=backend:backend /app/prisma ./prisma

USER backend

EXPOSE 3001

CMD ["node", "dist/main.js"]