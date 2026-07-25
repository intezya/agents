# j4flmao Skill Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import the 38 approved j4flmao skills, replace the two existing Dockerfile-specific skills, validate exact source parity, and publish the result on `master`.

**Architecture:** Treat the selected upstream directories as pinned vendored content and copy them without rewriting. Organize them by the semantic taxonomy approved in the design spec, keep complementary incident-response, GitLab CI, Helm, and container-hardening skills, and verify every imported directory against the pinned source before publishing.

**Tech Stack:** Git, GitHub CLI, POSIX file utilities, Ruby standard library (`yaml`), Markdown.

## Global Constraints

- Work only in `/Users/kurumi/Projects/agents/.worktrees/feat-add-developer-skills` on branch `feat/add-engineering-skills` until the integration task.
- Prefix every shell command with `rtk`.
- Use `j4flmao/agent-skills` commit `1a3d5f4026cd30ca471f66df083cda44d4ddaa4e`.
- Copy each requested directory in full without rewriting its `SKILL.md` or `references/` files.
- If upstream trailing spaces make `git diff --check` fail, remove trailing spaces only, record that parity exception, and verify content with `git diff --no-index --ignore-space-at-eol`.
- The pinned source has 64 unresolved local `references/*.md` targets across the selected entrypoints; preserve and report that exact upstream baseline instead of inventing missing files or silently retargeting links.
- Import only the 38 approved skills; do not bulk-import any other upstream content.
- Remove only `skills/devops/containers/dockerfile-generator` and `skills/devops/containers/dockerfile-validator`.
- Preserve the existing security-focused `skills/devops/security/incident-response`.
- Do not execute any command, script, rollback, scaling action, forensic procedure, or infrastructure operation described by imported documentation.
- Treat operational examples as reference material requiring human review, environment-specific adaptation, a dry run where practical, and a rollback plan.
- Integrate through the repository's `master` branch and verify the published remote commit.

---

### Task 1: Import design, developer, ecommerce, and persona skills

**Files:**
- Create: `skills/design/`
- Create: `skills/developer/readme-writer/`
- Create: `skills/developer/security-auditor/`
- Create: `skills/ecommerce/payment-processing/`
- Create: `skills/personas/system-architect/`
- Create: `skills/personas/security-engineer/`
- Create: `skills/personas/devops-sre-engineer/`
- Create: `skills/personas/backend-engineer/`
- Create: `skills/personas/ai-architect/`

**Interfaces:**
- Consumes: pinned upstream checkout at `/tmp/agents-j4flmao-1a3d5f40`.
- Produces: 16 complete imported skill directories with source-identical content.

- [ ] **Step 1: Verify the worktree and source target are safe**

Run:

```bash
rtk git status --short --branch
rtk proxy test ! -e /tmp/agents-j4flmao-1a3d5f40
rtk proxy test ! -e skills/design
rtk proxy test ! -e skills/developer/readme-writer
rtk proxy test ! -e skills/developer/security-auditor
rtk proxy test ! -e skills/ecommerce
rtk proxy test ! -e skills/personas
```

Expected: branch `feat/add-engineering-skills`, clean worktree, and every `test`
exits successfully.

- [ ] **Step 2: Create a pinned upstream checkout**

Run:

```bash
rtk git clone --filter=blob:none --no-checkout https://github.com/j4flmao/agent-skills.git /tmp/agents-j4flmao-1a3d5f40
rtk git -C /tmp/agents-j4flmao-1a3d5f40 checkout --detach 1a3d5f4026cd30ca471f66df083cda44d4ddaa4e
rtk git -C /tmp/agents-j4flmao-1a3d5f40 rev-parse HEAD
rtk git -C /tmp/agents-j4flmao-1a3d5f40 status --short --branch
```

Expected: HEAD is exactly
`1a3d5f4026cd30ca471f66df083cda44d4ddaa4e` and the temporary checkout is
clean.

- [ ] **Step 3: Copy the approved non-DevOps directories**

Run from the worktree:

```bash
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/design skills/design
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/readme-writer skills/developer/readme-writer
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/security-auditor skills/developer/security-auditor
rtk proxy mkdir -p skills/ecommerce
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/ecommerce/payment-processing skills/ecommerce/payment-processing
rtk proxy mkdir -p skills/personas
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/personas/system-architect skills/personas/system-architect
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/personas/security-engineer skills/personas/security-engineer
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/personas/devops-sre-engineer skills/personas/devops-sre-engineer
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/personas/backend-engineer skills/personas/backend-engineer
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/personas/ai-architect skills/personas/ai-architect
```

