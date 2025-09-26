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
  initGit: boolean
): void {
  const langColor = isTS ? chalk.blue : chalk.yellow;
  
  // Clean, organized success message
  console.log();
  console.log(chalk.green.bold('  🎉 Project setup completed successfully!'));
  console.log();
  console.log(chalk.bold('  📋 Configuration Summary:'));
  console.log(`     Language: ${langColor.bold(isTS ? 'TypeScript' : 'JavaScript')}`);
  console.log(`     Git:      ${initGit ? chalk.green.bold('✓ Initialized') : chalk.yellow.bold('✗ Skipped')}`);
  console.log(`     Database: ${chalk.magenta.bold('MongoDB')} ${chalk.gray('(configurable in .env)')}`);
  console.log(`     Port:     ${chalk.cyan.bold('5000')} ${chalk.gray('(configurable in .env)')}`);
  console.log();
  console.log(chalk.bold('  🚀 Next steps:'));
  console.log(chalk.cyan(`     cd ${projectName}`));
  console.log(chalk.cyan('     npm run dev'));
  console.log();
  console.log(chalk.gray('  Happy coding! 🎯'));
  console.log();
  console.log(chalk.gray('  📝 Usage: npx create-tin <project-name>'));
  console.log();
}