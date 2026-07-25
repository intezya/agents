# Curated j4flmao Skill Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import 109 approved j4flmao skills, remove two replaced Dockerfile skills, validate the curated source manifests, and publish the result on `master`.

**Architecture:** Vendor 74 selected upstream directories in full and construct 35 backend functional slices from each entrypoint plus its directly named existing references. Preserve upstream content except trailing end-of-line whitespace, keep the known 80 unresolved-reference baseline, and reject all unapproved source paths.

**Tech Stack:** Git, GitHub CLI, Ruby standard library (`fileutils`, `yaml`), POSIX file utilities, Markdown.

## Global Constraints

- Work only in `/Users/kurumi/Projects/agents/.worktrees/feat-add-developer-skills` on branch `feat/add-engineering-skills` until integration.
- Prefix every shell command with `rtk`.
- Use upstream commit `1a3d5f4026cd30ca471f66df083cda44d4ddaa4e`.
- Copy 74 approved directories in full.
- For 35 backend skills, copy only `SKILL.md` plus existing `references/*.md` files directly named by that entrypoint.
- Preserve exactly 80 selected-entrypoint unresolved references.
- Remove only `skills/devops/containers/dockerfile-generator` and `skills/devops/containers/dockerfile-validator`.
- Do not execute any command embedded in imported documentation.
- Integrate only through `master` after static validation passes.

---

### Task 1: Verify the isolated baseline and pinned source

**Files:**
- Verify: repository worktree
- Create outside repository: `/tmp/agents-j4flmao-1a3d5f40`

**Interfaces:**
- Consumes: clean feature worktree and GitHub source.
- Produces: clean pinned upstream checkout.

- [ ] **Step 1: Verify the linked worktree**

Run:

```bash
rtk git status --short --branch
rtk git rev-parse --git-dir
rtk git rev-parse --git-common-dir
rtk git branch --show-current
```

Expected: clean `feat/add-engineering-skills`; Git dir differs from the common
dir.

- [ ] **Step 2: Run baseline static validation**

Run the repository-wide frontmatter validator from Task 5 before importing.

Expected: 49 valid skill frontmatters with unique names.

- [ ] **Step 3: Verify RED import preconditions**

Run:

```bash
rtk proxy ruby -e 'paths=%w[skills/design/accessibility skills/planning/create-prd skills/quality/unit-testing skills/devops/security/zero-trust skills/developer/backend/go/architecture skills/developer/backend/database-patterns skills/personas/system-architect]; missing=paths.reject{|path| File.file?(File.join(path,"SKILL.md"))}; abort "expected RED: missing #{missing.length}/#{paths.length}" unless missing.empty?'
```

Expected: nonzero exit with all seven representative destinations missing.

- [ ] **Step 4: Create or verify the pinned source checkout**

Run:

```bash
rtk git clone --filter=blob:none --no-checkout https://github.com/j4flmao/agent-skills.git /tmp/agents-j4flmao-1a3d5f40
rtk git -C /tmp/agents-j4flmao-1a3d5f40 checkout --detach 1a3d5f4026cd30ca471f66df083cda44d4ddaa4e
rtk git -C /tmp/agents-j4flmao-1a3d5f40 rev-parse HEAD
rtk git -C /tmp/agents-j4flmao-1a3d5f40 status --short --branch
```

Expected: exact pinned SHA and clean detached checkout.

---

### Task 2: Import the 74 full directories

**Files:**
- Create: approved design, developer workflow, DevOps, planning, quality, security, ecommerce, and persona directories
- Delete: two Dockerfile skill directories

**Interfaces:**
- Consumes: pinned checkout from Task 1.
- Produces: 74 complete source-directory copies.

- [ ] **Step 1: Remove only the approved Dockerfile skills**

Run:

```bash
rtk git rm -r skills/devops/containers/dockerfile-generator
rtk git rm -r skills/devops/containers/dockerfile-validator
```

Expected: only those two directories are staged as deletions.

- [ ] **Step 2: Copy the 38 original selections**

Use `FileUtils.cp_r` with this exact source-to-destination mapping:

