# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy root package.json and install root dependencies if any
COPY package.json package-lock.json* ./
RUN npm install

# Copy src package.json and install its dependencies
COPY src/package.json src/package-lock.json* ./src/
WORKDIR /app/src
RUN npm install

# 2. Build the application
FROM node:20-alpine AS builder
WORKDIR /app
# Copy all dependencies from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/node_modules ./src/node_modules
# Copy the rest of the source code
COPY . .

# Run the build command from the src directory
WORKDIR /app/src
RUN npm run build

# 3. Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copy production assets from the builder stage
COPY --from=builder /app/src/.next ./src/.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/node_modules ./src/node_modules
COPY --from=builder /app/src/package.json ./src/package.json

EXPOSE 9002

# The start command in src/package.json is just "next start".
# We need to tell it where to find the built application.
CMD ["npm", "run", "start", "--", "--prefix", "src"]
