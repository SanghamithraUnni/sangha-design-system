# Source selection and React integration

## Select one source, not two competing systems

1. Inspect the target repository for `design-system/src/components.jsx`, `tokens.css`, `components.css` and `GUIDE.md`. Locate from the repository root, not from the skill's installed directory: its `.agents/skills/` location may be a symlink.
2. If that is the existing Sangha implementation, read and import it directly. Preserve local additions and version differences. The original project is source version v0.2; the package version field may still say 0.1.0.
3. If a different local system exists, do not overwrite it. Apply Sangha only to the user-requested surface and explain the boundary; ask only if the conflict materially changes the task.
4. If no Sangha source exists, copy `assets/design-system/src/` and `assets/design-system/GUIDE.md` from this skill to a new `design-system/` in the target repository. This is a portable v0.2 snapshot. Its GUIDE paths describe the original structure; resolve imports from the target file. Do not use an absolute path back to the installed skill at runtime.

The portable assets contain reusable components only, not a runnable app scaffold. Use the target's React bundler; if starting from an empty project, create a minimal React/Vite setup appropriate to its package manager. Native dialog support is required. For server-rendered React hosts, import interactive components through the host's client-component boundary. Plain CSS imports must be supported by the host.

## Dependencies and imports

Use existing compatible React/react-dom dependencies where present. The original source uses React 19, React DOM 19, `@fontsource/manrope` 5.x and `@phosphor-icons/react` 2.1.10. Install Phosphor along with the fonts in a new host; copying source alone does not install dependencies. Match React and React DOM versions. Install packages using the target lockfile's package manager; avoid adding a second lockfile. Do not copy node_modules, build output or preview files.

Load Manrope once at the app entry:

```jsx
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
```

A screen placed at `src/Example.jsx` in a repository with root `design-system/` can use:

```jsx
import React, {useState} from 'react';
import {Button, Card, Input} from '../design-system/src/components.jsx';
import './example.css';

export default function Example() {
  const [name, setName] = useState('');
  return <main className="example-page">
    <Card>
      <h1>Start a collection</h1>
      <Input label="Collection name" value={name}
        onChange={event => setName(event.target.value)} />
      <Button disabled={!name.trim()} onClick={() => { /* product action */ }}>
        Create collection
      </Button>
    </Card>
  </main>;
}
```

```css
.example-page {
  max-width: var(--content-width);
  margin-inline: auto;
  padding: var(--layout-gutter);
}
.example-page .ds-card { display: grid; gap: var(--space-6); }
```

The component module loads tokens and component CSS itself. Use those tokens in product CSS; do not paste fresh hex values or copy the component gallery. Import only tokens.css if the task needs tokens without React components. Shared CSS currently includes global base typography and focus styles: inspect their effect when integrating into an established app.

## Available exports

Button, Input, Card, Tag, Nav, List, Modal, Avatar, IconButton, Tabs, Badge, Textarea, ProgressBar, DropdownMenu, and the decorative Icon utility. Read the selected source's GUIDE.md for exact prop contracts and one example per component. Do not invent unsupported props such as Card variant, Nav onSelect, Button as/link, indeterminate ProgressBar or portal DropdownMenu.

## Snapshot maintenance

The original repository's `design-system/` is authoritative. Portable copies are fallback assets, not an automatically synchronized package. Before updating both the system and this skill, ask the user to approve the specific coordinated change. After approval, update the guide, Phosphor dependency requirements and skill snapshot together if the change should travel to other projects. `assets/source-manifest.json` records source paths, version and SHA-256 hashes for the bundled copy. Recompute it when refreshing the snapshot. Never copy product data or secrets into the skill.
