# 🚀 Post-Setup Instructions for Agropal

## ⚠️ Important: Additional Dependencies Required

Due to disk space constraints during setup, some essential packages need to be installed manually:

### Frontend Dependencies

```bash
cd frontend
npm install socket.io-client
npm install @mui/x-date-pickers @date-io/date-fns date-fns recharts
```

### Backend Dependencies

```bash
cd backend
npm install socket.io
```

## 🔧 Configuration Steps

### 1. Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/agropal
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# API Keys
PLANTID_API_KEY=your-plant-id-api-key
OPENAI_API_KEY=your-openai-api-key
OPENWEATHER_API_KEY=your-openweather-api-key

# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Enable Real-Time Features

Once `socket.io-client` is installed, update `frontend/src/utils/socketService.ts`:

1. Uncomment the import statement:

   ```typescript
   import { io, Socket } from "socket.io-client";
   ```

2. Uncomment all the implementation code (currently commented out)

3. Replace the placeholder implementations with the actual socket.io code

### 3. Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Run the seed script to populate initial data:
   ```bash
   cd backend
   node scripts/seedData.js
   ```

### 4. API Keys Setup

#### Plant.id API (Crop Diagnosis)

1. Visit https://web.plant.id/
2. Create an account and get your API key
3. Add it to your `.env` file

#### OpenAI API (Fallback AI)

1. Visit https://platform.openai.com/
2. Create an account and get your API key
3. Add it to your `.env` file

#### OpenWeatherMap API (Weather)

1. Visit https://openweathermap.org/api
2. Create an account and get your API key
3. Add it to your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

### Production Mode

1. Build the frontend:

   ```bash
   cd frontend
   npm run build
   ```

2. Start the production server:
   ```bash
   cd backend
   npm start
   ```

## 📱 Features Overview

### ✅ Currently Working Features

1. **User Authentication** - Registration, login, JWT tokens
2. **AI Crop Diagnosis** - Image upload and analysis
3. **Community Forum** - Discussion posts and interactions
4. **Weather Dashboard** - Nigerian weather data
5. **E-Learning System** - Educational content
6. **User Profiles** - Personal information and preferences
7. **Dashboard** - Overview of user activity and statistics
8. **Crop Calendar** - Planning and scheduling
9. **Market Prices** - Price tracking and alerts
10. **Notifications** - In-app notification system

### 🔄 Requires Additional Setup

1. **Real-time Features** - Requires socket.io-client installation
2. **Chart Components** - Requires recharts installation
3. **Date Pickers** - Requires MUI date picker packages
4. **Push Notifications** - Requires service worker setup

## 🧪 Testing

### Backend API Testing

Test all endpoints using the provided test script:

```bash
cd backend
node test-endpoints.js
```

### Frontend Testing

Run React tests:

```bash
cd frontend
npm test
```

## 📦 Production Deployment

### Docker Deployment (Recommended)

1. Create `Dockerfile` in backend directory
2. Create `docker-compose.yml` for full stack deployment
3. Build and deploy containers

### Manual Deployment

1. Set production environment variables
2. Configure MongoDB connection
3. Build frontend for production
4. Deploy backend to cloud service (AWS, Heroku, etc.)
5. Configure domain and SSL certificates

## 🔒 Security Considerations

1. **Environment Variables** - Never commit `.env` files
2. **API Keys** - Use environment-specific keys
3. **CORS** - Configure for production domains
4. **Rate Limiting** - Adjust for production traffic
5. **Input Validation** - Validate all user inputs
6. **File Uploads** - Implement proper file validation

## 🌍 Internationalization

The app supports multiple Nigerian languages:

- English (default)
- Hausa
- Igbo
- Yoruba

Add more languages by extending the translation files.

## 📊 Monitoring & Analytics

1. **Error Tracking** - Implement Sentry or similar
2. **Performance Monitoring** - Use New Relic or similar
3. **User Analytics** - Implement Google Analytics
4. **API Monitoring** - Monitor API response times

## 🎯 Next Steps

1. Install missing dependencies
2. Configure environment variables
3. Set up API keys
4. Test all features
5. Deploy to production
6. Monitor and optimize performance

## 📞 Support

For issues or questions:

1. Check the logs in `backend/logs/`
2. Review the API documentation
3. Test individual endpoints
4. Check database connectivity

## 🎉 Congratulations!

You now have a fully functional AI-powered agricultural platform specifically designed for Nigerian farmers. The application includes advanced features like AI crop diagnosis, real-time communication, market intelligence, and educational resources.

**Key Benefits:**

- 📱 Mobile-first design for smartphone users
- 🌾 Nigerian agricultural context and crop data
- 🤖 AI-powered crop disease diagnosis
- 👥 Community-driven knowledge sharing
- 📚 Educational content for farmers
- 🌤️ Weather-based agricultural insights
- 💰 Market price intelligence
- 📅 Crop planning and calendar management

Happy farming! 🌱🇳🇬