```ruby
design = %w[accessibility brand-identity design-systems information-architecture motion-design prototyping ux-research visual-design]
devops = {
  "docker" => "skills/devops/containers/docker",
  "docker-patterns" => "skills/devops/containers/docker-patterns",
  "gitlab-ci" => "skills/devops/ci-cd/gitlab-ci",
  "argo-cd" => "skills/devops/delivery/argo-cd",
  "gitops" => "skills/devops/delivery/gitops",
  "gitops-advanced" => "skills/devops/delivery/gitops-advanced",
  "progressive-delivery" => "skills/devops/delivery/progressive-delivery",
  "helm-patterns" => "skills/devops/kubernetes/helm-patterns",
  "kubernetes" => "skills/devops/kubernetes/kubernetes",
  "kubernetes-patterns" => "skills/devops/kubernetes/kubernetes-patterns",
  "kubernetes-autoscaling" => "skills/devops/kubernetes/kubernetes-autoscaling",
  "kubernetes-for-data" => "skills/devops/kubernetes/kubernetes-for-data",
  "kubernetes-operators" => "skills/devops/kubernetes/kubernetes-operators",
  "longhorn" => "skills/devops/kubernetes/longhorn",
  "monitoring" => "skills/devops/observability/monitoring",
  "observability" => "skills/devops/observability/observability",
  "opentelemetry" => "skills/devops/observability/opentelemetry",
  "incident-response" => "skills/devops/operations/incident-response",
  "sre-practices" => "skills/devops/operations/sre-practices",
  "network-infrastructure" => "skills/devops/infrastructure/network-infrastructure",
  "policy-as-code" => "skills/devops/security/policy-as-code",
  "vault" => "skills/devops/security/vault"
}
```

Also copy:

```text
skills/dev-loop/readme-writer -> skills/developer/readme-writer
skills/dev-loop/security-auditor -> skills/developer/security-auditor
skills/ecommerce/payment-processing -> skills/ecommerce/payment-processing
skills/personas/{system-architect,security-engineer,devops-sre-engineer,backend-engineer,ai-architect} -> skills/personas/*
```

Expected: 38 destination `SKILL.md` files exist.

- [ ] **Step 3: Copy planning and quality**

Copy these source directories to the same repository-relative destinations:

```text
skills/planning/{bdd-atdd,bpmn-modeling,cost-benefit,create-brief,create-prd,create-roadmap,create-story,market-analysis,solution-architecture}
skills/quality/{acceptance-testing,contract-testing,e2e-testing,exploratory-testing,integration-testing,load-testing,property-based-testing,regression-testing,smoke-testing,unit-testing,visual-testing}
```

Expected: 20 additional destination `SKILL.md` files exist.

- [ ] **Step 4: Copy the 16 approved security directories**

Copy:

```text
skills/security/{abac,api-security,container-security,cspm,data-security,edr-xdr,iam-governance,rbac,sast-dast,sbom,secrets-management,siem-engineering,soar-automation,soc-operations,threat-intelligence,zero-trust}
```

into matching directory names under `skills/devops/security`.

Expected: 16 additional destination `SKILL.md` files exist; total full imports
is 74.

---

### Task 3: Import 35 backend functional slices

**Files:**
- Create: `skills/developer/backend/**`

**Interfaces:**
- Consumes: selected backend entrypoints from the pinned source.
- Produces: each exact entrypoint plus only directly named existing references.

- [ ] **Step 1: Define the exact backend source map**

Use:

```ruby
mapping = {
  "skills/backend/go/architecture" => "skills/developer/backend/go/architecture",
  "skills/backend/go/patterns" => "skills/developer/backend/go/patterns",
  "skills/backend/transactional-email" => "skills/developer/backend/transactional-email",
  "skills/backend/universal/api/graphql-federation" => "skills/developer/backend/graphql-federation",
  "skills/backend/universal/api/product-management" => "skills/developer/backend/api-product-management"
}

%w[
  api-gateway api-versioning audit-logging auth-patterns background-jobs
  bff-pattern caching clean-architecture database-patterns
  distributed-locking event-driven event-sourcing feature-flags file-storage
  graphql-patterns grpc-patterns idempotency internationalization
  message-queue microservices multi-tenancy openapi-documentation
  plugin-architecture resilience-patterns scheduling-cron search-patterns
  structured-logging transactional-outbox webhooks websocket-patterns
].each do |name|
  mapping["skills/backend/universal/#{name}"] =
    "skills/developer/backend/#{name}"
end
```

Expected: `mapping.length == 35`.

- [ ] **Step 2: Copy each backend functional slice**

For every mapping pair:

1. Copy the source `SKILL.md` to the destination.
2. Scan unique `references/[A-Za-z0-9._/-]+.md` targets.
3. Copy every existing target while preserving its path below the destination.
4. Record every absent source target.

Expected: 35 `SKILL.md` files, 318 copied files, and exactly three absent
targets:

```text
audit-logging: references/audit-log-fundamentals.md
audit-logging: references/audit-log-advanced.md
database-patterns: references/transaction-isolation.md
```

- [ ] **Step 3: Reject unreferenced backend files**

Recalculate the expected backend manifest from each source entrypoint and
compare it to the destination manifest.

Expected: no extra backend destination file, including no files from
`skills/backend/references`.

---

### Task 4: Normalize and verify source parity

**Files:**
- Modify mechanically: newly imported Markdown files with trailing whitespace

