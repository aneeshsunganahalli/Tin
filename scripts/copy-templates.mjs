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
      return !basename.includes('node_modules') && 
             !basename.includes('.git') && 
             !basename.startsWith('.') &&
             basename !== 'dist';
    }
  });
  
  // Verify the copy was successful
  const jsTemplate = path.join(templatesDestination, 'js', 'package.json');
  const tsTemplate = path.join(templatesDestination, 'ts', 'package.json');
  
  if (!await fs.pathExists(jsTemplate) || !await fs.pathExists(tsTemplate)) {
    throw new Error('Template copy verification failed - missing template files');
  }
  
  console.log('Templates copied successfully!');
} catch (error) {
  console.error('Failed to copy templates:', error);
  process.exit(1);
}
