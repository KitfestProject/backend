FROM node:lts-alpine AS builder

RUN apk add --no-cache curl bash
ENV SHELL /bin/bash
RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
ENV PATH="/root/.local/share/pnpm:/root/.local/share/pnpm/global/5/node_modules/.bin:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM node:lts-alpine

RUN apk add --no-cache curl bash \
    && curl -fsSL https://get.pnpm.io/install.sh | sh - \
    && apk del curl
ENV SHELL /bin/bash
ENV PATH="/root/.local/share/pnpm:/root/.local/share/pnpm/global/5/node_modules/.bin:$PATH"

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 5000

CMD [ "pnpm", "start" ]
