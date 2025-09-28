import { Request, Response, NextFunction } from 'express';
import { ErrorWithCode } from '@/types/utils.js';

const errorHandler = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default errorHandler;