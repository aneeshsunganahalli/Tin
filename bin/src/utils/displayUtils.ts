import chalk from 'chalk';
import { AuthMethod } from '../cli/prompts.js';

export function displayHeader(): void {
  console.log();
  console.log(chalk.cyan.bold('🔧 Create Tin - Express Scaffold'));
  console.log(chalk.gray('Fast Express.js project setup'));
  console.log();
}

export function displaySuccessMessage(
  projectName: string, 
  isTS: boolean, 
  isOnlyJWT: boolean,
  initGit: boolean,
  port: number = 3000,
  docker: boolean = false,
  swagger: boolean = false
): void {
  const langColor = isTS ? chalk.blue : chalk.yellow;
  
  // Clean, organized success message
  console.log();
  console.log(chalk.green.bold('  🎉 Project setup completed successfully!'));
  console.log();
  console.log(chalk.bold('  📋 Configuration Summary:'));
  console.log(`     Language: ${langColor.bold(isTS ? 'TypeScript' : 'JavaScript')}`);
  console.log(`     Authentication: ${langColor.bold(isOnlyJWT ? 'JWT (header-based)' : 'Cookie-based JWT')}`);
  console.log(`     Git:      ${initGit ? chalk.green.bold('✓ Initialized') : chalk.yellow.bold('✗ Skipped')}`);
  console.log(`     Docker:   ${docker ? chalk.green.bold('✓ Configured') : chalk.yellow.bold('✗ Skipped')}`);
  console.log(`     Swagger:  ${swagger ? chalk.green.bold('✓ Configured (Dark Mode)') : chalk.yellow.bold('✗ Skipped')}`);
  console.log();
  console.log(chalk.bold('  🔐 Environment Configuration:'));
  console.log(`     ${chalk.green.bold('.env file')} has been auto-generated with:`);
  console.log(`     • Port:       ${chalk.cyan.bold(port)}`);
  console.log(`     • Database:   ${chalk.magenta.bold('MongoDB')} ${chalk.gray('(local or Docker)')}`);
  console.log(`     • JWT Secret: ${chalk.yellow.bold('Auto-generated')} ${chalk.gray('(cryptographically secure)')}`);
  if (docker) {
    console.log(`     • Docker:     ${chalk.blue.bold('Configured')} ${chalk.gray('(MongoDB on mongo:27017)')}`);
  }
  if (swagger) {
    console.log(`     • Swagger:    ${chalk.blue.bold('Enabled')} ${chalk.gray('(API documentation settings)')}`);
  }
  console.log();
  console.log(chalk.bold('  🚀 Next steps:'));
  console.log(chalk.cyan(`     cd ${projectName}`));
  console.log(chalk.cyan('     npm run dev'));
  if (swagger) {
    console.log();
    console.log(chalk.bold('  📚 API Documentation:'));
    console.log(chalk.cyan(`     http://localhost:${port}/api-docs`));
  }
  console.log();
  console.log(chalk.gray('  💡 Tip: Check .env for configuration, .env.example for reference'));
  console.log(chalk.gray('  Happy coding! 🎯'));
}