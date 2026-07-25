# Useful Local Skills Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import nine approved local Codex skills with all supporting files, preserve source fidelity except for two approved dangling-reference removals and Markdown normalization, and publish the validated result to `intezya/agents` `master`.

**Architecture:** Rebase the isolated feature branch onto the pinned remote baseline, verify immutable local source snapshots, then vendor each complete skill directory into its approved category. Validate manifests and transformed bytes against the sources, run repository-wide and static checks without executing imported workflows, commit the import separately, fast-forward local `master`, and verify the GitHub publication.

**Tech Stack:** Git, GitHub CLI, Ruby standard library (`digest`, `fileutils`, `yaml`), Python standard library (`ast`), Bash parser, Markdown.

## Global Constraints

- Work only in `/Users/kurumi/Projects/agents/.worktrees/feat-add-useful-local-skills` on branch `feat/add-useful-local-skills` until integration.
- Prefix every shell command with `rtk`.
- Use remote baseline `c6d01529e9d68048d5dc537c65a8431c365802ad`, which contains 165 valid, uniquely named skills.
- Stop if remote `master` advances; repeat the skill count, destination, and name-collision checks before changing the expected total.
- Import exactly nine complete local directories from `/Users/kurumi/.codex/skills`.
- Expect 48 imported regular files and 174 repository `SKILL.md` files after import.
- Reject every symlink, changed source digest, occupied destination, duplicate skill name, unresolved bundled-file reference, unexpected file, secret candidate, machine-specific credential path, or syntax failure.
- Normalize imported Markdown only: LF line endings, no trailing spaces or tabs, and exactly one final newline.
- Remove spaces and tabs from exactly 53 otherwise blank lines in `skills/base/lint-and-validate/scripts/lint_runner.py` and `skills/base/lint-and-validate/scripts/type_coverage.py`.
- Remove only the dangling `resources/implementation-playbook.md` instruction from `devops-troubleshooter/SKILL.md` and `docs-architect/SKILL.md`.
- Preserve every other imported file byte-for-byte.
- Do not invent license or provenance metadata; the approved design remains the provenance record.
- Do not change any existing skill, repository instruction, or unrelated documentation.
- Do not include the primary checkout's 16 user-owned deletions below `skills/devops/kubernetes/kubernetes-autoscaling`.
- Do not install dependencies or execute imported research, browser, lint, network, or operational workflows.
- Never force-push.

The Python blank-line normalization was approved during Task 4 after raw Git
reported diagnostics that RTK had hidden while preserving the nonzero exit
code. The existing local import commit is followed by a dedicated normalization
commit so the final branch tree satisfies this plan.

## File Structure

The design and this plan remain as separately committed provenance:

- `docs/superpowers/specs/2026-07-25-useful-local-skills-import-design.md`
- `docs/superpowers/plans/2026-07-25-useful-local-skills-import.md`

Create these exact skill files:

- `skills/base/lint-and-validate/`
  - `SKILL.md`
  - `scripts/lint_runner.py`
  - `scripts/type_coverage.py`
- `skills/devops/operations/devops-troubleshooter/`
  - `SKILL.md`
- `skills/devops/infrastructure/network-debugging/`
  - `SKILL.md`
  - `references/browser-network-tools.md`
  - `references/checklist.md`
  - `references/common-network-issues.md`
  - `references/debugging-tools-techniques.md`
  - `scripts/validate-api.sh`
  - `templates/api-scaffold.yaml`
- `skills/base/linear-task-workflow/`
  - `SKILL.md`
  - `agents/openai.yaml`
- `skills/developer/backend/go/golang-pro/`
  - `SKILL.md`
- `skills/base/deep-research/`
  - `.gitignore`
  - `README.md`
  - `SKILL.md`
  - `reference/continuation.md`
  - `reference/html-generation.md`
  - `reference/methodology.md`
  - `reference/quality-gates.md`
  - `reference/report-assembly.md`
  - `reference/weasyprint_guidelines.md`
  - `requirements.txt`
  - `scripts/citation_manager.py`
  - `scripts/md_to_html.py`
  - `scripts/research_engine.py`
  - `scripts/source_evaluator.py`
  - `scripts/validate_report.py`
  - `scripts/verify_citations.py`
  - `scripts/verify_html.py`
  - `templates/mckinsey_report_template.html`
  - `templates/report_template.md`
  - `tests/fixtures/invalid_report.md`
  - `tests/fixtures/valid_report.md`
- `skills/developer/docs-architect/`
  - `SKILL.md`
