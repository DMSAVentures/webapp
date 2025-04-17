# Build Stage
FROM node:23-slim AS builder

# Build-time env vars for Vite
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_GOOGLE_REDIRECT_URL
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLISHABLE_KEY

WORKDIR /app

COPY package.json package-lock.json ./

RUN apt-get update && apt-get install -y python3 g++ make

RUN npm install npm
RUN npm i @rollup/rollup-linux-x64-gnu --save-optional
# Install dependencies
RUN npm ci

# Copy full app source
COPY . .

# Build the Vite app
ENV VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
ENV VITE_GOOGLE_REDIRECT_URL=${VITE_GOOGLE_REDIRECT_URL}
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_STRIPE_PUBLISHABLE_KEY=${VITE_STRIPE_PUBLISHABLE_KEY}
ENV ROLLUP_FORCE_JS=true

RUN npm run build

# Serve Stage (use "serve" package to serve static files)
FROM node:23-slim AS runner

# Install a static file server
RUN npm install -g serve

WORKDIR /app

# Copy the built app from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the static server
CMD ["serve", "-s", "dist", "-l", "3000"]
