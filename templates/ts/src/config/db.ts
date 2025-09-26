// @ts-nocheck - Template file, dependencies will be installed when scaffolded
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO;
  if (!mongoUri) {
    throw new Error('MONGO environment variable is not defined');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // optional: fail fast if DB is unreachable
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${(err as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;