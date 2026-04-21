# Use official Node image for building and runtime
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies and generate Prisma client for build
COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
