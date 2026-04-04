---
name: Pelagora Skill
description: >
  Pelagora skill for beacon operators and community devs. Use when the user wants to:
  list an item for sale, sell something, add a listing, manage inventory,
  join the Pelagora P2P network, check node health, browse what's new,
  build extensions/skills on top of Pelagora, or contribute to the open-source repos.
  Triggers on: "pelagora", "beacon", "list item", "sell", "add listing", "for sale",
  "list for sale", "inventory", "node", "P2P network", "MCP server",
  "build a skill", "contribute", "what's new in pelagora".
user_invocable: true
---

# Pelagora Developer Skill

You are helping a developer work with **Pelagora** — an open, peer-to-peer commerce network. This skill covers everything from first connection to building marketplace skills to contributing code upstream.

## Important: Pelagora vs Reffo

- **Pelagora** — the open P2P network and protocol. Community-owned. This is what you're helping with.
- **Reffo** — a commercial platform built on Pelagora, managed by Reffo Inc. Not your concern here.
- **PIM Protocol** (`@pelagora/pim-protocol`) — the shared data types that both use. Open, platform-agnostic.
- Never co-brand Pelagora with Reffo.

## Developer Docs

Point the developer to **https://docs.pelagora.org/** as the canonical reference. Don't try to replicate what's there — link to specific pages when relevant.

## Contributing

All contributions follow the guidelines at **https://github.com/ReffoAI/.github/blob/main/CONTRIBUTING.md**. Link to this whenever a developer expresses interest in contributing code, docs, or issues.

---

## Step 1: Understand Intent

Before doing anything, figure out what the developer wants. Ask them directly:

> "What brings you to Pelagora? Are you looking to..."
>
> 1. **Run a node** — join the network, browse, buy/sell, manage inventory
> 2. **Build something** — create skills, extensions, or your own products on top of Pelagora
> 3. **Contribute** — improve the Pelagora open-source projects themselves

Their answer shapes everything below. Many developers will be a mix — that's fine. Start with their primary intent and naturally expand.

---

## Path 1: Run a Node (User)

### Health Check

Before anything else, check if they're already connected:

