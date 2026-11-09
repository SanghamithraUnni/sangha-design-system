# Foundation decisions

## Sources and verification

Source: https://sanghadesign.framer.website/ plus its About and Works pages; initial measurements in ../portfolio-audit.md. The browser retry succeeded during this stage. At the narrow browser viewport, the live hero and first project card confirmed grey outer framing, white content surfaces, a pale blue pill action, dark text and rounded project wrappers. Embedded Mygate artwork and tool logos were not used as system references. Desktop values still come from published CSS, not a new measured desktop audit. No screenshot attachments were available in the message received.

## Retained from the portfolio

- Canvas #E8EAEB, surface #FFFFFF, subtle surface #F6F6F6, secondary text #5C5C6A, blue #0F67DB.
- #0C0C13 main text; #050505 primary actions. Similar dark values have distinct roles rather than arbitrary per-element choices.
- Manrope, including regular 400, medium 500, semibold 600 and bold 700.
- 32px display, 26px section, 20px title, 14px labels and 12px captions have source precedents. The display is not the oversized decorative gallery hero.
- Feature corners 24px, media corners 18px, small corners 8px. Pill shape retained with a normalized 999px value.
- Project-card gradient: 186deg #FDFDFD to #F5F5F5; original three-layer feature shadow retained in tokens.
- 1120px content-width token from card CSS.

## Normalized rules

- Manrope replaces scattered Satoshi/Inter Tight usage. This is a design decision, not a claim that the portfolio used one font everywhere.
- Type scale: 12, 14, 16, 18, 20, 26, 32px; body line height 1.6 and heading 1.3. Interface control labels use 1.2. Default root 16px and rem sizing preserve zoom.
- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px. Repeated existing sizes retained within a 4px base. 50/60px portfolio gaps become 48/64px by role.
- Default control 44px; compact 36px only where density requires it. Not a claim that original buttons were 44px.
- Feature cards are for prominent content, plain cards for everyday groups. Do not turn every message or list item into a shadowed card.
- Standard control radius 12px is an addition; 19px tool tiles are not a general system token.

## Additions for reusable interfaces

- Semantic colours: success #176744 on #EAF6EF; warning #805000 on #FFF4D9; danger #B42332 on #FFF0F1. Blue soft surface #EDF4FF. Labels communicate meaning alongside colour.
- Borders #D9DCE1 for decoration and #838591 for input boundaries. Blue hover #0A52B4 token reserved for accent actions; pale accent buttons use a darker pale fill on hover.
- Focus ring: white separation plus blue outer ring. Keyboard focus must remain visible; never remove it without replacement.
- Small elevation and overlay elevation; modal scrim, overlay layer 100.
- Motion: 120ms feedback, 200ms modal entrance, 320ms reserved for larger transitions; standard cubic-bezier(.2,0,0,1) and entrance cubic-bezier(0,0,.2,1). These timings are chosen defaults, not extracted values. Reduced-motion disables animation and smooth scrolling. No perpetual decorative motion; the loading indicator only conveys busy state.
- Input, interactive Tag and native dialog patterns; disabled, loading, error, empty and selected states where relevant. Avatar images fall back to initials.
- Phone preview layout at 700px and single-column gallery at 1100px are gallery additions, not portfolio breakpoints. Components remain fluid and wrap long text.

## Keyboard and behaviour contract

Native buttons: Tab then Enter/Space. Native links: Tab then Enter. No arrow-key contract because Nav is a link group, not tabs or a menu. Static cards, tags, avatars and list rows are not put into the tab order. Inputs have associated visible labels and descriptions. Native dialog handles focus containment and inert background; component handles dismissal, scroll locking and restoring focus. Escape dismisses, as do Cancel, Close and an outside click. Only one modal at a time is supported.

## Still open to feedback

Whether all-uppercase buttons still feel right; whether the blue should be more prominent; whether feature shadows should be softer; whether the compact sizing is comfortable. The gallery adds a larger editorial heading only for presentation, not as a new core display token. Dark mode and complex widgets are out of scope for this first foundation. Automated tests are useful interaction checks, not a full accessibility certification.

## v0.2 refinement additions

The existing ease-standard/ease-enter tokens are now explained in the preview and GUIDE.md; ease-exit is added as a reserved rule. Added semantic token aliases, hover/pressed tokens, control/icon/avatar sizes, border widths, density roles and named layers. The checkmark-to-label gap is explicitly 8px. Button icons are optional SVGs with action-specific meaning. Six general interface components were added without product-specific message/book UI. All added rules are extensions; none are claimed to be newly measured from the portfolio.
