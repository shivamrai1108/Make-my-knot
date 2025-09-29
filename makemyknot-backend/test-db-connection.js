const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Test database operations
    const connectionState = mongoose.connection.readyState;
    console.log('Connection state:', connectionState === 1 ? 'Connected' : 'Disconnected');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Full error:', error);
  }
};

testConnection();