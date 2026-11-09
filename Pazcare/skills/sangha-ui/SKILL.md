---
name: sangha-ui
description: Build or refine React interfaces in the Sangha visual style using shared tokens and accessible components. Use for new products or layouts that should use this system, including unfamiliar domains.
---

# Sangha UI

Translate the user's product brief into an interface using the Sangha design system. Keep the user's product, scope and requested output; this skill does not require multiple alternatives, a specific app layout, publishing or any GitHub action.

## Find the implementation

Read [references/integration.md](references/integration.md) first to choose the source location and set up imports. In the original repository, use `design-system/src/components.jsx`, `tokens.css`, `components.css` and `design-system/GUIDE.md` as the source of truth. Do not rebuild components inside the product or import the gallery's `main.jsx`/`preview.css`.

For a different repository, the skill includes a portable source snapshot in `assets/design-system/`. Copy that source into the target project's `design-system/` only if it has no Sangha implementation. Do not overwrite an existing implementation. Read the selected implementation's `GUIDE.md` for exact props, examples, keyboard behaviour and limitations before composing it. The snapshot needs React and Manrope; integration instructions list the dependencies. Do not assume this conversation, portfolio access, a particular machine path or a GitHub connection exists.

## Choose the product structure

Identify the main user task, key content, repeated actions and required states from the brief. Make reasonable reversible assumptions when details are missing and state the important ones. Read [references/layout-and-extension.md](references/layout-and-extension.md) for composition and density choices.

Choose the layout for the task: a dense workspace, a browsing/profile page, an editorial landing page and a focused form have different information needs. Keep the visual language, not the gallery's sidebar, hero, columns or component catalogue. If alternatives are requested, change the organising idea and interaction model rather than merely rearranging cards.

## Preserve the visual language

- Use the shared semantic tokens: neutral canvas/white/subtle surfaces, dark text, muted supporting text, restrained blue emphasis. Functional colours convey named status, with text or icons as well as colour.
- Use Manrope hierarchy and the 4px spacing scale. Retain pill actions and named corner/elevation roles; feature gradients/shadows belong to prominent content, not every row.
- Keep component defaults and variant meaning consistent. Main action: primary Button; alternative: secondary; low emphasis: ghost; destructive intent: danger. Card groups passive content. Tag classifies/filters; Badge reports count/status. Tabs switch nearby panels; Nav changes destinations.
- Use optional action-specific SVG icons; keep checkmark/label spacing, focus rings and accessible names. Avoid arbitrary arrows on every button or emoji as interface icons.
- Comfortable controls are 44px high; compact 36px is for dense desktop contexts. Keep comfortable touch actions. Adjust layout and spacing before shrinking text.
- Use named duration/easing tokens and honour reduced motion. Current menus/dialogs exit immediately; the exit easing token is reserved, not evidence of an implemented exit animation.

## Extend only what is missing

Compose existing exports before introducing a pattern. Read the extension workflow in [references/layout-and-extension.md](references/layout-and-extension.md) when the system has no suitable answer. A new pattern must use existing semantic tokens and components, include relevant states/keyboard semantics, and be documented as an addition rather than an extracted portfolio rule. Share truly reusable additions through the selected `design-system/`; keep product-specific compositions in the product. Do not silently change token meanings or existing component APIs to suit one screen.

## Verify and hand over

Check actual imports, responsive flow, long content, empty/error/loading/selected states as relevant, accessible labels, keyboard activation and focus. For dialogs verify containment, Escape and focus restoration; for menus verify arrow keys, dismissal and Tab exit. Respect the documented single-modal and simple anchored-menu limits. Check reduced-motion rules; distinguish source inspection from preference-on visual testing.

Run the target app's build and meaningful interaction checks when code changes. Inspect the resulting screen at a wide and a narrow viewport when browser tools are available. Report checks that could not be performed instead of claiming they passed. Explain the layout rationale, additions and how to open the result in simple terms. Save a meaningful Git checkpoint if the user has requested checkpointing; do not upload or publish without the user's instruction.
