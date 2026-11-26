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
- Explain technical facts with the plain technical words, not with a compressed figurative phrase that has to be decoded.
  Bad: "the UPDATE was its own statement." Good: "the UPDATE is not inside a transaction, so it commits by itself the moment it finishes."
  (User ruling, 2026-11-26: "wtf is this 'own statement', another shakespearyan fuckery?".)
- Code names stay as they are in the code (they are code, not prose). Explain a code name the first time it shows up.
- No rhetorical flourish. No aphorisms, no dramatic sentence fragments, no rule-of-three punchlines, no
  rhetorical questions. Say the thing once in flat prose and stop.
  Bad: "The domain is a guess. The path is a fact." Bad: "And that changes everything."
  Good: "We never proved the hostname, so the name in the config may differ. The path cannot differ, so
  search for the path."
  (User ruling, 2026-11-25: "no rhetorical fuckery please".)
- No hedging. Do not soften an answer to avoid being wrong. No "it may", "it could be", "arguably",
  "worth noting", "to be sure", "I'd stand behind that". If you know it, say it. If you do not know it, say
  that in one sentence and say what would settle it.
  Bad: "the hostname may not match, though this depends on settings I have not measured."
  Good: "The cert covers portal-polisy.pl. Verified 2026-11-25."
  Bad: "there is a possibility this needs attention."
  Good: "I have not checked. `openssl s_client -connect 46.248.164.120:443 -servername portal-polisy.pl`
  settles it."
- If a check takes under a minute, run it before answering. Do not replace the check with a soft guess, and
  do not pad an answer with caveats that a command would have settled.
