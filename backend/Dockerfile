FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generate Prisma client
RUN npx prisma generate

COPY . .
RUN npm run build

RUN cp src/generated/prisma/*.node dist/generated/prisma/ 2>/dev/null || true

RUN npm prune --production

RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]