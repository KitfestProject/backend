FROM node:22-alpine AS builder

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apk update && apk add --no-cache \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    atk \
    libc6-compat \
    cairo \
    cups-libs \
    dbus \
    expat \
    fontconfig \
    gbm \
    glib \
    gtk+3.0 \
    nspr \
    nss \
    pango \
    libstdc++ \
    libx11 \
    libxcomposite \
    libxcursor \
    libxdamage \
    libxext \
    libxfixes \
    libxi \
    libxrandr \
    libxrender \
    libxss \
    libxtst \
    lsb-release \
    wget \
    xdg-utils

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

COPY  . .

RUN pnpm install


RUN pnpm run build

EXPOSE 5000

CMD [ "pnpm", "start" ]
