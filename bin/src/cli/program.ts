import { Command } from 'commander';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('create-tin')
    .description('Scaffold a TypeScript or JavaScript Express boilerplate')
    .option('--ts', 'Use TypeScript')
    .option('--js', 'Use JavaScript')
    .option('--jwt', 'Use JWT-based authentication')
    .option('--cookies', 'Use Cookie-based authentication')
    .option('--skip-git', 'Skip Git repository initialization')
    .option('--git', 'Initialize Git repository')
    .option('--port <number>', 'Specify the port number (default: 3000)')
    .option('--docker', 'Include Docker configuration')
    .option('--skip-docker', 'Skip Docker configuration')
    .argument('[project-name]', 'Name of the project')
    .parse();

  return program;
}

export function getProgramOptions(program: Command) {
  const options = program.opts();
  const projectName = program.args[0] || 'my-express-app';
  
  return { options, projectName };
}