- `skills/base/agent-browser/`
  - `SKILL.md`
  - `references/authentication.md`
  - `references/commands.md`
  - `references/profiling.md`
  - `references/proxy-support.md`
  - `references/session-management.md`
  - `references/snapshot-refs.md`
  - `references/video-recording.md`
  - `templates/authenticated-session.sh`
  - `templates/capture-workflow.sh`
  - `templates/form-automation.sh`
- `skills/base/find-skills/`
  - `SKILL.md`

---

### Task 1: Rebase onto and validate the pinned baseline

**Files:**
- Verify: `/Users/kurumi/Projects/agents/.worktrees/feat-add-useful-local-skills`
- Verify: `/Users/kurumi/Projects/agents`
- Verify: `skills/**/SKILL.md`

**Interfaces:**
- Consumes: the committed design, committed implementation plan, local feature branch, and remote `master`.
- Produces: a clean feature branch based directly on the approved 165-skill baseline.

- [ ] **Step 1: Verify the linked worktree**

Run:

```bash
rtk git status --short --branch
rtk git branch --show-current
rtk git rev-parse --git-dir
rtk git rev-parse --git-common-dir
```

Expected: clean `feat/add-useful-local-skills`; the worktree Git directory
differs from the common Git directory.

- [ ] **Step 2: Fetch and pin remote `master`**

Run:

```bash
rtk git fetch origin master
rtk git rev-parse origin/master
rtk git ls-remote https://github.com/intezya/agents.git refs/heads/master
```

Expected: both remote checks report
`c6d01529e9d68048d5dc537c65a8431c365802ad`. Stop if either value differs.

- [ ] **Step 3: Rebase the documentation commits**

Run:

```bash
rtk git rebase origin/master
rtk git merge-base --is-ancestor origin/master HEAD
rtk git diff --name-only origin/master...HEAD
rtk git status --short --branch
```

Expected: the rebase succeeds; the diff contains only the design and plan
documents; the worktree is clean.

- [ ] **Step 4: Validate the 165-skill baseline**

Run:

```bash
rtk proxy ruby -ryaml -e '
files = Dir["skills/**/SKILL.md"].sort
names = {}
files.each do |file|
  text = File.read(file)
  parts = text.split(/^---\s*$\n?/, 3)
  abort "#{file}: missing frontmatter" unless parts.length == 3 && parts.first.empty?
  data = YAML.safe_load(parts[1], aliases: false)
  abort "#{file}: frontmatter is not a map" unless data.is_a?(Hash)
  %w[name description].each do |key|
    abort "#{file}: missing #{key}" unless data[key].is_a?(String) && !data[key].strip.empty?
  end
  (names[data["name"]] ||= []) << file
end
duplicates = names.select { |_, paths| paths.length > 1 }
abort "duplicate skill names: #{duplicates}" unless duplicates.empty?
abort "expected 165 skills, got #{files.length}" unless files.length == 165
puts "165 valid skill frontmatters; names unique"
'
```

Expected: `165 valid skill frontmatters; names unique`.

- [ ] **Step 5: Verify all destinations and names are free**

Run:

```bash
rtk proxy ruby -ryaml -e '
mapping = {
  "lint-and-validate" => "skills/base/lint-and-validate",
  "devops-troubleshooter" => "skills/devops/operations/devops-troubleshooter",
  "network-debugging" => "skills/devops/infrastructure/network-debugging",
  "linear-task-workflow" => "skills/base/linear-task-workflow",
  "golang-pro" => "skills/developer/backend/go/golang-pro",
  "deep-research" => "skills/base/deep-research",
  "docs-architect" => "skills/developer/docs-architect",
  "agent-browser" => "skills/base/agent-browser",
  "find-skills" => "skills/base/find-skills"
}
occupied = mapping.values.select { |path| File.exist?(path) }
abort "occupied destinations: #{occupied}" unless occupied.empty?
repo_names = Dir["skills/**/SKILL.md"].to_h do |file|
  parts = File.read(file).split(/^---\s*$\n?/, 3)
  data = YAML.safe_load(parts[1], aliases: false)
  [data["name"], file]
end
collisions = mapping.keys.select { |name| repo_names.key?(name) }
abort "skill-name collisions: #{collisions}" unless collisions.empty?
puts "9 destinations absent; 9 skill names free"
'
```

Expected: `9 destinations absent; 9 skill names free`.

- [ ] **Step 6: Record the primary checkout boundary**

Run:

