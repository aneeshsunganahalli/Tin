# Create Tin Express

[![npm version](https://img.shields.io/npm/v/create-tin-express.svg)](https://www.npmjs.com/package/create-tin-express)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A fast, modern CLI tool to scaffold TypeScript or JavaScript Express.js projects with authentication boilerplate. Generate production-ready Express applications with JWT authentication, MongoDB integration, and proper project structure in seconds.

## ✨ Features

- 🚀 **Fast scaffold** - Generate complete Express projects instantly
- 🔧 **TypeScript or JavaScript** - Choose your preferred language
- � **JWT Authentication** - Built-in auth controllers and middleware
- �️ **MongoDB Ready** - Pre-configured database connection
- 📁 **Clean Structure** - Organized folders (controllers, models, routes, middleware)
- 🎨 **Modern CLI UX** - Beautiful interactive prompts with colors
- ⚡ **Git Integration** - Optional git repository initialization
- � **Environment Setup** - Auto-generated .env file with defaults
- � **Dependency Management** - Automatic npm package installation

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx create-tin-express my-project
```

### Global Installation

```bash
npm install -g create-tin-express
tin my-project
```

## � Usage

### Interactive Mode

Simply run the command with your project name:

```bash
npx create-tin-express my-express-app
```

You'll be prompted to choose:
- **Language**: TypeScript or JavaScript
- **Git**: Initialize git repository (yes/no)

### Command Line Flags

Skip the interactive prompts by using flags:

```bash
# TypeScript with git
npx create-tin-express my-project --ts --git

# JavaScript without git
npx create-tin-express my-project --js --no-git
```

### Available Options

| Flag | Description |
|------|-------------|
| `--ts` | Use TypeScript |
| `--js` | Use JavaScript |
| `--git` | Initialize git repository |
| `--no-git` | Skip git initialization |
| `-h, --help` | Show help |

## 📁 Project Structure

### TypeScript Project

```
my-project/
├── src/
│   ├── index.ts                 # Main application entry
│   ├── config/
│   │   └── db.ts               # MongoDB connection
│   ├── controllers/
│   │   └── authController.ts   # Authentication logic
│   ├── middlewares/
│   │   ├── errorHandler.ts     # Global error handling
│   │   └── verifyToken.ts      # JWT verification
│   ├── models/
│   │   └── userModel.ts        # User schema/model
│   ├── routes/
│   │   └── authRoutes.ts       # Authentication routes
│   └── types/
│       ├── constants.ts        # App constants
│       ├── index.d.ts          # Type declarations
│       ├── types.ts            # Custom types
│       └── utils.d.ts          # Utility types
├── package.json
├── tsconfig.json
├── .env                        # Environment variables
├── .gitignore
└── README.md
```

### JavaScript Project

```
my-project/
├── src/
│   ├── index.js                # Main application entry
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middlewares/
│   │   ├── errorHandler.js    # Global error handling
│   │   └── verifyToken.js     # JWT verification
│   ├── models/
│   │   └── userModel.js       # User schema/model
│   └── routes/
│       └── authRoutes.js      # Authentication routes
├── package.json
├── .env                       # Environment variables
├── .gitignore
└── README.md
```

## 🔧 Environment Variables

The generated `.env` file includes:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-super-secret-jwt-key
```

## 🏃‍♂️ Getting Started with Generated Project

After scaffolding, navigate to your project and start development:

```bash
cd my-project

# Install dependencies (if not auto-installed)
npm install

# TypeScript projects - build first
npm run build

# Start the server
npm start

# Development with auto-reload (if nodemon is configured)
npm run dev
```

## 📦 Generated Dependencies

### TypeScript Projects Include:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable loading
- `helmet` - Security middleware

### Development Dependencies:
- `typescript` - TypeScript compiler
- `@types/*` - Type definitions
- `ts-node` - TypeScript execution
- `nodemon` - Development auto-reload

### JavaScript Projects Include:
- Same runtime dependencies as TypeScript
- No TypeScript-specific dev dependencies

## 🎯 API Endpoints

Generated projects include these authentication endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile (protected) |

## 🔐 Authentication Features

- **User Registration**: Email/password with validation
- **User Login**: JWT token generation
- **Protected Routes**: Middleware for route protection
- **Password Hashing**: bcryptjs for secure password storage
- **Error Handling**: Centralized error management

## ⚙️ Customization

### Modify Templates

To customize the generated project structure, edit the template files in:
- `templates/ts/` - TypeScript templates
- `templates/js/` - JavaScript templates

### Adding New Templates

1. Create new template files in the appropriate directory
2. Update the CLI logic in `bin/index.ts` to copy your new files

### Environment Configuration

Modify the default environment variables by editing the `.env` generation logic in the CLI tool.

## 🛠️ Development

### Building the CLI Tool

```bash
# Clone this repository
git clone <your-repo-url>
cd create-tin-express

# Install dependencies
npm install

# Build the TypeScript
npm run build

# Test locally
npm link
tin my-test-project
```

### Publishing to npm

```bash
# Build the project
npm run build

# Login to npm
npm login

# Publish
npm publish
```

