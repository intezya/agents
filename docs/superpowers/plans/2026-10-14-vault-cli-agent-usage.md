# Vault CLI Agent Usage Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. This task runs inline in the authorized contribution workflow.

**Goal:** Make the existing Vault skill guide agents through secure CLI secret retrieval.

**Architecture:** Add one focused reference to the existing skill and route to it from `SKILL.md` and `AGENTS.md`. Keep all VM runtime configuration outside this repository.

**Tech Stack:** Markdown, YAML frontmatter, Python standard-library example.

## Global Constraints

- No private credentials or VM-specific runtime configuration.
- Preserve existing Vault setup workflows and authorization boundaries.
- Work in an isolated branch from `master`; publish through a PR.

## Task 1: Document and verify CLI usage

**Files:**
- Modify: `AGENTS.md`
- Modify: `skills/devops/security/vault/SKILL.md`
- Create: `skills/devops/security/vault/references/agent-cli-usage.md`

- [ ] Add repository-wide preference for the installed official CLI and link to the skill.
- [ ] Add operational CLI routing before the existing infrastructure workflow; move existing nonstandard frontmatter fields under `metadata` for Codex validation.
- [ ] Document metadata commands, environment-specific SSO, protected token-helper IPC, and captured secret handoff through subprocess stdin.
- [ ] Run `python3 /home/intezya/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/devops/security/vault`; expect a valid skill.
- [ ] Compile and exercise the reference example with fake producer and consumer processes; assert exact delivery and no secret on stdout/stderr, including failure paths.
- [ ] Run `git diff --check`, review the staged diff, commit, push the task branch, create a PR against `master`, and register its URL with this thread.
