# Changelog

All notable changes to **pelagora-cli-installer** will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

Nothing yet.

## [0.1.8] - 2026-04-03

### Added
- Node.js version check (>= 20) at startup
- Beacon name picker (beacon-pelagora, kevin-beacon, or custom)
- Install location prompt (current dir, home dir, or custom path)
- Non-interactive CLI flags (`--name`, `--path`, `--port`, `--pm`, `--ai-tool`, `-y`)
- AI tool prompt — installs Pelagora skill for Claude Code, Cursor, or Windsurf
- Pelagora skill bundled as `SKILL.md` template with `/pelagora` command
- Skill reads beacon port from `.env` instead of hardcoding `localhost:3000`

### Changed
- Flattened repo structure (removed nested `pelagora-cli-installer/` directory)
- Default beacon name changed from `my-pelagora-node` to `beacon-pelagora`

### Fixed
- Default Reffo.ai URL to `https://reffo.ai` instead of localhost

## [0.1.5] - 2026-03-05

### Changed
- Rename default beacon directory to `my-pelagora-node`
- Auto-chdir out of installer repo after scaffolding

## [0.1.4] - 2026-03-01

### Fixed
- Minor installer stability improvements

## [0.1.0] - 2026-02-18

Initial release.

### Added
- CLI scaffolding tool to bootstrap a self-hosted Pelagora beacon
- Interactive setup wizard for node configuration
