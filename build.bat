@echo off
echo 🌱 Starting Agropal Full Build Process...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ✗ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✓ Node.js and npm are installed

REM Install backend dependencies
echo ✓ Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ✗ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed successfully

REM Install frontend dependencies
echo ✓ Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ✗ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed successfully

REM Build frontend
echo ✓ Building frontend application...
call npm run build
if %errorlevel% neq 0 (
    echo ✗ Frontend build failed
    pause
    exit /b 1
)
echo ✓ Frontend build completed successfully

REM Copy build to public directory
echo ✓ Copying build files to public directory...
if not exist "..\public" mkdir "..\public"
xcopy /E /Y build\* "..\public\"
if %errorlevel% neq 0 (
    echo ✗ Failed to copy build files to public directory
    pause
    exit /b 1
)
echo ✓ Build files copied to public directory successfully

REM Go back to root directory
cd ..

REM Create production environment file if it doesn't exist
if not exist "backend\.env" (
    echo ⚠ No .env file found. Creating from template...
    copy "backend\.env.example" "backend\.env"
    echo ⚠ Please update the .env file with your production values
)

echo ✓ Build process completed successfully!
echo ✓ Your Agropal application is ready to deploy!
echo.
echo 🚀 Next Steps:
echo 1. Update backend\.env with your production values
echo 2. Start the backend server: cd backend ^&^& npm start
echo 3. Your frontend is built and ready in public\ directory
echo 4. Deploy to your hosting platform
echo.
echo 💡 For development:
echo - Backend: cd backend ^&^& npm run dev
echo - Frontend: cd frontend ^&^& npm start
echo.
echo 🌱 Happy farming with Agropal!
pause
