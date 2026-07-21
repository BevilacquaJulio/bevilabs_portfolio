# Cliente Prisma (gerado)

Esta pasta **nao vai para o Git** nem e copiada do host no Docker build.

Recrie localmente:

```bash
cd backend
npx prisma generate
```

## Onde o runtime encontra o client

| Ambiente | Caminho usado |
|---|---|
| Desenvolvimento (`npm run start:dev`) | `backend/generated/prisma/` |
| Producao (container Docker) | `backend/dist/generated/prisma/` |

O Nest compila `generated/` para `dist/generated/` no build. Por isso, dentro do container,
`generated/prisma/client.js` na raiz pode nao existir — o correto e `dist/generated/prisma/client.js`.

Scripts de producao (`db:seed`, `db:reset-admin`) usam os arquivos compilados em `dist/prisma/`.
