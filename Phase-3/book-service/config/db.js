// Book Service: src/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Each service connects to its own database
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/book-service-db');
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;