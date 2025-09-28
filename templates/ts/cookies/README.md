# Express.js JWT Authentication API with Cookies

This is an Express.js API template for authentication using JWT stored in cookies, built with TypeScript. It includes user registration and login functionality with MongoDB integration.

## Features

- Written in TypeScript with proper typing
- User registration and login
- JWT authentication stored in HTTP-only cookies
- Password encryption with bcrypt
- MongoDB integration with Mongoose
- Input validation
- Error handling middleware
- CORS configuration
- Protected routes

## Setup

1. Clone the repository or generate using the Tin CLI
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
4. Start the development server: `npm run dev`

## API Endpoints

### Authentication
- **POST /auth/register** - Register a new user
- **POST /auth/login** - Login and receive authentication cookie
- **POST /auth/logout** - Clear authentication cookie
- **GET /auth/me** - Get authenticated user data

## Usage

### Register a User
```
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Access Protected Route
```
GET /auth/me
```

## Security Features

- TypeScript for code quality and type safety
- HTTP-Only cookies to prevent XSS attacks
- CSRF protection
- Secure cookies in production
- Password hashing with salt
- JWT token expiration

## License

MIT