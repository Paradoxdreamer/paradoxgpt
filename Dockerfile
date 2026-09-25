# Stage 1: obfuscate
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY src ./src
COPY scripts ./scripts
COPY assets ./assets

RUN npm run build

# Stage 2: production — only dist + prod deps
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY assets ./assets
COPY .env.example ./

RUN mkdir -p /app/data/session
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV WEB_PORT=3000
ENV WEB_HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/index.js"]
