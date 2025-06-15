#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';
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
    .argument('[project-name]', 'Name of the project')
    .parse();
const options = program.opts();
const projectName = program.args[0] || 'my-express-app';
async function chooseTemplate() {
    if (options.ts)
        return 'ts';
    if (options.js)
        return 'js';
    const { language } = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Choose a language:',
            choices: [
                { name: chalk.blue('TypeScript'), value: 'ts' },
                { name: chalk.yellow('JavaScript'), value: 'js' },
            ],
        },
    ]);
    return language;
}
function copyTemplate(src, dest) {
    fs.copySync(src, dest, {
        filter: (src) => !src.includes('node_modules'),
    });
}
function installDependencies(dest) {
    const spinner = ora('Installing dependencies...').start();
    try {
        execSync('npm install', { cwd: dest, stdio: 'ignore' });
        spinner.succeed('Dependencies installed');
    }
    catch {
        spinner.fail('Failed to install dependencies. Run `npm install` manually.');
    }
}
function updatePackageJson(dest) {
    const pkgPath = path.join(dest, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = fs.readJsonSync(pkgPath);
        pkg.name = projectName;
        fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
    }
}
function gitInit(dest) {
    const spinner = ora('Initializing Git repository...').start();
    try {
        execSync('git --version', { stdio: 'ignore' });
        execSync('git init', { cwd: dest, stdio: 'ignore' });
        execSync('git add .', { cwd: dest, stdio: 'ignore' });
        execSync('git commit -m "Initial commit"', { cwd: dest, stdio: 'ignore' });
        spinner.succeed('Git repository initialized');
    }
    catch {
        spinner.fail('Failed to initialize Git repository. Run `git init` manually.');
    }
}
(async () => {
    console.log(chalk.bold.cyan('\nTin - Express Scaffold\n'));
    const template = await chooseTemplate();
    const isTS = template === 'ts';
    const langColor = isTS ? chalk.blue : chalk.yellow;
    const templatePath = path.join(__dirname, '..', '..', 'templates', template);
    const targetPath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(targetPath)) {
        console.log(chalk.red(`✖ Folder "${projectName}" already exists.`));
        process.exit(1);
    }
    const spinner = ora(`Creating ${langColor(isTS ? 'TypeScript' : 'JavaScript')} project...`).start();
    try {
        copyTemplate(templatePath, targetPath);
        updatePackageJson(targetPath);
        spinner.succeed(`Created ${langColor(projectName)}`);
    }
    catch (e) {
        spinner.fail('Project creation failed.');
        console.error(e);
        process.exit(1);
    }
    installDependencies(targetPath);
    gitInit(targetPath);
    console.log(`\n${chalk.green('✔ Ready!')}\n`);
    console.log(`Next steps:`);
    console.log(`  ${chalk.cyan(`cd ${projectName}`)}`);
    console.log(`  ${chalk.cyan('npm run dev')}\n`);
})();
