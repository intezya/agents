# Git Workflow

- Use a dedicated Git worktree for every task. Never make task-related changes in the primary checkout.
- The primary/default branch of every repository must be named `master`.
- Name task branches using `<type>/<short-kebab-case-description>`, where `<type>` describes the change, such as `feat`, `fix`, `docs`, `refactor`, `test`, or `chore`. Example: `feat/create-this-change`.
- If the repository uses a task tracker and the task has an issue key, include it in the branch name: `<type>/<ISSUE-KEY>-<short-kebab-case-description>`. Example: `fix/LP-123-correct-login-redirect`.
- If the repository uses a task tracker but the task has no issue key, ask the user whether a task should be created before creating the branch. Never create or assume an issue key without confirmation.
