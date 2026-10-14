# Native Teleport identity

Read the local profile for the approved proxy, identity file and helper guide.
The established helper obtains a new identity through the native OIDC connector:

```bash
sso-agent teleport
```

The helper owns browser authentication, shared locking and atomic installation of
the private identity. Do not run an independent `tsh login` flow in parallel or
forward Keycloak Admin API tokens to Teleport. Use the configured connector even
if its historical name differs from the current identity provider; determine the
actual issuer from local configuration rather than guessing from that name.

After successful enrollment, run the documented `tsh` command with explicit
`--identity` and `--proxy` options. The identity file path and approved proxy are
non-secret bindings; the file's contents include credentials and must stay private.
For a read-only check, append `ls`. Do not rely on an old `.tsh` profile as evidence
that the newly enrolled identity works. Sanitize the resource list if topology is
confidential, and perform only the requested operations within assigned roles.

Read timer state and renewal schedule from local documentation. A timer being
enabled does not prove enrollment, certificate validity or access to a target.
If renewal fails, report the sanitized failure and follow the native documented
flow rather than changing proxy, TLS validation or roles.

If revocation is requested, distinguish stopping renewal, revoking the passkey or
OIDC delegation, removing a local identity file and revoking an issued Teleport
identity/session. These actions have different effects; use the service's supported
revocation process within the authorized scope and verify the relevant result.
