import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { TemplateOptions } from './cli/prompts.js';
import { displaySuccessMessage } from './utils/displayUtils.js';
import { checkProjectExists, createEnvFile, createGitIgnore, updatePackageJson } from './utils/fileUtils.js';
import { createDockerFiles } from './utils/dockerUtils.js';
import { setupSwaggerUI } from './utils/swaggerUtils.js';
import { copyTemplate, findTemplatePath } from './templates/manager.js';
import { gitInitFast, installDependenciesAsync } from './utils/installUtils.js';

// Function has been moved to displayUtils.ts

export async function createProject(
  template: TemplateOptions,
  projectName: string,
  __dirname: string
): Promise<void> {
  const isTS = template.language === 'ts';
  const isOnlyJWT = template.authMethod === 'jwt';
  const initGit = template.initGit;
  const langColor = isTS ? chalk.blue : chalk.yellow;

  console.log(); // Add spacing before project creation
  
  const templatePath = findTemplatePath(template.language, __dirname, template.authMethod);
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
    createGitIgnore(targetPath)
    
    // Add Docker files if selected
    if (template.docker) {
      createDockerFiles(targetPath, isTS, template.port);
    }

    // Add Swagger UI if selected
    if (template.swagger) {
      await setupSwaggerUI(targetPath, isTS, template.port);
    }
    
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

  displaySuccessMessage(
    projectName, 
    isTS, 
    isOnlyJWT, 
    initGit, 
    template.port, 
    template.docker, 
    template.swagger
  );
}