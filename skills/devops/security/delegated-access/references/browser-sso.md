# Native browser SSO

Read the local `sso-agent` guide and confirm that the user has authorized this
helper and its software passkey for the task. Do not create or register a passkey
merely because this skill is installed. The helper completes native Keycloak/OIDC
login; each application issues its own session. Admin API tokens are separate.

The established commands are:

```bash
sso-agent status
```

Use `sso-agent open` with the exact locally approved HTTPS service URL. The URL
must not contain tokens or private invitation links. The helper needs a configured
origin, login adapter and authenticated completion check. A newly requested service
is not supported merely because its domain shares a suffix with an existing one.
If the adapter is missing, report that gap and add support only within the user's
authorized task; do not disable origin or identity restrictions.

The authentication browser has a dedicated named session and private persistent
profile. Let the helper hold the shared SSO lock across login, passkey-counter
updates and credential handoff. Do not interact with that browser during renewal
or run concurrent SSO flows. Use the host's collaborative browser for ordinary
UI inspection when available, following its tool discovery procedure.

Passkey material, cookies, cached tokens and callback query parameters must remain
inside private files or local process channels. Do not print profiles, raw browser
snapshots of authentication pages, or callback URLs. Diagnostic output must be
redacted before it reaches a tool result; a generic error is preferable to leaking
a credential through an exception or child-process stderr.

Verify completion using the adapter's authenticated route or self-profile check,
then verify the operation needed by the task. A visible dashboard can be cached;
a public landing page does not prove authentication. Record only the services
actually checked and any DNS/adapter/authorization failures. Do not copy historical
success claims from another VM into a new environment's status.

Removing a software passkey blocks fresh authentication. Already issued sessions,
tokens and certificates may remain valid and need service-specific revocation.