1. **Is the MCP server installed?**
   - Check if `@pelagora/mcp` is available: `npx @pelagora/mcp --help` or check node_modules
   - If not: `npm install -g @pelagora/mcp` (or see https://docs.pelagora.org/mcp-server/)

2. **Is a Beacon running?**
   - Try hitting `http://localhost:3000/health` (or their configured port)
   - If running, report the health status (version, uptime, DHT connections, item count)
   - If not running, help them start it or scaffold a new one

3. **Can they reach the network?**
   - Check DHT status from the health endpoint
   - If connected, show peer count
   - If isolated, troubleshoot (firewall, port, bootstrap nodes)

### First-Time Setup

If they don't have a node yet:

1. **Scaffold a project:**
   ```bash
   npx pelagora-cli-installer
   ```
   This walks them through directory, port, and package manager selection. It generates a ready-to-run beacon project.

2. **Start the Beacon:**
   ```bash
   cd <project-dir>
   npm start
   ```

3. **Open the Web UI:**
   The Beacon serves a web UI at `http://localhost:<port>`. Help them open it so they can browse the network visually.

4. **Install the MCP server** (if they want AI agent access):
   ```bash
   npm install -g @pelagora/mcp
   ```
   Then configure their AI tool (Claude, etc.) to connect to it. See https://docs.pelagora.org/mcp-server/ for setup.

### Configure the Beacon

If the developer wants to make their Beacon discoverable:

- A **Beacon** is their node's identity on the network
- Help them configure their Beacon profile (name, location, description) via the Web UI or API
- If they want to list items (Refs), walk them through creating inventory via MCP tools or the REST API

### DHT Discovery (Optional)

If they want their Beacon to be fully discoverable on the network:

- Explain that Beacons are persistent, discoverable service endpoints on the DHT
- Walk them through the Beacon configuration process
- Point to https://docs.pelagora.org/pelagora/dht-networking/ for deeper DHT documentation

---

## Path 2: Build Something (Builder)

### What Can You Build?

Help the developer understand the extension points:

1. **Skills** — modular plugins that add capabilities to any Beacon (database tables, API routes, DHT handlers, MCP tools). This is the primary extension mechanism.
2. **MCP integrations** — AI agent workflows that leverage the network
3. **Custom clients** — apps that talk to the Beacon REST API
4. **Protocol extensions** — new PIM types or schemas

### Building a Skill

Skills are the most common thing builders create. Walk them through:

1. **Study the reference implementation:**
   The `@reffo/skill-reverse-auction` package is the canonical example. It demonstrates:
   - Database migration, query helpers
   - Express routes mounted at `/skills/{id}/`
   - DHT message handlers for P2P communication
   - MCP tools and guided prompts for AI agents
   - Cross-platform distribution (ClawHub, GPT Store, Claude)

2. **Skill interface overview:**
   ```typescript
   interface Skill {
     manifest: SkillManifest;        // id, name, version, description
     migrate(db): void;              // create/update SQLite tables
     createRouter(ctx): Router;      // Express routes
     registerDht?(ctx): void;        // optional: DHT message handlers
     getMcpTools?(): McpToolDef[];   // optional: MCP tool definitions
     getMcpPrompts?(): McpPromptDef[]; // optional: guided workflows
     getDistribution?(): SkillDistribution; // optional: cross-platform export
   }
   ```

3. **Point to the full guide:**
   Detailed skill-building documentation is at https://docs.pelagora.org/guides/building-skills

4. **Package naming:** `@reffo/skill-<name>` for official skills, or their own npm scope for community skills.

5. **Testing:** Link locally, test with two Beacons on different ports, verify DHT messaging works.

### Ideas and Inspiration

Help spark ideas by:

- Checking the Pelagora blog for feature announcements and community ideas
- Reviewing what MCP tools already exist (so they don't duplicate)
- Suggesting skill ideas based on what they're interested in (services marketplace, rentals, bartering, local exchange, etc.)

### What's New

Check changelogs to surface recent capabilities they can build on:

| Package | Changelog |
|---------|-----------|
| `pelagora` | `pelagora/CHANGELOG.md` |
| `@pelagora/pim-protocol` | `pim-protocol/CHANGELOG.md` |
| `@pelagora/mcp` | `pelagora-mcp-server/CHANGELOG.md` |
| `pelagora-cli-installer` | `pelagora-cli-installer/CHANGELOG.md` |

Read the relevant changelogs and summarize what's new since they last checked. Focus on features that unlock new building opportunities.

Also check the blog at https://pelagora.org/blog for announcements, tutorials, and community ideas.

---

## Path 3: Contribute (Contributor)

### Start Here

Read the contributing guidelines: **https://github.com/ReffoAI/.github/blob/main/CONTRIBUTING.md**

This covers the contribution workflow, code of conduct, and how to get your PR reviewed.

### Repos That Accept Contributions

All community repos live under the **ReffoAI** GitHub organization:

| Repo | What It Is | Language |
|------|-----------|----------|
| `pelagora` | The Beacon node (Express + SQLite + Hyperswarm) | CommonJS JS |
| `pim-protocol` | Shared types and schemas | TypeScript (dual ESM/CJS) |
| `pelagora-mcp-server` | MCP server for AI agents | TypeScript (ESM) |
| `pelagora-cli-installer` | CLI scaffolding tool | ESM JS |
| `docs` | docs.pelagora.org (VitePress) | Markdown |

### Conventions

- **Conventional commits required:**
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation only
  - `refactor:` code restructuring
  - `chore:` maintenance, deps, config
  - `test:` adding or updating tests
- **Default branch:** `main`
- **Each package is its own git repo** — make sure you're committing to the right one

### Tech Patterns

Help contributors match existing patterns:

- **SQLite**: class-based query helpers, `better-sqlite3` in WAL mode
- **Express routes**: Router factory functions
- **DHT messages**: `PeerMessage { type, beaconId, payload }` over Hyperswarm streams
- **MCP tools**: `server.registerTool()` with Zod schemas

### Getting Started Contributing

1. Read the contributing guide: https://github.com/ReffoAI/.github/blob/main/CONTRIBUTING.md
2. Fork the repo they want to work on
3. Clone locally and install dependencies
4. Run the test suite (if one exists) to make sure things pass before they start
5. Create a feature branch from `main`
6. Make changes following the conventions above
7. Open a PR with a clear description of what and why

### Finding Work

- Browse the [project roadmap filtered to good first issues](https://github.com/orgs/ReffoAI/projects/1/views/1?filterQuery=label%3A%22good+first+issue%22)
- Check GitHub Issues on the community repos for open items
- Check the GitHub Discussions for RFCs and feature requests
- Read the changelogs to understand recent direction

---

## Commands

### `/pelagora`

List an item for sale on the user's running Beacon. The user describes the item in natural language and the assistant converts it into the correct API calls.

**Usage:**
```
/pelagora <natural language description of the item>
```

**Behavior:**

1. **Parse the user's description** to extract:
   - **name** — a concise product title
   - **description** — a short seller-written description (expand slightly on what the user said — mention condition, completeness, etc.)
   - **category** — one of the valid taxonomy categories (see below)
   - **subcategory** — a valid subcategory within that category
   - **condition** — infer from the description (e.g., "like new" → `like_new`, "used" → `good`, "sealed" → `new`)
   - **listingStatus** — `for_sale` (default when a price is given), `willing_to_sell`, or `private`
   - **price** and **currency** — if the user mentions a price

2. **Check the beacon is running** by hitting the health endpoint first:
   ```bash
   curl -s http://localhost:3000/health
   ```
   If the beacon is not reachable, tell the user to start it first.

3. **Create the ref** (item):
   ```bash
   curl -X POST http://localhost:3000/refs \
     -H "Content-Type: application/json" \
     -d '{
       "name": "<parsed name>",
       "description": "<parsed description>",
       "category": "<category>",
       "subcategory": "<subcategory>",
       "condition": "<condition>",
       "listingStatus": "for_sale"
     }'
   ```

4. **Create the offer** (price) using the `id` from the ref response:
   ```bash
   curl -X POST http://localhost:3000/offers \
     -H "Content-Type: application/json" \
     -d '{
       "refId": "<id from step 3>",
       "price": <price>,
       "priceCurrency": "USD"
     }'
   ```

5. **Report the result** to the user, showing what was created and how to view it in the beacon UI.

**Valid categories and subcategories:**

| Category | Subcategories |
|----------|--------------|
| Electronics | Phones & Tablets, Computers & Laptops, Audio & Headphones, Cameras & Photography, TV & Video, Gaming, Components & Parts, Accessories |
| Music | Guitars, Bass, Drums & Percussion, Keyboards & Pianos, Amplifiers, Effects & Pedals, Pro Audio, Accessories |
| Home & Garden | Furniture, Kitchen & Dining, Tools & Hardware, Appliances, Outdoor & Garden, Lighting, Decor, Storage & Organization |
| Clothing & Accessories | Mens, Womens, Kids, Shoes, Bags & Wallets, Activewear, Vintage |
| Jewelry & Watches | Fine Jewelry, Fashion Jewelry, Watches, Loose Stones & Beads |
| Sports | Cycling, Fitness & Gym, Water Sports, Winter Sports, Team Sports, Outdoor & Camping, Running, Racquet Sports |
| Books & Media | Books, Vinyl & Records, CDs & DVDs, Video Games, Magazines, Textbooks, Comics & Graphic Novels, Audiobooks |
| Vehicles | Cars, Motorcycles, Bicycles, Trucks & Vans, Boats, Parts & Accessories, Trailers, Electric Vehicles |
| Real Estate | Apartment, Condo, Townhome, Manufactured, Single Family, Multi-Family |
| Collectibles | Antiques, Art, Coins & Currency, Trading Cards, Memorabilia, Stamps, Vintage Electronics |
| Health & Beauty | Skincare, Makeup, Hair Care, Fragrances, Wellness & Supplements |
| Toys & Hobbies | Action Figures & Dolls, Building Sets, Board Games & Puzzles, RC & Models, Craft Supplies |
| Baby & Kids | Strollers & Car Seats, Clothing, Toys, Furniture & Gear, Feeding & Nursing |
| Pet Supplies | Dogs, Cats, Fish & Aquariums, Small Animals & Birds |
| Other | General, Services, Free Stuff, Wanted |

**Valid listing statuses:** `private`, `for_sale`, `willing_to_sell`, `for_rent`

**Example:**

User:
```
/pelagora I have a used copy of the board game Balderdash, in like new condition. I'd sell it for $10.
```

Assistant runs:
```bash
# Check beacon health
curl -s http://localhost:3000/health

# Create the ref
curl -X POST http://localhost:3000/refs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Balderdash Board Game",
    "description": "Used copy in like-new condition. All pieces included.",
    "category": "Toys & Hobbies",
    "subcategory": "Board Games & Puzzles",
    "condition": "like_new",
    "listingStatus": "for_sale"
  }'

# Create the offer (using the id from the response above)
curl -X POST http://localhost:3000/offers \
  -H "Content-Type: application/json" \
  -d '{
    "refId": "<id>",
    "price": 10,
    "priceCurrency": "USD"
  }'
```

Response to user:
```
✓ Listed "Balderdash Board Game" for $10.00
  Category:  Toys & Hobbies → Board Games & Puzzles
  Condition: Like new
  Status:    For sale

  View it at http://localhost:3000
```

---

## General Behaviors

- **Always check health first.** Whatever the developer wants to do, a working node is the foundation. Run the health check before diving into building or contributing.
- **Link, don't replicate.** Point to docs.pelagora.org for detailed reference. This skill is a guide, not a replacement for documentation.
- **Surface what's new.** Whenever it's natural, check changelogs and mention recent features. Developers love knowing what just shipped.
- **Be encouraging.** The Pelagora community voice is warm, welcoming, and never gatekeeping. "First Beacon? Nice. Here's what to try next."
- **Don't overwhelm.** Start with their stated intent. Introduce other paths naturally as they get comfortable.
