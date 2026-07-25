# j4flmao Skill Import Design

## Goal

Import the 38 explicitly requested skills from
`j4flmao/agent-skills`, organize them within the repository's existing
taxonomy, replace the two existing Dockerfile-specific skills as requested,
and preserve complementary skills that do not conflict.

The import is pinned to upstream commit
`1a3d5f4026cd30ca471f66df083cda44d4ddaa4e`.

## Scope

Copy each requested upstream directory in full, including its `SKILL.md` and
all `references/` files. Do not bulk-import any other part of the upstream
repository.

### Design

Copy all eight upstream `skills/design/*` skills to:

- `skills/design/accessibility`
- `skills/design/brand-identity`
- `skills/design/design-systems`
- `skills/design/information-architecture`
- `skills/design/motion-design`
- `skills/design/prototyping`
- `skills/design/ux-research`
- `skills/design/visual-design`

Place development-loop skills at:

- `skills/developer/readme-writer`
- `skills/developer/security-auditor`

Replace the existing Dockerfile generator and validator with:

- `skills/devops/containers/docker`
- `skills/devops/containers/docker-patterns`

Remove only:

- `skills/devops/containers/dockerfile-generator`
- `skills/devops/containers/dockerfile-validator`

Place the remaining DevOps skills by responsibility:

- CI/CD:
  - `skills/devops/ci-cd/gitlab-ci`
- Delivery and GitOps:
  - `skills/devops/delivery/argo-cd`
  - `skills/devops/delivery/gitops`
  - `skills/devops/delivery/gitops-advanced`
  - `skills/devops/delivery/progressive-delivery`
- Kubernetes:
  - `skills/devops/kubernetes/helm-patterns`
  - `skills/devops/kubernetes/kubernetes`
  - `skills/devops/kubernetes/kubernetes-patterns`
  - `skills/devops/kubernetes/kubernetes-autoscaling`
  - `skills/devops/kubernetes/kubernetes-for-data`
  - `skills/devops/kubernetes/kubernetes-operators`
  - `skills/devops/kubernetes/longhorn`
- Observability:
  - `skills/devops/observability/monitoring`
  - `skills/devops/observability/observability`
  - `skills/devops/observability/opentelemetry`
- Operations:
  - `skills/devops/operations/incident-response`
  - `skills/devops/operations/sre-practices`
- Infrastructure:
  - `skills/devops/infrastructure/network-infrastructure`
- Security:
  - `skills/devops/security/policy-as-code`
  - `skills/devops/security/vault`

Place the payment skill at:

- `skills/ecommerce/payment-processing`

Place the five persona skills in a dedicated top-level category:

- `skills/personas/system-architect`
- `skills/personas/security-engineer`
- `skills/personas/devops-sre-engineer`
- `skills/personas/backend-engineer`
- `skills/personas/ai-architect`

## Overlap Decisions

Keep the existing `skills/devops/security/incident-response`. It is a
security-incident and forensics playbook whose frontmatter name is
`incident-response`. The new skill is an operational incident-management
framework whose frontmatter name is `devops-incident-response`; it focuses on
severity, on-call, incident command, communication, and postmortems. The two
skills are complementary and do not have a discovery-name collision.

Keep the existing GitLab CI generator and validator alongside `gitlab-ci`.
The new skill provides architectural and operational guidance; the existing
skills provide deterministic generation and validation workflows.

Keep the existing Helm generator and validator alongside `helm-patterns` for
the same reason.

Keep `container-hardening`; the request to remove Docker skills applies only
to the current `dockerfile-generator` and `dockerfile-validator` directories.

## Import Method

Use a temporary checkout of the pinned upstream commit as the source. Copy
complete directories into the approved destinations without rewriting their
content. Record and investigate any unavoidable source-parity exception.

Do not execute commands or operational examples embedded in imported
documentation. Imported rollback, scaling, incident-response, security, and
infrastructure commands remain reference material requiring human review,
environment-specific adaptation, a dry run where practical, and a rollback
plan.

## Verification

Before completion:

1. Confirm all 38 expected `SKILL.md` files exist at their destination.
2. Compare every imported directory against its pinned upstream source,
   including file manifests and file contents.
3. Validate every imported `SKILL.md` frontmatter block and confirm skill
   names are unique across the repository.
4. Check that local Markdown references resolve within each imported skill.
5. Confirm the two replaced Dockerfile skill directories are absent and no
   other existing skills were removed.
6. Run `git diff --check` and inspect the complete changed-file inventory.
7. Commit the import on the existing worktree branch, integrate it into
   `master`, push the repository, and verify the remote commit and paths.

## Success Criteria

- All requested skills are present in the approved semantic categories.
- All five requested personas are present under `skills/personas`.
- Only the two explicitly replaced Dockerfile skills are removed.
- Both incident-response specialties remain discoverable under distinct
  frontmatter names.
- Imported files match the pinned upstream source.
- Static validation passes without executing imported operational commands.
- The published `master` branch contains and exposes the verified result.
