import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app: Express = express();
const port: number = parseInt(process.env.PORT || '3000', 10);

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000'], // replace with your frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // This is important for cookies to work with CORS
};

// Middleware
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  res.send("API is Working");
});

app.use('/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});