# Catadoro – working rules

## Git: one branch per issue, merged into develop

- Every feature or fix gets its own branch, cut from an up-to-date `develop`:
  - `change/#<issue>` for features and changes, `fix/#<issue>` for bugs.
  - If a branch with that name already exists and is already merged, fast-forward it to `develop` and keep using it.
- Commit each feature separately. A commit holds only that issue's files. Never mix two issues in one commit or one branch.
  - When one file carries changes for two issues, split it so each commit has only its own part.
  - Order the commits so each one builds on its own (shared pieces go in first).
- Commit message: `#<issue> <short summary in plain words>`, e.g. `#81 Settings as one grouped list`.
- When the issue is done, merge its branch into `develop` with `git merge --no-ff change/#<issue>`, then start the next issue from `develop`.
- Version bumps are their own commit (`Updated version: x -> y …`), not part of a feature commit.
- Never commit local-only tweaks, such as the DEV "minutes count as seconds" change in `common/Hooks.ts`, `local.env` or the generated `android/` folder.
- Push and open pull requests only when asked.
