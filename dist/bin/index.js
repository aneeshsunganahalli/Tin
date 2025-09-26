#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import { createProgram, getProgramOptions } from './src/cli/program.js';
import { chooseTemplate } from './src/cli/prompts.js';
import { createProject } from './src/app.js';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function displayHeader() {
    console.log();
    console.log(chalk.cyan.bold('🔧 Create Tin - Express Scaffold'));
    console.log(chalk.gray('Fast Express.js project setup'));
    console.log();
}
(async () => {
    displayHeader();
    const program = createProgram();
    const { options, projectName } = getProgramOptions(program);
    const template = await chooseTemplate(options);
    await createProject(template, projectName, __dirname);
})();
