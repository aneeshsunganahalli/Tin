import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import { spawn, execSync } from 'child_process';
import { TemplateOptions } from './cli/prompts.js';
import { displaySuccessMessage } from './utils/displayUtils.js';
import { checkProjectExists, createEnvFile, updatePackageJson } from './utils/fileUtils.js';

function findTemplatePath(templateLanguage: string, __dirname: string): string {
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

function copyTemplate(src: string, dest: string): void {
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

// Async dependency installation for parallel execution
async function installDependenciesAsync(dest: string): Promise<void> {
  const spinner = ora({
    text: 'Installing dependencies...',
    spinner: 'dots',
    color: 'cyan'
  }).start();
  
  return new Promise((resolve) => {
    // Use cross-platform npm command
    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    
    const npmInstall = spawn(npmCommand, ['install'], {
      cwd: dest,
      stdio: 'ignore',
      shell: true // Important for Windows compatibility
    });
    
    npmInstall.on('close', (code: number | null) => {
      if (code === 0) {
        spinner.succeed(chalk.green('Dependencies installed successfully!'));
      } else {
        spinner.fail(chalk.red('Failed to install dependencies. Run `npm install` manually.'));
      }
      resolve();
    });
    
    npmInstall.on('error', () => {
      spinner.fail(chalk.red('Failed to install dependencies. Run `npm install` manually.'));
      resolve();
    });
  });
}

// Ultra-fast git initialization
async function gitInitFast(dest: string): Promise<void> {
  const spinner = ora('Initializing Git repository...').start();
  
  return new Promise((resolve) => {
    try {
      // Check if already a git repo
      if (fs.existsSync(path.join(dest, '.git'))) {
        spinner.info('Git repository already exists');
        resolve();
        return;
      }
      
      // Fast single command execution with better cross-platform support
      execSync('git init && git add . && git commit -m "Initial commit"', { 
        cwd: dest, 
        stdio: 'ignore',
        timeout: 10000, // Increased timeout for slower systems
        env: { 
          ...process.env,
          // Remove potentially problematic environment variables
          GIT_TERMINAL_PROMPT: '0',
          GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME || 'Developer',
          GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL || 'dev@example.com',
          GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME || 'Developer', 
          GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL || 'dev@example.com'
        }
      });
      
      spinner.succeed('Git repository initialized');
      resolve();
    } catch (error) {
      // Silently skip git init if git is not available
      spinner.warn('Git not available - skipping repository initialization');
      resolve();
    }
  });
}

// Function has been moved to displayUtils.ts

export async function createProject(
  template: TemplateOptions,
  projectName: string,
  __dirname: string
): Promise<void> {
  const isTS = template.language === 'ts';
  const initGit = template.initGit;
  const langColor = isTS ? chalk.blue : chalk.yellow;

  console.log(); // Add spacing before project creation
  
  const templatePath = findTemplatePath(template.language, __dirname);
  const targetPath = path.resolve(process.cwd(), projectName);

  checkProjectExists(targetPath, projectName);
  
  const spinner = ora({
    text: `Creating ${langColor(isTS ? 'TypeScript' : 'JavaScript')} project...`,
    spinner: 'dots',
    color: isTS ? 'blue' : 'yellow'
  }).start();
  
  try {
    copyTemplate(templatePath, targetPath);
    updatePackageJson(targetPath, projectName);
    createEnvFile(targetPath, template.port); // Create .env file with user-specified port
    spinner.succeed(chalk.green.bold(`✨ Created ${langColor.bold(projectName)} project!`));
  } catch (e) {
    spinner.fail(chalk.red.bold('Project creation failed.'));
    console.error('Error details:', e);
    console.error(`Template path: ${templatePath}`);
    console.error(`Target path: ${targetPath}`);
    process.exit(1);
  }

  console.log(); // Add spacing

  // Create tasks array for parallel execution
  const tasks: Promise<void>[] = [
    installDependenciesAsync(targetPath)
  ];

  // Add git initialization if requested
  if (initGit) {
    tasks.push(gitInitFast(targetPath));
  }
  
  // Run dependency installation and git init in parallel for speed
  await Promise.all(tasks);

  displaySuccessMessage(projectName, isTS, initGit, template.port);
}