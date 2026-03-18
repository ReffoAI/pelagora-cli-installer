# Changelog

All notable changes to **pelagora-cli-installer** will be documented in this file.

This project follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Switch license from MIT to AGPL-3.0

## [0.1.0] - 2026-02-18

Initial release.

### Added
- Interactive CLI scaffolding tool (`npx pelagora-cli-installer`)
- Prompts for project directory, HTTP port, package manager, API key
- API key format validation (`rfk_` prefix) with skip option
- Generates `.env`, `package.json`, `.gitignore`, and `uploads/` directory
- Auto-installs dependencies with chosen package manager (npm, yarn, pnpm)
- Configurable Reffo.ai URL for local dev support
- Tilde expansion in project directory paths
- Graceful handling when running from deleted directories
