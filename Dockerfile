FROM node:lts-alpine AS builder

RUN apk add --no-cache curl

ENV SHELL /bin/bash

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
ENV PATH="/root/.local/share/pnpm:/root/.local/share/pnpm/global/5/node_modules/.bin:$PATH"

COPY . /app
WORKDIR /app
RUN pnpm i
RUN pnpm run build

FROM node:lts-alpine

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=buildER /app/dist /app/dist

EXPOSE 5000

CMD [ "pnpm", "start" ]
