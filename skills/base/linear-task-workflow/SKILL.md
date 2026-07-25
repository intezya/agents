---
name: linear-task-workflow
description: Guide Codex through Linear-backed engineering tasks from issue intake to PR closeout. Use when working on a code task that has or needs a Linear issue key, when updating Linear issue ownership/status/comments, when opening or linking PRs from Linear issues, or when blocked/changing scope during issue work.
---

# Linear Task Workflow

## Core Rule

Treat the Linear issue as the task contract. Before editing code, confirm the issue key, read the issue, follow its scope and acceptance criteria, and keep Linear updated as the work moves.

If the repository has `AGENTS.md`, `CLAUDE.md`, or similar local instructions, read them before acting and let the repo-specific rules override this skill when they are stricter.

## Intake

1. Confirm the task has a Linear issue key, for example `PAR-123`.
2. If no issue key is provided, stop and ask for one before changing code.
3. Fetch the issue from Linear and identify:
   - title, status, assignee, team/project
   - description, acceptance criteria, linked PRs/branches
   - comments with decisions, blockers, or prior attempts
4. State the working assumption and the smallest plan needed to satisfy the issue.

## Start Work

Before code edits:

1. Assign the issue to yourself, unless the task explicitly names another responsible person.
2. Move the issue to the active work status, normally `In Progress`.
3. Add a short kickoff comment when the issue is ambiguous, risky, production-facing, or has stale context. Include the intended approach and first verification target.
4. Update the base branch before branching: run `git pull` on the repository default branch, usually `main` or `master`.
5. Create a dedicated branch or worktree for the issue.

Use branch names in this form:

```text
PAR-123-short-english-title
```

If the Linear title is not English, translate the meaning into a short English slug. Do not transliterate.

## Commits And PRs

Commit messages must start with the issue key and a space, with no colon after the key:

```text
PAR-123 update agent workflow instructions
```

Every code task should end with a pull request unless the user explicitly says not to. Never push task changes directly to `main` or `master`.

When opening a PR:

1. Put the issue key and issue title in the PR title.
2. Link the PR in Linear if auto-linking did not happen.
3. Comment on the Linear issue with the PR URL, commit hash or branch, and verification already run.
4. Move the issue to the review status if the workspace has one, otherwise leave it in the active status with a review-ready comment.

Do not merge until the user explicitly approves the merge, unless the issue/repo instructions clearly grant that permission.

## Required Linear Comments

Write a Linear comment whenever the task materially changes or the agent gets stuck. Do not keep important project state only in the chat.

Comment when:

- the codebase reality conflicts with the issue description
- acceptance criteria need to change
- scope is broadened, narrowed, split, or deferred
- a blocker appears, including missing access, failing unrelated tests, unclear product behavior, missing env/secrets, flaky infrastructure, or dependency/version drift
- a risky workaround is chosen
- implementation is paused or handed off
- the PR is ready for review
- the work is merged or closed

Good blocker comment shape:

```text
Blocked on <specific condition>.

Checked:
- <evidence or command/result>
- <evidence or command/result>

Impact: <what cannot proceed or what is at risk>.
Needed decision/access: <specific ask>.
Next step once unblocked: <one concrete action>.
```

Good scope-change comment shape:

```text
Found that <issue assumption> differs from current code/runtime: <evidence>.

Proposed scope update: <new scope>.
Not doing: <explicitly deferred work>.
Verification target: <how this will be proven>.
```

## Status Discipline

Use the actual statuses from the Linear workspace. Do not invent statuses if the workflow differs.

Typical transitions:

1. `Todo` or backlog -> `In Progress` when taking ownership.
2. `In Progress` -> `Blocked` when progress cannot continue without a decision, access, or external fix.
3. `Blocked` -> `In Progress` when unblocked.
4. `In Progress` -> `In Review` or equivalent after PR creation and Linear comment with verification.
5. Review status -> `Done` only after merge/closeout criteria are met.

If Linear access is unavailable or the MCP is not authenticated, say so clearly, continue only if safe, and provide the exact comment text and status changes that should be applied manually. Do not claim Linear was updated unless the update succeeded.

## Closeout

Before final response:

1. Verify the code with the narrowest meaningful checks for the issue.
2. Comment in Linear with:
   - PR URL
   - commit hash or branch
   - verification commands and results
   - remaining risks or intentionally deferred items
3. Move the issue to the correct final workflow state only when the repo and user rules allow it.
4. Report any Linear update that failed, including the manual comment/status text to apply.
