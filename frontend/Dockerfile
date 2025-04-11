# Stage 1: Build the React app
FROM node:18 AS build

# Set working directory inside container
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve with `serve` package (static file server)
FROM node:18-slim

# Install `serve`
RUN npm install -g serve

# Copy built files from the build stage
COPY --from=build /app/build /app/build

# Set working directory
WORKDIR /app/build

# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["serve", "-s", ".", "-l", "3000"]
