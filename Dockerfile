# ---- Build Stage ----
FROM node:26-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    cp -R node_modules /prod_modules && \
    npm ci

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
RUN npm run build

# ---- Production Stage ----
FROM node:26-alpine AS runner

WORKDIR /app

COPY --from=builder /prod_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./

USER nestjs

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/main"]