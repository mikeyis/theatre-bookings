# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Create a basic package.json if it doesn't exist
RUN if [ ! -f package.json ]; then \
    echo '{"name":"theatre-bookings","version":"1.0.0","scripts":{"dev":"next dev","build":"next build","start":"next start"}}' > package.json; \
    fi

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install Next.js if it's not already in the dependencies
RUN if ! grep -q '"next":' package.json; then npm install next@latest react@latest react-dom@latest; fi

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