```bash
rtk proxy ruby -e '
root = "/Users/kurumi/Projects/agents"
lines = IO.popen(["git", "-C", root, "status", "--porcelain=v1"], &:read).lines.map(&:chomp)
prefix = " D skills/devops/kubernetes/kubernetes-autoscaling/"
abort "primary checkout changed unexpectedly: #{lines}" unless lines.length == 16 && lines.all? { |line| line.start_with?(prefix) }
puts "primary checkout retains exactly 16 scoped user deletions"
'
```

Expected: `primary checkout retains exactly 16 scoped user deletions`. Do not
stage, restore, or otherwise modify them.

---

### Task 2: Verify and import the nine immutable source snapshots

**Files:**
- Read: `/Users/kurumi/.codex/skills/{lint-and-validate,devops-troubleshooter,network-debugging,linear-task-workflow,golang-pro,deep-research,docs-architect,agent-browser,find-skills}/**`
- Create: the 48 files listed in **File Structure**

**Interfaces:**
- Consumes: nine absent destinations and the approved local source digests.
- Produces: nine complete imported directories with only the approved transformations.

- [ ] **Step 1: Recompute source manifests and SHA-256 digests**

Run:

```bash
rtk proxy ruby -rdigest -e '
expected = {
  "lint-and-validate" => [3, "31643981b1f965ed007d90008b25a796a89e6037f24e3a11231e0bbe2c2f04d4"],
  "devops-troubleshooter" => [1, "d9eea940c2277775abc6fdbc5f2b2767b5daa582d21c40d44ed5c0ad008d3320"],
  "network-debugging" => [7, "54e9888b51abaf398c04c6dd8dad8a24f6f26451b4262d7db8d5d9ccfe14c066"],
  "linear-task-workflow" => [2, "8e23ebc9ad2e358ffadd40705b8674a04a0d67659759dc9032482444ece4d072"],
  "golang-pro" => [1, "a64c2dfbdd1fe06b8df12d8537defdf749bc833e09197d0d776707ca881e9b17"],
  "deep-research" => [21, "86c390998095bc847f4b8a820eb099d815e8c700f7c60dacfacb246112c00806"],
  "docs-architect" => [1, "32c2dcd73b54d4e35aece094698f52869c313f1860d8dfc23a9e4c37f6bbe388"],
  "agent-browser" => [11, "68d4702e2443912a3a19ca29950d4d54052233effdf85606b6525f9c8856faf8"],
  "find-skills" => [1, "0617d3c653db13816803517f321087f6991e26ff85ae5feb97d318b35aba4e99"]
}
expected.each do |name, (count, wanted_digest)|
  root = File.join(Dir.home, ".codex/skills", name)
  entries = Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH)
    .reject { |path| %w[. ..].include?(File.basename(path)) }
  links = entries.select { |path| File.symlink?(path) }
  abort "#{name}: symlinks #{links}" unless links.empty?
  files = entries.select { |path| File.file?(path) }
    .sort_by { |path| path.delete_prefix(root + "/") }
  digest = Digest::SHA256.new
  files.each do |path|
    relative = path.delete_prefix(root + "/")
    digest.update(relative)
    digest.update("\0")
    digest.update(File.binread(path))
    digest.update("\0")
  end
  abort "#{name}: expected #{count} files, got #{files.length}" unless files.length == count
  abort "#{name}: digest #{digest.hexdigest} != #{wanted_digest}" unless digest.hexdigest == wanted_digest
  puts "#{name}: #{files.length} files #{digest.hexdigest}"
end
'
```

Expected: all nine file counts and digests exactly match the design. Any
difference stops the import.

- [ ] **Step 2: Run the RED destination precondition**

Run:

```bash
rtk proxy ruby -e '
paths = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
missing = paths.reject { |path| File.exist?(path) }
abort "expected RED: all 9 destinations are absent" if missing.length == paths.length
abort "partial destination collision: #{paths - missing}"
'
```

Expected: nonzero exit with `expected RED: all 9 destinations are absent`.

- [ ] **Step 3: Copy the complete source directories**

Run:

```bash
rtk proxy ruby -rfileutils -e '
mapping = {
  "lint-and-validate" => "skills/base/lint-and-validate",
  "devops-troubleshooter" => "skills/devops/operations/devops-troubleshooter",
  "network-debugging" => "skills/devops/infrastructure/network-debugging",
  "linear-task-workflow" => "skills/base/linear-task-workflow",
  "golang-pro" => "skills/developer/backend/go/golang-pro",
  "deep-research" => "skills/base/deep-research",
  "docs-architect" => "skills/developer/docs-architect",
  "agent-browser" => "skills/base/agent-browser",
  "find-skills" => "skills/base/find-skills"
}
mapping.each do |name, destination|
  source = File.join(Dir.home, ".codex/skills", name)
  abort "#{destination}: destination exists" if File.exist?(destination)
  FileUtils.mkdir_p(File.dirname(destination))
  FileUtils.cp_r(source, destination, preserve: true)
end
puts "copied 9 complete skill directories"
'
```

