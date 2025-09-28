import inquirer from 'inquirer';
import chalk from 'chalk';

export interface TemplateOptions {
  language: string;
  initGit: boolean;
  port: number;
  docker: boolean;
  authMethod: string;
}

export async function chooseTemplate(options: any): Promise<TemplateOptions> {
  const answers: { language?: string; initGit?: boolean; port?: number; docker?: boolean; authMethod?: string } = {};

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

  // Authentication Method selection
  if (options.jwt) {
    answers.authMethod = 'jwt';
  } else if (options.cookies) {
    answers.authMethod = 'cookies';
  } else {
    const { authMethod } = await inquirer.prompt([
      {
        type: 'list',
        name: 'authMethod',
        message: chalk.bold('Choose authentication method:'),
        choices: [
          {
            name: `${chalk.red('●')} ${chalk.blue.bold('JWT (header-based)')} ${chalk.gray('- Classic JWT Authentication')}`,
            value: 'jwt'
          },
          {
            name: `${chalk.blue('●')} ${chalk.yellow.bold('Cookies')} ${chalk.gray('- More Secure JWT Authentication Using Cookie')}`,
            value: 'cookies'
          },
        ],
      },
    ]);
    answers.authMethod = authMethod;
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

  // Docker setup selection
  if (options.docker) {
    answers.docker = true;
  } else if (options.skipDocker) {
    answers.docker = false;
  } else {
    const { docker } = await inquirer.prompt([{
      type: 'list',
      name: 'docker',
      message: chalk.bold('Include Docker configuration?'),
      choices: [
        {
          name: `${chalk.green('✓')} ${chalk.bold('Yes')} ${chalk.gray('- Include Dockerfile and docker-compose.yml')}`,
          value: true
        },
        {
          name: `${chalk.red('✗')} ${chalk.bold('No')} ${chalk.gray('- Skip Docker setup')}`,
          value: false
        },
      ],
      default: 0
    } as any]);
    answers.docker = docker;
  }

  return {
    language: answers.language!,
    initGit: answers.initGit!,
    port: answers.port!,
    docker: answers.docker!,
    authMethod: answers.authMethod!
  };
}