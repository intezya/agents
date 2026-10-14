# Vault CLI agent usage design

## Scope

Contribute the established Vault CLI usage rules from the VM to the existing
`vault` skill and repository-wide `AGENTS.md`. This is a documentation change;
it does not distribute the environment-specific SSO runtime or credentials.

## Approach

Extend the existing skill rather than introduce a duplicate skill or copy the
VM adapter. Keep essential routing in `SKILL.md` and put the detailed workflow
in `references/agent-cli-usage.md`. Add a concise repository-wide instruction
that prefers the installed official CLI and points to the skill.

The workflow discovers local installation and authentication instructions,
preserves TLS and endpoint constraints, separates metadata from secret reads,
and captures secret responses inside a local process for an authorized consumer.
Managed SSO helpers remain optional and environment-specific. Generic examples
use `secret/deploy/qa/app`; actual mounts and paths must be discovered locally.

## Boundaries

No personal hostnames, user/entity identifiers, private file contents, certificates,
binary archives, credentials, live IAM changes, or CLI installation are included.
Existing Vault setup workflows remain available. This contribution grants no
permission to initialize Vault, change policies, or rotate credentials.

## Validation

Validate the modified skill frontmatter, resolve its new relative reference,
compile the Python example, and exercise its subprocess handoff with fake CLI and
consumer executables. Confirm successful delivery and failure without secret
output. Run `git diff --check` and inspect the full staged diff before pushing a
branch and opening a PR against `master`.
