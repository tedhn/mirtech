# File: mirtech/fe/Dockerfile

# Use a base image that supports Bun or install Bun manually.
# For simplicity, we'll start from a node image and install Bun.
FROM node:20-alpine

# Install Bun
# Note: You can also use a dedicated Bun image if available and stable (e.g., oven/bun:latest)
RUN npm install -g bun

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies using Bun
# Bun uses package.json and bun.lockb
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy all the rest of the application source code
COPY . .

# Expose the default Next.js dev port
EXPOSE 3000

# The CMD is overridden in docker-compose.yml to use 'bun dev'