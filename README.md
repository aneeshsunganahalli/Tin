# Create Tin

[![npm version](https://img.shields.io/npm/v/create-tin.svg)](https://www.npmjs.com/package/create-tin)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Fast Express.js project scaffold with TypeScript/JavaScript support, JWT authentication, and MongoDB integration.

## Features

- 🚀 **Instant setup** - Generate Express projects in seconds
- 🔧 **TypeScript or JavaScript** - Choose your preferred language
- 🔑 **JWT Authentication** - Built-in auth system
- 🗄️ **MongoDB Ready** - Pre-configured database connection
- 📁 **Clean Structure** - Organized project folders
- ⚡ **Git Integration** - Optional repository initialization

## Quick Start

```bash
npx create-tin my-project
```

## Usage

### Interactive Mode
```bash
npx create-tin my-express-app
```

### Command Line Flags
```bash
# TypeScript with git
npx create-tin my-project --ts --git

# JavaScript without git
npx create-tin my-project --js --skip-git
```

### Available Options
- `--ts` - Use TypeScript
- `--js` - Use JavaScript  
- `--git` - Initialize git repository
- `--skip-git` - Skip git initialization

## Project Structure

### TypeScript Project
```
my-project/
├── src/
│   ├── index.ts
│   ├── config/db.ts
│   ├── controllers/authController.ts
│   ├── middlewares/
│   ├── models/userModel.ts
│   ├── routes/authRoutes.ts
│   └── types/
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

### JavaScript Project
```
my-project/
├── src/
│   ├── index.js
│   ├── config/db.js
│   ├── controllers/authController.js
│   ├── middlewares/
│   ├── models/userModel.js
│   └── routes/authRoutes.js
├── package.json
├── .env
└── README.md
```

## Environment Variables

Generated `.env` file:
```env
MONGO=mongodb://localhost:27017/myapp
PORT=5000
```

## Getting Started

After scaffolding:

```bash
cd my-project
npm run dev  # Start development server
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile (protected) |

## Dependencies

**Runtime:**
- express, mongoose, jsonwebtoken, bcryptjs, cors, dotenv

**TypeScript projects also include:**
- typescript, @types/*, tsx, rimraf

## License

ISC

