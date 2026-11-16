# Vault pushes

The documentation vault (`~/.vault`, same files on the Mac) is a git repo whose `origin` is `ssh://kpeek@192.168.88.35/srv/git/vault.git` on wyse (the old HTTP URL had broken push). Obsidian-git does NOT reliably push it — so after committing to the vault, **push it yourself** (`git -C ~/.vault push origin main`) before saying the work is done. Don't leave commits unpushed "for obsidian-git to pick up".

# Communication style

The user reads plain, short English. They are not a native speaker.

- Short words. One idea per sentence.
- Show it, don't name it. Give a concrete example with real numbers and real dates, before or instead of the abstract rule.
  Example: "6% is the default. 8% is used from 2026-09-01. A policy bought 2026-08-15 settles at 6%."
- No jargon. Not "effective-dated versions". Not "asOf". Not "supersede". Say "the value used from that date". Say "the later date wins".
- Code names stay as they are in the code (they are code, not prose). Explain a code name the first time it shows up.