Expected: all 16 destination directories exist.

- [ ] **Step 4: Verify exact parity for the imported directories**

Run:

```bash
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/design skills/design
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/readme-writer skills/developer/readme-writer
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/security-auditor skills/developer/security-auditor
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/ecommerce/payment-processing skills/ecommerce/payment-processing
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/personas/system-architect skills/personas/system-architect
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/personas/security-engineer skills/personas/security-engineer
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/personas/devops-sre-engineer skills/personas/devops-sre-engineer
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/personas/backend-engineer skills/personas/backend-engineer
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/personas/ai-architect skills/personas/ai-architect
```

Expected: every command exits `0` with no output.

- [ ] **Step 5: Normalize only upstream trailing whitespace**

Run:

```bash
rtk proxy find skills/design skills/developer/readme-writer skills/developer/security-auditor skills/ecommerce skills/personas -type f -name '*.md' -exec perl -pi -e 's/[ \t]+$//' {} +
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/design skills/design
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/readme-writer skills/developer/readme-writer
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/dev-loop/security-auditor skills/developer/security-auditor
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/ecommerce/payment-processing skills/ecommerce/payment-processing
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/personas/system-architect skills/personas/system-architect
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/personas/security-engineer skills/personas/security-engineer
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/personas/devops-sre-engineer skills/personas/devops-sre-engineer
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/personas/backend-engineer skills/personas/backend-engineer
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/personas/ai-architect skills/personas/ai-architect
```

Expected: all commands exit `0`. Differences from upstream, if any, are
limited to trailing spaces at end of line.

- [ ] **Step 6: Commit the non-DevOps imports**

Run:

```bash
rtk git add skills/design skills/developer/readme-writer skills/developer/security-auditor skills/ecommerce skills/personas
rtk git diff --cached --check
rtk git commit -m "feat: add design and persona skills"
```

Expected: whitespace check passes and the commit contains only the 16 approved
skill directories.

---

### Task 2: Replace Dockerfile skills and import categorized DevOps skills

**Files:**
- Delete: `skills/devops/containers/dockerfile-generator/`
- Delete: `skills/devops/containers/dockerfile-validator/`
- Create: `skills/devops/containers/docker/`
- Create: `skills/devops/containers/docker-patterns/`
- Create: `skills/devops/ci-cd/gitlab-ci/`
- Create: `skills/devops/delivery/argo-cd/`
- Create: `skills/devops/delivery/gitops/`
- Create: `skills/devops/delivery/gitops-advanced/`
- Create: `skills/devops/delivery/progressive-delivery/`
- Create: `skills/devops/kubernetes/helm-patterns/`
- Create: `skills/devops/kubernetes/kubernetes/`
- Create: `skills/devops/kubernetes/kubernetes-patterns/`
- Create: `skills/devops/kubernetes/kubernetes-autoscaling/`
- Create: `skills/devops/kubernetes/kubernetes-for-data/`
- Create: `skills/devops/kubernetes/kubernetes-operators/`
- Create: `skills/devops/kubernetes/longhorn/`
- Create: `skills/devops/observability/monitoring/`
- Create: `skills/devops/observability/observability/`
- Create: `skills/devops/observability/opentelemetry/`
- Create: `skills/devops/operations/incident-response/`
- Create: `skills/devops/operations/sre-practices/`
- Create: `skills/devops/infrastructure/network-infrastructure/`
- Create: `skills/devops/security/policy-as-code/`
- Create: `skills/devops/security/vault/`

**Interfaces:**
- Consumes: verified pinned checkout from Task 1 and the existing repository taxonomy.
- Produces: 22 source-identical DevOps skill directories, with only the two approved Dockerfile directories removed.

- [ ] **Step 1: Verify exact deletion and creation targets**

Run:

