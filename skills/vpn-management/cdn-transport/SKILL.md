---
name: cdn-transport
description: Operate CDN-backed VPN transports for Remnawave/Xray, especially XHTTP through Yandex Cloud CDN or similar providers. Use when configuring, debugging, or verifying CDN/CND transport domains, DNS, certificates, origin reverse proxies, Remnawave hosts/inbounds/squads, remnanode runtime client loading, and real tunneled traffic tests.
---

# CDN Transport

Build and debug CDN-backed VPN transport as a live, evidence-driven workflow.

## Operating Rules

- Treat CDN as transport only: prove origin, CDN, proxy, Xray runtime, subscription output, and real tunneled traffic separately.
- Keep changes additive. Do not replace working public nodes or mutate unrelated Remnawave hosts/inbounds.
- Do not print subscription URLs, short UUIDs, user UUIDs, tokens, `.env`, or raw Xray configs containing client IDs.
- Prefer provider/API/UI operations over direct database edits. If direct SQL is unavoidable, expect Remnawave backend/node snapshots to need a controlled refresh.
- Do not apply firewall changes as part of CDN transport setup. Use `$selfsteal` for self-steal routing/firewall work.

## Workflow

1. Inventory current state: DNS, CDN resource, origin group, TLS certificate, Caddy/nginx origin routing, Remnawave host/inbound, squad membership, and remnanode runtime.
2. Validate HTTP layers:
   - Root or decoy path may return `200`.
   - XHTTP path should return Xray-style `400` for invalid unauthenticated probes, not HTML.
   - XHTTP path must include `Cache-Control: no-store` through CDN.
3. Validate runtime: ensure the target inbound exists, listens only where intended, and has the expected client count.
4. Validate subscription rendering for the exact user/client type before claiming the user can see the host.
5. Validate real traffic through local Xray SOCKS or an equivalent client. Health `OPTIONS`/`GET` checks are not enough.

## Common Failure Modes

- CDN health checks pass but real traffic stalls: inspect whether the CDN changes methods, strips query/header padding, downgrades origin protocol, or caches XHTTP streams.
- Remnawave DB has squad membership but node has fewer clients: the backend/node did not rebuild from an application-level event; controlled backend/node refresh may be required.
- Subscription omits the host while node has clients: inspect subscription response rules, HWID/client policy, external squad/template settings, and client User-Agent.
- XHTTP path returns HTML: request hit the fake-site/default location instead of the XHTTP location.

## Resources

- Read `references/runbook.md` before mutating live CDN, Remnawave, or node state.
- Use `scripts/inspect-remnanode-runtime-config.js` inside a remnanode container to print sanitized inbound summaries.
