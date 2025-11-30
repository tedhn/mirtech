# File: mirtech/be/Dockerfile

# Use a lean Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
# (In development, this is overridden by the volume mount, but good for build)
COPY . . 

# Expose the port FastAPI runs on
EXPOSE 8000

# The CMD is specified in docker-compose.yml