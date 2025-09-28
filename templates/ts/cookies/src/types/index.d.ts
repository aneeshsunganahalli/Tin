export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface IUserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface IUser {
  id: string;
  username?: string;
  email?: string;
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none' | boolean;
  maxAge: number;
  path: string;
}