```bash
rtk proxy test -d skills/devops/containers/dockerfile-generator
rtk proxy test -d skills/devops/containers/dockerfile-validator
rtk proxy test -d skills/devops/security/incident-response
rtk proxy test -d skills/devops/security/container-hardening
rtk proxy test ! -e skills/devops/containers/docker
rtk proxy test ! -e skills/devops/containers/docker-patterns
rtk proxy test ! -e skills/devops/ci-cd/gitlab-ci
rtk proxy test ! -e skills/devops/delivery
rtk proxy test ! -e skills/devops/kubernetes/helm-patterns
rtk proxy test ! -e skills/devops/kubernetes/kubernetes
rtk proxy test ! -e skills/devops/observability/monitoring
rtk proxy test ! -e skills/devops/operations
rtk proxy test ! -e skills/devops/infrastructure/network-infrastructure
rtk proxy test ! -e skills/devops/security/policy-as-code
rtk proxy test ! -e skills/devops/security/vault
```

Expected: every precondition passes. The two removal targets exist, preserved
security skills exist, and all new destinations are absent.

- [ ] **Step 2: Remove only the two approved Dockerfile skills**

Run:

```bash
rtk git rm -r skills/devops/containers/dockerfile-generator
rtk git rm -r skills/devops/containers/dockerfile-validator
rtk proxy test ! -e skills/devops/containers/dockerfile-generator
rtk proxy test ! -e skills/devops/containers/dockerfile-validator
```

Expected: both directories are staged as deletions. The operation remains
recoverable from Git history.

- [ ] **Step 3: Copy containers, CI/CD, and delivery skills**

Run:

```bash
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker skills/devops/containers/docker
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker-patterns skills/devops/containers/docker-patterns
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitlab-ci skills/devops/ci-cd/gitlab-ci
rtk proxy mkdir -p skills/devops/delivery
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/argo-cd skills/devops/delivery/argo-cd
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops skills/devops/delivery/gitops
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops-advanced skills/devops/delivery/gitops-advanced
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/progressive-delivery skills/devops/delivery/progressive-delivery
```

Expected: seven new skill directories exist in the approved categories.

- [ ] **Step 4: Copy Kubernetes skills**

Run:

```bash
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/helm-patterns skills/devops/kubernetes/helm-patterns
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes skills/devops/kubernetes/kubernetes
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-patterns skills/devops/kubernetes/kubernetes-patterns
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-autoscaling skills/devops/kubernetes/kubernetes-autoscaling
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-for-data skills/devops/kubernetes/kubernetes-for-data
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-operators skills/devops/kubernetes/kubernetes-operators
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/longhorn skills/devops/kubernetes/longhorn
```

Expected: seven new Kubernetes skill directories exist.

- [ ] **Step 5: Copy observability, operations, infrastructure, and security skills**

Run:

```bash
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/monitoring skills/devops/observability/monitoring
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/observability skills/devops/observability/observability
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/opentelemetry skills/devops/observability/opentelemetry
rtk proxy mkdir -p skills/devops/operations
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/incident-response skills/devops/operations/incident-response
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/sre-practices skills/devops/operations/sre-practices
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/network-infrastructure skills/devops/infrastructure/network-infrastructure
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/policy-as-code skills/devops/security/policy-as-code
rtk proxy cp -R /tmp/agents-j4flmao-1a3d5f40/skills/devops/vault skills/devops/security/vault
```

Expected: eight new skill directories exist and the two pre-existing
security-focused directories remain unchanged.

- [ ] **Step 6: Verify parity for all 22 DevOps imports**

Run `diff -qr` for each source/destination pair:

```bash
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker skills/devops/containers/docker
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker-patterns skills/devops/containers/docker-patterns
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitlab-ci skills/devops/ci-cd/gitlab-ci
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/argo-cd skills/devops/delivery/argo-cd
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops skills/devops/delivery/gitops
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops-advanced skills/devops/delivery/gitops-advanced
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/progressive-delivery skills/devops/delivery/progressive-delivery
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/helm-patterns skills/devops/kubernetes/helm-patterns
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes skills/devops/kubernetes/kubernetes
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-patterns skills/devops/kubernetes/kubernetes-patterns
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-autoscaling skills/devops/kubernetes/kubernetes-autoscaling
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-for-data skills/devops/kubernetes/kubernetes-for-data
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-operators skills/devops/kubernetes/kubernetes-operators
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/longhorn skills/devops/kubernetes/longhorn
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/monitoring skills/devops/observability/monitoring
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/observability skills/devops/observability/observability
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/opentelemetry skills/devops/observability/opentelemetry
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/incident-response skills/devops/operations/incident-response
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/sre-practices skills/devops/operations/sre-practices
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/network-infrastructure skills/devops/infrastructure/network-infrastructure
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/policy-as-code skills/devops/security/policy-as-code
rtk proxy diff -qr /tmp/agents-j4flmao-1a3d5f40/skills/devops/vault skills/devops/security/vault
```

