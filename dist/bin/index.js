#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';
const program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- CLI definition ---
program
    .name('tin')
    .description('Scaffold a TypeScript or JavaScript Express boilerplate')
    .option('--ts', 'Create a TypeScript project')
    .option('--js', 'Create a JavaScript project')
    .argument('[project-name]', 'Name of the project')
    .parse(process.argv);
const options = program.opts();
const projectName = program.args[0] || 'my-express-app';
// --- Determine template ---
async function chooseTemplate() {
    if (options.ts)
        return 'ts';
    if (options.js)
        return 'js';
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Which language do you want to generate with?',
            choices: ['TypeScript', 'JavaScript'],
        },
    ]);
    return answer.language === 'TypeScript' ? 'ts' : 'js';
}
// --- Copy template ---
function copyTemplate(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
        if (file === 'node_modules')
            continue;
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
            copyTemplate(srcPath, destPath);
        }
        else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
// --- Install dependencies ---
function installDependencies(dest) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { cwd: dest, stdio: 'inherit' });
        console.log('✅ Done!');
    }
    catch (err) {
        console.error('❌ Failed to install dependencies. Run `npm install` manually.');
    }
}
// --- Main ---
(async () => {
    const template = await chooseTemplate();
    const templatePath = path.join(__dirname, '..', '..', 'templates', template);
    const targetPath = path.resolve(process.cwd(), projectName);
    if (fs.existsSync(targetPath)) {
        console.error(`❌ Folder "${projectName}" already exists.`);
        process.exit(1);
    }
    console.log(`🚀 Creating ${template === 'ts' ? 'TypeScript' : 'JavaScript'} project in "${projectName}"...`);
    copyTemplate(templatePath, targetPath);
    installDependencies(targetPath);
})();
