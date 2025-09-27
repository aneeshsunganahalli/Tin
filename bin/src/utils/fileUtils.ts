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

export function createEnvFile(targetDir: string): void {
  const envContent = `MONGO=\nPORT=3000\n`;
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