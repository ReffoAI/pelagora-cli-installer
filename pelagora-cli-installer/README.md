# pelagora-cli-installer

CLI tool that scaffolds a self-hosted [Pelagora](https://github.com/ReffoAI/pelagora) node.

## Quick Start (npm)

```bash
npx pelagora-cli-installer
```

This downloads the latest version from npm and runs the interactive setup.

## Running from Source

If you've cloned this repo to contribute or develop locally:

```bash
git clone https://github.com/ReffoAI/pelagora-cli-installer.git
cd pelagora-cli-installer
node src/index.js
```

> The installer detects when it's run from inside its own repo and automatically creates the project in the parent directory.

## What It Does

The installer prompts you for:

- **Project directory** — where to create your node (default: `my-pelagora-node`)
- **HTTP port** — port for the beacon server (default: `3000`)
- **Package manager** — npm, yarn, or pnpm
- **Reffo.ai API key** — optional, for syncing items to [reffo.ai](https://reffo.ai)

Then it scaffolds a project with:

- `package.json` with `pelagora` as a dependency
- `.env` with your configuration
- `.gitignore`
- `uploads/` directory

## License

AGPL-3.0-only
