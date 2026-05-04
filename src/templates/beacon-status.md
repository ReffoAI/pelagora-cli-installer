---
name: beacon-status
description: >
  Check the health and sync status of the local Pelagora Beacon. Reports
  whether the node is reachable, what port it's running on, peer/network
  state, and a one-line summary of recent activity.
  Triggers on: "is my beacon running", "beacon status", "health check",
  "is pelagora up", "node status".
user_invocable: true
---

# /beacon-status

Diagnose the local Beacon node. Used both as a quick "is this thing on?" check and as the first step when something else (a `/beacon-list-item` call, the UI) isn't working.

**Usage:**
```
/beacon-status
```

No arguments. The skill reads the port from the user's `.env` (or defaults to `3000`) and queries the local node.

## Behavior

1. **Determine the port.** Try in order:
   - `BEACON_PORT` env var
   - `PORT` in `.env` (if `.env` exists in the working directory)
   - Default: `3000`

2. **Health check.** Hit the health endpoint:
   ```bash
   curl -s -m 3 http://localhost:<port>/health
   ```
   - If the request times out or returns non-200: report **DOWN** with the cause (connection refused = not running; timeout = hung; non-200 = unhealthy).
   - If 200: parse the JSON body — typically includes `status`, `version`, `uptime`, `peers`, `lastSync`.

3. **Optionally fetch counts** (best-effort, ignore failures):
   ```bash
   curl -s -m 3 http://localhost:<port>/refs?limit=1   # for total listings count via response headers
   ```

4. **Report a clean summary** in this exact shape — fixed-width so it's scannable:

   ```
   Pelagora Beacon — http://localhost:<port>
     Status:    ✓ healthy
     Version:   <version>
     Uptime:    <human-readable, e.g. 2h 14m>
     Peers:     <count>
     Listings:  <count>
     Last sync: <relative time>
   ```

   For DOWN states:
   ```
   Pelagora Beacon — http://localhost:<port>
     Status: ✗ not running

     Likely fix: cd into the beacon directory and run `npm start`.
     If you're sure it's running, check the port — `.env` may
     have BEACON_PORT set to a different value.
   ```

5. **Be terse.** This command is a glance, not a story. Don't add filler.

## Examples

**Healthy node:**
```
Pelagora Beacon — http://localhost:3000
  Status:    ✓ healthy
  Version:   0.3.1
  Uptime:    2h 14m
  Peers:     7
  Listings:  12
  Last sync: 38 seconds ago
```

**Not running:**
```
Pelagora Beacon — http://localhost:3000
  Status: ✗ not running

  Likely fix: cd into the beacon directory and run `npm start`.
```
