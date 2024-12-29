import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;

let cached = global as { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

if (!cached.mongoose) {
  cached.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.mongoose?.conn) {
    console.log('Using cached MongoDB connection');
    return cached.mongoose.conn;
  }

  if (!cached.mongoose?.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('Creating new MongoDB connection');
    if (cached.mongoose) {
      cached.mongoose.promise = mongoose.connect(uri, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          throw error;
        });
    }
  } else {
    console.log('Using existing MongoDB connection promise');
  }

  try {
    if (cached.mongoose) {
      cached.mongoose.conn = await cached.mongoose.promise;
    }
  } catch (e) {
    if (cached.mongoose) {
      cached.mongoose.promise = null;
    }
    throw e;
  }

  return cached.mongoose?.conn;
}

export default connectDB;