Expected: every command exits `0` with no output.

- [ ] **Step 7: Normalize only upstream trailing whitespace**

Run:

```bash
rtk proxy find skills/devops/containers/docker skills/devops/containers/docker-patterns skills/devops/ci-cd/gitlab-ci skills/devops/delivery skills/devops/kubernetes/helm-patterns skills/devops/kubernetes/kubernetes skills/devops/kubernetes/kubernetes-patterns skills/devops/kubernetes/kubernetes-autoscaling skills/devops/kubernetes/kubernetes-for-data skills/devops/kubernetes/kubernetes-operators skills/devops/kubernetes/longhorn skills/devops/observability/monitoring skills/devops/observability/observability skills/devops/observability/opentelemetry skills/devops/operations skills/devops/infrastructure/network-infrastructure skills/devops/security/policy-as-code skills/devops/security/vault -type f -name '*.md' -exec perl -pi -e 's/[ \t]+$//' {} +
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker skills/devops/containers/docker
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/docker-patterns skills/devops/containers/docker-patterns
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitlab-ci skills/devops/ci-cd/gitlab-ci
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/argo-cd skills/devops/delivery/argo-cd
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops skills/devops/delivery/gitops
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/gitops-advanced skills/devops/delivery/gitops-advanced
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/progressive-delivery skills/devops/delivery/progressive-delivery
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/helm-patterns skills/devops/kubernetes/helm-patterns
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes skills/devops/kubernetes/kubernetes
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-patterns skills/devops/kubernetes/kubernetes-patterns
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-autoscaling skills/devops/kubernetes/kubernetes-autoscaling
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-for-data skills/devops/kubernetes/kubernetes-for-data
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/kubernetes-operators skills/devops/kubernetes/kubernetes-operators
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/longhorn skills/devops/kubernetes/longhorn
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/monitoring skills/devops/observability/monitoring
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/observability skills/devops/observability/observability
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/opentelemetry skills/devops/observability/opentelemetry
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/incident-response skills/devops/operations/incident-response
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/sre-practices skills/devops/operations/sre-practices
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/network-infrastructure skills/devops/infrastructure/network-infrastructure
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/policy-as-code skills/devops/security/policy-as-code
rtk git diff --no-index --ignore-space-at-eol -- /tmp/agents-j4flmao-1a3d5f40/skills/devops/vault skills/devops/security/vault
```

Expected: all 22 source/destination comparisons exit `0`; only trailing
end-of-line whitespace differs from upstream.

- [ ] **Step 8: Verify overlap decisions and commit**

Run:

```bash
rtk proxy sed -n '2p' skills/devops/security/incident-response/SKILL.md
rtk proxy sed -n '2p' skills/devops/operations/incident-response/SKILL.md
rtk proxy test -d skills/devops/ci-cd/gitlab-ci-generator
rtk proxy test -d skills/devops/ci-cd/gitlab-ci-validator
rtk proxy test -d skills/devops/kubernetes/helm-generator
rtk proxy test -d skills/devops/kubernetes/helm-validator
rtk proxy test -d skills/devops/security/container-hardening
rtk git add skills/devops
rtk git diff --cached --check
rtk git commit -m "feat: add curated devops skills"
```

Expected: incident-response names are `incident-response` and
`devops-incident-response`; complementary skills remain; the commit contains
22 approved new directories and only the two approved Dockerfile-skill
removals.

---

### Task 3: Run repository-wide static validation

**Files:**
- Verify: all `skills/**/SKILL.md`
- Verify: all imported Markdown references
- Verify: Git diff from design commit `6381246`

**Interfaces:**
- Consumes: the 38 imported skill directories from Tasks 1 and 2.
- Produces: evidence that the content is complete, source-identical, discoverable by unique names, and free of unintended changes.

