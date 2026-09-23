FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p /app/data/session
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV WEB_PORT=3000
ENV WEB_HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "src/index.js"]
