# SRE Workflow Skills Implementation Plan

> **For agentic workers:** Execute inline within the user's authorized creation,
> installation and contribution request.

**Goal:** Install and publish incident-triage, deploy-check and sso-debug.

**Architecture:** Three independent Markdown workflows with generated Codex
metadata, using existing project runbooks and locally documented access helpers.

**Tech Stack:** Markdown, YAML and the installed skill-creator validation tools.

## Global Constraints

- Keep credentials, environment bindings and live diagnostic output outside Git.
- Preserve existing authorization; checks do not authorize infrastructure changes.
- Use the isolated `feat/sre-workflow-skills` worktree; target `master` by PR.

## Tasks

- [x] Write the three `SKILL.md` entrypoints at the paths in the design spec.
- [x] Generate `agents/openai.yaml` with the skill-creator generator for each.
- [x] Run `quick_validate.py` on each skill and `git diff --check`.
- [x] Review scenarios for monitoring failure, TLS failure, migration rollback,
  SSO redirect mismatch, effective roles and expired helper credentials.
- [x] Copy only the three validated skill directories to `~/.codex/skills` and
  compare installed contents with their repository sources.
- [ ] Commit, push, create a PR against `master`, and register it with this thread.

## Validation evidence

- All three entrypoints passed `skill-creator/scripts/quick_validate.py`.
- Metadata inspection confirmed matching names, explicit skill prompts, permitted
  description lengths, automatic discovery and no VM-specific environment bindings.
- Independent simulated review covered six cases: monitoring access failure, a
  public 200 with broken checkout, an incompatible schema rollback, no baseline or
  traffic, missing role claims, and a request outside the approved realm.
- Review identified a self-profile verification ambiguity. Updated `sso-debug` so
  self-profile proves identity/session only; recovery of an authorization failure
  requires the originally failing protected operation.
- These checks validate instruction behavior in simulated cases, not live service
  access, actual deployment or successful production authentication.
