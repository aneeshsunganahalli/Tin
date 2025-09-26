import { Command } from 'commander';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('create-tin')
    .description('Scaffold a TypeScript or JavaScript Express boilerplate')
    .option('--ts', 'Use TypeScript')
    .option('--js', 'Use JavaScript')
    .option('--skip-git', 'Skip Git repository initialization')
    .option('--git', 'Initialize Git repository')
    .argument('[project-name]', 'Name of the project')
    .parse();

  return program;
}

export function getProgramOptions(program: Command) {
  const options = program.opts();
  const projectName = program.args[0] || 'my-express-app';
  
  return { options, projectName };
}