#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const program = new Command();

// ESM-compatible __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI definition
program
  .name('tin')
  .description('Scaffold a TypeScript or JavaScript Express boilerplate')
  .option('--ts', 'Create a TypeScript project')
  .option('--js', 'Create a JavaScript project')
  .argument('[project-name]', 'Name of the project')
  .parse(process.argv);

const options = program.opts();
const projectName = program.args[0] || 'my-express-app';

// Determine template (from flag or prompt)
async function chooseTemplate() {
  if (options.ts) return 'ts';
  if (options.js) return 'js';

  const { language } = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Which language do you want to generate with?',
      choices: ['TypeScript', 'JavaScript'],
    },
  ]);
  return language === 'TypeScript' ? 'ts' : 'js';
}

// Copy template directory
function copyTemplate(src: string, dest: string) {
  fs.copySync(src, dest, {
    filter: (src) => !src.includes('node_modules'),
  });
}

// Install npm dependencies
function installDependencies(dest: string) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { cwd: dest, stdio: 'inherit' });
    console.log('✅ Dependencies installed!');
  } catch {
    console.error('❌ Failed to install dependencies. Please run `npm install` manually.');
  }
}

// Update package.json with project name
function updatePackageJson(dest: string) {
  const pkgPath = path.join(dest, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }
}

// Main runner
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
  updatePackageJson(targetPath);
  installDependencies(targetPath);

  console.log(`\n✨ Project created! To get started:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm run dev   # or npm start\n`);
})();
