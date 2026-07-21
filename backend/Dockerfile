# syntax=docker/dockerfile:1

# Stage 1 — build (prisma generate + nest build)
FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# "build" = "prisma generate && nest build". Migrations NAO rodam aqui:
# o banco nao esta acessivel durante o build da imagem.
RUN npm run build

# Stage 2 — runtime de producao
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
# A API usa dist/generated/ (compilado pelo Nest). O "prisma migrate deploy"
# roda num servico dedicado (profile "tools", stage "build") — o runtime
# nao precisa mais da CLI do Prisma nem de ./src/config.
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
# Falha o build cedo se o client Prisma nao foi compilado para dist/.
# prisma generate cria generated/prisma/*.ts; nest build gera dist/generated/prisma/*.js.
RUN test -f dist/generated/prisma/client.js

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "dist/src/main.js"]