- [ ] **Step 1: Assert the exact 38 destination skill files**

Run:

```bash
rtk proxy ruby -e 'paths=%w[
skills/design/accessibility
skills/design/brand-identity
skills/design/design-systems
skills/design/information-architecture
skills/design/motion-design
skills/design/prototyping
skills/design/ux-research
skills/design/visual-design
skills/developer/readme-writer
skills/developer/security-auditor
skills/ecommerce/payment-processing
skills/personas/system-architect
skills/personas/security-engineer
skills/personas/devops-sre-engineer
skills/personas/backend-engineer
skills/personas/ai-architect
skills/devops/containers/docker
skills/devops/containers/docker-patterns
skills/devops/ci-cd/gitlab-ci
skills/devops/delivery/argo-cd
skills/devops/delivery/gitops
skills/devops/delivery/gitops-advanced
skills/devops/delivery/progressive-delivery
skills/devops/kubernetes/helm-patterns
skills/devops/kubernetes/kubernetes
skills/devops/kubernetes/kubernetes-patterns
skills/devops/kubernetes/kubernetes-autoscaling
skills/devops/kubernetes/kubernetes-for-data
skills/devops/kubernetes/kubernetes-operators
skills/devops/kubernetes/longhorn
skills/devops/observability/monitoring
skills/devops/observability/observability
skills/devops/observability/opentelemetry
skills/devops/operations/incident-response
skills/devops/operations/sre-practices
skills/devops/infrastructure/network-infrastructure
skills/devops/security/policy-as-code
skills/devops/security/vault
]; abort "expected 38 paths, got #{paths.length}" unless paths.length == 38; missing=paths.reject { |path| File.file?(File.join(path, "SKILL.md")) }; abort "missing: #{missing.join(", ")}" unless missing.empty?; puts "38 imported SKILL.md files present"'
```

Expected: `38 imported SKILL.md files present`.

- [ ] **Step 2: Validate all repository skill frontmatter and name uniqueness**

Run:

```bash
rtk proxy ruby -ryaml -e 'files=Dir["skills/**/SKILL.md"].sort; names={}; files.each do |file|; text=File.read(file); parts=text.split(/^---\s*$\n?/, 3); abort "#{file}: missing frontmatter" unless parts.length == 3 && parts.first.empty?; data=YAML.safe_load(parts[1], aliases: false); abort "#{file}: frontmatter is not a map" unless data.is_a?(Hash); %w[name description].each { |key| abort "#{file}: missing #{key}" unless data[key].is_a?(String) && !data[key].strip.empty? }; names[data["name"]] ||= []; names[data["name"]] << file; end; duplicates=names.select { |_name, paths| paths.length > 1 }; abort "duplicate skill names: #{duplicates}" unless duplicates.empty?; puts "#{files.length} frontmatter blocks valid; names unique"'
```

Expected: every repository `SKILL.md` parses successfully and no duplicate
frontmatter names are reported. Preserve upstream persona names exactly even
where they are human-readable rather than kebab-case.

- [ ] **Step 3: Validate the pinned unresolved-reference baseline**

Run the same 38-path list from Step 1 with this check:

```bash
rtk proxy ruby -e 'paths=%w[
skills/design/accessibility skills/design/brand-identity skills/design/design-systems skills/design/information-architecture skills/design/motion-design skills/design/prototyping skills/design/ux-research skills/design/visual-design
skills/developer/readme-writer skills/developer/security-auditor skills/ecommerce/payment-processing
skills/personas/system-architect skills/personas/security-engineer skills/personas/devops-sre-engineer skills/personas/backend-engineer skills/personas/ai-architect
skills/devops/containers/docker skills/devops/containers/docker-patterns skills/devops/ci-cd/gitlab-ci
skills/devops/delivery/argo-cd skills/devops/delivery/gitops skills/devops/delivery/gitops-advanced skills/devops/delivery/progressive-delivery
skills/devops/kubernetes/helm-patterns skills/devops/kubernetes/kubernetes skills/devops/kubernetes/kubernetes-patterns skills/devops/kubernetes/kubernetes-autoscaling skills/devops/kubernetes/kubernetes-for-data skills/devops/kubernetes/kubernetes-operators skills/devops/kubernetes/longhorn
skills/devops/observability/monitoring skills/devops/observability/observability skills/devops/observability/opentelemetry
skills/devops/operations/incident-response skills/devops/operations/sre-practices
skills/devops/infrastructure/network-infrastructure skills/devops/security/policy-as-code skills/devops/security/vault
]; missing=[]; paths.each do |dir|; File.read(File.join(dir, "SKILL.md")).scan(%r{references/[A-Za-z0-9._/-]+\.md}).uniq.each do |relative|; candidate=File.join(dir, relative); missing << "#{dir}/SKILL.md -> #{relative}" unless File.file?(candidate); end; end; abort "expected 64 upstream-missing references, got #{missing.length}" unless missing.length == 64; puts "64 upstream-missing references preserved; no additional failures introduced"'
```

