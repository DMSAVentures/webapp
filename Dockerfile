# Use an official Node.js image as a base image
FROM node:22-alpine AS builder


# Accept build arguments for environment variables
ARG VITE_PUBLIC_GOOGLE_CLIENT_ID
ARG VITE_PUBLIC_GOOGLE_REDIRECT_URL
ARG VITE_PUBLIC_API_URL
ARG VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your Next.js app into the container
COPY . .

# Set environment variables at build time
ENV VITE_PUBLIC_GOOGLE_CLIENT_ID=${VITE_PUBLIC_GOOGLE_CLIENT_ID}
ENV VITE_PUBLIC_GOOGLE_REDIRECT_URL=${VITE_PUBLIC_GOOGLE_REDIRECT_URL}
ENV VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY=${VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY}


# Build the Next.js app
RUN npm run build

# Use a lightweight image for the final container
FROM node:22-alpine AS runner

# Install curl
RUN apk --no-cache add curl

# Set the working directory in the container
WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/.next ./.next
COPY package.json package-lock.json ./

# Install production-only dependencies
RUN npm ci --only=production

# Set environment variables for Next.js
ENV NODE_ENV production

# Expose the port your Next.js app runs on
EXPOSE 3000

# Command to start the Next.js app
CMD ["npm", "run", "start"]
