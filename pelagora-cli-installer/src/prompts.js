import readline from 'node:readline';

const DEFAULT_NAME = 'beacon-pelagora';
const DEFAULT_PORT = 3000;
const DEFAULT_PM   = 'npm';

// Maps AI tool choice to the directory where the skill file is installed.
// null means "skip skill installation".
export const AI_TOOL_SKILL_PATHS = {
  claude:   '.claude/skills',
  cursor:   '.cursor/rules',
  windsurf: '.windsurf/rules',
  none:     null,
};

// ── CLI flag parser (non-interactive mode) ─────────────────────────
// Supports:
//   --name <dir>       Beacon name        (default: beacon-pelagora)
//   --path <dir>       Install location   (default: current directory)
//   --port <number>    HTTP port          (default: 3000)
//   --pm <npm|yarn|pnpm>                  (default: npm)
//   --ai-tool <claude|cursor|windsurf|none>  AI tool (default: none)
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
    if (arg === '--path'    && argv[i + 1])    { flags.path    = argv[++i]; continue; }
    if (arg === '--port'    && argv[i + 1])    { flags.port    = argv[++i]; continue; }
    if (arg === '--pm'      && argv[i + 1])    { flags.pm      = argv[++i]; continue; }
    if (arg === '--ai-tool' && argv[i + 1])    { flags.aiTool  = argv[++i]; continue; }
    if (arg === '--api-key' && argv[i + 1])    { flags.apiKey  = argv[++i]; continue; }
    if (arg === '--api-url' && argv[i + 1])    { flags.apiUrl  = argv[++i]; continue; }
  }

  // Only engage non-interactive mode if at least one flag was provided
  if (!Object.keys(flags).length) return null;

  const pm = (flags.pm || DEFAULT_PM).toLowerCase();
  const aiTool = (flags.aiTool || 'none').toLowerCase();
  return {
    name:           flags.name || DEFAULT_NAME,
    location:       flags.path || '.',
    port:           parseInt(flags.port, 10) || DEFAULT_PORT,
    useNpm:         true,
    packageManager: ['npm', 'yarn', 'pnpm'].includes(pm) ? pm : DEFAULT_PM,
    aiTool:         Object.keys(AI_TOOL_SKILL_PATHS).includes(aiTool) ? aiTool : 'none',
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

  // Beacon name
  console.log('  Choose a name for your beacon:\n');
  console.log('    1) beacon-pelagora');
  console.log('    2) kevin-beacon');
  console.log('    3) Custom name\n');
  const nameChoice = await prompt.ask('  Enter 1, 2, or 3 (default: 1): ');
  if (nameChoice === '2') {
    answers.name = 'kevin-beacon';
  } else if (nameChoice === '3') {
    answers.name = await prompt.ask('  Custom beacon name: ');
    if (!answers.name) answers.name = DEFAULT_NAME;
  } else {
    answers.name = 'beacon-pelagora';
  }

  // Install location
  console.log(`\n  Where should we create "${answers.name}"?\n`);
  console.log(`    1) Current directory (${process.cwd()})`);
  console.log('    2) Home directory (~)');
  console.log('    3) Custom path\n');
  const locChoice = await prompt.ask('  Enter 1, 2, or 3 (default: 1): ');
  if (locChoice === '2') {
    answers.location = '~';
  } else if (locChoice === '3') {
    answers.location = await prompt.ask('  Install path: ');
    if (!answers.location) answers.location = '.';
  } else {
    answers.location = '.';
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

  // AI tool — determines where to install the Pelagora skill file
  console.log('\n  Which AI coding tool do you use?\n');
  console.log('    1) Claude Code');
  console.log('    2) Cursor');
  console.log('    3) Windsurf');
  console.log('    4) None / skip\n');
  const aiChoice = await prompt.ask('  Enter 1, 2, 3, or 4 (default: 4): ');
  const aiMap = { '1': 'claude', '2': 'cursor', '3': 'windsurf' };
  answers.aiTool = aiMap[aiChoice] || 'none';

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
