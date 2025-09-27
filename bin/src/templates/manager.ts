import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export function findTemplatePath(templateLanguage: string, __dirname: string): string {
  // Try multiple possible template paths to handle different installation scenarios
  const templatePaths = [
    // NPM package paths (production) - check these first
    path.join(__dirname, '..', '..', 'templates', templateLanguage), // Standard build: dist/bin -> dist/templates
    path.resolve(__dirname, '..', '..', 'templates', templateLanguage), // Absolute path for npx
    
    // Global npm installation paths
    path.join(__dirname, '..', '..', '..', 'templates', templateLanguage), // npm global install
    path.join(process.env.NODE_PATH || '', 'create-tin', 'dist', 'templates', templateLanguage),
    
    // Local npm installation paths
    path.join(process.cwd(), 'node_modules', 'create-tin', 'dist', 'templates', templateLanguage),
    path.join(process.cwd(), 'node_modules', 'create-tin', 'templates', templateLanguage),
    
    // Development mode paths (keep these last)
    path.join(__dirname, '..', 'templates', templateLanguage), // Same directory as script
    path.join(process.cwd(), 'templates', templateLanguage), // Current working directory
  ];
  
  for (const possiblePath of templatePaths) {
    if (fs.existsSync(possiblePath)) {
      return possiblePath;
    }
  }
  
  console.log();
  console.log(chalk.red.bold('  ✖ Error: ') + chalk.red('Template not found!'));
  console.log(chalk.gray('    Searched paths:'));
  templatePaths.forEach(p => console.log(chalk.gray(`      - ${p}`)));
  console.log();
  process.exit(1);
}

export function copyTemplate(src: string, dest: string): void {
  try {
    // Ensure source exists
    if (!fs.existsSync(src)) {
      throw new Error(`Source template directory does not exist: ${src}`);
    }
    
    // Check source contents before copying
    const sourceContents = fs.readdirSync(src);
    if (sourceContents.length === 0) {
      throw new Error(`Source template directory is empty: ${src}`);
    }
    
    // Ensure destination directory exists
    fs.ensureDirSync(dest);
    
    // Copy all files from template - simplified approach
    fs.copySync(src, dest, {
      overwrite: true,
      errorOnExist: false
    });
    
    // Check if destination has any files after copy
    const destContents = fs.readdirSync(dest);
    if (destContents.length === 0) {
      throw new Error(`Copy operation failed - destination directory is empty after copy. Source had: ${sourceContents.join(', ')}`);
    }
    
    // Verify the copy was successful by checking if essential files exist
    const packageJsonPath = path.join(dest, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`Template copy failed - package.json not found in ${dest}. Destination contains: ${destContents.join(', ')}`);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to copy template: ${errorMessage}`);
  }
}