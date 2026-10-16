---
name: sso-debug
description: Diagnose a failing application OIDC login through Keycloak by tracing redirects, issuer/client bindings, effective roles and session lifetimes. Use for login loops, redirect errors, unexpected 401/403 and refresh failures; does not provision identity providers or grant roles.
---

# SSO debugging

Find the first failing boundary in application → OIDC client → Keycloak → callback
→ application session. Discover the approved realm, issuer, application origin,
client ID, expected identity and installed helpers from local instructions. Do not
guess bindings or treat this skill's installation as an access grant.

## Access and evidence

Use locally documented `keycloak-agent`, `sso-agent`, Vault and Teleport workflows
when available. Read their local guides before use. Keep realm-management tokens
separate from application credentials: an Admin API token is never an application
login credential. Confine requests to the approved realm and task scope.

Start with helper status and existing configuration metadata. If a delegation
requires renewal, use its documented native approval flow; do not invent grants,
impersonate users or run competing pollers. Serialize shared authentication-browser
operations through the existing helper lock. Prefer the product-native browser
for ordinary inspection, leaving the private authentication session to its helper.

Authentication URLs and network traces can contain codes, state, nonce, cookies,
tokens and client secrets. Do not print or save raw traces in reports or Git.
Capture sensitive responses inside a local process and select only required safe
fields. Never dump client records, session files, browser storage or token-helper
stdout into tool output. Ask the user to enter credentials in the native login UI.

## Trace the failure

1. **Application entry:** reproduce the exact authorized login operation and
   record the time, origin, status and sanitized error. Check DNS, TLS, reverse
   proxy scheme/host and the intended external URL. Distinguish an unavailable
   service from an authentication failure.
2. **Discovery and client binding:** verify the issuer/discovery metadata and
   client ID against the intended realm and application configuration. Check
   allowed flow, client type and PKCE requirements against actual configuration.
   Preserve exact issuer matching, including path and trailing-slash semantics.
3. **Redirect:** compare the requested callback with registered redirect URIs,
   including scheme, host, port and path. Check web origins separately from
   redirect URIs. Inspect proxy/base-URL configuration when an internal hostname
   or HTTP callback is emitted. Propose the narrow correct callback; do not
   broaden it to a wildcard or disable TLS to make login pass.
4. **Native authentication and callback:** verify provider-side success, callback
   completion and application session creation as distinct stages. Inspect safe
   error codes and correlated logs. For state/nonce/PKCE failures investigate the
   application session, cookie SameSite/Secure/domain/path settings, clock skew
   and callback routing. Do not weaken these checks or replay authorization codes.
5. **Authorization:** a 401 or 403 alone is not a diagnosis. Check application
   logs, expected subject, audience and role claim locations. Distinguish realm
   roles, client roles, effective composite/group roles, scope mappings and the
   application's own permission mapping. A role assigned in Keycloak may be
   absent from the application token; an existing session may carry old claims.
   Do not grant broader roles, full-scope access or admin privileges as a probe.
6. **Session lifetime and refresh:** compare realm and client overrides, SSO idle
   and maximum lifetimes, application cookie/session lifetime, access-token expiry
   and refresh/offline-session policy. Check clocks and serialized refresh-token
   rotation. An active Keycloak session need not imply a valid application session.

Decoded JWT payloads are unverified evidence. Verify signature, issuer, audience,
expiry and applicable nonce through the application's normal validator or a trusted
library before accepting claims; do not paste tokens into external decoder sites.
Report only the claims necessary for the diagnosis, with personal data redacted.

## Validate and report

Prove recovery by testing the originally failing authenticated operation with the
expected identity. An accepted native self-profile API request can prove identity
and session creation, but cannot establish that a separate protected operation is
authorized. If that operation cannot be safely tested, report its recovery as
unverified. A dashboard, redirect completion or public landing page alone is
insufficient. Use a fresh session only
when needed and within the authorized helper workflow; do not clear unrelated
browser sessions or revoke sessions merely to diagnose an issue.

Report the failing boundary, verified facts and sanitized evidence, hypothesis,
smallest proposed correction and exact verification still needed. Distinguish
configuration inspection from a tested login. Apply changes to clients, roles,
redirects or session policies only within the user's authorized change scope;
otherwise finish the diagnosis and present the concrete correction for approval.
