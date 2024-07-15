FROM node:lts-alpine AS builder

RUN apk add --no-cache curl

RUN curl -fsSL https://get.pnpm.io/install.sh | sh -

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000

CMD [ "pnpm", "start" ]
