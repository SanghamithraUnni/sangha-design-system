# Sangha design system · v0.1

A React foundation extracted from Sanghamithra's portfolio. No reusable skill or product layouts are included.

## Open the preview

With Node.js 20.19+ or 22.12+ and pnpm installed, open a terminal in `design-system/` and run:

```
pnpm install
pnpm dev
```

Open the local address printed in the terminal (usually http://127.0.0.1:5173). Leave the terminal running. To stop, press Control+C. `pnpm build` produces the static preview in `dist/`. `pnpm test` runs interaction tests.

This computer currently uses Codex's bundled Node and pnpm. From the project root you can also run `./preview.sh`, which finds those tools automatically. No GitHub connection is needed.

## Files

- `src/tokens.css`: shared values, usable independently of React.
- `src/components.jsx` and `src/components.css`: reusable components.
- `src/main.jsx` and `src/preview.css`: component gallery only; showcase decoration is not required by consuming apps.
- `DECISIONS.md`: origin of retained, normalized and added rules.
- `tests/`: behavioural tests. Native modal trapping and Escape need real-browser verification; jsdom tests only verify component wiring.

## Use

Import components from `src/components.jsx`. This imports their CSS and tokens. Load Manrope weights 400, 500, 600 and 700 in the consuming app (the preview bundles them locally through Fontsource).

```jsx
import {Button, Input, Card} from './design-system/src/components';
<Card><Input label="Name" hint="How should we address you?"/><Button>Continue</Button></Card>
```

Button: `variant` primary/secondary/accent/ghost/danger; `size` default/compact; `loading`, `disabled`. Native buttons use Enter and Space. Use actual anchors for navigation, not Button onClick.

Input: required `label`; optional `hint`, `error`; passes native input props through. Errors are linked through aria-describedby, with aria-invalid. Validation belongs to the consuming form; do not rely on colour alone.

Card: plain/feature/raised `treatment`. Passive container; put a real link or button inside for actions.

Tag: neutral/accent/success/warning/danger `tone`. Supply onToggle and selected for a button toggle; otherwise a static label. Disabled toggles are supported.

Nav: items with href, label and optional current. Semantic anchors use Tab/Enter; not an ARIA menu or tab widget, so arrow-key navigation is intentionally unnecessary.

List: stable-id items with title, description, leading and trailing React content; optional compact and emptyMessage. Semantic list, with native focusable actions supplied by the consumer.

Avatar: required name, optional src and sm/md/lg size. Circular image or initials fallback on missing/failed source. Accessible name included; online status is not inferred.

Modal: controlled open/onClose, title, optional description and children. Native dialog provides modal focus containment and background inertness; Escape, close button and outside click dismiss; scroll locks and previous focus returns on close. Use only one modal at a time. For lengthy content it scrolls inside the viewport. Consumer handles submission and pending state.

## Review

Use the gallery at wide and narrow widths. Tab through links and controls, activate buttons/toggles with Enter/Space, edit an input, open the modal, submit an empty name, then save or press Escape. Reopen to test Shift+Tab containment and return focus. Changes remain local to the gallery and disappear on reload.

## Verification for v0.1

- Production build passed; seven interaction tests passed.
- Live browser review succeeded for the portfolio hero and first project wrapper.
- Preview inspected at desktop width and 390px phone width; phone page width matched viewport with no horizontal overflow.
- Real-browser modal checks passed: empty submission error, successful local save, explicit Tab/Shift+Tab wrapping, Escape dismissal and focus restoration.
- No browser console errors in the final check. This is not a full accessibility audit.

## v0.2 refinement

See [GUIDE.md](GUIDE.md) for the complete component options, fourteen component examples, state rules, semantic tokens, density, responsive and layering guidance. Additions include IconButton, Tabs, Badge, Textarea, ProgressBar and DropdownMenu. The original portfolio direction and gallery layout are retained.

Current verification: see [VERIFICATION.md](VERIFICATION.md). v0.2 passes 15 tests and the production build. Reduced-motion rules are checked in source and loaded browser CSS; preference-on visual testing remains outstanding because browser media emulation is unavailable.
