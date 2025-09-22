#!/bin/bash

# Deployment script for DEV Egypt e-commerce platform

# Exit on any error
set -e

echo "Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Please run this script from the project root directory."
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
  echo "Error: Build failed. Dist directory not found."
  exit 1
fi

# Run database migrations
echo "Running database migrations..."
npm run db:push

# Start the application
echo "Starting the application..."
npm start

echo "Deployment completed successfully!"