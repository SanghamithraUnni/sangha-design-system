# Sangha design system

A reusable React design system based on Sanghamithra Unni's portfolio, plus **sangha-ui**, a skill that helps an agent apply it to unfamiliar products.

## Start here

Download the repository ZIP and extract it, or clone it with Git. This is a private repository, so other people need repository access before downloading it. A Git clone includes the commit history; a GitHub source ZIP contains files only.

Open the repository folder in your editor or Codex. The correct folder directly contains `design-system/`, `skills/` and this README. There is no extra `Pazcare/` folder inside it.

## Run the component preview

Install Node.js 20.19+ (or 22.12+) and pnpm first. In Terminal, navigate to the downloaded repository, then run:

```sh
cd design-system
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed in Terminal, normally http://127.0.0.1:5173/. Leave Terminal running; Control+C stops the preview. After dependencies are installed, `sh preview.sh` from the repository root is another way to start it. The launcher also supports Codex's bundled Node/pnpm when available.

From `design-system/`, `pnpm test` runs the interaction checks and `pnpm build` creates the static preview in `dist/`. Dependencies and generated output are intentionally not tracked.

## Use the skill in Codex

1. Open this repository folder in Codex.
2. Start a chat and type `$sangha-ui` with your product brief. If it is not listed, restart Codex.
3. Example: `Use $sangha-ui to propose a volunteer signup interface. Explain the layout before building.`

The skill lives in `skills/sangha-ui/`. `.agents/skills/sangha-ui` is a relative symlink to it for Codex discovery. Some ZIP extractors or Windows Git settings do not preserve symlinks. If the skill is not detected, explicitly ask Codex to read `skills/sangha-ui/SKILL.md`, or copy the entire `skills/sangha-ui` folder into `.agents/skills/sangha-ui` after checking the destination is not already a working link. Do not edit two independent copies.

To use it in a different project, copy the complete skill folder into that project's `.agents/skills/`. Its bundled components let an agent bootstrap the system without this repository or conversation. See [skill setup and sharing](skills/sangha-ui/README.md).

## Folder map

```text
.agents/skills/sangha-ui -> ../../skills/sangha-ui
 design-system/              React source, tokens, preview and tests
 skills/sangha-ui/            Skill instructions, references and portable assets
 portfolio-audit.md           Original source-style audit
 preview.sh                  Optional preview launcher
```

- [Component options and examples](design-system/GUIDE.md)
- [Design decisions](design-system/DECISIONS.md)
- [Verification and limitations](design-system/VERIFICATION.md)
- [Skill instructions](skills/sangha-ui/SKILL.md)

`design-system/` is the source of truth in this repository. The skill's `assets/design-system/` is a portable fallback snapshot. Refresh its files and manifest hashes when shared components or tokens change.

## History

The original local checkpoints are preserved. GitHub's separate website-upload commit is also retained when the histories are reconciled. Do not force-push to replace either history. Continue making small, meaningful commits; upload with Git push so the history travels with the files.

## Current scope

Foundation v0.2 and the reusable skill are included. No six product layouts have been built. Passing automated checks is not a full accessibility audit; preference-on reduced-motion visual testing and a live unfamiliar-product evaluation remain outstanding.
