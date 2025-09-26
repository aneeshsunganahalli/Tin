import { spawn } from 'child_process';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

// Async dependency installation for parallel execution
export async function installDependenciesAsync(dest: string): Promise<void> {
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
export async function gitInitFast(dest: string): Promise<void> {
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