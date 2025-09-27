import fs from 'fs-extra';
import path from 'path';

export function createDockerFiles(targetDir: string, isTS: boolean, port: number = 3000): void {
  // Create Dockerfile
  const dockerfile = generateDockerfile(isTS);
  const dockerfilePath = path.join(targetDir, 'Dockerfile');
  fs.writeFileSync(dockerfilePath, dockerfile, 'utf-8');
  
  // Create docker-compose.yml
  const dockerCompose = generateDockerCompose(port);
  const dockerComposePath = path.join(targetDir, 'docker-compose.yml');
  fs.writeFileSync(dockerComposePath, dockerCompose, 'utf-8');
  
  // Create .dockerignore
  const dockerignore = generateDockerignore();
  const dockerignorePath = path.join(targetDir, '.dockerignore');
  fs.writeFileSync(dockerignorePath, dockerignore, 'utf-8');
}

function generateDockerfile(isTS: boolean): string {
  if (isTS) {
    return `# Node.js TypeScript API Dockerfile
# Multi-stage build for optimized production image


# --- Build Stage ---
FROM node:18-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and build the application
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine as production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Environment variables are managed through docker-compose.yml
# but can also be set during docker run with -e flag
EXPOSE \${PORT:-3000}

CMD ["node", "dist/index.js"]
`;
  } else {
    return `# Node.js JavaScript API Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Environment variables are managed through docker-compose.yml
# but can also be set during docker run with -e flag
EXPOSE \${PORT:-3000}

CMD ["node", "src/index.js"]
`;
  }
}

function generateDockerCompose(port: number): string {
  return `# Docker Compose configuration for Express API with MongoDB
version: '3.8'

services:
  # Express API service
  app:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - PORT=${port}
      - MONGODB_URI=mongodb://mongo:27017/express-app
      - NODE_ENV=development
    depends_on:
      - mongo
    volumes:
      - .:/app          # Mount current directory to enable live updates
      - /app/node_modules  # Prevent container node_modules from being overwritten
    restart: unless-stopped
    networks:
      - express-network
`;
}

function generateDockerignore(): string {
  return `# Dependency directories
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist
build

# Version control
.git
.gitignore

# Docker
.dockerignore
Dockerfile
docker-compose.yml

# Environment variables
.env.local
.env.*.local
.env.development
.env.test
.env.production

# Documentation
README.md
docs

# Testing
coverage
.nyc_output
*.lcov

# IDE files
.idea
.vscode
*.swp
*.swo
*.sublime-*
`;
}