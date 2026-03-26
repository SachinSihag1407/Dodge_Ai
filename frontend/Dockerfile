# Build environment
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production environment
FROM nginx:alpine

# Copy built assets from builder
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration if necessary, otherwise use default
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