**Interfaces:**
- Consumes: 109 imported skills.
- Produces: whitespace-clean files with verified source provenance.

- [ ] **Step 1: Normalize only new Markdown files**

Run trailing-whitespace normalization only over untracked imported Markdown
files.

Expected: no pre-existing tracked file is modified.

- [ ] **Step 2: Verify the 74 complete directory manifests**

For each full-directory mapping, compare the relative file list and each file
against upstream, allowing only end-of-line trailing whitespace differences.

Expected: 74 exact manifests and zero substantive content differences.

- [ ] **Step 3: Verify the 35 backend manifests**

Rebuild each expected functional slice from the pinned source and compare
relative paths and content, allowing only end-of-line trailing whitespace.

Expected: 35 exact functional-slice manifests and the same three absent source
targets.

---

### Task 5: Run repository-wide static validation

**Files:**
- Verify: `skills/**/SKILL.md`
- Verify: the complete feature-branch diff

**Interfaces:**
- Consumes: verified imports.
- Produces: evidence for discoverability, scope, and source fidelity.

- [ ] **Step 1: Assert exact selected destinations**

Check the full mapping from Tasks 2 and 3.

Expected: 109 selected destination `SKILL.md` files exist.

- [ ] **Step 2: Validate frontmatter and name uniqueness**

Run:

```bash
rtk proxy ruby -ryaml -e 'files=Dir["skills/**/SKILL.md"].sort; names={}; files.each do |file|; text=File.read(file); parts=text.split(/^---\s*$\n?/,3); abort "#{file}: missing frontmatter" unless parts.length==3 && parts.first.empty?; data=YAML.safe_load(parts[1], aliases:false); abort "#{file}: frontmatter is not a map" unless data.is_a?(Hash); %w[name description].each{|key| abort "#{file}: missing #{key}" unless data[key].is_a?(String) && !data[key].strip.empty?}; (names[data["name"]]||=[]) << file; end; duplicates=names.select{|_,paths| paths.length>1}; abort "duplicate skill names: #{duplicates}" unless duplicates.empty?; abort "expected 156 skills, got #{files.length}" unless files.length==156; puts "156 valid skill frontmatters; names unique"'
```

Expected: `156 valid skill frontmatters; names unique`.

- [ ] **Step 3: Validate unresolved references**

Scan only the 109 selected entrypoints for local `references/*.md` links.

Expected: exactly 80 unresolved targets, matching the pinned source selection.

- [ ] **Step 4: Validate replacement and exclusion scope**

Expected:

- Both Dockerfile skill directories are absent.
- Existing security incident response, container hardening, GitLab CI
  generator/validator, and Helm generator/validator remain.
- No rejected backend, prompt-engineering, site-reliability-engineering, or
  system-design destination exists.

- [ ] **Step 5: Validate the complete diff**

Run:

```bash
rtk git add docs skills
rtk git diff --cached --check
rtk git diff --cached --name-status
rtk git status --short --branch
```

Expected: only approved docs, imports, and the two Dockerfile removals.

- [ ] **Step 6: Commit**

Run:

```bash
rtk git commit -m "feat: import curated engineering skills"
```

Expected: clean feature worktree after commit.

---

### Task 6: Integrate, publish, and verify

**Files:**
- Integrate: `feat/add-engineering-skills` into `master`
- Publish: `intezya/agents` branch `master`

**Interfaces:**
- Consumes: clean validated feature branch.
- Produces: remote `master` at the verified local commit.

- [ ] **Step 1: Use `finishing-a-development-branch`**

Re-run the complete validation suite before integration.

- [ ] **Step 2: Verify integration preconditions**

From the primary checkout:

```bash
rtk git status --short --branch
rtk git fetch origin master
rtk git merge-base --is-ancestor origin/master feat/add-engineering-skills
```

Expected: clean `master`; remote master is an ancestor of the feature branch.

- [ ] **Step 3: Fast-forward and push**

Run:

```bash
rtk git merge --ff-only feat/add-engineering-skills
rtk git push origin master
```

If SSH returns the known port `65535` transport failure, use:

```bash
rtk git push https://github.com/intezya/agents.git master:master
```

- [ ] **Step 4: Verify the published SHA and paths**

Run:

```bash
rtk git ls-remote https://github.com/intezya/agents.git refs/heads/master
rtk gh api repos/intezya/agents/commits/master --jq .sha
rtk gh api 'repos/intezya/agents/contents/skills/developer/backend/database-patterns/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/developer/backend/audit-logging/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/planning/create-prd/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/devops/containers/docker/SKILL.md?ref=master' --jq .path
```

Expected: remote SHA equals local `master`; all representative paths resolve.

- [ ] **Step 5: Verify removed paths**

Both remote Dockerfile directory requests must return `404 Not Found`.
