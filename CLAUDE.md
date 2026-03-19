# Reffo / Pelagora — AI Assistant Instructions

## Project Structure

Monorepo at `/Users/dougkinnison/apps/reffo/` — each package has its own git repo under the `ReffoAI` GitHub org.

| Package | Description | Runtime | npm |
|---------|-------------|---------|-----|
| `pelagora` | P2P node (Express + SQLite + Hyperswarm DHT) | CommonJS | `pelagora` |
| `pim-protocol` | Shared types, no runtime deps | Dual ESM/CJS | `@pelagora/pim-protocol` |
| `pelagora-mcp-server` | MCP server for AI agents | ESM | `@pelagora/mcp` |
| `pelagora-cli-installer` | CLI scaffolding tool | ESM | `pelagora-cli-installer` |
| `reffo-webapp` | Next.js web app (Supabase backend) | — | — |
| `reffo-marketing` | Next.js marketing/content hub (Supabase backend) | — | — |
| `reffo-api` | API service | — | — |
| `reffo-skill-reverse-auction` | First skill plugin | CommonJS | `@reffo/skill-reverse-auction` |

## Branding

- **PIM Protocol** — open, platform-agnostic data structure layer
- **Pelagora** — open P2P network (Pelagos + Agora). When the user says "pelagora" they mean the node software.
- **Reffo** — commercial platform built on Pelagora
- Never co-brand Pelagora with Reffo visually

## Git Conventions

- **Conventional commits required** — always ask the user what type of commit before creating one
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation only
  - `refactor:` code restructuring
  - `style:` formatting changes
  - `chore:` maintenance, deps, config
  - `perf:` performance improvement
  - `test:` adding or updating tests
- Each package is its own git repo — commit and push to the correct repo
- Default branch is `main`

## Tech Patterns

- **SQLite** (pelagora): class-based queries, better-sqlite3 in WAL mode
- **Supabase** (webapp/marketing): auth, DB, storage
- **Express routes**: Router factories
- **DHT**: PeerMessage `{ type, beaconId, payload }` over Hyperswarm streams
- **MCP tools**: `server.registerTool()` with zod schemas

## Key Rules

- Update `admin/features/*.md` docs when adding features to any app
- Marketing app supports multi-brand (Reffo + Pelagora) — always scope by brand
- When publishing npm packages, bump version in both `package.json` and any version banner in source
