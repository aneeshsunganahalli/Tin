import inquirer from 'inquirer';
import chalk from 'chalk';

export interface TemplateOptions {
  language: string;
  initGit: boolean;
  port: number;
}

export async function chooseTemplate(options: any): Promise<TemplateOptions> {
  const answers: { language?: string; initGit?: boolean; port?: number } = {};
  
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
  
  // Port selection
  if (options.port) {
    answers.port = parseInt(options.port, 10);
  } else {
    // This type assertion is needed to help TypeScript with the inquirer types
    const portResponse = await inquirer.prompt([{
      type: 'input',
      name: 'port',
      message: chalk.bold('Enter the port number for your application:'),
      default: 3000,
      validate: (input: string) => {
        const port = parseInt(input, 10);
        if (isNaN(port) || port < 0 || port > 65535) {
          return 'Please enter a valid port number (0-65535)';
        }
        return true;
      },
      filter: (input: string) => parseInt(input, 10)
    } as any]);
    answers.port = portResponse.port;
  }

  return {
    language: answers.language!,
    initGit: answers.initGit!,
    port: answers.port!
  };
}