Expected: `copied 9 complete skill directories`.

- [ ] **Step 4: Normalize only the approved imported text**

Run:

```bash
rtk proxy ruby -e '
destinations = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
markdown = destinations.flat_map do |root|
  Dir.glob(File.join(root, "**", "*.md"), File::FNM_DOTMATCH)
end.sort
markdown.each do |path|
  text = File.binread(path).force_encoding(Encoding::UTF_8)
  abort "#{path}: invalid UTF-8" unless text.valid_encoding?
  lines = text.gsub(/\r\n?/, "\n").split("\n", -1)
    .map { |line| line.sub(/[ \t]+\z/, "") }
  lines.pop while lines.last == ""
  File.binwrite(path, lines.join("\n") + "\n")
end
abort "expected 30 Markdown files, got #{markdown.length}" unless markdown.length == 30
puts "normalized 30 imported Markdown files"
'
```

Expected: `normalized 30 imported Markdown files`.

Then run:

```bash
rtk proxy ruby -e '
paths = %w[
  skills/base/lint-and-validate/scripts/lint_runner.py
  skills/base/lint-and-validate/scripts/type_coverage.py
]
changed = 0
paths.each do |path|
  text = File.binread(path)
  count = text.scan(/^[ \t]+(?=\r?$)/).length
  changed += count
  File.binwrite(path, text.gsub(/^[ \t]+(?=\r?$)/, ""))
end
abort "expected 53 normalized blank lines, got #{changed}" unless changed == 53
puts "normalized 53 Python blank lines"
'
```

Expected: `normalized 53 Python blank lines`.

- [ ] **Step 5: Remove the two approved dangling instructions**

Run:

```bash
rtk proxy ruby -e '
targets = %w[
  skills/devops/operations/devops-troubleshooter/SKILL.md
  skills/developer/docs-architect/SKILL.md
]
needle = "- If detailed examples are required, open `resources/implementation-playbook.md`.\n"
targets.each do |path|
  text = File.binread(path)
  count = text.scan(needle).length
  abort "#{path}: expected one dangling instruction, got #{count}" unless count == 1
  File.binwrite(path, text.sub(needle, ""))
end
puts "removed exactly 2 approved dangling instructions"
'
```

Expected: `removed exactly 2 approved dangling instructions`.

- [ ] **Step 6: Run the GREEN import check**

Run:

```bash
rtk proxy ruby -e '
roots = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
files = roots.flat_map do |root|
  Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH)
    .reject { |path| %w[. ..].include?(File.basename(path)) }
    .select { |path| File.file?(path) }
end
links = roots.flat_map do |root|
  Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH)
    .select { |path| File.symlink?(path) }
end
abort "unexpected symlinks: #{links}" unless links.empty?
abort "expected 48 imported files, got #{files.length}" unless files.length == 48
abort "expected 9 entrypoints" unless roots.all? { |root| File.file?(File.join(root, "SKILL.md")) }
puts "GREEN: 48 regular files; 9 entrypoints; 0 symlinks"
'
```

Expected: `GREEN: 48 regular files; 9 entrypoints; 0 symlinks`.

---

### Task 3: Prove transformed source parity and bundled-file integrity

**Files:**
- Verify: all 48 imported files
- Verify: all Markdown links and bundled relative file references in imported Markdown

**Interfaces:**
- Consumes: the imported directories and immutable local sources.
- Produces: byte-level evidence that no undocumented transformation occurred.

- [ ] **Step 1: Compare every destination manifest and file**

Run:

