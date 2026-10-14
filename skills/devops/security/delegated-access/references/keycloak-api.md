# Delegated Keycloak API

Read the installed helper guide and local profile first. The commands here describe
the established `keycloak-agent` interface; they require that helper to be installed
and configured for the approving user's identity and approved realm.

Start with:

```bash
keycloak-agent status
```

Use `keycloak-agent request` with a path restricted to
`/admin/realms/<approved-realm>/...`. For a read-only check, request that realm's
`users/count` endpoint. Substitute the actual approved realm; do not discover it
by probing other realms. Count output is suitable for a sanitized status report.
Capture other responses locally before exposing selected fields: user records,
client representations and authentication resources may contain sensitive data.

For authorized mutations, use the helper's documented method and private
`--body-file` interface; do not interpolate JSON or credentials into shell
arguments. Compare affected roles/groups/clients before and after. Authentication
does not grant permission to widen realm scope or change unrelated assignments.

The established helper validates identity/audience, restricts realm paths and
refreshes tokens. Its offline-session timer rotates credentials under a lock.
Do not modify the private token file manually or launch competing refresh loops.
Discover the actual service names from the local profile; timer presence alone
does not prove that the session is valid.

If consent is revoked or expired, run the documented `keycloak-agent login` flow
and start its single authorization service if the guide requires it. Give the
intended verification link to the user. Their passkey approval is required; do not
substitute a password grant, another identity or a parallel device-code poller.

`keycloak-agent revoke` ends the helper's delegation when revocation is requested.
It does not revoke every independently issued application session or Teleport
certificate. Verify revocation through the documented helper and report that
boundary explicitly.
