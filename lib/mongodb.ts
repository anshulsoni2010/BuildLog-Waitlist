import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

async function connectDB() {
  try {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new MongoDB connection');
    const connection = await mongoose.connect(uri, opts);
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