```bash
rtk proxy ruby -e '
mapping = {
  "lint-and-validate" => "skills/base/lint-and-validate",
  "devops-troubleshooter" => "skills/devops/operations/devops-troubleshooter",
  "network-debugging" => "skills/devops/infrastructure/network-debugging",
  "linear-task-workflow" => "skills/base/linear-task-workflow",
  "golang-pro" => "skills/developer/backend/go/golang-pro",
  "deep-research" => "skills/base/deep-research",
  "docs-architect" => "skills/developer/docs-architect",
  "agent-browser" => "skills/base/agent-browser",
  "find-skills" => "skills/base/find-skills"
}
transformed_entrypoints = %w[devops-troubleshooter docs-architect]
normalized_python = %w[scripts/lint_runner.py scripts/type_coverage.py]
needle = "- If detailed examples are required, open `resources/implementation-playbook.md`.\n"
list_files = lambda do |root|
  entries = Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH)
    .reject { |path| %w[. ..].include?(File.basename(path)) }
  links = entries.select { |path| File.symlink?(path) }
  abort "#{root}: symlinks #{links}" unless links.empty?
  entries.select { |path| File.file?(path) }
    .map { |path| path.delete_prefix(root + "/") }.sort
end
normalize_markdown = lambda do |bytes, label|
  text = bytes.force_encoding(Encoding::UTF_8)
  abort "#{label}: invalid UTF-8" unless text.valid_encoding?
  lines = text.gsub(/\r\n?/, "\n").split("\n", -1)
    .map { |line| line.sub(/[ \t]+\z/, "") }
  lines.pop while lines.last == ""
  (lines.join("\n") + "\n").b
end
checked = 0
mapping.each do |name, destination|
  source = File.join(Dir.home, ".codex/skills", name)
  source_manifest = list_files.call(source)
  destination_manifest = list_files.call(destination)
  abort "#{name}: manifest mismatch" unless destination_manifest == source_manifest
  source_manifest.each do |relative|
    expected = File.binread(File.join(source, relative))
    expected = normalize_markdown.call(expected, "#{name}/#{relative}") if relative.end_with?(".md")
    expected = expected.gsub(/^[ \t]+(?=\r?$)/, "") if name == "lint-and-validate" && normalized_python.include?(relative)
    if transformed_entrypoints.include?(name) && relative == "SKILL.md"
      count = expected.scan(needle).length
      abort "#{name}: expected one source instruction, got #{count}" unless count == 1
      expected = expected.sub(needle, "")
    end
    actual = File.binread(File.join(destination, relative))
    abort "#{name}/#{relative}: content mismatch" unless actual == expected
    checked += 1
  end
end
abort "expected 48 compared files, got #{checked}" unless checked == 48
puts "48 imported files match transformed source bytes"
'
```

Expected: `48 imported files match transformed source bytes`.

- [ ] **Step 2: Resolve Markdown links**

Run:

```bash
rtk proxy ruby -e '
roots = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
missing = []
roots.each do |root|
  Dir.glob(File.join(root, "**", "*.md")).sort.each do |file|
    text = File.read(file)
    text.scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each do |raw|
      target = raw.strip.sub(/\A</, "").sub(/>\z/, "")
        .split(/[ \t]+["\x27]/, 2).first
      next if target.empty? || target.start_with?("#", "/", "~")
      next if target.match?(/\A[a-z][a-z0-9+.-]*:/i)
      path = target.split("#", 2).first
      next if path.empty?
      resolved = File.expand_path(path, File.dirname(file))
      missing << "#{file}: #{target}" unless File.exist?(resolved)
    end
  end
end
abort "unresolved Markdown links:\n#{missing.join("\n")}" unless missing.empty?
puts "0 unresolved imported Markdown links"
'
```

Expected: `0 unresolved imported Markdown links`.

- [ ] **Step 3: Resolve explicit bundled-file references**

Run:

```bash
rtk proxy ruby -e '
roots = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
pattern = %r{(?:\./)?(?:agents|reference|references|resources|scripts|templates)/[A-Za-z0-9._/-]+\.(?:md|py|sh|ya?ml|html)}
missing = []
roots.each do |root|
  Dir.glob(File.join(root, "**", "*.md")).sort.each do |file|
    File.read(file).scan(pattern).uniq.each do |target|
      relative = target.sub(%r{\A\./}, "")
      candidates = [
        File.expand_path(target, File.dirname(file)),
        File.join(root, relative)
      ]
      missing << "#{file}: #{target}" unless candidates.any? { |path| File.file?(path) }
    end
  end
end
abort "unresolved bundled references:\n#{missing.join("\n")}" unless missing.empty?
puts "0 unresolved explicit bundled-file references"
'
```

Expected: `0 unresolved explicit bundled-file references`, proving both removed
`resources/implementation-playbook.md` references are gone.

---

### Task 4: Run static validation and commit the import

**Files:**
- Verify: imported Python, Bash, YAML, Markdown, HTML, text, and dotfiles
- Stage: only the 48 imported files
- Commit: `feat: import useful local skills`

**Interfaces:**
- Consumes: source-parity-verified imports.
- Produces: one isolated import commit with repository-wide validation evidence.

- [ ] **Step 1: Scan for embedded secrets and inspect absolute paths**

Run:

