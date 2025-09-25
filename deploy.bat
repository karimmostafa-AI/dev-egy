@echo off
REM =====================================================
REM DEV Egypt E-commerce Platform - Deployment Script
REM Handles first-time setup and deployment
REM =====================================================

setlocal EnableDelayedExpansion

echo.
echo ==========================================
echo   DEV Egypt - Deployment Script
echo ==========================================
echo.

REM Color codes for better output
set "GREEN=[32m"
set "YELLOW=[33m"
set "RED=[31m"
set "BLUE=[34m"
set "RESET=[0m"

REM Check if we're in the right directory
echo %BLUE%[INFO]%RESET% Checking project directory...
if not exist "package.json" (
    echo %RED%[ERROR]%RESET% package.json not found. Please run this script from the project root directory.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% Project directory verified.

REM Check Node.js installation
echo.
echo %BLUE%[INFO]%RESET% Checking Node.js installation...
node --version > nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
echo %GREEN%[SUCCESS]%RESET% Node.js found: %NODE_VERSION%

REM Check npm installation
echo %BLUE%[INFO]%RESET% Checking npm installation...
npm --version > nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% npm is not installed or not in PATH.
    pause
    exit /b 1
)
for /f "delims=" %%i in ('npm --version') do set NPM_VERSION=%%i
echo %GREEN%[SUCCESS]%RESET% npm found: v%NPM_VERSION%

REM Check for environment file
echo.
echo %BLUE%[INFO]%RESET% Checking environment configuration...
if not exist ".env" (
    echo %YELLOW%[WARNING]%RESET% .env file not found.
    echo %BLUE%[INFO]%RESET% Please ensure you have a .env file with the following required variables:
    echo.
    echo DATABASE_URL=your_database_connection_string
    echo JWT_SECRET=your_jwt_secret_key
    echo NODE_ENV=production
    echo PORT=5000
    echo.
    set /p "continue=Do you want to continue without .env file? (y/N): "
    if /i "!continue!" neq "y" (
        echo %YELLOW%[INFO]%RESET% Deployment cancelled. Please create .env file first.
        pause
        exit /b 1
    )
    echo %YELLOW%[WARNING]%RESET% Continuing without .env file...
) else (
    echo %GREEN%[SUCCESS]%RESET% Environment file found.
)

REM Ask deployment type
echo.
echo %BLUE%[INFO]%RESET% Select deployment type:
echo 1. Development (npm run dev)
echo 2. Production (build + npm start)
set /p "deploy_type=Enter your choice (1 or 2): "

if "%deploy_type%" == "1" goto :development
if "%deploy_type%" == "2" goto :production
echo %RED%[ERROR]%RESET% Invalid choice. Defaulting to development mode.
goto :development

:development
echo.
echo %BLUE%[INFO]%RESET% Starting DEVELOPMENT deployment...
echo.

REM Install dependencies
echo %BLUE%[INFO]%RESET% Installing dependencies...
npm install
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Failed to install dependencies.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% Dependencies installed successfully.

REM Database setup
echo.
echo %BLUE%[INFO]%RESET% Setting up database...
echo %BLUE%[INFO]%RESET% Pushing database schema...
npm run db:push
if errorlevel 1 (
    echo %YELLOW%[WARNING]%RESET% Database schema push failed. This might be expected for first-time setup.
    echo %BLUE%[INFO]%RESET% Continuing with deployment...
) else (
    echo %GREEN%[SUCCESS]%RESET% Database schema pushed successfully.
)

REM Ask about database seeding
set /p "seed_db=Do you want to seed the database with sample data? (y/N): "
if /i "!seed_db!" == "y" (
    echo %BLUE%[INFO]%RESET% Seeding database...
    npm run db:seed
    if errorlevel 1 (
        echo %YELLOW%[WARNING]%RESET% Database seeding failed or completed with warnings.
    ) else (
        echo %GREEN%[SUCCESS]%RESET% Database seeded successfully.
    )
)

REM Start development server
echo.
echo %GREEN%[SUCCESS]%RESET% Starting development server...
echo %BLUE%[INFO]%RESET% The application will be available at: http://localhost:5000
echo %YELLOW%[NOTE]%RESET% Press Ctrl+C to stop the server
echo.
npm run dev
goto :end

:production
echo.
echo %BLUE%[INFO]%RESET% Starting PRODUCTION deployment...
echo.

REM Install dependencies (production only)
echo %BLUE%[INFO]%RESET% Installing dependencies (production)...
npm ci --only=production
if errorlevel 1 (
    echo %YELLOW%[WARNING]%RESET% Production-only install failed. Trying full install...
    npm ci
    if errorlevel 1 (
        echo %RED%[ERROR]%RESET% Failed to install dependencies.
        pause
        exit /b 1
    )
)
echo %GREEN%[SUCCESS]%RESET% Dependencies installed successfully.

REM Database setup
echo.
echo %BLUE%[INFO]%RESET% Setting up database...
echo %BLUE%[INFO]%RESET% Pushing database schema...
npm run db:push
if errorlevel 1 (
    echo %YELLOW%[WARNING]%RESET% Database schema push failed.
    set /p "continue_prod=Do you want to continue without database setup? (y/N): "
    if /i "!continue_prod!" neq "y" (
        echo %RED%[ERROR]%RESET% Production deployment cancelled.
        pause
        exit /b 1
    )
) else (
    echo %GREEN%[SUCCESS]%RESET% Database schema pushed successfully.
    
    REM Ask about database seeding for production
    set /p "seed_prod=Do you want to seed the database with sample data? (y/N): "
    if /i "!seed_prod!" == "y" (
        echo %BLUE%[INFO]%RESET% Seeding database...
        npm run db:seed
        if errorlevel 1 (
            echo %YELLOW%[WARNING]%RESET% Database seeding failed or completed with warnings.
        ) else (
            echo %GREEN%[SUCCESS]%RESET% Database seeded successfully.
        )
    )
)

REM Build the application
echo.
echo %BLUE%[INFO]%RESET% Building the application...
npm run build
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Build failed.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% Application built successfully.

REM Check if build was successful
if not exist "dist" (
    echo %RED%[ERROR]%RESET% Build failed. Dist directory not found.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% Build artifacts verified.

REM Start production server
echo.
echo %GREEN%[SUCCESS]%RESET% Starting production server...
echo %BLUE%[INFO]%RESET% The application will be available at: http://localhost:5000
echo %YELLOW%[NOTE]%RESET% Press Ctrl+C to stop the server
echo.
set NODE_ENV=production
npm start

:end
echo.
echo %GREEN%[SUCCESS]%RESET% Deployment process completed!
echo %BLUE%[INFO]%RESET% Thank you for using DEV Egypt deployment script.
pause
