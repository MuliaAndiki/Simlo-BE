
FROM node:20-slim AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src


RUN npx prisma generate
RUN npm run build


FROM node:20-slim AS runtime
WORKDIR /usr/src/app

COPY package*.json ./


COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma


RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]