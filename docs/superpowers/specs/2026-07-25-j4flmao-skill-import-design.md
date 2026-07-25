# Curated j4flmao Skill Import Design

## Goal

Import 109 approved skills from `j4flmao/agent-skills`, organize them within
the repository taxonomy, replace the two existing Dockerfile-specific skills,
and exclude the audited low-quality or duplicate source areas.

The import is pinned to upstream commit
`1a3d5f4026cd30ca471f66df083cda44d4ddaa4e`.

## Scope

The import has two source-parity modes:

1. Copy 74 approved directories in full, including their `SKILL.md`,
   references, assets, and scripts.
2. Import 35 backend skills as functional slices: copy each `SKILL.md` plus
   only the existing `references/*.md` files named by that entrypoint.

The backend exception prevents importing approximately 56 MB of unrelated,
generated reference filler from the selected source directories.

## Full-Directory Imports

### Design and developer workflow

- `skills/design/accessibility`
- `skills/design/brand-identity`
- `skills/design/design-systems`
- `skills/design/information-architecture`
- `skills/design/motion-design`
- `skills/design/prototyping`
- `skills/design/ux-research`
- `skills/design/visual-design`
- `skills/developer/readme-writer`
- `skills/developer/security-auditor`

### DevOps

- Containers:
  - `skills/devops/containers/docker`
  - `skills/devops/containers/docker-patterns`
- CI/CD:
  - `skills/devops/ci-cd/gitlab-ci`
- Delivery:
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

### Planning

- `skills/planning/bdd-atdd`
- `skills/planning/bpmn-modeling`
- `skills/planning/cost-benefit`
- `skills/planning/create-brief`
- `skills/planning/create-prd`
- `skills/planning/create-roadmap`
- `skills/planning/create-story`
- `skills/planning/market-analysis`
- `skills/planning/solution-architecture`

### Quality

- `skills/quality/acceptance-testing`
- `skills/quality/contract-testing`
- `skills/quality/e2e-testing`
- `skills/quality/exploratory-testing`
- `skills/quality/integration-testing`
- `skills/quality/load-testing`
- `skills/quality/property-based-testing`
- `skills/quality/regression-testing`
- `skills/quality/smoke-testing`
- `skills/quality/unit-testing`
- `skills/quality/visual-testing`

Use upstream `skills/quality/e2e-testing`; do not import the duplicate
`skills/quality/quality-e2e-testing`.

### Application and organizational security

Copy these upstream `skills/security/*` directories into
`skills/devops/security/*`:

- `abac`
- `api-security`
- `container-security`
- `cspm`
- `data-security`
- `edr-xdr`
- `iam-governance`
- `rbac`
- `sast-dast`
- `sbom`
- `secrets-management`
- `siem-engineering`
- `soar-automation`
- `soc-operations`
- `threat-intelligence`
- `zero-trust`

### Ecommerce and personas

- `skills/ecommerce/payment-processing`
- `skills/personas/system-architect`
- `skills/personas/security-engineer`
- `skills/personas/devops-sre-engineer`
- `skills/personas/backend-engineer`
- `skills/personas/ai-architect`

## Backend Functional Slices

Place all backend skills under `skills/developer/backend`.

### Go and email

- `skills/developer/backend/go/architecture`
- `skills/developer/backend/go/patterns`
- `skills/developer/backend/transactional-email`

### Universal backend

- `api-gateway`
- `api-versioning`
- `graphql-federation`
- `api-product-management`
- `audit-logging`
- `auth-patterns`
- `background-jobs`
- `bff-pattern`
- `caching`
- `clean-architecture`
- `database-patterns`
- `distributed-locking`
- `event-driven`
- `event-sourcing`
- `feature-flags`
- `file-storage`
- `graphql-patterns`
- `grpc-patterns`
- `idempotency`
- `internationalization`
- `message-queue`
- `microservices`
- `multi-tenancy`
- `openapi-documentation`
- `plugin-architecture`
- `resilience-patterns`
- `scheduling-cron`
- `search-patterns`
- `structured-logging`
- `transactional-outbox`
- `webhooks`
- `websocket-patterns`

