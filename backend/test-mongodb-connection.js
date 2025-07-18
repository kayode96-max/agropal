require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Test');
console.log('📍 Current IP:', '172.166.156.103');
console.log('🗄️  MongoDB URI:', process.env.MONGODB_URI ? 'Loaded from environment' : 'NOT FOUND');

// More aggressive connection options
const options = {
  serverSelectionTimeoutMS: 15000, // Increase timeout
  connectTimeoutMS: 15000,
  maxPoolSize: 10,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4 only
  retryWrites: true,
  w: 'majority'
};

async function testConnection() {
  try {
    console.log('🚀 Attempting to connect...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔢 Ready State:', conn.connection.readyState);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📋 Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection Error Details:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Cause:', error.cause?.type || 'Unknown');
    
    if (error.reason) {
      console.error('Reason:', error.reason.type);
      console.error('Servers attempted:', Array.from(error.reason.servers.keys()));
    }
    
    process.exit(1);
  }
}

testConnection();
