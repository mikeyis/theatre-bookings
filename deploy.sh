#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Define variables
APP_NAME="theatre-bookings"
REPO_URL="https://github.com/yourusername/theatre-bookings.git"
APP_DIR="/opt/$APP_NAME"
DOCKER_COMPOSE_FILE="$APP_DIR/docker-compose.yml"

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Clone or pull the latest code
if [ -d "$APP_DIR" ]; then
    echo "Updating existing repository..."
    cd "$APP_DIR"
    git pull
else
    echo "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Create .env file
echo "Creating .env file..."
cat << EOF > .env
DATABASE_URL=mysql://gslcloudpaneldata:CDpp8xFm9a7SNC41z8jW@localhost:3306/opportunity
EOF

# Create Dockerfile
echo "Creating Dockerfile..."
cat << EOF > Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3030
CMD ["npm", "start"]
EOF

# Create docker-compose.yml
echo "Creating docker-compose.yml..."
cat << EOF > docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3030:3000"
    environment:
      - DATABASE_URL=mysql://gslcloudpaneldata:CDpp8xFm9a7SNC41z8jW@host.docker.internal:3306/opportunity
    extra_hosts:
      - "host.docker.internal:host-gateway"
EOF

# Build and start Docker containers
echo "Building and starting Docker containers..."
docker-compose up --build -d

# Print success message
echo "Deployment completed successfully!"
echo "Your application should now be running at http://localhost:3030"