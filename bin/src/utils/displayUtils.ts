import chalk from 'chalk';

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
  docker: boolean = false
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
  console.log(`     Database: ${chalk.magenta.bold('MONGODB_URI')} ${chalk.gray('(configurable in .env)')}`);
  console.log(`     Port:     ${chalk.cyan.bold(port)} ${chalk.gray('(configurable in .env)')}`);
  console.log();
  console.log(chalk.bold('  🚀 Next steps:'));
  console.log(chalk.cyan(`     cd ${projectName}`));
  console.log(chalk.cyan('     npm run dev'));
  console.log();
  console.log(chalk.gray('  Happy coding! 🎯'));
}