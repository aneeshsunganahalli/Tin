// Global type definitions for the application

import { Request } from 'express';
import { IUser } from '../models/userModel.ts';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Environment variables interface
export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN?: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}

// Request body interfaces
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// JWT Payload interface
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Database connection interface
export interface DatabaseConfig {
  uri: string;
  options?: {
    useNewUrlParser?: boolean;
    useUnifiedTopology?: boolean;
  };
}

// CORS configuration interface
export interface CorsConfig {
  origin: string | string[];
  methods: string[];
  credentials?: boolean;
  optionsSuccessStatus?: number;
}

// Custom error interface
export interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  isOperational?: boolean;
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Mongoose error types
export interface MongoError extends Error {
  code: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, any>;
}

// Request handler types
export type TypedRequestHandler<T = any, U = any> = (
  req: import('express').Request<any, any, T>,
  res: import('express').Response<U>,
  next: import('express').NextFunction
) => Promise<void> | void;

export type AsyncRequestHandler<T = any, U = any> = (
  req: import('express').Request<any, any, T>,
  res: import('express').Response<U>,
  next: import('express').NextFunction
) => Promise<void>;

// Re-export utility types
export * from './utils.js';
export * from './constants.ts';