```bash
rtk proxy ruby -e '
roots = %w[
  skills/base/lint-and-validate
  skills/devops/operations/devops-troubleshooter
  skills/devops/infrastructure/network-debugging
  skills/base/linear-task-workflow
  skills/developer/backend/go/golang-pro
  skills/base/deep-research
  skills/developer/docs-architect
  skills/base/agent-browser
  skills/base/find-skills
]
patterns = {
  "AWS access key" => /(?:AKIA|ASIA)[0-9A-Z]{16}/,
  "GitHub token" => /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/,
  "OpenAI-style key" => /sk-[A-Za-z0-9]{20,}/,
  "private key" => /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/,
  "credential assignment" => /(?:api[_-]?key|access[_-]?token|secret[_-]?key|password)\s*[:=]\s*["\x27][^"\x27]{8,}["\x27]/i,
  "macOS user path" => %r{/Users/},
  "Linux user path" => %r{/home/[^ /]+},
  "Windows user path" => /C:\\Users\\/,
  "SSH credential path" => %r{\.ssh/},
  "AWS credential path" => %r{\.aws/credentials},
  "Kubernetes credential path" => %r{\.kube/config}
}
hits = []
roots.each do |root|
  Dir.glob(File.join(root, "**", "*"), File::FNM_DOTMATCH)
    .select { |path| File.file?(path) }
    .each do |path|
      text = File.read(path, encoding: "UTF-8")
      patterns.each do |label, pattern|
        hits << "#{label}: #{path}" if text.match?(pattern)
      end
    end
end
abort "sensitive or machine-specific candidates:\n#{hits.join("\n")}" unless hits.empty?
puts "0 secret candidates; 0 machine-specific credential paths"
'
```

Expected: `0 secret candidates; 0 machine-specific credential paths`.

Then run:

```bash
rtk rg -n --hidden '(/tmp/|/path/to/|/Users/|/home/|C:\\Users\\|/etc/|/var/)' skills/base/lint-and-validate skills/devops/operations/devops-troubleshooter skills/devops/infrastructure/network-debugging skills/base/linear-task-workflow skills/developer/backend/go/golang-pro skills/base/deep-research skills/developer/docs-architect skills/base/agent-browser skills/base/find-skills
```

Expected: exactly 14 matches, all below `skills/base/agent-browser`, using
only generic `/tmp/` output paths or `/path/to/` documentation examples. There
must be no `/Users/`, `/home/`, `C:\Users\`, `/etc/`, or `/var/` match.

- [ ] **Step 2: Inspect potentially active script operations**

Run:

```bash
rtk rg -n --hidden '(subprocess\.|os\.system|Popen\(|shell=True|eval\(|exec\(|request\.urlopen|requests\.|httpx\.|socket\.|rm[[:space:]]+-rf|curl[[:space:]]|wget[[:space:]]|ssh[[:space:]]|scp[[:space:]]|kubectl[[:space:]]|docker[[:space:]]|sudo[[:space:]])' skills/base/lint-and-validate/scripts skills/devops/infrastructure/network-debugging/scripts skills/base/deep-research/scripts skills/base/agent-browser/templates
rtk sed -n '70,105p' skills/base/lint-and-validate/scripts/lint_runner.py
rtk sed -n '112,178p' skills/base/deep-research/scripts/verify_citations.py
rtk sed -n '1,240p' skills/devops/infrastructure/network-debugging/scripts/validate-api.sh
rtk sed -n '1,240p' skills/base/agent-browser/templates/authenticated-session.sh
rtk sed -n '1,240p' skills/base/agent-browser/templates/capture-workflow.sh
rtk sed -n '1,240p' skills/base/agent-browser/templates/form-automation.sh
```

Expected: the risk-pattern scan reports only two `subprocess` lines in
`lint_runner.py` and two `request.urlopen` lines in `verify_citations.py`.
Confirm that the linter uses argument arrays, no shell invocation, and a
120-second timeout; citation verification performs outbound requests only
when explicitly run and uses 10-second timeouts. Confirm that the four shell
files contain no recursive deletion or privilege-changing command. Do not run
any of these workflows.

- [ ] **Step 3: Parse Python without generating bytecode**

Run:

```bash
rtk python3 -c 'import ast, pathlib, sys; paths=[pathlib.Path(p) for p in sys.argv[1:]]; [ast.parse(p.read_text(encoding="utf-8"), filename=str(p)) for p in paths]; print(f"parsed {len(paths)} Python files")' skills/base/lint-and-validate/scripts/lint_runner.py skills/base/lint-and-validate/scripts/type_coverage.py skills/base/deep-research/scripts/citation_manager.py skills/base/deep-research/scripts/md_to_html.py skills/base/deep-research/scripts/research_engine.py skills/base/deep-research/scripts/source_evaluator.py skills/base/deep-research/scripts/validate_report.py skills/base/deep-research/scripts/verify_citations.py skills/base/deep-research/scripts/verify_html.py
```

Expected: `parsed 9 Python files` and no `__pycache__` creation.

- [ ] **Step 4: Parse Bash and YAML**

Run:

```bash
rtk bash -n skills/devops/infrastructure/network-debugging/scripts/validate-api.sh skills/base/agent-browser/templates/authenticated-session.sh skills/base/agent-browser/templates/capture-workflow.sh skills/base/agent-browser/templates/form-automation.sh
rtk proxy ruby -ryaml -e 'ARGV.each { |path| data = YAML.safe_load(File.read(path), aliases: false); abort "#{path}: empty YAML" if data.nil?; puts "#{path}: #{data.class}" }' skills/base/linear-task-workflow/agents/openai.yaml skills/devops/infrastructure/network-debugging/templates/api-scaffold.yaml
```

Expected: Bash exits successfully; both YAML files parse as `Hash`.

- [ ] **Step 5: Validate all 174 repository entrypoints**

Run:

```bash
rtk proxy ruby -ryaml -e '
files = Dir["skills/**/SKILL.md"].sort
names = {}
files.each do |file|
  text = File.read(file)
  parts = text.split(/^---\s*$\n?/, 3)
  abort "#{file}: missing frontmatter" unless parts.length == 3 && parts.first.empty?
  data = YAML.safe_load(parts[1], aliases: false)
  abort "#{file}: frontmatter is not a map" unless data.is_a?(Hash)
  %w[name description].each do |key|
    abort "#{file}: missing #{key}" unless data[key].is_a?(String) && !data[key].strip.empty?
  end
  (names[data["name"]] ||= []) << file
