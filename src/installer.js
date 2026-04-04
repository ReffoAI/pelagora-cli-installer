import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AI_TOOL_SKILL_PATHS } from './prompts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function install(answers) {
  // Resolve the install location — expand ~ and resolve relative paths
  const expandTilde = (p) => p.startsWith('~') ? p.replace(/^~/, os.homedir()) : p;
  let cwd;
  try {
    cwd = process.cwd();
  } catch {
    cwd = os.homedir();
  }

  const baseDir = path.resolve(cwd, expandTilde(answers.location || '.'));
  const targetDir = path.resolve(baseDir, answers.name);
  console.log(`\n  Creating beacon in ${targetDir}...\n`);

  // Create project directory
  if (fs.existsSync(targetDir)) {
    console.log(`  ⚠ Directory "${answers.name}" already exists at ${baseDir}.`);
    console.log('  Files will be written into the existing directory.\n');
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate .env from template
  const envTemplate = fs.readFileSync(
    path.join(__dirname, 'templates', 'env.template'),
    'utf-8'
  );
  const envContent = envTemplate
    .replace(/\{\{PORT\}\}/g, String(answers.port))
    .replace(/\{\{REFFO_API_KEY\}\}/g, answers.apiKey || '')
    .replace(/\{\{REFFO_API_URL\}\}/g, answers.apiUrl || 'https://reffo.ai');
  fs.writeFileSync(path.join(targetDir, '.env'), envContent);
  console.log('  ✓ Created .env');

  // Generate package.json
  const pkg = {
    name: path.basename(targetDir),
    version: '0.1.0',
    private: true,
    description: 'Pelagora — self-hosted node for the Pelagora network',
    scripts: {
      start: 'node node_modules/pelagora/dist/index.js',
      dev: 'node node_modules/pelagora/dist/index.js',
    },
    dependencies: {
      'pelagora': '^0.1.5',
    },
    engines: {
      node: '>=20.0.0',
    },
  };
  fs.writeFileSync(
    path.join(targetDir, 'package.json'),
    JSON.stringify(pkg, null, 2) + '\n'
  );
  console.log('  ✓ Created package.json');

  // Create .gitignore
  fs.writeFileSync(
    path.join(targetDir, '.gitignore'),
    ['node_modules/', '.env', '*.db', '*.db-wal', '*.db-shm', 'uploads/', ''].join('\n')
  );
  console.log('  ✓ Created .gitignore');

  // Create uploads directory
  fs.mkdirSync(path.join(targetDir, 'uploads'), { recursive: true });
  console.log('  ✓ Created uploads/');

  // Install Pelagora skill file for the chosen AI tool
  const skillDir = AI_TOOL_SKILL_PATHS[answers.aiTool];
  if (skillDir) {
    const skillSrc = path.join(__dirname, 'templates', 'pelagora-skill.md');
    const skillDest = path.join(targetDir, skillDir);
    fs.mkdirSync(skillDest, { recursive: true });
    fs.copyFileSync(skillSrc, path.join(skillDest, 'SKILL.md'));
    console.log(`  ✓ Installed Pelagora skill → ${skillDir}/SKILL.md`);
  }

  // Install dependencies
  console.log(`\n  Installing dependencies with ${answers.packageManager}...\n`);
  try {
    const installCmd = answers.packageManager === 'yarn'
      ? 'yarn install'
      : answers.packageManager === 'pnpm'
        ? 'pnpm install'
        : 'npm install';
    execSync(installCmd, { cwd: targetDir, stdio: 'inherit' });
    console.log('\n  ✓ Dependencies installed');
  } catch {
    console.log('\n  ⚠ Dependency installation failed. Run it manually:');
    console.log(`    cd ${targetDir} && ${answers.packageManager} install`);
  }

  // Print summary
  console.log('\n  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ✓ Pelagora node is ready!\n');
  // Show a user-friendly path (use ~ shorthand if under home dir)
  const homeDir = os.homedir();
  const displayDir = targetDir.startsWith(homeDir)
    ? targetDir.replace(homeDir, '~')
    : targetDir;
  console.log(`    cd ${displayDir}`);

  const startCmd = answers.packageManager === 'yarn' ? 'yarn start' : answers.packageManager === 'pnpm' ? 'pnpm start' : 'npm start';
  console.log(`    ${startCmd}\n`);

  if (answers.apiKey) {
    console.log('  Reffo.ai sync is configured. Your items will sync');
    console.log('  to reffo.ai when you toggle "Share on Reffo" in the UI.\n');
  } else {
    console.log('  To connect to Reffo.ai later, add your API key to .env');
    console.log('  or use the Settings tab in the beacon UI.\n');
  }

  console.log(`  Open http://localhost:${answers.port} to access your beacon.`);
  console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
