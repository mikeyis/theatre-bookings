#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Function to print error messages
error() {
    echo "Error: $1" >&2
    exit 1
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker and try again."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose and try again."
fi

# Create a directory for the project
PROJECT_DIR="theatre-bookings"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Clone the repository
echo "Cloning the repository..."
git clone https://github.com/mikeyis/theatre-bookings.git .

# Check if the clone was successful
if [ $? -ne 0 ]; then
    error "Failed to clone the repository. Please check your internet connection and try again."
fi

# Create .env file
echo "Creating .env file..."
cat << EOF > .env
DATABASE_URL=mysql://gslcloudpaneldata:CDpp8xFm9a7SNC41z8jW@host.docker.internal:3306/opportunity
EOF

# Build and start the Docker container
echo "Building and starting the Docker container..."
docker-compose up --build -d

# Check if the container is running
if [ $? -ne 0 ]; then
    error "Failed to start the Docker container. Please check the Docker logs for more information."
fi

# Print success message and instructions
echo "Setup complete! The theatre-bookings application is now running."
echo "You can access it at http://localhost:3000"
echo "To view the logs, run: docker-compose logs -f"
echo "To stop the application, run: docker-compose down"