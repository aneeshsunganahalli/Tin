import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();
const port: number = parseInt(process.env.PORT || '3000');

const corsOptions = {
  origin: ['http://localhost:3000'], // replace with your frontend domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (_req: Request, res: Response) => {
  res.send("API is Working");
});

app.use('/auth', authRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`✅ Server listening at ${port}`);
});