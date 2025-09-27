#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';
import { createProgram, getProgramOptions } from './src/cli/program.js';
import { chooseTemplate } from './src/cli/prompts.js';
import { createProject } from './src/app.js';
import { displayHeader } from './src/utils/displayUtils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
(async () => {
    displayHeader();
    const program = createProgram();
    const { options, projectName } = getProgramOptions(program);
    const template = await chooseTemplate(options);
    await createProject(template, projectName, __dirname);
})();
