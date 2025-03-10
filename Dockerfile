FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install dependencies
RUN apk update && apk add --no-cache \
    bash \
    wget \
    gnupg \
    udev \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

# Setup pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# Copy files and install dependencies
COPY . .
RUN pnpm install
RUN pnpm run build

# Multi-architecture build
FROM --platform=$TARGETPLATFORM node:20-alpine AS runner

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Re-install only the dependencies needed for runtime
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app

# Setup pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# Copy only what's needed from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 5001

CMD ["pnpm", "start"]
