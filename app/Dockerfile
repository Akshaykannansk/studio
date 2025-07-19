# Dockerfile

# 1. Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Add a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files from the builder stage
# Using public* makes this optional if the directory doesn't exist
COPY --from=builder /app/public* ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set user and expose port
USER nextjs
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
