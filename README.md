# Tin - Express.js Project Generator

![Tin Project Logo](https://img.shields.io/badge/Tin-Express%20Generator-blue)
![Version](https://img.shields.io/badge/version-2.2.0-green)
![License](https://img.shields.io/badge/license-ISC-orange)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)

Tin is a modern command-line tool for quickly scaffolding Express.js applications with TypeScript or JavaScript. The tool generates a complete project structure with authentication, MongoDB integration, and best practices ready to use.

## Features

- ✨ Generate Express.js REST API projects with a single command
- 🔄 Choose between **TypeScript** and **JavaScript** templates
- 🔒 Built-in JWT authentication system
- 📦 MongoDB integration with Mongoose
- 🐳 Optional Docker configuration generation
- 🚀 Modular architecture with best practices
- 🛠️ Fully configured development environment
- 📝 Error handling middleware
- 🔧 Environment variables configuration

## Installation

### Global Installation (Recommended)

```bash
npm install -g create-tin
```

### Using npx (No Installation Required)

```bash
npx create-tin my-api-project
```

## Quick Start

### Create a New Project

```bash
# Using the installed package
create-tin my-api-project

# Or using npx
npx create-tin my-api-project
```

Follow the interactive prompts to configure your project:
1. Choose language (TypeScript or JavaScript)
2. Initialize Git repository
3. Set the server port
4. Add Docker configuration

## Command Line Options

| Option | Description |
|--------|-------------|
| `--ts` | Use TypeScript template |
| `--js` | Use JavaScript template |
| `--git` | Initialize Git repository |
| `--skip-git` | Skip Git initialization |
| `--port <number>` | Specify the server port (default: 3000) |
| `--docker` | Include Docker configuration |
| `--skip-docker` | Skip Docker configuration |

## Example Usage

```bash
# Create a TypeScript project with Git and Docker configuration
create-tin my-ts-api --ts --git --docker

# Create a JavaScript project without Git and Docker
create-tin my-js-api --js --skip-git --skip-docker --port 5000
```

## Generated Project Structure

### TypeScript Project

```
my-api-project/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── middlewares/
│   │   ├── errorHandler.ts
│   │   └── verifyToken.ts
│   ├── models/
│   │   └── userModel.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   ├── types/
│   │   ├── constants.ts
│   │   └── index.d.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### JavaScript Project

```
my-api-project/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── verifyToken.js
│   ├── models/
│   │   └── userModel.js
│   ├── routes/
│   │   └── authRoutes.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Docker Support

When Docker configuration is enabled, the following files are generated:

- `Dockerfile` - Optimized multi-stage build
- `docker-compose.yml` - Docker Compose setup with MongoDB
- `.dockerignore` - Ignores unnecessary files

## Getting Started With Generated Projects

After generating your project:

```bash
# Navigate to your project directory
cd my-api-project

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Features of Generated Projects

- **Express.js REST API** structure with clean architecture
- **JWT Authentication** with secure login and registration
- **MongoDB** integration with Mongoose
- **Environment variables** configuration
- **Error handling** middleware
- **TypeScript** type definitions (TypeScript template only)

## Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0

## License

This project is licensed under the ISC License.