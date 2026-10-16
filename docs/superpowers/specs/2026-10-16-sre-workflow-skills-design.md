# SRE workflow skills

The user requested three installable skills and publication in `intezya/agents`.
Implement the three workflows described in the conversation as focused Markdown
skills, rather than a new infrastructure client or a general SRE persona.

- `skills/devops/operations/incident-triage`: bounded evidence collection for
  availability, TLS, recent changes and logs; separate facts from hypotheses.
- `skills/devops/delivery/deploy-check`: baseline, rollback readiness and
  post-deployment verification; checking does not itself authorize deployment.
- `skills/devops/security/sso-debug`: trace application/OIDC/Keycloak boundaries,
  redirects, effective roles and session lifetimes without exposing credentials.

Each directory contains a self-contained `SKILL.md` and generated Codex interface
metadata. Prefer locally documented helpers and discover environment bindings at
runtime. Keep private VM addresses, identities, credentials and live reports out
of the repository. Do not duplicate the broader incident-response framework or
the delegated-access implementation. Normal automatic skill discovery remains on.

Validate frontmatter and metadata, inspect routing and references, and review
failure scenarios: inaccessible monitoring, unsafe rollback, public landing pages,
expired authentication and realm/audience confusion. No production access is
required to create or validate these instructions. Install verified copies in
`~/.codex/skills`; publish through a branch and PR targeting `master`.
