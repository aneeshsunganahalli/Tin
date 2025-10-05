import crypto from 'crypto';
import { TemplateOptions } from '../cli/prompts.js';

/**
 * Generate a cryptographically secure random string for secrets
 * @param length - Length of the random string (default: 64)
 * @returns A secure random hex string
 */
export function generateSecureSecret(length: number = 64): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate environment variables based on template options
 * @param options - Template options selected by the user
 * @param projectName - Name of the project
 * @returns Object containing environment variable key-value pairs
 */
export function generateEnvVariables(
  options: TemplateOptions,
  projectName: string
): Record<string, string> {
  const envVars: Record<string, string> = {};

  // Basic configuration
  envVars.PORT = options.port.toString();
  envVars.NODE_ENV = 'development';

  // Database configuration
  const dbName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  envVars.MONGODB_URI = `mongodb://localhost:27017/${dbName}`;

  // JWT Secret - always needed for both auth types
  envVars.JWT_SECRET = generateSecureSecret(64);

  // Docker-specific variables
  if (options.docker) {
    // When using Docker, MongoDB runs in a container
    envVars.MONGODB_URI = `mongodb://mongo:27017/${dbName}`;
    // Add Docker-specific variables if needed
    envVars.DOCKER_ENABLED = 'true';
  }

  // Swagger-specific variables
  if (options.swagger) {
    envVars.SWAGGER_ENABLED = 'true';
    envVars.API_TITLE = `${projectName} API`;
    envVars.API_VERSION = '1.0.0';
    envVars.API_DESCRIPTION = `API documentation for ${projectName}`;
  }

  return envVars;
}

/**
 * Format environment variables as .env file content
 * @param envVars - Environment variables object
 * @returns Formatted .env file content as string
 */
export function formatEnvContent(envVars: Record<string, string>): string {
  const lines = [
    '# Environment Configuration',
    '# Generated automatically by Tin CLI',
    '# DO NOT commit this file to version control',
    '',
    '# Server Configuration',
    `PORT=${envVars.PORT}`,
    `NODE_ENV=${envVars.NODE_ENV}`,
    '',
    '# Database Configuration',
    `MONGODB_URI=${envVars.MONGODB_URI}`,
    '',
    '# Authentication',
    `JWT_SECRET=${envVars.JWT_SECRET}`,
  ];

  // Add Docker section if enabled
  if (envVars.DOCKER_ENABLED) {
    lines.push(
      '',
      '# Docker Configuration',
      `DOCKER_ENABLED=${envVars.DOCKER_ENABLED}`
    );
  }

  // Add Swagger section if enabled
  if (envVars.SWAGGER_ENABLED) {
    lines.push(
      '',
      '# API Documentation (Swagger)',
      `SWAGGER_ENABLED=${envVars.SWAGGER_ENABLED}`,
      `API_TITLE=${envVars.API_TITLE}`,
      `API_VERSION=${envVars.API_VERSION}`,
      `API_DESCRIPTION=${envVars.API_DESCRIPTION}`
    );
  }

  lines.push(''); // Add final newline
  return lines.join('\n');
}

/**
 * Generate .env.example file content with placeholder values
 * @param options - Template options selected by the user
 * @returns Formatted .env.example file content
 */
export function generateEnvExampleContent(options: TemplateOptions): string {
  const lines = [
    '# Environment Configuration',
    '# Copy this file to .env and fill in the values',
    '',
    '# Server Configuration',
    'PORT=3000',
    'NODE_ENV=development',
    '',
    '# Database Configuration',
    '# Local MongoDB: mongodb://localhost:27017/your-database-name',
    '# Docker MongoDB: mongodb://mongo:27017/your-database-name',
    '# MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/your-database-name',
    'MONGODB_URI=your_mongodb_connection_string',
    '',
    '# Authentication',
    '# Generate a secure random string for production',
    'JWT_SECRET=your_jwt_secret_key',
  ];

  if (options.docker) {
    lines.push(
      '',
      '# Docker Configuration',
      'DOCKER_ENABLED=true'
    );
  }

  if (options.swagger) {
    lines.push(
      '',
      '# API Documentation (Swagger)',
      'SWAGGER_ENABLED=true',
      'API_TITLE=Your API Name',
      'API_VERSION=1.0.0',
      'API_DESCRIPTION=API documentation description'
    );
  }

  lines.push(''); // Add final newline
  return lines.join('\n');
}
