# File: mirtech/fe/Dockerfile

# Use a stable Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all the rest of the application source code
# (This is mostly for the initial image; volume mount handles updates)
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# The CMD is specified in docker-compose.yml to run 'npm run dev'