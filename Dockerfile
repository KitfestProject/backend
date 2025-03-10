FROM --platform=linux/arm64 node:20-alpine AS builder

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Update repositories with more resilience
RUN apk update --no-cache || (sleep 2 && apk update --no-cache)

# Install packages one by one to identify problematic packages
RUN apk add --no-cache bash
RUN apk add --no-cache wget
RUN apk add --no-cache gnupg
# udev might be problematic on some Alpine versions for ARM64
RUN apk add --no-cache udev || echo "Skipping udev, might not be available"
RUN apk add --no-cache chromium
RUN apk add --no-cache nss
RUN apk add --no-cache freetype
RUN apk add --no-cache harfbuzz
RUN apk add --no-cache ca-certificates
RUN apk add --no-cache ttf-freefont

WORKDIR /app

# Setup pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest-9

# Copy files and install dependencies
COPY . .
RUN pnpm install
RUN pnpm run build

EXPOSE 5001

CMD [ "pnpm", "start" ]
