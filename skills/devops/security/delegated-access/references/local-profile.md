# Local access profile

Keep deployment bindings in a user-local guide linked from that user's agent
instructions. Paths and command names help discovery; credential values do not
belong in either guide or in this repository. Do not copy private JSON files,
browser profiles, identity files, or environment-file contents.

Record the following non-secret bindings using the actual installed configuration:

| Workflow | Bindings to record |
| --- | --- |
| Keycloak API | Helper executable and guide, approved issuer/realm, expected user identity, private token file path, refresh timer and authorization service names |
| Browser SSO | Helper and guide, explicitly authorized credential label, private profile path, dedicated browser session name, shared lock path, supported exact service origins and completion checks |
| Teleport | Approved proxy/connector, private identity file path, enrollment command, renewal timer and verified schedule |
| Vault | Installed official CLI/wrapper, trusted endpoint and CA file path, token-helper configuration path, managed login command, private session file path, current KV mount/path conventions |

For the established VM helpers, executable names are `keycloak-agent`, `sso-agent`,
`vault`, `vault-login` and `tsh`. These names are discovery hints, not installers.
Resolve them locally and read their installed guides before use. Preserve pinned
endpoints and existing identity checks; do not fill unknown bindings with guessed
hostnames, usernames or secret paths.

Record live verification separately with its date, authenticated operation and
non-secret result. Explicitly distinguish configured services from tested services
and authentication from authorization. Each VM needs its own verified profile;
copying the documentation does not copy delegation or consent.
