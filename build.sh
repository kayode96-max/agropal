#!/bin/bash

# Agropal Full Build Script

echo "🌱 Starting Agropal Full Build Process..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are installed"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -eq 0 ]; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Build frontend
print_status "Building frontend application..."
npm run build
if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Go back to root directory
cd ..

# Create production environment file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    print_warning "No .env file found. Creating from template..."
    cp backend/.env.example backend/.env
    print_warning "Please update the .env file with your production values"
fi

print_status "Build process completed successfully!"
print_status "Your Agropal application is ready to deploy!"

echo ""
echo "🚀 Next Steps:"
echo "1. Update backend/.env with your production values"
echo "2. Start the backend server: cd backend && npm start"
echo "3. Your frontend is built and ready in frontend/build/"
echo "4. Deploy to your hosting platform"
echo ""
echo "💡 For development:"
echo "- Backend: cd backend && npm run dev"
echo "- Frontend: cd frontend && npm start"
echo ""
echo "🌱 Happy farming with Agropal!"
