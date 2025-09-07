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
    .name('create-tin')
    .description('Scaffold a TypeScript or JavaScript Express boilerplate')
    .option('--ts', 'Use TypeScript')
    .option('--js', 'Use JavaScript')
    .option('--skip-git', 'Skip Git repository initialization')
    .option('--git', 'Initialize Git repository')
    .argument('[project-name]', 'Name of the project')
    .parse();
const options = program.opts();
const projectName = program.args[0] || 'my-express-app';
async function chooseTemplate() {
    const answers = {};
    // Language selection
    if (options.ts) {
        answers.language = 'ts';
    }
    else if (options.js) {
        answers.language = 'js';
    }
    else {
        const { language } = await inquirer.prompt([
            {
                type: 'list',
                name: 'language',
                message: chalk.bold('Choose a language:'), choices: [
                    {
                        name: `${chalk.blue('●')} ${chalk.blue.bold('TypeScript')} ${chalk.gray('- Type-safe JavaScript')}`,
                        value: 'ts'
                    },
                    {
                        name: `${chalk.yellow('●')} ${chalk.yellow.bold('JavaScript')} ${chalk.gray('- Classic JavaScript')}`,
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
    }
    else if (options.skipGit) {
        answers.initGit = false;
    }
    else {
        const { initGit } = await inquirer.prompt([
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
        language: answers.language,
        initGit: answers.initGit
    };
}
function copyTemplate(src, dest) {
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
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to copy template: ${errorMessage}`);
    }
}
// Async dependency installation for parallel execution
async function installDependenciesAsync(dest) {
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
        npmInstall.on('close', (code) => {
            if (code === 0) {
                spinner.succeed(chalk.green('Dependencies installed successfully!'));
            }
            else {
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
function updatePackageJson(dest) {
    const pkgPath = path.join(dest, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = fs.readJsonSync(pkgPath);
        pkg.name = projectName;
        fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    }
}
// Ultra-fast git initialization
async function gitInitFast(dest) {
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
        }
        catch (error) {
            // Silently skip git init if git is not available
            spinner.warn('Git not available - skipping repository initialization');
            resolve();
        }
    });
}
function createEnvFile(targetDir) {
    const envContent = `MONGO=mongodb://localhost:27017/myapp\nPORT=5000\n`;
    const envPath = path.join(targetDir, '.env');
    // Ensure the target directory exists
    fs.ensureDirSync(targetDir);
    fs.writeFileSync(envPath, envContent, 'utf-8');
}
(async () => {
    // Simple CLI header
    console.log();
    console.log(chalk.cyan.bold('🔧 Create Tin - Express Scaffold'));
    console.log(chalk.gray('Fast Express.js project setup'));
    console.log();
    const template = await chooseTemplate();
    const isTS = template.language === 'ts';
    const initGit = template.initGit;
    const langColor = isTS ? chalk.blue : chalk.yellow;
    console.log(); // Add spacing before project creation
    // Try multiple possible template paths to handle different installation scenarios
    const templatePaths = [
        path.join(__dirname, '..', 'templates', template.language), // Standard build structure (dist/bin -> dist/templates)
        path.join(__dirname, '..', '..', 'templates', template.language), // Development mode
        path.join(__dirname, 'templates', template.language), // Same directory
        // NPX specific paths
        path.resolve(__dirname, '..', 'templates', template.language), // Absolute path for npx
        path.join(process.cwd(), 'node_modules', 'create-tin', 'dist', 'templates', template.language), // Local install
        path.join(process.cwd(), 'node_modules', 'create-tin', 'templates', template.language), // Alternative structure
    ];
    let templatePath = null;
    for (const possiblePath of templatePaths) {
        if (fs.existsSync(possiblePath)) {
            templatePath = possiblePath;
            break;
        }
    }
    if (!templatePath) {
        console.log();
        console.log(chalk.red.bold('  ✖ Error: ') + chalk.red('Template not found!'));
        console.log(chalk.gray('    Searched paths:'));
        templatePaths.forEach(p => console.log(chalk.gray(`      - ${p}`)));
        console.log();
        process.exit(1);
    }
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
        createEnvFile(targetPath); // Create .env file immediately after copying template
        spinner.succeed(chalk.green.bold(`✨ Created ${langColor.bold(projectName)} project!`));
    }
    catch (e) {
        spinner.fail(chalk.red.bold('Project creation failed.'));
        console.error('Error details:', e);
        console.error(`Template path: ${templatePath}`);
        console.error(`Target path: ${targetPath}`);
        process.exit(1);
    }
    console.log(); // Add spacing
    // Create tasks array for parallel execution
    const tasks = [
        installDependenciesAsync(targetPath)
    ];
    // Add git initialization if requested
    if (initGit) {
        tasks.push(gitInitFast(targetPath));
    }
    // Run dependency installation and git init in parallel for speed
    await Promise.all(tasks);
    // Clean, organized success message
    console.log();
    console.log(chalk.green.bold('  🎉 Project setup completed successfully!'));
    console.log();
    console.log(chalk.bold('  📋 Configuration Summary:'));
    console.log(`     Language: ${langColor.bold(isTS ? 'TypeScript' : 'JavaScript')}`);
    console.log(`     Git:      ${initGit ? chalk.green.bold('✓ Initialized') : chalk.yellow.bold('✗ Skipped')}`);
    console.log(`     Database: ${chalk.magenta.bold('MongoDB')} ${chalk.gray('(configurable in .env)')}`);
    console.log(`     Port:     ${chalk.cyan.bold('5000')} ${chalk.gray('(configurable in .env)')}`);
    console.log();
    console.log(chalk.bold('  🚀 Next steps:'));
    console.log(chalk.cyan(`     cd ${projectName}`));
    console.log(chalk.cyan('     npm run dev'));
    console.log();
    console.log(chalk.gray('  Happy coding! 🎯'));
    console.log();
    console.log(chalk.gray('  📝 Usage: npx create-tin <project-name>'));
    console.log();
})();
