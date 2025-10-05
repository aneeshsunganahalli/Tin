import fs from 'fs-extra';
import path from 'path';
import { TemplateOptions } from '../cli/prompts.js';
import { generateEnvVariables, formatEnvContent, generateEnvExampleContent } from './envUtils.js';

export function updatePackageJson(dest: string, projectName: string): void {
  const pkgPath = path.join(dest, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }
}

/**
 * Create a .env file with auto-generated values based on template options
 * @param targetDir - Target directory for the project
 * @param options - Template options selected by the user
 * @param projectName - Name of the project
 */
export function createEnvFile(
  targetDir: string, 
  options: TemplateOptions,
  projectName: string
): void {
  // Ensure the target directory exists
  fs.ensureDirSync(targetDir);
  
  // Generate environment variables based on options
  const envVars = generateEnvVariables(options, projectName);
  const envContent = formatEnvContent(envVars);
  
  // Write .env file
  const envPath = path.join(targetDir, '.env');
  fs.writeFileSync(envPath, envContent, 'utf-8');
  
  // Also create .env.example file as a template reference
  const envExampleContent = generateEnvExampleContent(options);
  const envExamplePath = path.join(targetDir, '.env.example');
  fs.writeFileSync(envExamplePath, envExampleContent, 'utf-8');
}

export function checkProjectExists(targetPath: string, projectName: string): void {
  if (fs.existsSync(targetPath)) {
    const chalk = require('chalk');
    console.log();
    console.log(chalk.red.bold('  ✖ Error: ') + chalk.red(`Folder "${projectName}" already exists.`));
    console.log();
    process.exit(1);
  }
}

export function createGitIgnore(targetDir: string): void {
  const gitIgnoreContent = `
# Node dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
dist/
build/

# Environment variables
.env
.env.*.local
.env.development
.env.test
.env.production

# Logs
logs/
*.log
pids/
*.pid
*.seed
*.pid.lock

# IDE / Editor settings
.idea/
.vscode/
*.sublime-*
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/
*.lcov

# TypeScript
*.tsbuildinfo

# Misc
*.bak
*.tmp
`;
  const gitIgnorePath = path.join(targetDir, '.gitignore');
  
  // Ensure the target directory exists
  fs.ensureDirSync(targetDir);
  
  fs.writeFileSync(gitIgnorePath, gitIgnoreContent, 'utf-8');
}