FROM node:22-alpine AS builder
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
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
RUN corepack enable pnpm && corepack install -g pnpm@latest-9
COPY  . .
RUN pnpm install
RUN pnpm run build
EXPOSE 5001
CMD [ "pnpm", "start" ]
