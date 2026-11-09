# Portfolio style audit

Reviewed 8 November 2026. Source: https://sanghadesign.framer.website/ and its /about-me and /works pages.

## Scope and confidence

This is an initial audit of the published HTML and CSS, not a completed visual or interaction review. The browser tool stalled, so rendered appearance, loaded fonts, hover/focus states and responsive behaviour remain unverified. Values below are declarations in the published source; they are not measurements from a rendered screenshot. Responsive and hidden variants coexist in that source.

Only portfolio interface elements are included: navigation, introduction, project card wrappers, captions, buttons, testimonials and footer. Styles within project screenshots and third-party tool logos are excluded. Merely loading a font or declaring a colour token does not make it part of the portfolio's active visual language.

## Existing visual direction

A restrained, neutral portfolio with blue accents, Manrope typography, generous space, pill actions and large rounded project cards. Subtle gradients and layered shadows add softness. The dark footer provides a strong closing section. This direction is inferred from source structure and styles, pending visual verification.

## Verified source values

| Area | Existing evidence | What to resolve |
| --- | --- | --- |
| Backgrounds | Homepage outer background #E8EAEB; work section white; navigation #F6F6F6 | Give each surface a clear role |
| Text | #050505 and #0C0C13 for dark text; #5C5C6A for supporting text; some opacity-based dark text | Decide whether similar dark values need separate roles |
| Accent | #0F67DB on active navigation text and resume accent button | Define selected, hover and focus uses; check rendered link overrides |
| Typography | Manrope dominates; weights 400, 500, 600 and desktop active navigation 700. Satoshi occurs in mobile hero and some metadata; Inter Tight occurs in phone navigation | Decide which differences are intentional; loaded font rendering is unverified |
| Type examples | Desktop hero 32px/130%, mobile hero 24px/130%; project title 26px desktop and 20px mobile; button label 14px/1.1, weight 500, uppercase; desktop nav 15px | These examples are not yet a complete type scale |
| Text rhythm | Many descriptions use 1.4 line height; some mobile descriptions use 1.6. Letter spacing includes -0.3px, -0.5px, -1px and relative values | Establish a small set of text roles with consistent line heights and tracking |
| Buttons | Dark primary, subtle neutral outline and pale blue accent variants; 50px radius; base CSS 8px vertical / 16px horizontal padding and 38px height; instances may override height, including 36px parent containers | Choose final sizes and verify resulting rendered heights |
| Project cards | Repeated 24px outer radius, 18px image-wrapper radius, 186-degree #FDFDFD to #F5F5F5 gradient and the same layered shadow | Name this as a feature-card treatment; do not apply its full size/shadow everywhere |
| Other corners | Tool tiles 19px; testimonial cards 8px; pill buttons 50px | Define roles for the different corner sizes rather than assuming one universal radius |
| Spacing | Homepage outer padding 32px desktop and 16px mobile; work-section horizontal padding 50px desktop / 48px tablet / 20px phone; card gap 32px desktop; phone card padding 24px; work-card list gap 60px desktop and 80px phone | Existing spacing mixes multiple increments; create a deliberate scale and separate spacious portfolio layouts from dense app layouts |
| Layout | Desktop project card uses text and image columns; phone variants stack. Card base max-width 1120px; several component bases use 1200px. Homepage media boundaries include 810px and 1200px | Confirm widths and breakpoints visually; define shared container rules |
| Elevation | Project cards repeat a three-layer shadow; accent button uses inset shadows; testimonials use a radial light gradient | Define reusable elevation roles and distinguish decoration from functional layering |
| Motion | Source includes entrance opacity/transform setup, sticky project-card positioning, smooth-scroll hooks and a link underline hover rule | Exact intended durations/easing, reduced-motion handling and live behaviour are not verified |

## What is already consistent

- Manrope is the dominant interface font across the three pages.
- Neutral surfaces, dark text and restrained blue accents form a coherent starting palette.
- Project cards reuse a recognisable wrapper, corner treatment, shadow and action style.
- Buttons reuse a pill shape and uppercase labels.
- Desktop-to-phone variants generally move from side-by-side content to vertical stacking.

## What needs tidying

- Decide whether Satoshi and Inter Tight add necessary roles or are leftovers to consolidate.
- Replace scattered near-black/grey values with named colour roles.
- Group font sizes, line heights and letter spacing into deliberate text roles.
- Define spacing and corner scales with clear uses. Different values are not automatically errors, but their purpose needs documentation.
- Reconcile button base heights and instance overrides.
- Separate reusable card styling from portfolio-specific fixed dimensions and image presentation.
- Check dark-footer action contrast and navigation link colour overrides in a rendered browser before claiming accessibility or final colours.

## Missing or unverified for the assignment

- A documented token set for colour, type, spacing, radius, elevation and motion.
- React components: Button, Input, Card, Tag, Nav, List, Modal or Sheet, Avatar. Existing visual examples do not satisfy the React deliverable by themselves.
- Inputs, tags and modal/sheet patterns are not evidenced by the inspected page interfaces. Portraits and experience rows provide partial references for Avatar and List, not complete component rules.
- Hover, pressed, focus, disabled, loading, selected, error and empty states as applicable.
- Functional colours for success, warning and error; accessible contrast and keyboard behaviour.
- Rules for dense lists, long conversations, long titles, overflowing content and smaller controls.
- Verified animation durations/easing and reduced-motion behaviour.
- The reusable skill and six runnable product layouts remain later assignment stages.

## Proposed direction, not approved tokens

Keep the neutral palette, restrained blue accent, Manrope-led hierarchy, rounded containers and pill actions. Preserve generous spacing for feature areas, then add a compact spacing mode for chat and reading lists. Define missing functional patterns as explicit extensions rather than pretending they already exist in the portfolio.

No components, design-system implementation or skill have been built.
