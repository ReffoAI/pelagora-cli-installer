#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { gatherAnswers } from './prompts.js';
import { install } from './installer.js';

// Check that the current working directory exists (it won't if the user
// is cd'd into a directory that was deleted).
try {
  process.cwd();
} catch {
  console.error('\n  Error: Your current directory no longer exists on disk.');
  console.error('  This usually happens after a directory was deleted while your terminal was in it.');
  console.error('  Please run: cd ~ && npx pelagora-cli-installer\n');
  process.exit(1);
}

// Warn if running from inside the installer repo itself
const cwd = process.cwd();
if (
  fs.existsSync(path.join(cwd, 'src', 'installer.js')) &&
  fs.existsSync(path.join(cwd, 'src', 'prompts.js'))
) {
  console.log('\n  ⚠ You are running the installer from inside its own repository.');
  console.log('  The new project will be created in this directory.');
  console.log('  Consider running from a different location instead:\n');
  console.log('    cd ~ && node /path/to/pelagora-cli-installer/src/index.js');
  console.log('    # or: npx pelagora-cli-installer\n');
}

console.log('\n  ⚡ pelagora-cli-installer v0.1.4\n');

try {
  const answers = await gatherAnswers();
  await install(answers);
} catch (err) {
  if (err.code === 'ERR_USE_AFTER_CLOSE') {
    // User pressed Ctrl+C during prompts
    console.log('\n  Cancelled.\n');
  } else {
    console.error('\n  Error:', err.message);
    process.exit(1);
  }
}
