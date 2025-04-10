# Use Node.js for building frontend
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Use Nginx to serve frontend
FROM nginx:alpine

# Copy built frontend files
COPY --from=build /app/build /usr/share/nginx/html

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
