#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDir = path.join(__dirname, '..', 'templates');

async function cleanTemplateNodeModules() {
  try {
    console.log('Cleaning template node_modules...');
    
    // Find all node_modules directories in templates
    const jsCookiesNodeModules = path.join(templatesDir, 'js', 'cookies', 'node_modules');
    const jsJwtNodeModules = path.join(templatesDir, 'js', 'jwt', 'node_modules');
    const tsCookiesNodeModules = path.join(templatesDir, 'ts', 'cookies', 'node_modules');
    const tsJwtNodeModules = path.join(templatesDir, 'ts', 'jwt', 'node_modules');
    
    // Remove them if they exist
    const nodeModulesPaths = [jsCookiesNodeModules, jsJwtNodeModules, tsCookiesNodeModules, tsJwtNodeModules];
    for (const modulesPath of nodeModulesPaths) {
      if (await fs.pathExists(modulesPath)) {
        console.log(`Removing ${modulesPath}...`);
        await fs.remove(modulesPath);
      }
    }
    
    console.log('Successfully cleaned all template node_modules directories');
  } catch (error) {
    console.error('Failed to clean template node_modules:', error);
    process.exit(1);
  }
}

cleanTemplateNodeModules();