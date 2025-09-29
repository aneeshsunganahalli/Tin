#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesSource = path.join(__dirname, '..', 'templates');
const templatesDestination = path.join(__dirname, '..', 'dist', 'templates');

try {
  // Ensure source exists
  if (!await fs.pathExists(templatesSource)) {
    throw new Error(`Source templates directory does not exist: ${templatesSource}`);
  }

  console.log('Copying templates...');
  await fs.copy(templatesSource, templatesDestination, {
    overwrite: true,
    filter: (src) => {
      // Skip node_modules and other build artifacts
      const basename = path.basename(src);
      const isNodeModules = src.includes('node_modules');
      return !isNodeModules && 
             !basename.includes('node_modules') && 
             !basename.includes('.git') && 
             !basename.startsWith('.') &&
             basename !== 'dist';
    }
  });
  
  // Verify the copy was successful - check all template variations
  const jsJwtTemplate = path.join(templatesDestination, 'js', 'jwt', 'package.json');
  const jsCookiesTemplate = path.join(templatesDestination, 'js', 'cookies', 'package.json');
  const tsJwtTemplate = path.join(templatesDestination, 'ts', 'jwt', 'package.json');
  const tsCookiesTemplate = path.join(templatesDestination, 'ts', 'cookies', 'package.json');
  
  // Check if all template variations exist
  const templatePaths = [jsJwtTemplate, jsCookiesTemplate, tsJwtTemplate, tsCookiesTemplate];
  const missingTemplates = [];
  
  for (const templatePath of templatePaths) {
    if (!await fs.pathExists(templatePath)) {
      missingTemplates.push(templatePath);
    }
  }
  
  if (missingTemplates.length > 0) {
    throw new Error(`Template copy verification failed - missing template files: ${missingTemplates.join(', ')}`);
  }
  
  console.log('Templates copied successfully!');
} catch (error) {
  console.error('Failed to copy templates:', error);
  process.exit(1);
}
