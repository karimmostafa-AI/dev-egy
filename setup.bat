@echo off
REM =====================================================
REM DEV Egypt E-commerce Platform - Quick Setup Script
REM Creates .env file from template
REM =====================================================

setlocal EnableDelayedExpansion

echo.
echo ==========================================
echo   DEV Egypt - Quick Setup Script
echo ==========================================
echo.

REM Color codes
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

REM Check if .env already exists
if exist ".env" (
    echo %YELLOW%[WARNING]%RESET% .env file already exists.
    set /p "overwrite=Do you want to overwrite it? (y/N): "
    if /i "!overwrite!" neq "y" (
        echo %BLUE%[INFO]%RESET% Setup cancelled. Keeping existing .env file.
        pause
        exit /b 0
    )
)

REM Check if .env.example exists
if not exist ".env.example" (
    echo %RED%[ERROR]%RESET% .env.example file not found.
    echo %BLUE%[INFO]%RESET% Creating basic .env template...
    echo DATABASE_URL=postgresql://username:password@localhost:5432/dev_egypt> .env
    echo JWT_SECRET=change-this-secret-key>> .env
    echo NODE_ENV=development>> .env
    echo PORT=5000>> .env
    echo.
    echo %GREEN%[SUCCESS]%RESET% Basic .env file created.
    echo %YELLOW%[WARNING]%RESET% Please edit .env file and update the values before running the application.
    goto :end
)

REM Copy .env.example to .env
echo %BLUE%[INFO]%RESET% Creating .env file from template...
copy ".env.example" ".env" > nul
if errorlevel 1 (
    echo %RED%[ERROR]%RESET% Failed to create .env file.
    pause
    exit /b 1
)
echo %GREEN%[SUCCESS]%RESET% .env file created successfully.

echo.
echo %BLUE%[INFO]%RESET% Next steps:
echo 1. Edit the .env file and replace placeholder values with your actual configuration
echo 2. Make sure you have a PostgreSQL database ready
echo 3. Run deploy.bat to start the application
echo.
echo %YELLOW%[IMPORTANT]%RESET% Required variables to update in .env:
echo - DATABASE_URL: Your PostgreSQL connection string
echo - JWT_SECRET: A secure random string for JWT tokens
echo.

:end
echo %GREEN%[SUCCESS]%RESET% Setup completed!
echo %BLUE%[INFO]%RESET% You can now run deploy.bat to start the application.
pause