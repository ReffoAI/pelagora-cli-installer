import readline from 'node:readline';

const DEFAULT_NAME = 'beacon-pelagora';
const DEFAULT_PORT = 3000;
const DEFAULT_PM   = 'npm';

// ── CLI flag parser (non-interactive mode) ─────────────────────────
// Supports:
//   --name <dir>       Project directory  (default: pelagora-beacon)
//   --port <number>    HTTP port          (default: 3000)
//   --pm <npm|yarn|pnpm>                  (default: npm)
//   --api-key <key>    Reffo.ai API key   (optional)
//   --api-url <url>    Reffo.ai API URL   (optional)
//   -y / --yes         Accept all defaults (no prompts)
//
// Returns a complete answers object when flags are sufficient,
// or null to fall through to the interactive prompts.
export function parseCliFlags(argv) {
  if (!argv.length) return null;

  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-y' || arg === '--yes')       { flags.yes = true; continue; }
    if (arg === '--name'    && argv[i + 1])    { flags.name    = argv[++i]; continue; }
    if (arg === '--port'    && argv[i + 1])    { flags.port    = argv[++i]; continue; }
    if (arg === '--pm'      && argv[i + 1])    { flags.pm      = argv[++i]; continue; }
    if (arg === '--api-key' && argv[i + 1])    { flags.apiKey  = argv[++i]; continue; }
    if (arg === '--api-url' && argv[i + 1])    { flags.apiUrl  = argv[++i]; continue; }
  }

  // Only engage non-interactive mode if at least one flag was provided
  if (!Object.keys(flags).length) return null;

  const pm = (flags.pm || DEFAULT_PM).toLowerCase();
  return {
    directory:      flags.name || DEFAULT_NAME,
    port:           parseInt(flags.port, 10) || DEFAULT_PORT,
    useNpm:         true,
    packageManager: ['npm', 'yarn', 'pnpm'].includes(pm) ? pm : DEFAULT_PM,
    apiKey:         flags.apiKey || '',
    apiUrl:         flags.apiUrl || (flags.apiKey ? 'https://reffo.ai' : ''),
  };
}

// ── Interactive prompts ────────────────────────────────────────────

function createPrompt() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return {
    ask(question) {
      return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
      });
    },
    close() {
      rl.close();
    },
  };
}

export async function gatherAnswers() {
  const prompt = createPrompt();
  const answers = {};

  console.log('\n  🔧 Pelagora Beacon Setup\n');

  // Project directory
  console.log('  Choose a name for your beacon:\n');
  console.log('    1) beacon-pelagora');
  console.log('    2) kevin-beacon');
  console.log('    3) Custom name\n');
  const nameChoice = await prompt.ask('  Enter 1, 2, or 3 (default: 1): ');
  if (nameChoice === '2') {
    answers.directory = 'kevin-beacon';
  } else if (nameChoice === '3') {
    answers.directory = await prompt.ask('  Custom project directory: ');
    if (!answers.directory) answers.directory = DEFAULT_NAME;
  } else {
    answers.directory = 'beacon-pelagora';
  }

  // Port
  answers.port = await prompt.ask(`  HTTP port (default: ${DEFAULT_PORT}): `);
  if (!answers.port) answers.port = String(DEFAULT_PORT);
  answers.port = parseInt(answers.port, 10) || DEFAULT_PORT;

  // Registry / NPM install preference
  answers.useNpm = true;
  const pkgManager = await prompt.ask(`  Package manager [npm/yarn/pnpm] (default: ${DEFAULT_PM}): `);
  answers.packageManager = pkgManager.toLowerCase() || DEFAULT_PM;
  if (!['npm', 'yarn', 'pnpm'].includes(answers.packageManager)) {
    answers.packageManager = DEFAULT_PM;
  }

  // Reffo.ai API key
  console.log('\n  Reffo.ai Integration (optional)');
  console.log('  Connect your beacon to reffo.ai to share items with a wider audience.');
  console.log('  Get an API key at https://reffo.ai/account\n');

  const apiKey = await prompt.ask('  Reffo.ai API key (press Enter to skip): ');
  if (apiKey) {
    if (!apiKey.startsWith('rfk_')) {
      console.log('  ⚠ Warning: Reffo API keys start with "rfk_". The key you entered may be invalid.');
      const proceed = await prompt.ask('  Use this key anyway? [y/N]: ');
      if (proceed.toLowerCase() === 'y') {
        answers.apiKey = apiKey;
      } else {
        answers.apiKey = '';
        console.log('  Skipped — you can add it later in .env');
      }
    } else {
      answers.apiKey = apiKey;
    }
  } else {
    answers.apiKey = '';
  }

  // If API key was provided, ask for the webapp URL
  if (answers.apiKey) {
    console.log('\n  Reffo.ai API URL');
    console.log('  For local development, point this to your running reffo-webapp.');
    console.log('  For production, use the default (https://reffo.ai).\n');
    const apiUrl = await prompt.ask('  Reffo.ai URL (default: https://reffo.ai): ');
    answers.apiUrl = apiUrl || 'https://reffo.ai';
  } else {
    answers.apiUrl = '';
  }

  prompt.close();
  return answers;
}
