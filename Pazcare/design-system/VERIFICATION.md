# v0.2 verification

## Passed

- Production build and 15 automated tests: 14 component interaction tests and one reduced-motion CSS-rule check.
- The preview imports all fourteen reusable React exports from `src/components.jsx`; that module imports the shared `tokens.css` and `components.css`. No parallel preview-only component implementations exist. `preview.css` is limited to gallery presentation.
- Keyboard tests cover loading/disabled action prevention, chip Space/Enter, tabs Arrow/Home/End and disabled skipping, menu Arrow/Home/End, letter navigation, selection, Escape, outside dismissal and Tab/Shift+Tab exit. Textarea accepts multiline input; error associations and progress bounds are tested.
- Real browser: tab activation with ArrowRight; menu opening with ArrowUp, Home navigation, Escape return focus and Shift+Tab leaving to the preceding Reset control. Modal Shift+Tab loops from Close to Cancel; Tab returns from Cancel to Close; Escape dismisses and returns focus to Open dialog.
- Real browser: 390px phone, 768px tablet and 1280px desktop page widths equal the viewport width. Phone anchored menu left/right bounds fit inside the viewport. Gallery keeps one column on smaller screens and two columns at 1280px. Existing visual direction and layout retained.
- Design chip computed gap is 8px. Optional SVG icons preserve text-only buttons and give icon-only buttons accessible names.
- Browser loads the reduced-motion media rules: shared durations become 0ms, animation and smooth scroll stop, pressed button translation is removed. Automated check parses these actual source rules and verifies their declarations.
- No browser console errors observed in the final interaction check.

## Not fully verified / boundaries

- This browser reports `prefers-reduced-motion: reduce` as false. Its automation interface does not expose media emulation, so the active reduced-motion experience was not visually exercised. Rule parsing/loading is verified; it is not a substitute for a real preference-on check.
- No full screen-reader session or cross-browser accessibility audit was performed. Focus and semantic behaviour were checked in the current browser and component tests.
- Dropdown is intentionally a simple anchored action list: bounded width/height and internal scroll, without automatic collision repositioning, portals or nested menus. Place it where there is space below and avoid clipping ancestors.
- Only a single modal at a time is supported. Product-specific async states and unsaved-change guards belong to future consuming apps.

No skill or product layouts were created.
