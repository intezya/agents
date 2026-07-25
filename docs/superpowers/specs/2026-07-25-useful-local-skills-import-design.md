# Useful Local Skills Import Design

**Date:** 2026-07-25
**Status:** Approved in conversation, including the remote-baseline amendment
**Branch:** `feat/add-useful-local-skills`
**Task tracker:** No task will be created
**Remote baseline:** `c6d01529e9d68048d5dc537c65a8431c365802ad` with 165 skills

## Goal

Import the nine most useful locally managed skills into `intezya/agents`
without losing their supporting files, changing unrelated repository content,
or copying known broken references.

The import uses the exact locally installed directories as its source. This
matches the versions whose recent use was measured with `codex-skill-admin`.

## Scope

Import exactly these nine skills:

| Local source | Repository destination |
| --- | --- |
| `~/.codex/skills/lint-and-validate` | `skills/base/lint-and-validate` |
| `~/.codex/skills/devops-troubleshooter` | `skills/devops/operations/devops-troubleshooter` |
| `~/.codex/skills/network-debugging` | `skills/devops/infrastructure/network-debugging` |
| `~/.codex/skills/linear-task-workflow` | `skills/base/linear-task-workflow` |
| `~/.codex/skills/golang-pro` | `skills/developer/backend/go/golang-pro` |
| `~/.codex/skills/deep-research` | `skills/base/deep-research` |
| `~/.codex/skills/docs-architect` | `skills/developer/docs-architect` |
| `~/.codex/skills/agent-browser` | `skills/base/agent-browser` |
| `~/.codex/skills/find-skills` | `skills/base/find-skills` |

The expected repository total after import is 174 `SKILL.md` files: the
remote baseline's 165 plus these nine additions.

## Source Snapshot

Each digest is SHA-256 over all regular files below the source directory,
sorted by relative path. The digest input for each file is:

```text
relative_path + NUL + file_bytes + NUL
```

| Skill | Files | Source tree SHA-256 |
| --- | ---: | --- |
| `lint-and-validate` | 3 | `31643981b1f965ed007d90008b25a796a89e6037f24e3a11231e0bbe2c2f04d4` |
| `devops-troubleshooter` | 1 | `d9eea940c2277775abc6fdbc5f2b2767b5daa582d21c40d44ed5c0ad008d3320` |
| `network-debugging` | 7 | `54e9888b51abaf398c04c6dd8dad8a24f6f26451b4262d7db8d5d9ccfe14c066` |
| `linear-task-workflow` | 2 | `8e23ebc9ad2e358ffadd40705b8674a04a0d67659759dc9032482444ece4d072` |
| `golang-pro` | 1 | `a64c2dfbdd1fe06b8df12d8537defdf749bc833e09197d0d776707ca881e9b17` |
| `deep-research` | 21 | `86c390998095bc847f4b8a820eb099d815e8c700f7c60dacfacb246112c00806` |
| `docs-architect` | 1 | `32c2dcd73b54d4e35aece094698f52869c313f1860d8dfc23a9e4c37f6bbe388` |
| `agent-browser` | 11 | `68d4702e2443912a3a19ca29950d4d54052233effdf85606b6525f9c8856faf8` |
| `find-skills` | 1 | `0617d3c653db13816803517f321087f6991e26ff85ae5feb97d318b35aba4e99` |

Known upstream references:

- `deep-research` identifies
  `https://github.com/199-biotechnologies/claude-deep-research-skill.git`.
- `find-skills` is available from
  `https://github.com/vercel-labs/skills/tree/main/skills/find-skills`.
- The remaining imports use the approved local snapshots. Their upstream
  provenance is not asserted when it cannot be confirmed.

No license or provenance metadata will be invented.

## Content Policy

Copy every regular file in each selected source directory, including scripts,
references, templates, fixtures, requirements, agent metadata, and dotfiles.
Do not reduce a skill to only its `SKILL.md`.

The only semantic changes allowed are removing this dangling instruction from
both `devops-troubleshooter/SKILL.md` and `docs-architect/SKILL.md`:

```text
If detailed examples are required, open `resources/implementation-playbook.md`.
```

Neither local source contains that referenced file. Removing the instruction
makes both imported skills internally consistent without inventing content.

For imported Markdown files only:

- convert line endings to LF;
- remove trailing spaces and tabs;
- end each file with exactly one newline.

All other file bytes must match the approved local snapshot.

## Isolation and Change Boundaries

All changes happen in the dedicated worktree:

```text
/Users/kurumi/Projects/agents/.worktrees/feat-add-useful-local-skills
```

The remote `master` advanced after the initial design approval. Before the
import, fetch the remote, verify that `master` still points to the recorded
baseline, and rebase this feature branch onto it. If the remote advances
again, repeat the count, destination, and name-collision checks before
changing the expected total.

The primary checkout currently contains unrelated user-owned deletions under
`skills/devops/kubernetes/kubernetes-autoscaling`. Those deletions are outside
this task and must remain untouched.

The complete branch diff may contain only:

- additions below the nine approved destinations;
- the design and implementation-plan documents for this task.

No existing skill, repository instruction, or unrelated documentation may be
changed.

## Validation

### Source and Manifest

- Recompute every local source tree digest before copying.
- Confirm all nine destinations are absent before import.
- Compare each destination manifest with its source manifest.
- Compare file content exactly after applying only the documented Markdown
  normalization and two dangling-reference removals.
- Reject symlinks and unexpected files.

### Skill Structure

- Parse YAML frontmatter in every repository `SKILL.md`.
- Require non-empty string values for `name` and `description`.
- Require exactly 174 skills and 174 unique names.
- Verify every imported relative reference to a bundled file resolves.
- Confirm the two removed references no longer appear.

### Static Safety and Syntax

- Inspect imported scripts without executing their workflows.
- Scan imported files for embedded secrets, machine-specific credentials, and
  unexpected absolute paths.
- Parse Python scripts without generating bytecode.
- Run `bash -n` on imported shell scripts and shell templates.
- Parse imported YAML files.
- Do not install dependencies or execute networked research/browser workflows
  as part of validation.

### Git and Publication

- Run `git diff --cached --check`.
- Verify the staged path set is exactly the approved scope.
- Commit the import separately from the design document.
- Fast-forward local `master` only after the merged tree passes the same
  validation.
- Push `master` to `https://github.com/intezya/agents.git`.
- Verify local HEAD, `git ls-remote`, and the GitHub API report the same SHA.
- Verify the remote `SKILL.md` path for each of the nine skills.

## Failure Handling

- If a source digest changes before import, stop and review the changed local
  skill instead of silently copying a different version.
- If a destination already exists, stop and compare it rather than overwrite.
- If a new unresolved reference, duplicate name, secret candidate, syntax
  error, or unexpected file appears, stop and report it.
- If remote `master` advances, fetch and investigate; never force-push.
- If merged-result validation fails, preserve the feature worktree and branch
  for diagnosis.

## Success Criteria

The work is complete when:

1. exactly nine approved skills are present at the approved destinations;
2. all supporting files are retained;
3. only the two approved dangling instructions differ semantically from the
   local snapshots;
4. repository-wide skill validation reports 174 valid unique skills;
5. static reference, syntax, secret, manifest, and Git checks pass;
6. the primary checkout's unrelated deletions were never included;
7. GitHub `master` matches the verified local commit.

## Out of Scope

- Importing the remaining local-skill shortlist.
- Rewriting, merging, or deduplicating these nine skills.
- Repairing unrelated pre-existing missing references.
- Executing imported operational, browser, or research workflows.
- Changing local Codex skill enablement or installation state.
