# Agropal - Quick Start Guide

Welcome to Agropal! This guide will help you get the application running quickly.

## Prerequisites

- Node.js (v16 or higher)
- npm package manager

## Quick Setup

### Option 1: Using VS Code Tasks (Recommended)

1. Open the project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Tasks: Run Task"
4. Select "Install All Dependencies" and wait for completion
5. Run "Start Full Application" to start both backend and frontend

### Option 2: Manual Commands

1. **Install dependencies:**

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Start the application:**

   ```bash
   # Terminal 1 - Start backend (from root directory)
   cd backend
   npm run dev

   # Terminal 2 - Start frontend (from root directory)
   cd frontend
   npm start
   ```

### Option 3: Root Level Scripts

```bash
# From the root directory
npm run install:all     # Install all dependencies
npm run dev:backend     # Start backend in development mode
npm run start:frontend  # Start frontend (in another terminal)
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Key Features to Test

1. **Home Page** - Overview and navigation
2. **Crop Diagnosis** - Upload images for AI analysis
3. **Voice Chat** - Test speech-to-text functionality
4. **Community** - Create posts and interact with the forum
5. **Weather** - View weather insights
6. **Learning** - Browse modules and take quizzes

## Demo Data

The application uses mock data for demonstration:

- Sample crop diseases and treatments
- Fake community posts and discussions
- Mock weather data
- Placeholder learning modules and quizzes

## Troubleshooting

**Port conflicts:**

- Backend uses port 5000
- Frontend uses port 3000
- Change ports in package.json if needed

**Dependency issues:**

- Delete `node_modules` folders and run `npm install` again
- Ensure Node.js version is 16 or higher

**CORS errors:**

- Backend includes CORS configuration for localhost:3000
- Check that both servers are running

## Development

- Backend auto-reloads with nodemon
- Frontend hot-reloads with React dev server
- All API endpoints return JSON responses
- File uploads stored in `backend/uploads/`

## Next Steps

1. Replace mock AI with real services (OpenAI, TensorFlow.js)
2. Add database integration (MongoDB/PostgreSQL)
3. Implement real authentication
4. Add more language support
5. Deploy to production

Happy farming! 🌱