end
duplicates = names.select { |_, paths| paths.length > 1 }
abort "duplicate skill names: #{duplicates}" unless duplicates.empty?
abort "expected 174 skills, got #{files.length}" unless files.length == 174
puts "174 valid skill frontmatters; names unique"
'
```

Expected: `174 valid skill frontmatters; names unique`.

- [ ] **Step 6: Stage only the approved import scope**

Run:

```bash
rtk git add skills/base/lint-and-validate skills/devops/operations/devops-troubleshooter skills/devops/infrastructure/network-debugging skills/base/linear-task-workflow skills/developer/backend/go/golang-pro skills/base/deep-research skills/developer/docs-architect skills/base/agent-browser skills/base/find-skills
rtk git diff --cached --check
rtk git diff --cached --name-status
rtk proxy ruby -e '
allowed = %w[
  skills/base/lint-and-validate/
  skills/devops/operations/devops-troubleshooter/
  skills/devops/infrastructure/network-debugging/
  skills/base/linear-task-workflow/
  skills/developer/backend/go/golang-pro/
  skills/base/deep-research/
  skills/developer/docs-architect/
  skills/base/agent-browser/
  skills/base/find-skills/
]
lines = IO.popen(%w[git diff --cached --name-status], &:read).lines.map(&:chomp)
abort "expected 48 staged files, got #{lines.length}" unless lines.length == 48
bad = lines.reject do |line|
  status, path = line.split("\t", 2)
  status == "A" && allowed.any? { |prefix| path.start_with?(prefix) }
end
abort "staged scope violation: #{bad}" unless bad.empty?
puts "48 approved additions staged"
'
```

Expected: no whitespace errors and `48 approved additions staged`.

- [ ] **Step 7: Commit the import**

Run:

```bash
rtk git commit -m "feat: import useful local skills"
rtk git status --short --branch
rtk git show --check --stat --oneline HEAD
```

Expected: one import commit and a clean feature worktree.

- [ ] **Step 8: Validate the complete branch diff**

Run:

```bash
rtk proxy ruby -e '
lines = IO.popen(%w[git diff --name-status origin/master...HEAD], &:read).lines.map(&:chomp)
allowed_files = %w[
  docs/superpowers/specs/2026-07-25-useful-local-skills-import-design.md
  docs/superpowers/plans/2026-07-25-useful-local-skills-import.md
]
allowed_prefixes = %w[
  skills/base/lint-and-validate/
  skills/devops/operations/devops-troubleshooter/
  skills/devops/infrastructure/network-debugging/
  skills/base/linear-task-workflow/
  skills/developer/backend/go/golang-pro/
  skills/base/deep-research/
  skills/developer/docs-architect/
  skills/base/agent-browser/
  skills/base/find-skills/
]
abort "expected 50 branch additions, got #{lines.length}" unless lines.length == 50
bad = lines.reject do |line|
  status, path = line.split("\t", 2)
  status == "A" && (allowed_files.include?(path) || allowed_prefixes.any? { |prefix| path.start_with?(prefix) })
