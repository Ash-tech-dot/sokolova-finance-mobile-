# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Need build tools for better-sqlite3 (native module)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .

# Build Next.js (skip lint to avoid blocking on warnings)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache python3 make g++

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy built app and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/app ./app
COPY --from=builder /app/components ./components
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/next.config.js ./

# Persistent data directory (mounted from host/volume)
RUN mkdir -p /app/data

EXPOSE 3000
CMD ["npm", "start"]
