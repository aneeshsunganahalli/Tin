import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
}
