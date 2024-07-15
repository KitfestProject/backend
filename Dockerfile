FROM node:20-slim AS base

WORKDIR /app

RUN npm install -g pnpm

RUN pnpm install

COPY . /app

RUN pnpm run build

EXPOSE 5000

CMD [ "pnpm", "start" ]
