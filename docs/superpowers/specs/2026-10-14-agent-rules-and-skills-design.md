# Agent rules and skills contribution design

## Scope

Extend PR 5 with the remaining established local instructions and reusable skills.
Import the installed `design-system` and `humanizer-ru` folders and update the
existing `ru-text` folder from the installed version. Preserve supporting scripts,
references, assets and metadata; exclude caches and generated Python bytecode.

Copy the user's non-secret context and UI/text rules to repository `AGENTS.md`.
Keep the existing process, Git, DNS removal and Vault instructions. UI rules
continue to require project `DESIGN.md`, contract discovery, craft/use boundaries,
bureau.ru research, contrast checks and evidence for completion.

## Delegated access

Create a `delegated-access` skill for the already-established Keycloak API,
application SSO and Teleport workflows. Route detailed commands to separate
references. Discover environment-specific endpoints and private file paths from
local configuration rather than embed this VM's user identity or hosts. A short
local-profile template records bindings without copying credentials or making a
new delegation implicit.

The skill covers correct credential audiences, realm scope, user approval on
reauthorization, shared authentication locks, native application completion and
revocation boundaries. It adds no access grants and does not install the runtime.
The existing `agent-browser` skill remains unchanged; ordinary browser work
prefers the host's collaborative browser, while documented authentication helpers
use their dedicated private sessions.

## Validation

Validate four skill entrypoints. Compare imported files with installed sources,
check supporting links, compile imported Python modules, and run Node syntax
checks. Exercise the humanizer scanner on synthetic Russian text and the design
contract checker/index generator on isolated synthetic fixtures. Run diff checks,
review publication scope, push the existing task branch and update PR 5's title
and description to reflect the combined contribution.
