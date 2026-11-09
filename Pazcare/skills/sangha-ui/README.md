# Use Sangha UI

This skill helps an agent build different React interfaces with the Sangha design system. It includes instructions, layout/extension guidance and a portable copy of the reusable components. No previous conversation or portfolio access is needed.

## In this project

The skill's main folder is `skills/sangha-ui/`. A relative link at `.agents/skills/sangha-ui` makes the same folder discoverable in Codex without duplicating the instructions.

1. Open this project folder in Codex.
2. Start a new chat and type `$sangha-ui` with your brief. If it is not listed, restart Codex. You can also explicitly ask Codex to read `skills/sangha-ui/SKILL.md`.
3. Describe the product, target screen, main task, platform and any constraints. The agent can make sensible assumptions for missing details.

Example:

```text
Use $sangha-ui to design a volunteer shift signup page in React.
Make it work on phones and desktops. Reuse our shared components,
and explain any patterns you need to add.
```

For a planning-only request, say “propose layouts without building yet.” The skill follows the requested scope; it does not automatically create several products or publish anything.

## In another project

Copy the entire `sangha-ui` folder into that project's `.agents/skills/`. Keep references and assets with SKILL.md. Open the target project in Codex and invoke `$sangha-ui`. If the target has no Sangha design-system source, the skill tells the agent to copy the bundled reusable source into that project, set up React/Manrope and import it. The source assets are not a standalone runnable application.

Alternatively, to retain the assignment's `skills/sangha-ui/` layout, copy that folder there and create the discovery link from the target repository root:

```sh
mkdir -p .agents/skills
ln -s ../../skills/sangha-ui .agents/skills/sangha-ui
```

Do not run the link command if that path already exists. Git preserves the relative link on macOS/Linux. Where symlinks are unavailable, copy the entire folder directly into `.agents/skills/sangha-ui` instead and use that as the local source to avoid diverging copies.

## What is included

- `SKILL.md`: instructions the agent follows.
- `agents/openai.yaml`: Codex display metadata and example prompt.
- `references/`: integration and layout/extension decisions.
- `assets/design-system/`: reusable v0.2 source and full component API guide for use elsewhere.
- `assets/source-manifest.json`: provenance and file hashes for that snapshot.

The original repository's `design-system/` remains authoritative. Ask the user before future updates that affect both `design-system/` and `skills/sangha-ui/`; once approved, keep the reusable source, guide and bundled snapshot in sync. The portable source now also requires `@phosphor-icons/react` 2.1.10 (Phosphor regular icons). No GitHub login or external connector is required to use this skill.

Codex discovery and symlink setup follows [OpenAI's skill documentation](https://learn.chatgpt.com/docs/build-skills).

## Validation completed

The skill passed Codex's structure validator. Local instruction links, the discovery symlink and the portable asset hashes were checked. A temporary React/Vite build outside this repository successfully imported all fourteen components from the bundled snapshot and loaded Manrope. This checks packaging and compilation, not whether an agent will make good design decisions on every new brief. A live unfamiliar-product evaluation has not been run yet.
