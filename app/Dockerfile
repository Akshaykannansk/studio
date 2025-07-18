# Base image for dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Next.js build
WORKDIR /app/src
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built assets from the correct location
COPY --from=builder /app/src/.next ./src/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/package.json ./src/package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/public ./public

WORKDIR /app/src

EXPOSE 9002

CMD ["npm", "start"]