The source paths for `graphql-federation` and `api-product-management` are
`skills/backend/universal/api/graphql-federation` and
`skills/backend/universal/api/product-management`. The other universal source
paths are direct children of `skills/backend/universal`.

`audit-logging` names two absent upstream references and `database-patterns`
names one. Preserve these three unresolved links as source defects. The
directly referenced Go patterns `error-handling.md` is noisy generated
material, but it remains included because the selected entrypoint names it.

## Explicit Exclusions

Do not import:

- `skills/backend/references` because it has no `SKILL.md` entrypoint.
- Any unreferenced backend files.
- `skills/prompt-engineering`.
- `skills/site-reliability-engineering`.
- `skills/system-design`.
- The rejected backend universal skills:
  - `api-design`
  - `api-response`
  - `authorization`
  - `contract-testing`
  - `cqrs-patterns`
  - `data-masking`
  - `data-streaming`
  - `design-patterns`
  - `firebase`
  - `load-testing`
  - `observability`
  - `oop-principles`
  - `rate-limiting`
  - `saga-patterns`
  - `serverless`
  - `supabase`
  - `testing`

## Replacement and Overlap Decisions

Remove only:

- `skills/devops/containers/dockerfile-generator`
- `skills/devops/containers/dockerfile-validator`

Keep the existing security-focused
`skills/devops/security/incident-response`. The imported operational incident
management skill uses the distinct frontmatter name
`devops-incident-response`.

Keep the existing GitLab CI and Helm generators and validators. Keep
`container-hardening`; the Docker replacement applies only to the two
Dockerfile-specific directories.

## Import Method

Use a temporary checkout of the pinned upstream commit.

For the 74 full-directory imports:

- Copy complete directories.
- Normalize trailing end-of-line whitespace only when needed.
- Verify source/destination manifests and content while ignoring only
  end-of-line whitespace.

For the 35 backend imports:

- Copy each selected `SKILL.md`.
- Parse its unique `references/*.md` targets.
- Copy every target that exists upstream.
- Preserve exactly three absent targets.
- Reject destination files outside that calculated functional slice.

The approved 109 entrypoints contain 80 unresolved local reference targets:
64 from the original 38-skill selection, 13 from planning, quality, and
security, and 3 from the added backend skills. Preserve that exact pinned
baseline rather than inventing files or silently retargeting links.

Do not execute commands or operational examples embedded in imported
documentation. Infrastructure, security, rollback, scaling, and incident
commands remain reference material requiring human review, environment
adaptation, a dry run where practical, and a rollback plan.

## Verification

Before completion:

1. Confirm all 109 selected destination `SKILL.md` files exist.
2. Confirm the repository contains 156 skills in total: the original 49,
   minus two Dockerfile skills, plus 109 imports.
3. Verify full-directory and backend functional-slice parity against the
   pinned source.
4. Parse every repository skill frontmatter block and require globally unique
   names.
5. Confirm the selected imports have exactly 80 unresolved reference targets.
6. Confirm only the two approved Dockerfile directories were removed.
7. Confirm excluded backend, SRE, system-design, and prompt-engineering paths
   were not imported.
8. Run `git diff --check` and inspect the complete changed-file inventory.
9. Integrate into `master`, push, and verify the remote commit and
   representative paths.

## Success Criteria

- All 109 approved skills are present in the agreed categories.
- Backend imports contain only functional entrypoints and their directly
  named existing references.
- Only the two explicitly replaced Dockerfile skills are removed.
- Imported files match the pinned upstream source except for normalized
  trailing whitespace and the approved backend subset manifest.
- Static validation passes and known source defects are reported honestly.
- GitHub `intezya/agents` exposes the verified result on `master`.
