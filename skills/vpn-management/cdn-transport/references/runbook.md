# CDN Transport Runbook

## Scope

Use this runbook for Remnawave/Xray CDN transport, especially XHTTP over Yandex Cloud CDN. It assumes an architecture like:

`client -> CDN domain -> origin domain -> Caddy/nginx -> loopback Xray inbound -> internet`

## Inventory Checklist

- CDN domain and provider CNAME.
- Origin domain, origin protocol, host header, TLS certificate, and CDN cache/query settings.
- Origin reverse proxy block for the CDN domain.
- Local nginx/Caddy route for the XHTTP path.
- Remnawave config profile inbound, host, node mapping, squad mapping, and user membership.
- remnanode runtime config and client counts.

## Safe HTTP Checks

Use exact domains and paths:

```bash
curl -sS -D - -o /dev/null https://CDN_DOMAIN/
curl -sS -D - -o /dev/null https://CDN_DOMAIN/api/uploadFile/
curl -sS -k -D - -o /dev/null https://ORIGIN_DOMAIN:ORIGIN_PORT/api/uploadFile/
```

Expected baseline:

- Root may return `200` for a fake site.
- XHTTP path should return an Xray-style `400` for invalid unauthenticated requests.
- XHTTP path must not return HTML.
- XHTTP path should include `Cache-Control: no-store`.

## Yandex CDN XHTTP Notes

- Yandex Cloud CDN may allow only `GET`, `HEAD`, and `OPTIONS` on some resources.
- If XHTTP uses `uplinkHTTPMethod=OPTIONS`, origin nginx may need `proxy_method` to translate `OPTIONS` to `POST` for local Xray.
- CDN success on `OPTIONS` or `/cdn-check` does not prove the real data path.
- Purge CDN cache after changing root/fake-site behavior or cache headers.

## Remnawave/Node Checks

Direct DB edits do not necessarily trigger node rebuilds. Prefer API/UI mutations. If direct DB edits were used:

1. Verify membership/host/inbound in DB.
2. Refresh Remnawave backend if subscriptions still render stale data.
3. Restart or refresh remnanode only when the node runtime still has stale client counts.

Use the bundled runtime inspector from inside the remnanode container:

```bash
docker cp scripts/inspect-remnanode-runtime-config.js remnanode:/tmp/inspect.js
docker exec remnanode node /tmp/inspect.js
```

The script prints counts and settings only; it does not print client IDs.

## Real Traffic Proof

A passing result must include a tunneled request, not just HTTP probes. Good checks:

- `https://www.gstatic.com/generate_204` returns `204`.
- `https://www.cloudflare.com/cdn-cgi/trace` returns `200` and expected egress geography.

If the local test starts Xray, clean up local processes after the test.
