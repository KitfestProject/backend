FROM node:lts-alpine AS builder

WORKDIR /app

RUN corepack enable pnpm && corepack install -g pnpm@latest-9

COPY  . .

RUN pnpm install


RUN pnpm run build

EXPOSE 5001

CMD [ "pnpm", "start" ]