end
abort "branch scope violation: #{bad}" unless bad.empty?
puts "50 approved branch additions; no modifications or deletions"
'
```

Expected: `50 approved branch additions; no modifications or deletions`.

---

### Task 5: Verify, integrate, publish, and clean up

**Files:**
- Integrate: `feat/add-useful-local-skills` into local `master`
- Publish: `intezya/agents` branch `master`
- Preserve: primary checkout's 16 unrelated working-tree deletions

**Interfaces:**
- Consumes: a clean, fully validated feature branch based on the unchanged remote baseline.
- Produces: matching local and GitHub `master` SHAs with all nine remote entrypoints present.

- [ ] **Step 1: Use `verification-before-completion`**

Re-run Tasks 2 Step 1, Task 3 in full, and Tasks 4 Steps 1 through 5 against
the committed feature tree.

Expected: source digests, transformed parity, bundled references, safety scans,
syntax checks, and the 174-skill repository validator all pass with fresh
output.

- [ ] **Step 2: Use `finishing-a-development-branch`**

Select local fast-forward integration followed by publication to the repository
the user named.

- [ ] **Step 3: Recheck remote and primary preconditions**

Run:

```bash
rtk git fetch origin master
rtk git rev-parse origin/master
rtk git merge-base --is-ancestor origin/master feat/add-useful-local-skills
rtk proxy ruby -e '
root = "/Users/kurumi/Projects/agents"
lines = IO.popen(["git", "-C", root, "status", "--porcelain=v1"], &:read).lines.map(&:chomp)
prefix = " D skills/devops/kubernetes/kubernetes-autoscaling/"
abort "primary checkout changed unexpectedly: #{lines}" unless lines.length == 16 && lines.all? { |line| line.start_with?(prefix) }
puts "primary checkout boundary unchanged"
'
```

Expected: `origin/master` is still
`c6d01529e9d68048d5dc537c65a8431c365802ad`, it is an ancestor of the feature
branch, and the primary checkout boundary is unchanged. Stop if the remote SHA
changed.

- [ ] **Step 4: Fast-forward local `master`**

Run from `/Users/kurumi/Projects/agents`:

```bash
rtk git branch --show-current
rtk git merge --ff-only feat/add-useful-local-skills
rtk git rev-parse master
rtk git rev-parse feat/add-useful-local-skills
rtk git status --short --branch
```

Expected: both branch SHAs match; the same 16 unrelated deletions remain
unstaged and no imported path is dirty.

- [ ] **Step 5: Push without force**

Run:

```bash
rtk git push origin master
```

If the configured transport fails with the known port `65535` SSH error, run:

```bash
rtk git push https://github.com/intezya/agents.git master:master
```

Expected: a normal fast-forward push. If the push is rejected because remote
`master` advanced, stop and return to Task 1; never force-push.

- [ ] **Step 6: Verify all published SHAs and the skill count**

Run:

```bash
rtk git rev-parse master
rtk git ls-remote https://github.com/intezya/agents.git refs/heads/master
rtk gh api repos/intezya/agents/commits/master --jq .sha
rtk gh api 'repos/intezya/agents/git/trees/master?recursive=1' --jq '[.tree[].path | select(endswith("/SKILL.md"))] | length'
```

Expected: all three SHAs are identical and the GitHub tree contains exactly
174 `SKILL.md` paths.

- [ ] **Step 7: Verify every published entrypoint**

Run:

```bash
rtk gh api 'repos/intezya/agents/contents/skills/base/lint-and-validate/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/devops/operations/devops-troubleshooter/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/devops/infrastructure/network-debugging/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/base/linear-task-workflow/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/developer/backend/go/golang-pro/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/base/deep-research/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/developer/docs-architect/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/base/agent-browser/SKILL.md?ref=master' --jq .path
rtk gh api 'repos/intezya/agents/contents/skills/base/find-skills/SKILL.md?ref=master' --jq .path
```

Expected: each command returns its requested repository path.

- [ ] **Step 8: Remove the merged worktree and branch**

Only after remote verification succeeds, run from
`/Users/kurumi/Projects/agents`:

```bash
rtk git worktree remove /Users/kurumi/Projects/agents/.worktrees/feat-add-useful-local-skills
rtk git branch -d feat/add-useful-local-skills
rtk git worktree list
rtk git status --short --branch
```

Expected: the merged worktree and local feature branch are gone; `master`
matches GitHub and the primary checkout still shows only the 16 user-owned
deletions.
