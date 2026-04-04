#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { gatherAnswers, parseCliFlags } from './prompts.js';
import { install } from './installer.js';

// ── Node.js check ──────────────────────────────────────────────────
// Verify Node.js is on PATH and meets the minimum version requirement.
function checkNode() {
  try {
    const raw = execSync('node --version', { encoding: 'utf-8' }).trim();
    const match = raw.match(/^v(\d+)/);
    if (!match) {
      console.error(`\n  Error: Could not parse Node.js version ("${raw}").`);
      process.exit(1);
    }
    const major = parseInt(match[1], 10);
    if (major < 20) {
      console.error(`\n  Error: Node.js >= 20 is required (found ${raw}).`);
      console.error('  Please upgrade Node.js and try again.\n');
      process.exit(1);
    }
  } catch {
    console.error('\n  Error: Node.js is not installed or not on your PATH.');
    console.error('  Install Node.js 20+ from https://nodejs.org and try again.\n');
    process.exit(1);
  }
}

checkNode();

// ── CWD sanity check ───────────────────────────────────────────────
try {
  process.cwd();
} catch {
  console.error('\n  Error: Your current directory no longer exists on disk.');
  console.error('  This usually happens after a directory was deleted while your terminal was in it.');
  console.error('  Please run: cd ~ && npx pelagora-cli-installer\n');
  process.exit(1);
}

// If running from inside the installer repo itself, move up to parent directory
const cwd = process.cwd();
if (
  fs.existsSync(path.join(cwd, 'src', 'installer.js')) &&
  fs.existsSync(path.join(cwd, 'src', 'prompts.js'))
) {
  const parentDir = path.dirname(cwd);
  console.log('\n  ℹ Detected installer repo — creating project in parent directory.');
  console.log(`  (${parentDir})\n`);
  process.chdir(parentDir);
}

console.log('\n  ⚡ pelagora-cli-installer v0.1.8\n');

// ── Gather config (CLI flags or interactive prompts) ───────────────
try {
  const cliAnswers = parseCliFlags(process.argv.slice(2));
  const answers = cliAnswers || await gatherAnswers();
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
