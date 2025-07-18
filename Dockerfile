# 1. Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy config files and source code
COPY package*.json ./
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY next.config.ts .
COPY components.json .
COPY src ./src

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# 2. Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy the standalone output from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The Next.js app will run on port 3000 by default
EXPOSE 3000

CMD ["node", "server.js"]
