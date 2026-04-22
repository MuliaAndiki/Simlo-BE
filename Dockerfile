# --- Stage Builder ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

RUN npx prisma generate
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]