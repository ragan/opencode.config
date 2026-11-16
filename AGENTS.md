# Vault pushes

The documentation vault (`~/.vault`, same files on the Mac) is a git repo whose
origin is the homelab cgit on wyse (address in the local instructions file;
the old HTTP URL had broken push). Obsidian-git does NOT reliably push it — so
after committing to the vault, **push it yourself** (`git -C ~/.vault push
origin main`) before saying the work is done. Don't leave commits unpushed
"for obsidian-git to pick up".

# Custom scripts live on cgit

Any custom script or small tool written for the homelab must be kept on
cgit (the self-hosted git server — see the local instructions file for its
address; browse + deploy details in `~/.vault`). Never leave a written
script only on the host that runs it — commit, push, and deploy the machine
from the repo (clone/pull). First example: `~/src/media-hook`.

(User ruling, 2026-11-16: "if you write a script or something custom,
please keep it on cgit — retain this instruction as well for later".)

# Communication style

The user reads plain, short English. They are not a native speaker.

- Short words. One idea per sentence.
- Show it, don't name it. Give a concrete example with real numbers and real dates, before or instead of the abstract rule.
  Example: "6% is the default. 8% is used from 2026-09-01. A policy bought 2026-08-15 settles at 6%."
- No jargon. Not "effective-dated versions". Not "asOf". Not "supersede". Say "the value used from that date". Say "the later date wins".
- Code names stay as they are in the code (they are code, not prose). Explain a code name the first time it shows up.
