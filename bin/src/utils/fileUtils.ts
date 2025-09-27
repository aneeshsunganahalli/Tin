import fs from 'fs-extra';
import path from 'path';

export function updatePackageJson(dest: string, projectName: string): void {
  const pkgPath = path.join(dest, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }
}

export function createEnvFile(targetDir: string, port: number = 3000): void {
  const envContent = `MONGODB_URI=\nPORT=${port}\n`;
  const envPath = path.join(targetDir, '.env');
  
  // Ensure the target directory exists
  fs.ensureDirSync(targetDir);
  
  fs.writeFileSync(envPath, envContent, 'utf-8');
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

# Docker
.dockerignore
Dockerfile
docker-compose.yml

# TypeScript
*.tsbuildinfo

# Misc
*.bak
*.tmp

  `;
  const gitIgnorePath = path.join(targetDir, '.env');
  
  // Ensure the target directory exists
  fs.ensureDirSync(targetDir);
  
  fs.writeFileSync(gitIgnorePath, gitIgnoreContent, 'utf-8');
}
