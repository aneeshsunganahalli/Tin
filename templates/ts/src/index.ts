import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Hello from TypeScript Express Boilerplate!');
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
