---
name: selfsteal
description: "Deploy and verify VPN self-steal patterns: fake-site decoy responses on CDN/origin root paths, XHTTP no-store separation, client direct-route rules, and cautious server-side firewall guards. Use when adding self-steal to Remnawave/Xray/CDN nodes or generating v2rayN/v2rayNG direct rules and nftables dry-run artifacts from whitelist IP/CIDR files."
---

# Self-Steal

Add self-steal behavior without breaking existing VPN transports.

## Operating Rules

- Split work into two tracks: fake-site decoy responses and direct-route/firewall controls.
- Apply fake-site changes first; they are reversible and should not affect XHTTP paths.
- Never run bulk `ufw deny` lists blindly. Collapse CIDRs, dry-run with `nft -c`, and scope server drops to the smallest port set.
- Keep XHTTP paths out of cache: `Cache-Control: no-store`, buffering off, and a location that cannot fall through to HTML.
- Prefer client-side direct routing as the primary self-steal mechanism. Server firewall guards are a backstop.

## Workflow

1. Baseline:
   - Probe origin root, CDN root, origin XHTTP path, CDN XHTTP path.
   - Run a real tunneled request before and after changes.
2. Fake site:
   - Serve a simple `200 text/html` response on `/` and `/index.html`.
   - Keep unknown paths restricted according to the existing origin policy.
   - Keep XHTTP location before/default-separated from the fake-site route.
3. Client direct rules:
   - Convert whitelist IP/CIDR sources into collapsed route rules.
   - Generate v2rayN/v2rayNG-compatible JSON rules with `outboundTag: direct`.
4. Server firewall guard:
   - Scope to the CDN origin port unless the user explicitly approves a wider port set.
   - Preserve SSH, VPN management, NetBird/WireTrustee, and CDN provider source ranges.
   - Validate with `nft -c`; apply only after an explicit approval.
5. Verify:
   - Root returns fake HTML through origin and CDN.
   - XHTTP path still returns Xray `400` on invalid probes with `no-store`.
   - Real Xray traffic still passes through the CDN profile.

## Resources

- Read `references/runbook.md` before touching live origin or firewall state.
- Use `scripts/build-selfsteal-rules.py` to collapse whitelist files and generate client JSON plus an nftables candidate.
