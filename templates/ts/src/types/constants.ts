// Application constants and enums

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'Please fill all required fields',
  INVALID_EMAIL: 'Please enter a valid email',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters',
  USER_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  REGISTER_FAILED: 'Failed to register user',
  LOGIN_FAILED: 'Failed to login',
  UNAUTHORIZED_ACCESS: 'Access denied. No token provided',
  INVALID_TOKEN: 'Invalid token',
  USER_NOT_FOUND: 'User not found',
} as const;

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;

export const JWT_CONFIG = {
  EXPIRES_IN: '30d',
  ALGORITHM: 'HS256',
} as const;

export const BCRYPT_CONFIG = {
  SALT_ROUNDS: 10,
} as const;

export const CORS_CONFIG = {
  ALLOWED_ORIGINS: ['http://localhost:3000'],
  ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE'],
} as const;

export const DATABASE_CONFIG = {
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 2,
  USERNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
} as const;

// Environment types
export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

// User roles (if needed for future expansion)
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// HTTP methods
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];
