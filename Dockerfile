FROM node:22.5.0-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable --install

WORKDIR /app

COPY . .

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:22.5.0-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable --install

WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["pnpm", "start"]
