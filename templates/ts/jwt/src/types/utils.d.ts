// Utility types for the application

// Omit password from user object for responses
export type UserResponse = Omit<import('../models/userModel.ts').IUser, 'password'>;

// Pick only essential user fields
export type UserSafe = Pick<import('../models/userModel.ts').IUser, '_id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>;

// Make all properties optional (for updates)
export type PartialUser = Partial<import('../models/userModel.ts').IUser>;

// Extract specific fields from user
export type UserPublic = {
  id: string;
  username: string;
  email: string;
};

// Request handler with typed response
export type TypedRequestHandler<T = any, U = any> = (
  req: import('express').Request<any, any, T>,
  res: import('express').Response<U>,
  next: import('express').NextFunction
) => Promise<void> | void;

// Async request handler
export type AsyncRequestHandler<T = any, U = any> = (
  req: import('express').Request<any, any, T>,
  res: import('express').Response<U>,
  next: import('express').NextFunction
) => Promise<void>;

// Middleware function type
export type MiddlewareFunction = import('express').RequestHandler;

// Error middleware type
export type ErrorMiddleware = (
  err: Error,
  req: import('express').Request,
  res: import('express').Response,
  next: import('express').NextFunction
) => void;

// Database document with timestamps
export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

// Paginated response type
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

// Generic API handler response
export type ApiHandler<TRequest = any, TResponse = any> = TypedRequestHandler<TRequest, TResponse>;
