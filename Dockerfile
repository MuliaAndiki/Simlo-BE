# Use official Node image for building and runtime
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies for build
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma
RUN npm run build

# Production image
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]
