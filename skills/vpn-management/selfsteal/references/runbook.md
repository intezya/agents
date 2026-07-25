# Self-Steal Runbook

## Scope

Use this runbook for self-steal on CDN-backed Remnawave/Xray nodes:

- Fake-site response on origin/CDN root.
- XHTTP path isolation from fake HTML.
- Client-side direct rules for whitelist IP/CIDR sets.
- Optional server-side firewall guard as a backstop.

## Fake-Site Pattern

Serve a simple HTML page from `/` and `/index.html`. Keep XHTTP paths separate:

- `/` -> `200 text/html`.
- `/index.html` -> `200 text/html`.
- `/api/uploadFile/` or configured XHTTP path -> Xray-style `400` on invalid probes.
- Unknown paths -> follow the existing origin policy, often `abort` or `404`.

Do not let fake-site routing catch the XHTTP path.

## Cache Rules

- Root fake-site content may be cacheable.
- XHTTP path must be `no-store`.
- Disable buffering/request buffering for XHTTP reverse proxying.
- Purge CDN cache after changing root/fake-site content.

## Client Direct Rules

Generate direct rules from IP/CIDR whitelist sources. Prefer collapsed CIDRs over enormous one-IP rule lists.

Use:

```bash
python3 scripts/build-selfsteal-rules.py --out-dir /tmp/selfsteal-rules whitelist1.txt whitelist2.txt
```

Outputs:

- `selfsteal-targets-collapsed.txt`
- `selfsteal-v2ray-rules.json`
- `selfsteal-ports.nft`

Import the JSON into v2rayN/v2rayNG where supported.

## Server Firewall Guard

Do not run bulk UFW commands directly. Problems with raw UFW lists:

- Very large rule counts can slow management operations.
- Existing `ALLOW IN Anywhere` rules may take precedence depending on insertion order.
- It is easy to block CDN or management traffic accidentally.

Prefer an nftables candidate with an interval set, then dry-run:

```bash
nft -c -f selfsteal-ports.nft
```

Apply only after explicit approval and only for the intended ports. Start with CDN origin port only.

## Verification

Before and after each change, verify:

- Origin root returns fake HTML.
- CDN root returns fake HTML.
- CDN XHTTP path returns Xray `400`, not HTML.
- XHTTP path has `Cache-Control: no-store`.
- A real tunneled request still succeeds.
