# Use BuildKit syntax
# syntax=docker/dockerfile:1.4

FROM node:20.10-slim

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Use Debian-based image which might have better ARM64 support
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-freefont-ttf \
    ca-certificates \
    wget \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Setup pnpm (using NPM instead of corepack which might have arch issues)
RUN npm install -g pnpm@latest-9

COPY . .
RUN pnpm install
RUN pnpm run build

EXPOSE 5001

CMD ["pnpm", "start"]
