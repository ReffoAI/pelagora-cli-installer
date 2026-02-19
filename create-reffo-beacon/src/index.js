#!/usr/bin/env node

import { gatherAnswers } from './prompts.js';
import { install } from './installer.js';

console.log('\n  ⚡ create-reffo-beacon v0.1.0\n');

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
