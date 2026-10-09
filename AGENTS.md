# Workflow

- Always use the `using-superpowers` skill at the start of every task, before responding or taking any action.
- Always use the `superpowers:brainstorming` skill for every task, before implementation.
- Use the `ask-questions-if-underspecified` skill before implementation whenever the request has multiple plausible interpretations or lacks essential requirements.

# Service Removal

- When removing a service, check its associated domains and DNS records at the provider (for example, Cloudflare). Delete records that are no longer used as part of the service removal, without requiring a separate reminder. Before deleting a record, verify that no other service needs it; afterwards, verify its absence at the provider. Removing a domain from Dokploy does not by itself remove the DNS record.

# Git Workflow

- Always use the `using-git-worktrees` skill to create and work in a dedicated Git worktree for every task. Never make task-related changes in the primary checkout.
- The primary/default branch of every repository must be named `master`.
- Name task branches using `<type>/<short-kebab-case-description>`, where `<type>` describes the change, such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`. Example: `feat/create-this-change`.
- If the repository uses a task tracker and the task has an issue key, include it in the branch name: `<type>/<ISSUE-KEY>-<short-kebab-case-description>`. Example: `fix/LP-123-correct-login-redirect`.
- If the repository uses a task tracker but the task has no issue key, ask the user whether a task should be created before creating the branch. Never create or assume an issue key without confirmation.
