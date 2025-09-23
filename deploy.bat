@echo off
REM Deployment script for DEV Egypt e-commerce platform

echo Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
  echo Error: package.json not found. Please run this script from the project root directory.
  exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm ci

REM Build the application
echo Building the application...
npm run build

REM Check if build was successful
if not exist "dist" (
  echo Error: Build failed. Dist directory not found.
  exit /b 1
)

REM Run database migrations
echo Running database migrations...
npm run db:push

REM Start the application
echo Starting the application...
npm start

echo Deployment completed successfully!