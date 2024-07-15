FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app

RUN pnpm install
RUN pnpm run build

EXPOSE 5000
CMD [ "pnpm", "start" ]
