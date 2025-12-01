# Dockerfile
FROM node:18-alpine AS builder
LABEL authors="Diego"

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# -------- Runtime --------
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]