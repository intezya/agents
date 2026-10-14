# Agent Rules and Skills Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline for this authorized contribution.

**Goal:** Share established user rules and portable access/design/text skills in PR 5.

**Architecture:** Preserve local skill snapshots; add a focused delegated-access entrypoint with mode references. Discover environment bindings locally.

**Tech Stack:** Markdown/YAML, existing Python scanner and Node contract scripts.

## Global Constraints

- No credentials, browser profiles, identity files or live access changes.
- Keep existing workflow and Vault rules; do not duplicate the existing browser skill.
- Preserve installed skill sources except whitespace normalization required by diff checks.

## Task 1: Import and route

- [x] Copy `design-system` to `skills/design/design-system` and `humanizer-ru` to `skills/ru-writing/humanizer-ru`; update `skills/ru-writing/ru-text` from installed sources without caches.
- [x] Copy user context and UI/text rules into `AGENTS.md`; add delegated-access routing.
- [x] Create `skills/devops/security/delegated-access/SKILL.md` and mode references for Keycloak, browser SSO, Teleport and a local profile template.

## Task 2: Validate and publish

- [x] Run the Codex skill validator on the four imported/new skills; check local reference files.
- [x] Compare imported snapshots, compile Python and syntax-check Node scripts; exercise the Russian scanner and contract/index scripts with temporary fixtures.
- [x] Run `git diff --check`, review staged files, commit and push `docs/vault-cli-agent-usage`.
- [x] Update PR 5's title/body and verify that it is linked to this thread.