Expected:
`64 upstream-missing references preserved; no additional failures introduced`.
The exact directory parity checks in Tasks 1 and 2 prove this is the same
upstream set rather than a destination-only regression.

- [ ] **Step 4: Confirm replacement scope and changed-file inventory**

Run:

```bash
rtk proxy test ! -e skills/devops/containers/dockerfile-generator
rtk proxy test ! -e skills/devops/containers/dockerfile-validator
rtk proxy test -e skills/devops/security/incident-response/SKILL.md
rtk proxy test -e skills/devops/security/container-hardening/SKILL.md
rtk git diff --check 6381246..HEAD
rtk git diff --name-status 6381246..HEAD
rtk git status --short --branch
```

Expected: no whitespace errors, only approved import/removal paths appear in
the diff, and the worktree is clean.

- [ ] **Step 5: Confirm no imported operational content was executed**

Review the command history for this implementation. The only commands allowed
against imported content are file copy, file comparison, Markdown/frontmatter
parsing, and Git operations.

Expected: no Docker, Kubernetes, Helm, Vault, incident-response, security,
network, payment, or infrastructure command from an imported document was
executed.

---

### Task 4: Integrate, publish, and verify

**Files:**
- Integrate: branch `feat/add-engineering-skills` into `master`
- Publish: `intezya/agents` branch `master`

**Interfaces:**
- Consumes: clean, validated feature branch.
- Produces: remote `master` at the same verified commit as local `master`.

- [ ] **Step 1: Verify both checkouts before integration**

Run:

```bash
rtk git status --short --branch
rtk git log --oneline --decorate -6
```

Run from `/Users/kurumi/Projects/agents`:

```bash
rtk git status --short --branch
rtk git branch --show-current
rtk git fetch origin master
rtk git merge-base --is-ancestor origin/master feat/add-engineering-skills
```

Expected: feature worktree and primary checkout are clean; primary branch is
`master`; the remote `master` is already an ancestor of the validated feature
branch.

- [ ] **Step 2: Fast-forward local master**

Run from `/Users/kurumi/Projects/agents`:

```bash
rtk git merge --ff-only feat/add-engineering-skills
rtk git status --short --branch
rtk git rev-parse master
```

Expected: `master` fast-forwards to the validated feature branch and remains
clean.

- [ ] **Step 3: Push master**

Run from `/Users/kurumi/Projects/agents`:

```bash
rtk git push origin master
```

Expected: GitHub accepts the fast-forward update. If the configured SSH
transport fails with the known `Connection closed by UNKNOWN port 65535`
transport error, run the exact HTTPS fallback:

```bash
rtk git push https://github.com/intezya/agents.git master:master
```

- [ ] **Step 4: Verify remote commit and representative paths**

Run:

```bash
rtk git ls-remote https://github.com/intezya/agents.git refs/heads/master
rtk gh api repos/intezya/agents/commits/master --jq .sha
rtk gh api 'repos/intezya/agents/contents/skills/personas/system-architect/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/devops/containers/docker/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/devops/operations/incident-response/SKILL.md?ref=master' --jq .path
```

Expected: both remote SHA checks equal local `master`; each representative
path is returned from GitHub.

- [ ] **Step 5: Verify the removed Dockerfile paths are absent remotely**

Run:

```bash
rtk gh api 'repos/intezya/agents/contents/skills/devops/containers/dockerfile-generator?ref=master'
rtk gh api 'repos/intezya/agents/contents/skills/devops/containers/dockerfile-validator?ref=master'
```

Expected: both commands return HTTP `404 Not Found`, confirming the two
replacements were published.
