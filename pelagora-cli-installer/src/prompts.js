import readline from 'node:readline';

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

  console.log('\n  🔧 Pelagora Node Setup\n');

  // Project directory
  answers.directory = await prompt.ask('  Project directory (default: my-pelagora-node): ');
  if (!answers.directory) answers.directory = 'my-pelagora-node';

  // Port
  answers.port = await prompt.ask('  HTTP port (default: 3000): ');
  if (!answers.port) answers.port = '3000';
  answers.port = parseInt(answers.port, 10) || 3000;

  // Registry / NPM install preference
  answers.useNpm = true;
  const pkgManager = await prompt.ask('  Package manager [npm/yarn/pnpm] (default: npm): ');
  answers.packageManager = pkgManager.toLowerCase() || 'npm';
  if (!['npm', 'yarn', 'pnpm'].includes(answers.packageManager)) {
    answers.packageManager = 'npm';
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
    const apiUrl = await prompt.ask('  Reffo.ai URL (default: http://localhost:3000): ');
    answers.apiUrl = apiUrl || 'http://localhost:3000';
  } else {
    answers.apiUrl = '';
  }

  prompt.close();
  return answers;
}
