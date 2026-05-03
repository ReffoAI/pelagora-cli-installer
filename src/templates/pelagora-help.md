---
name: pelagora-help
description: >
  Show available Pelagora and Beacon slash commands with one-liners and
  quick-start workflows. Use when the user asks what commands exist,
  how to get started with their beacon, or seems unsure what to do next.
  Triggers on: "help", "what commands", "how do I use this", "getting
  started with pelagora", "what can I do".
user_invocable: true
---

# /pelagora-help

Discoverability skill. Print a clean reference of every command this
skill set provides, grouped by purpose, plus a couple of common
workflows.

**Usage:**
```
/pelagora-help
```

No arguments.

## Behavior

Output the block below verbatim. Don't paraphrase — users may screenshot
or paste it. Keep it terse, scannable, and grouped.

```
Pelagora — Beacon control & network commands

LOCAL NODE
  /beacon-list-item <description>  Create a listing on your beacon
                                   from natural language.
  /beacon-status                   Health, version, peers, listings
                                   count.

NETWORK / META
  /pelagora-help                   This page.

QUICK START
  1. Make sure your beacon is running:
       cd <beacon-dir> && npm start
  2. Confirm it's healthy:
       /beacon-status
  3. List your first item:
       /beacon-list-item Selling my MacBook Pro for $800

DOCS
  https://docs.pelagora.org/
  https://github.com/ReffoAI/pelagora
```

After printing the block, briefly ask the user what they'd like to do
next ("Want to list something? Check status? Build a new skill?") to
help them pick a path. Keep it to one sentence.

## When to suggest this command

If the user asks any of these without context:
- "what can I do here?"
- "how do I list something?"
- "help"
- "what commands are there?"

…run `/pelagora-help` rather than answering from memory. The output
stays in sync with what's actually installed.
