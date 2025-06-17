#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync, spawn } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

program
  .name('tin')
  .description('Scaffold a TypeScript or JavaScript Express boilerplate')
  .option('--ts', 'Use TypeScript')
  .option('--js', 'Use JavaScript')
  .option('--skip-git', 'Skip Git repository initialization')
  .option('--git', 'Initialize Git repository')
  .argument('[project-name]', 'Name of the project')
  .parse();

const options = program.opts();
const projectName = program.args[0] || 'my-express-app';

async function chooseTemplate(): Promise<{ language: string; initGit: boolean }> {
  const answers: { language?: string; initGit?: boolean } = {};
  
  // Language selection
  if (options.ts) {
    answers.language = 'ts';
  } else if (options.js) {
    answers.language = 'js';
  } else {    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: chalk.bold('Choose a language:'),
        choices: [
          { 
            name: `${chalk.blue('●')} ${chalk.bold('TypeScript')} ${chalk.gray('- Type-safe JavaScript')}`, 
            value: 'ts' 
          },
          { 
            name: `${chalk.yellow('●')} ${chalk.bold('JavaScript')} ${chalk.gray('- Classic JavaScript')}`, 
            value: 'js' 
          },
        ],
      },
    ]);
    answers.language = language;
  }
  
  // Git initialization selection
  if (options.git) {
    answers.initGit = true;
  } else if (options.skipGit) {
    answers.initGit = false;
  } else {    const { initGit } = await inquirer.prompt([
      {
        type: 'list',
        name: 'initGit',
        message: chalk.bold('Initialize Git repository?'),
        choices: [
          { 
            name: `${chalk.green('✓')} ${chalk.bold('Yes')} ${chalk.gray('- Initialize with Git')}`, 
            value: true 
          },
          { 
            name: `${chalk.red('✗')} ${chalk.bold('No')} ${chalk.gray('- Skip Git setup')}`, 
            value: false 
          },
        ],
        default: 0,
      },
    ]);
    answers.initGit = initGit;
  }

  return {
    language: answers.language!,
    initGit: answers.initGit!
  };
}

function copyTemplate(src: string, dest: string) {
  fs.copySync(src, dest, {
    filter: (src) => !src.includes('node_modules'),
  });
}

