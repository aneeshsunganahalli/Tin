import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

/**
 * Sets up Swagger UI in the project by adding required dependencies and configuration files
 * @param targetPath Path to the target project
 * @param isTS Whether the project is using TypeScript
 * @param port The port number the server will run on
 */
export async function setupSwaggerUI(
  targetPath: string,
  isTS: boolean,
  port: number
): Promise<void> {
  try {
    // 1. Add swagger dependencies to package.json
    const packageJsonPath = path.join(targetPath, 'package.json');
    const packageJson = await fs.readJSON(packageJsonPath);
    
    // Add dependencies
    packageJson.dependencies = {
      ...packageJson.dependencies,
      'swagger-ui-express': '^5.0.0',
      'swagger-themes': '^1.2.28',
    };
    
    // Add dev dependencies for TypeScript projects
    if (isTS) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        '@types/swagger-ui-express': '^4.1.3',
      };
    }
    
    // Write updated package.json
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    
    // 2. Create OpenAPI yaml file
    await createOpenAPIYAMLFile(targetPath, isTS, port);
    
    // 3. Set up Swagger UI configuration
    await createSwaggerConfig(targetPath, isTS);
    
    // 4. Update index file to include Swagger UI
    await updateIndexFile(targetPath, isTS);
    
    console.log(chalk.green.bold('✨ Swagger UI has been set up with swagger-themes dark mode!'));
  } catch (error) {
    console.error(chalk.red.bold('Failed to set up Swagger UI:'), error);
    throw error;
  }
}

/**
 * Creates the OpenAPI YAML configuration file
 */
async function createOpenAPIYAMLFile(
  targetPath: string,
  isTS: boolean,
  port: number
): Promise<void> {
  // Make sure we have valid YAML formatting
  const openApiContent = `openapi: 3.0.0
info:
  title: Express API
  description: API documentation for Express application with authentication
  version: 1.0.0
  contact:
    email: info@example.com
servers:
  - url: http://localhost:${port}
    description: Local development server
tags:
  - name: Auth
    description: Authentication endpoints
  - name: Users
    description: User related operations
paths:
  /:
    get:
      summary: API Status
      description: Returns API status
      responses:
        '200':
          description: API is working
  /auth/register:
    post:
      tags:
        - Auth
      summary: Register new user
      description: Creates a new user account
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - name
                - email
                - password
              properties:
                name:
                  type: string
                  example: John Doe
                email:
                  type: string
                  format: email
                  example: john@example.com
                password:
                  type: string
                  format: password
                  example: strongPassword123
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: User registered successfully
                  token:
                    type: string
                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        '400':
          description: Invalid input
        '409':
          description: Email already exists
  /auth/login:
    post:
      tags:
        - Auth
      summary: Login user
      description: Authenticate user and return token
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                  example: john@example.com
                password:
                  type: string
                  format: password
                  example: strongPassword123
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: Login successful
                  token:
                    type: string
                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        '400':
          description: Invalid credentials
        '404':
          description: User not found
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
`;

  const docsDir = path.join(targetPath, 'src/docs');
  await fs.ensureDir(docsDir);
  // Ensure proper YAML format and write to file
  await fs.writeFile(path.join(docsDir, 'openapi.yaml'), openApiContent);
}

/**
 * Creates the Swagger configuration file
 */

