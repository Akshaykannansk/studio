# Dockerfile

# 1. Base Image: Use an official Node.js image.
# Using alpine for a smaller image size.
FROM node:20-alpine AS base

# 2. Set up the working directory
WORKDIR /app

# 3. Install dependencies
# Use a separate step to leverage Docker's caching mechanism.
# Only re-install dependencies if package.json or package-lock.json changes.
FROM base AS deps
COPY package.json ./
# If you have a package-lock.json, copy it as well for deterministic builds
# COPY package-lock.json ./
RUN npm install

# 4. Build the application
# Copy the rest of the source code and build the Next.js app.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 5. Production Image
# Create a smaller, final image for production.
FROM base AS runner
WORKDIR /app

# Set environment variables for production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy the standalone output from the builder stage.
# This includes only the necessary files to run the app.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Expose the port Next.js runs on
EXPOSE 3000

# Set the user to a non-root user for security
# The node:alpine image creates a 'node' user automatically.
USER node

# The command to start the app
CMD ["node", "server.js"]