function installDependencies(dest: string) {
  const spinner = ora('Installing dependencies...').start();
  try {
    execSync('npm install', { cwd: dest, stdio: 'ignore' });
    spinner.succeed('Dependencies installed');
  } catch {
    spinner.fail('Failed to install dependencies. Run `npm install` manually.');
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
    const npmInstall = spawn('npm', ['install'], {
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

function updatePackageJson(dest: string) {
  const pkgPath = path.join(dest, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }
}

// Optimized git initialization with better performance
function gitInitOptimized(dest: string) {
  const spinner = ora('Initializing Git repository...').start();
  try {
    // Skip git version check if we're confident git is installed
    // Or check git availability by trying to run git command directly
    
    // Ultra-fast git init with minimal configuration
    const gitCommands = [
      'git init --quiet',  // Suppress output for faster execution
      'git config user.name "Developer" 2>/dev/null || true',  // Set minimal config, ignore errors
      'git config user.email "dev@example.com" 2>/dev/null || true',
      'git add . --all',  // Add all files at once
      'git commit -m "Initial commit" --quiet --no-verify'  // Skip hooks for speed
    ].join(' && ');
    
    execSync(gitCommands, { 
      cwd: dest, 
      stdio: 'ignore',
      timeout: 8000,  // Reduced timeout
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }  // Disable interactive prompts
    });
    
    spinner.succeed('Git repository initialized');
  } catch (error) {
    spinner.fail('Failed to initialize Git repository. Run `git init` manually.');
  }
}

// Alternative: Async git initialization (non-blocking)
async function gitInitAsync(dest: string) {
  const spinner = ora('Initializing Git repository...').start();
  
  return new Promise<void>((resolve) => {
    // Use spawn for better performance with large repositories
    const gitInit = spawn('git', ['init', '--quiet'], { 
      cwd: dest, 
      stdio: 'ignore',
      detached: false
    });
    
    gitInit.on('close', (code: number | null) => {
      if (code === 0) {
        // Chain the next commands
        const gitAdd = spawn('git', ['add', '.'], { cwd: dest, stdio: 'ignore' });
        gitAdd.on('close', (addCode: number | null) => {
          if (addCode === 0) {
            const gitCommit = spawn('git', ['commit', '-m', 'Initial commit', '--quiet'], { 
              cwd: dest, 
              stdio: 'ignore' 
            });
            gitCommit.on('close', (commitCode: number | null) => {
              if (commitCode === 0) {
                spinner.succeed('Git repository initialized');
              } else {
                spinner.fail('Failed to create initial commit');
              }
              resolve();
            });
          } else {
            spinner.fail('Failed to add files to git');
            resolve();
          }
        });
      } else {
        spinner.fail('Failed to initialize Git repository');
        resolve();
      }
    });
    
    gitInit.on('error', () => {
      spinner.fail('Git not found. Install Git or run `git init` manually.');
      resolve();
    });
  });
}

// Super fast git init - only if git is available and needed
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
      
      // Fast single command execution
      execSync('git init --quiet && git add . && git commit -m "Initial commit" --quiet --no-verify', { 
        cwd: dest, 
        stdio: 'ignore',
        timeout: 5000,
        env: { 
          ...process.env, 
          GIT_TERMINAL_PROMPT: '0',
          GIT_AUTHOR_NAME: 'Developer',
          GIT_AUTHOR_EMAIL: 'dev@example.com',
          GIT_COMMITTER_NAME: 'Developer', 
          GIT_COMMITTER_EMAIL: 'dev@example.com'
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

function createEnvFile(targetDir: string) {
  const spinner = ora({
    text: 'Creating environment configuration...',
    spinner: 'dots',
    color: 'green'
  }).start();
  
  const envContent = `MONGO=mongodb://localhost:27017/myapp\nPORT=5000\n`;
  const envPath = path.join(targetDir, '.env');

  try {
    fs.writeFileSync(envPath, envContent, 'utf-8');
    spinner.succeed(chalk.green('Environment file created'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create .env file'));
    console.error(error);
  }
}

(async () => {
  // Clean, modern CLI header
  console.log();
  console.log(chalk.cyan.bold('  ╭─────────────────────────────────╮'));
  console.log(chalk.cyan.bold('  │                                 │'));
  console.log(chalk.cyan.bold('  │  ') + chalk.white.bold('🔧 Tin - Express Scaffold') + chalk.cyan.bold('  │'));
  console.log(chalk.cyan.bold('  │  ') + chalk.gray('Fast Express.js project setup') + chalk.cyan.bold('   │'));
  console.log(chalk.cyan.bold('  │                                 │'));
  console.log(chalk.cyan.bold('  ╰─────────────────────────────────╯'));
  console.log();

  const template = await chooseTemplate();
  const isTS = template.language === 'ts';
  const initGit = template.initGit;
  const langColor = isTS ? chalk.blue : chalk.yellow;

  console.log(); // Add spacing before project creation

  const templatePath = path.join(__dirname, '..', '..', 'templates', template.language);
  const targetPath = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetPath)) {
    console.log();
    console.log(chalk.red.bold('  ✖ Error: ') + chalk.red(`Folder "${projectName}" already exists.`));
    console.log();
    process.exit(1);
  }
  const spinner = ora({
    text: `Creating ${langColor(isTS ? 'TypeScript' : 'JavaScript')} project...`,
    spinner: 'dots',
    color: isTS ? 'blue' : 'yellow'
  }).start();

  try {
    copyTemplate(templatePath, targetPath);
    updatePackageJson(targetPath);
    spinner.succeed(chalk.green.bold(`✨ Created ${langColor.bold(projectName)} project!`));
  } catch (e) {
    spinner.fail(chalk.red.bold('Project creation failed.'));
    console.error(e);
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
  
  createEnvFile(targetPath);

  // Clean, organized success message
  console.log();
  console.log(chalk.green.bold('  🎉 Project setup completed successfully!'));
  console.log();
  console.log(chalk.bold('  📋 Configuration Summary:'));
  console.log(`     Language: ${langColor.bold(isTS ? 'TypeScript' : 'JavaScript')}`);
  console.log(`     Git:      ${initGit ? chalk.green.bold('✓ Initialized') : chalk.yellow.bold('✗ Skipped')}`);
  console.log(`     Port:     ${chalk.cyan.bold('5000')} ${chalk.gray('(configurable in .env)')}`);
  console.log();
  console.log(chalk.bold('  🚀 Next steps:'));
  console.log(chalk.cyan(`     cd ${projectName}`));
  console.log(chalk.cyan('     npm run dev'));
  console.log();
  console.log(chalk.gray('  Happy coding! 🎯'));
  console.log();
})();
