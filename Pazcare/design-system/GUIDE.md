# Component and token guide · v0.2

This file is sufficient to use the foundation without the original conversation. Import all components from `design-system/src/components.jsx`. That module imports `tokens.css` and `components.css`. Load Manrope 400/500/600/700 in the host app, as the preview does using local Fontsource packages. The gallery uses these actual exports; it does not maintain duplicate versions. Gallery-specific layout lives in `preview.css`.

## What should remain consistent

Preserve semantic colour roles, Manrope hierarchy, spacing increments, named corner/elevation roles, clear labels, keyboard focus and native HTML semantics. Extend tokens by role, not by product name. Do not copy the large gallery heading or sidebar into every product. Product layout and density may change; blue must still mean emphasis/selection/focus, not arbitrary decoration. Do not use coloured dots alone to communicate status. Disabled controls do not activate. Loading actions block duplicate activation. Passive cards/avatars/status labels do not enter the tab order.

## Token roles and state rules

- Text: `--text-primary` for headings/content, `--text-secondary` for supporting content, `--text-inverse` on dark surfaces. Do not use disabled opacity for ordinary supporting text.
- Surfaces: `--surface-page` outer canvas; `--surface-base` content; `--surface-subtle` secondary groups. `--surface-selected` identifies selection.
- Section tints: use `--surface-tint-blue` (#EDF4FF), `--surface-tint-lavender` (#F1EDF9), or `--surface-tint-mint` (#EAF6EF) as backgrounds to distinguish peer content groups. Pair them with primary or secondary text and a visible group label. Use the existing status and selection tokens for feedback and interactive states.
- Borders: `--border-subtle` decorative separation; `--border-control` stronger input boundaries; `--border-focus` keyboard focus. Widths: `--border-width` 1px, `--border-width-selected` 2px, `--focus-width` 2px. Focus also has white separation and a blue outer shadow.
- Accent: `--color-accent` for links/focus/selection; `--color-accent-soft` pale accent surface. Soft hover/pressed: `--accent-hover-soft`/`--accent-pressed-soft`. Solid accent hover token is reserved for future solid accent controls.
- Functional: success, warning and danger each have foreground and soft background tokens. Error meaning also needs text. Danger action uses a solid foreground/background pairing with named hover and pressed tokens.
- Hover: surface-hover or action-hover. Pressed: surface-pressed/action-pressed; primary buttons also shift down 1px. Selected: blue text, soft blue fill and a border/underline or checkmark. Disabled: opacity .45 and native disabled. Keyboard focus: shared focus ring, never colour alone.
- Control heights: comfortable 44px; compact 36px. Icon sizes 14/18/24px; button icons default 18px. Icon buttons are square with the same control height. Avatar sizes 32/40/56px.
- Comfortable list rows: 16px vertical padding. Compact: 8px. Use compact in dense desktop lists only; keep comfortable actions on touch screens. Do not shrink font sizes to create density. Component spacing stays on the 4px scale.
- Layout: shared max content width 1120px; default outer gutter 32px, phone gutter 16px. Stack multi-column product regions at or before 700px; between 701 and 1100px simplify sidebars/columns as content requires; above 1100px allow multi-column layouts. These are new recommended rules, not claimed portfolio measurements. The gallery uses its existing 700/1100px layout breakpoints and its own presentational gutters. Components are fluid; Tabs scroll horizontally; menu width is bounded by viewport. Long labels wrap. Menus are simple anchored lists, not nested menus or collision-aware portals: place them with room below and inside non-clipping containers.
- Layers: base 0, sticky 10, menu 50, overlay 100. Menus use z-index 50. Native modal dialogs use the browser top layer, above ordinary z-index content; the overlay token is reserved for future non-native overlays. Avoid arbitrary larger values.

### Motion and easing (chosen additions)

| Token | Value | Use |
| --- | --- | --- |
| duration-fast | 120ms | Hover, press and menu entry |
| duration-normal | 200ms | Dialog entry and progress updates |
| duration-slow | 320ms | Reserved for larger transitions |
| ease-standard | cubic-bezier(.2,0,0,1) | Feedback and in-place updates |
| ease-enter | cubic-bezier(0,0,.2,1) | New surfaces appearing |
| ease-exit | cubic-bezier(.4,0,1,1) | Reserved for a future animated exit |

Current dialogs and menus dismiss immediately; no exit animation is claimed. Reduced motion sets shared durations to 0ms, removes animations (including spinner rotation), smooth scrolling and button press translation. Loading text remains visible/announced even when the spinner is static.

## APIs and examples

All snippets assume React and the named exports are imported. Controlled examples assume the indicated state setter exists. Props not explicitly listed pass through only where noted.

### Button

`variant`: primary (default), secondary, accent, ghost, danger. `size`: default or compact. `loading`, `disabled`, optional `icon`, `iconPosition` start/end, children and native button props. Type defaults to button; use submit in forms. Primary for the main action, secondary for alternatives, ghost for low emphasis, accent sparingly, danger for destructive intent. Icons optional: save for saving, send for messaging, plus for adding, external only when a destination leaves the app, arrow for moving forward. Never attach an external-link icon to every action.

```jsx
<Button variant="primary" icon="save" onClick={save}>Save changes</Button>
```

### Icon Button

`label` required accessible name, `icon` (default more), same variant/size/loading/disabled and native props as Button. Use for familiar compact actions; prefer text buttons for unfamiliar actions. Provide surrounding visible context; there is no tooltip implementation.

```jsx
<IconButton label="Add channel" icon="plus" onClick={addChannel} />
```

### Input

`label` required; `hint`, `error`, optional id and className; native input props (type, value, onChange, required, disabled, readOnly). Error overrides hint. Associated labels/descriptions and aria-invalid are automatic. Consumer handles validation, not the component.

```jsx
<Input label="Email" type="email" value={email}
  onChange={e => setEmail(e.target.value)} error={emailError} />
```

### Card

`treatment`: plain (default, everyday grouping), feature (prominent showcase with gradient/shadow), raised (small elevation). children, className and native div props. No implicit click/focus role. Nest a link/button for actions. Do not render every message as a feature card.

```jsx
<Card treatment="feature"><h3>Reading highlights</h3><p>A thoughtful summary.</p></Card>
```

### Tag

`tone`: neutral/accent/success/warning/danger; children. Static by default. `onToggle`, `selected` and optional `disabled` create a native toggle button with aria-pressed. Tags classify or filter. Keep short text; selected state uses a check, spacing, fill and border. Prefer Badge for counts/status.

```jsx
<Tag selected={selected} onToggle={() => setSelected(!selected)}>Design</Tag>
```

### Nav

`items`: array of `{href, label, current?}`; `label` names the navigation landmark. Links use Tab/Enter, not arrow keys. Use for destinations; use Tabs for panels within a view. Consumer updates current based on its router.

```jsx
<Nav label="Workspace" items={[
  {href:'/inbox', label:'Inbox', current:true}, {href:'/saved', label:'Saved'}
]} />
```

### List

`items`: `{id, title, description?, leading?, trailing?}[]`; `compact` boolean; `emptyMessage`. IDs must be stable/unique. leading/trailing accept React nodes. Not a listbox; plain rows are not focusable. Put actual buttons/links in the row if needed.

```jsx
<List compact items={[{id:'sam', title:'Sam', description:'Designer',
  leading:<Avatar name="Sam Lee"/>, trailing:<Badge tone="success">Available</Badge>}]} />
```

### Modal

`open`, `onClose`, `title`, optional description and children. Controlled native dialog: background inert, scroll lock, Escape/outside-click/close dismissal and return focus. Explicit keyboard Tab loop. Initial focus first input/textarea, else first button. Only one modal at a time. No unsaved-change guard; consumer must add that if needed.

```jsx
<Modal open={open} onClose={() => setOpen(false)} title="New collection">
  <Input label="Name" value={name} onChange={e => setName(e.target.value)}/>
  <Button onClick={save}>Create collection</Button>
</Modal>
```

### Avatar

`name` required; optional src; size sm/md/lg (default md). Failed/missing images show initials. Accessible name always included. Add a separate labelled Badge for status; avatar colours never imply online state.

```jsx
<Avatar name="Sangha Unni" src="/people/sangha.jpg" size="md" />
```

### Tabs

`items`: `{id, label, content, disabled?}[]`; required controlled `value`/`onChange`; optional label. Stable IDs must be unique. Arrow Left/Right wraps and activates the next available tab; Home/End jump; disabled skipped. One tab is in Tab order; panel is focusable. For local, immediately available panels, not delayed network requests. At least one enabled tab required.

```jsx
<Tabs label="Profile views" value={tab} onChange={setTab} items={[
 {id:'books', label:'Books', content:<p>Current books</p>},
 {id:'reviews', label:'Reviews', content:<p>Recent reviews</p>}
]} />
```

### Badge / status indicator

`tone`: neutral/accent/success/warning/danger; `dot` boolean and children. Informational, never interactive. Must include readable text. Does not automatically announce changes; wrap dynamic meaningful updates in a polite status region.

```jsx
<Badge tone="success" dot>Available</Badge>
```

### Textarea

Same label/hint/error/id contract as Input; rows default 4 and native textarea props. Resizable vertically. Enter inserts a line break; no send-on-Enter shortcut. Consumer manages value/validation.

```jsx
<Textarea label="Message" value={message} onChange={e => setMessage(e.target.value)}
 hint="Enter starts a new line." rows={4} />
```

### Progress Bar

`label` required, `value` default 0, `max` default 100; `showValue` default true. Determinate only. Clamps to [0,max]; invalid max becomes 100; invalid value becomes 0. Screen readers receive the name and actual numerical range. No live region to avoid noisy announcements.

```jsx
<ProgressBar label="Yearly reading goal" value={18} max={30} />
```

### Dropdown Menu

`label` trigger/menu name (default Actions), optional icon (default chevron); items `{id, label, icon?, disabled?, danger?, onSelect?}[]`. Stable unique IDs required. Use for actions, not navigation or forms; no submenus. Enter/Space/ArrowDown opens first; ArrowUp opens last. Arrow keys wrap and skip disabled; Home/End and single-letter typeahead supported. Escape restores trigger focus; Tab closes and proceeds to next/previous focusable element; outside pointer and focus loss dismiss. Selection closes before callback. No all-disabled menus; provide at least one enabled action. Anchored menu has bounded height/width but no smart collision detection.

```jsx
<DropdownMenu label="Book actions" items={[
 {id:'save', label:'Save book', icon:'save', onSelect:saveBook},
 {id:'remove', label:'Remove book', danger:true, onSelect:removeBook}
]} />
```

### Icon utility

The icon family is **Phosphor**, installed through `@phosphor-icons/react` (currently 2.1.10). Use the shared Icon wrapper so controls keep a consistent size and accessible behaviour. Default weight is **regular**; do not mix thin/light/bold/duotone arbitrarily. Use fill only when it deliberately represents a selected state, with another visible/accessibility cue. Keep the existing 14/18/24px tokens and inherited currentColor. Phosphor owns the glyph geometry; do not force the previous custom 24-unit grid or 1.7 stroke onto it.

Stable aliases map to Phosphor exports:

| Alias | Phosphor icon | Typical use |
| --- | --- | --- |
| arrow | ArrowRightIcon | Continue/forward |
| external | ArrowSquareOutIcon | External destination |
| check | CheckIcon | Selected/completed |
| close | XIcon | Dismiss |
| plus | PlusIcon | Add |
| chevron | CaretDownIcon | Expand menu |
| more | DotsThreeIcon | More actions |
| send | PaperPlaneTiltIcon | Send |
| save | FloppyDiskIcon | Save |

Icon accepts `name`, `size` sm/md/lg (default md) and `weight` (default regular). It is decorative and hidden from assistive tech: Button text or IconButton's required label supplies meaning. Unknown names render no icon. Icons remain optional on text buttons. Choose icons for the action rather than adding arrows to everything.

```jsx
<Icon name="check" size="sm" />
<Button icon="save">Save changes</Button>
<IconButton label="Send message" icon="send" />
```

For a missing glyph, choose an appropriate Phosphor icon and add a statically imported alias to the shared registry. Import individual files from `@phosphor-icons/react/dist/csr/<Name>` rather than dynamically importing the entire catalogue. Do not copy SVG paths or add another icon family. A server-only host can use Phosphor's SSR exports; the current interactive components belong inside a client boundary.

### Coordinating future changes

Ask the user before any future update that modifies both `design-system/` and `skills/sangha-ui/`, including refreshing the portable snapshot. Explain which files need syncing and why. Once that update is approved, keep the source, documentation, dependency requirements and snapshot manifest aligned.
