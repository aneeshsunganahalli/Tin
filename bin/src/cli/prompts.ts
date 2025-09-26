import inquirer from 'inquirer';
import chalk from 'chalk';

export interface TemplateOptions {
  language: string;
  initGit: boolean;
}

export async function chooseTemplate(options: any): Promise<TemplateOptions> {
  const answers: { language?: string; initGit?: boolean } = {};
  
  // Language selection
  if (options.ts) {
    answers.language = 'ts';
  } else if (options.js) {
    answers.language = 'js';
  } else {
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: chalk.bold('Choose a language:'),
        choices: [
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
  } else if (options.skipGit) {
    answers.initGit = false;
  } else {
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
    language: answers.language!,
    initGit: answers.initGit!
  };
}