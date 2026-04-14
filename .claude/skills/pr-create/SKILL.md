---
name: pr-create
description: Use when creating a pull request on GitHub via the gh CLI — especially before raising any PR to ensure the right account is active and the description summarizes changes clearly.
---

# Create a Pull Request

## Overview

Use `gh` CLI to create PRs with a human-friendly summary of changes. Always verify the active `gh` account first — multiple accounts are logged in.

## Steps

1. **Verify active GitHub account**
   ```bash
   gh auth status
   ```
   This project is under the **Synthlane org** — required account is **`deepak-syn`**.
   Do NOT use `ivorynoise` (personal). Switch if needed:
   ```bash
   gh auth switch --user deepak-syn
   ```

2. **Summarize changes from the base branch**
   ```bash
   git log <base-branch>...HEAD --oneline
   git diff <base-branch>...HEAD --stat
   ```
   Use this to write a human-friendly PR description — not a raw commit dump.

3. **Create the PR**
   ```bash
   gh pr create --title "Short, clear title" --body "$(cat <<'EOF'
   ## Summary
   - What changed and why (bullets, not jargon)

   ## Test plan
   - How to verify this works

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

## Rules

- **Always check `gh auth status` before creating a PR** — multiple accounts are configured; submitting from the wrong one causes issues.
- Base branch is typically `main` unless the user specifies otherwise.
- PR description must be human-friendly: explain intent, not just list commits.
- Keep title under 70 characters.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong `gh` account active | Run `gh auth status` first, switch if needed |
| Description is raw commit list | Summarize intent and changes in plain language |
| Forgetting to push branch | `git push -u origin <branch>` before `gh pr create` |
