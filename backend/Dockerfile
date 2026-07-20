# syntax=docker/dockerfile:1

# Stage 1 — build (prisma generate + nest build)
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# "build" = "prisma generate && nest build". Migrations NAO rodam aqui:
# o banco nao esta acessivel durante o build da imagem.
RUN npm run build

# Stage 2 — runtime de producao
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache wget

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/generated ./generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
# prisma.config.ts importa direto de ./src/config (TS fonte, nao o dist/) —
# precisa existir no runtime pra "prisma migrate deploy" rodar dentro do container.
COPY --from=build /app/src/config ./src/config
COPY --from=build /app/node_modules/.bin/prisma ./node_modules/.bin/prisma

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "dist/src/main.js"]
