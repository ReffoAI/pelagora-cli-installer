#!/usr/bin/env node

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

console.log('\n  ⚡ pelagora-cli-installer v0.1.3\n');

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
