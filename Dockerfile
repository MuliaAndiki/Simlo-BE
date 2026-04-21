# --- Stage Builder ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
# Pastikan semua library terinstall untuk build
RUN npm install

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Build TS dan Generate Prisma Client
RUN npm run build

# --- Stage Runtime ---
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Salin package files
COPY package*.json ./

# Salin node_modules hasil install (termasuk devDeps untuk sementara)
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# PENTING: Generate ulang client di runtime untuk memastikan 
# binary engine sesuai dengan environment alpine
RUN npx prisma generate

# Hapus devDependencies setelah prisma generate selesai
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/server.js"]