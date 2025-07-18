# 1. Builder Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port 9002
EXPOSE 9002

# Start the app
CMD ["npm", "start"]
