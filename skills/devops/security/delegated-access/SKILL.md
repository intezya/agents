---
name: delegated-access
description: Use existing delegated Keycloak administration, native application SSO, and Teleport CLI access for authorized tasks. Discovers local keycloak-agent/sso-agent bindings, separates credential audiences, and handles session renewal without exposing credentials. Does not install an identity provider or create a delegation.
---

# Delegated access

Use the installed, locally documented identity helpers before bootstrap credentials
or ad hoc authentication. This skill describes existing access; copying it does
not authorize a software passkey, new roles, impersonation, or application changes.

## Discover bindings

Read the user's local agent instructions and helper guides. Resolve the installed
commands, approved realm, issuer, proxy, expected identity and private file paths.
If a helper is absent, do not assume these commands work or silently provision an
alternative. Report the missing binding; continue independent work where possible.

Use [local profile](references/local-profile.md) only when documenting these
bindings. Keep credentials and diagnostic state outside this repository.

## Select the workflow

| Task | Read |
| --- | --- |
| Keycloak users, clients, groups or roles through delegated administration | [Keycloak API](references/keycloak-api.md) |
| Native application login through the authorized browser SSO helper | [Browser SSO](references/browser-sso.md) |
| Teleport CLI identity enrollment and use | [Teleport](references/teleport.md) |
| Vault metadata or secret retrieval | Existing [Vault CLI reference](../vault/references/agent-cli-usage.md) |

## Credential boundaries

- Keycloak administration tokens target realm management. Applications must finish
  their own native OIDC callbacks and issue their own sessions/certificates.
- Use only the locally approved identity, realm, service and task scope. Existing
  access does not authorize unrelated mutations or broader grants.
- Never print, commit, copy to chat, or place credential values in command arguments
  or environment variables. Private directories use mode 700 and files mode 600.
  Capture sensitive responses inside a local process; expose only required,
  non-secret fields. Avoid raw browser diagnostics and authentication URLs.
- Let documented helpers own locking, token rotation and atomic credential writes.
  Do not run parallel SSO flows, pollers or browser interactions during renewal.
- A cached page, public landing page or unit test is not proof of live access.
  Verify the requested authenticated operation and report only what succeeded.
- When new user approval is required, use the documented authorization flow and
  give the user its intended verification link. Do not bypass that approval.

For ordinary UI inspection prefer the product-native collaborative browser when
available. The documented authentication helper may use a separate private browser
session; that exception does not move ordinary browser work into that session.
