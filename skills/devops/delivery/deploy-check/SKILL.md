---
name: deploy-check
description: Check deployment readiness, record a baseline and rollback plan, and verify service health after a deployment. Use for preflight, rollback-readiness or post-deploy verification of a specific release; a check request does not authorize deployment or rollback.
---

# Deployment checks

Use the repository's deployment process and documented service checks. Distinguish
preflight, an explicitly authorized deployment and post-deployment verification.
Run only the phases the user requested; do not repeat a completed deployment just
to collect a baseline. Keep any previously granted deployment authorization.

## Resolve the release and environment

Identify the target service/environment, intended immutable revision or image
digest, current running version, deployment mechanism and affected dependencies.
Read the relevant runbook, CI configuration and migration instructions. Do not
assume Kubernetes, a particular CI provider, a health URL or a deployment command.
Use installed access helpers according to local instructions. Never expose secret
values in reports, shell arguments, logs or committed artifacts.

## Before deployment

- Confirm the intended artifact is available, required repository checks actually
  passed, and target credentials/access are usable. Report unavailable checks as
  unverified; a successful build alone does not establish release readiness.
- Record a timestamped baseline of the running version, instance/readiness state,
  error rate, latency, traffic, resource headroom and relevant dependency health.
  Use the existing SLOs and release thresholds. If they are absent, state that
  limitation; do not invent a numerical success criterion.
- Inspect configuration and schema changes, feature flags, jobs and external
  integrations. Identify required ordering and mixed-version compatibility.
- Avoid overlapping releases or migrations. Find the existing deployment lock or
  coordination mechanism; do not install a second one as part of a check.

## Make rollback reviewable

Record the previous immutable artifact, retained configuration, exact documented
rollback procedure, required access and the signals that would trigger it. Verify
that the artifact and required backups exist through metadata, not secret dumps.

Application rollback does not undo database migrations, emitted events, writes to
external services or deleted data. Identify irreversible operations and backward
compatibility explicitly. Do not recommend automatic rollback when old code cannot
read the new schema/data. Prefer the project's documented roll-forward or recovery
procedure in that case. Do not create a backup, restore data or test destructive
rollback on production merely to prove a plan.

A missing rollback path, failed mandatory check or incompatible migration blocks
a positive readiness verdict. Report the concrete blocker and the next action;
continue independent checks without deploying.

## After deployment

Verify the actual running digest/revision and rollout completion before judging
service behavior. Check the same indicators and observation points as the baseline,
including ingress/TLS, readiness, restarts, dependency errors and representative
user workflows. Prefer documented synthetic checks or test identities; write
transactions, notifications and purchases require authorization for those effects.

Compare with baseline and project thresholds over the documented observation
window. Account for warmup and traffic volume: an empty error log with no traffic
does not establish success. A rollout marked complete or a public HTTP 200 alone
does not establish application health. Report an incomplete observation window or
missing telemetry as unverified, rather than silently marking the release healthy.

On regression, preserve timestamps and evidence. Execute rollback only within
existing authorization and only if its safety conditions still hold; otherwise
present the concrete action for approval. Verify recovery using the same checks.

## Result

State the release/environment, phase and observation window, then give a verdict:
ready, blocked, healthy, regressed or unverified. List the observed evidence,
rollback readiness, limitations and next action. Clearly separate prepared actions
from actions actually executed. Keep live reports in the project's approved
operational location; never commit private diagnostic output into a skill library.
