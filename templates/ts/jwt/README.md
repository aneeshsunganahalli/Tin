# Express.js TypeScript API with MongoDB

A TypeScript Express.js API template with authentication, MongoDB integration, and best practices.

## Features

- TypeScript for type safety
- Express.js REST API structure
- JWT Authentication
- MongoDB with Mongoose
- Environment variables configuration
- Error handling middleware
- Modular architecture with type definitions

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- MongoDB (local or remote)

### Installation

1. Clone the repository or create using the Tin CLI:

```bash
npx create-tin my-api --ts
```

2. Install dependencies:

```bash
cd my-api
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
npm run start
```

## Docker Setup

This project includes Docker configuration for easy development and deployment.

### Running with Docker Compose

1. Start the application and MongoDB:

```bash
docker-compose up
```

2. Run in the background:

```bash
docker-compose up -d
```

3. Stop the services:

```bash
docker-compose down
```

### Building the Docker Image

```bash
docker build -t my-express-ts-app .
```

### Environment Variables

Docker Compose is configured to use the environment variables from the `.env` file. You can override them in the `docker-compose.yml` file or through Docker Compose environment variables.

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/profile` - Get user profile (protected route)

## Project Structure

```
.
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middlewares/   # Custom middlewares
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── types/         # TypeScript type definitions
│   └── index.ts       # App entry point
├── .env               # Environment variables
├── .gitignore         # Git ignore configuration
├── tsconfig.json      # TypeScript configuration
├── package.json       # Project dependencies and scripts
└── README.md          # Project documentation
```

## License

MIT