async function createSwaggerConfig(
  targetPath: string,
  isTS: boolean
): Promise<void> {
  const swaggerConfigContent = isTS 
    ? `import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { SwaggerTheme } from 'swagger-themes';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load OpenAPI YAML file
const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiSpecString = fs.readFileSync(openApiPath, 'utf8');

// Parse YAML with error handling
let openApiSpec: Record<string, any>;
try {
  openApiSpec = yaml.load(openApiSpecString) as Record<string, any>;
} catch (error) {
  console.error('Error parsing OpenAPI YAML file:', error);
  openApiSpec = {} as Record<string, any>;
}

// Initialize swagger-themes
const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer('dark');

// Swagger UI options for dark mode
const options = {
  customCss: darkStyle,
  customSiteTitle: 'API Documentation',
  explorer: false
};

export { swaggerUi, openApiSpec, options };
`
    : `import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { SwaggerTheme } from 'swagger-themes';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load OpenAPI YAML file
const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiSpecString = fs.readFileSync(openApiPath, 'utf8');

// Parse YAML with error handling
let openApiSpec;
try {
  openApiSpec = yaml.load(openApiSpecString);
} catch (error) {
  console.error('Error parsing OpenAPI YAML file:', error);
  openApiSpec = {};
}

// Initialize swagger-themes
const theme = new SwaggerTheme();
const darkStyle = theme.getBuffer('dark');

// Swagger UI options for dark mode
const options = {
  customCss: darkStyle,
  customSiteTitle: 'API Documentation',
  explorer: false
};

export { swaggerUi, openApiSpec, options };
`;

  const configDir = path.join(targetPath, isTS ? 'src/config' : 'src/config');
  await fs.ensureDir(configDir);
  await fs.writeFile(path.join(configDir, isTS ? 'swagger.ts' : 'swagger.js'), swaggerConfigContent);

  // Add js-yaml dependency
  const packageJsonPath = path.join(targetPath, 'package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  
  packageJson.dependencies = {
    ...packageJson.dependencies,
    'js-yaml': '^4.1.0',
  };
  
  if (isTS) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@types/js-yaml': '^4.0.9',
    };
  }
  
  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Updates the index file to include Swagger UI
 */
async function updateIndexFile(
  targetPath: string,
  isTS: boolean
): Promise<void> {
  const indexFilePath = path.join(targetPath, isTS ? 'src/index.ts' : 'src/index.js');
  let indexContent = await fs.readFile(indexFilePath, 'utf8');
  
  // Import swagger config
  const importStatement = isTS 
    ? "import { swaggerUi, openApiSpec, options } from './config/swagger.js';"
    : "import { swaggerUi, openApiSpec, options } from './config/swagger.js';";
  
  // Find all import statements in the file
  const allImportMatches = indexContent.match(/import .* from ['"].*['"];?(\r?\n|$)/g) || [];
  
  // If there are import statements, add our import after the last one
  if (allImportMatches.length > 0) {
    const lastImport = allImportMatches[allImportMatches.length - 1];
    const lastImportIndex = indexContent.lastIndexOf(lastImport) + lastImport.length;
    
    // Insert our import statement after the last import
    indexContent = 
      indexContent.substring(0, lastImportIndex) + 
      importStatement + '\n' + 
      indexContent.substring(lastImportIndex);
  } else {
    // If no imports found, add at the beginning of the file
    indexContent = importStatement + '\n\n' + indexContent;
  }
  
  // Import statement is now inserted above
  
  // Add swagger UI middleware before API routes
  // Look for the root route handler or any route definition
  const routePattern = /(app\.get\("\/.*\)|app\.use\(.*\)|app\.post\(.*\)|app\.put\(.*\)|app\.delete\(.*\))/;
  const swaggerMiddleware = `\n// Swagger UI
// Serve Swagger UI at /api-docs endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, options));

`;

  // First try to find a route pattern
  if (routePattern.test(indexContent)) {
    indexContent = indexContent.replace(
      routePattern,
      `${swaggerMiddleware}$1`
    );
  } else {
    // Fallback: Add after CORS middleware
    const corsPattern = /app\.use\(cors\(.*\)\);/;
    if (corsPattern.test(indexContent)) {
      indexContent = indexContent.replace(
        corsPattern,
        `$&\n${swaggerMiddleware}`
      );
    } else {
      // Last resort: Add after express.json middleware
      const jsonPattern = /app\.use\(express\.json\(\)\);/;
      indexContent = indexContent.replace(
        jsonPattern,
        `$&\n${swaggerMiddleware}`
      );
    }
  }
  
  await fs.writeFile(indexFilePath, indexContent);
}