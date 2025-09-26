import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO;
  if (!mongoUri) {
    throw new Error('MONGO environment variable is not defined');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // optional: fail fast if DB is unreachable
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
