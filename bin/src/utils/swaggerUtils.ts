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
    
    console.log(chalk.green.bold('✨ Swagger UI has been set up in dark mode!'));
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

  const docsDir = path.join(targetPath, isTS ? 'src/docs' : 'src/docs');
  await fs.ensureDir(docsDir);
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

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load OpenAPI YAML file
const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiSpec = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as Record<string, any>;

// Swagger UI options for dark mode
const options = {
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui { background-color: #1a1a1a; color: #ffffff; } .swagger-ui .info .title, .swagger-ui .info h1, .swagger-ui .info h2, .swagger-ui .info h3, .swagger-ui .info h4, .swagger-ui .info h5, .swagger-ui .opblock-tag, .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated, .swagger-ui .opblock .opblock-summary-description, .swagger-ui .model-title, .swagger-ui .models-control { color: #ffffff !important; } .swagger-ui .opblock { background-color: #2d2d2d; border-radius: 4px; margin: 0 0 15px; border: none; box-shadow: 0 0 0 1px rgba(255,255,255,0.1); } .swagger-ui .opblock .opblock-summary { border-bottom: 1px solid rgba(255,255,255,0.1); } .swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-external-docs-wrapper, .swagger-ui .opblock-title_normal { background-color: #2d2d2d; color: #ffffff; } .swagger-ui .opblock-body { background-color: #2d2d2d; } .swagger-ui table { color: #ffffff; background-color: #2d2d2d; } .swagger-ui table thead tr td, .swagger-ui table thead tr th { color: #ffffff; } .swagger-ui input, .swagger-ui select { background-color: #3c3c3c; color: #ffffff; border: 1px solid rgba(255,255,255,0.2); } .swagger-ui .btn { background-color: #4a4a4a; color: white; } .swagger-ui .scheme-container { background-color: #2d2d2d; color: white; box-shadow: none; } .swagger-ui section.models { background-color: #2d2d2d; border: 1px solid rgba(255,255,255,0.1); } .swagger-ui section.models.is-open h4 { color: #ffffff; } .swagger-ui .model-box { background-color: #3c3c3c; } .swagger-ui .model { color: #ffffff; } .swagger-ui .opblock.opblock-get .opblock-summary { background-color: rgba(97, 175, 254, 0.1); } .swagger-ui .opblock.opblock-post .opblock-summary { background-color: rgba(73, 204, 144, 0.1); } .swagger-ui .opblock.opblock-put .opblock-summary { background-color: rgba(252, 161, 48, 0.1); } .swagger-ui .opblock.opblock-delete .opblock-summary { background-color: rgba(249, 62, 62, 0.1); } .swagger-ui .opblock.opblock-patch .opblock-summary { background-color: rgba(80, 227, 194, 0.1); }',
  customSiteTitle: 'API Documentation',
};

export { swaggerUi, openApiSpec, options };
`
    : `import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load OpenAPI YAML file
const openApiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openApiSpec = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as Record<string, any>;

// Swagger UI options for dark mode
const options = {
  customCss: '
    /* General background & text */
    .swagger-ui {
      background-color: #121212;
      color: #e0e0e0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    /* Topbar */
    .swagger-ui .topbar {
      display: none;
    }

    /* Info / API title */
    .swagger-ui .info .title,
    .swagger-ui .info h1,
    .swagger-ui .info h2,
    .swagger-ui .info h3,
    .swagger-ui .info h4,
    .swagger-ui .info h5,
    .swagger-ui .opblock-tag,
    .swagger-ui .opblock-summary-path,
    .swagger-ui .opblock-summary-description,
    .swagger-ui .model-title,
    .swagger-ui .models-control {
      color: #ffffff !important;
    }

    /* Opblocks */
    .swagger-ui .opblock {
      background-color: #1f1f1f;
      border-radius: 6px;
      margin-bottom: 12px;
      border: none;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05);
    }

    .swagger-ui .opblock .opblock-summary {
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding: 8px 12px;
    }

    .swagger-ui .opblock-body {
      background-color: #2a2a2a;
      padding: 12px;
    }

    /* Table styling */
    .swagger-ui table {
      color: #e0e0e0;
      background-color: #1f1f1f;
    }
    .swagger-ui table thead tr th,
    .swagger-ui table thead tr td {
      color: #ffffff;
    }

    /* Inputs & buttons */
    .swagger-ui input,
    .swagger-ui select {
      background-color: #2b2b2b;
      color: #e0e0e0;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .swagger-ui .btn {
      background-color: #3a3a3a;
      color: #ffffff;
    }

    /* Scheme container & models */
    .swagger-ui .scheme-container,
    .swagger-ui section.models {
      background-color: #1f1f1f;
      color: #ffffff;
      border: none;
    }

    .swagger-ui .model-box,
    .swagger-ui .model {
      background-color: #2b2b2b;
      color: #e0e0e0;
    }

    /* Opblock colors by method */
    .swagger-ui .opblock.opblock-get .opblock-summary {
      background-color: rgba(97, 175, 254, 0.1);
    }
    .swagger-ui .opblock.opblock-post .opblock-summary {
      background-color: rgba(73, 204, 144, 0.1);
    }
    .swagger-ui .opblock.opblock-put .opblock-summary {
      background-color: rgba(252, 161, 48, 0.1);
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary {
      background-color: rgba(249, 62, 62, 0.1);
    }
    .swagger-ui .opblock.opblock-patch .opblock-summary {
      background-color: rgba(80, 227, 194, 0.1);
    }

    /* Smooth edges & spacing */
    .swagger-ui .opblock .opblock-summary-path,
    .swagger-ui .opblock .opblock-summary-operation-id {
      font-weight: 600;
    }
  ',
  customSiteTitle: 'API Documentation',
};

export { swaggerUi, openApiSpec, options };
`;

  const configDir = path.join(targetPath, isTS ? 'src/config' : 'src/config');
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