# Layout, density and extension decisions

## Choose from the task, not the portfolio layout

| Main task | Useful starting structure | Sangha treatment |
| --- | --- | --- |
| Act on many small items | Compact list beside a detail area; optional narrow navigation | Plain surfaces, separators, compact desktop rows, clear selected item |
| Explore a person or collection | Identity/summary above grouped content with optional secondary rail | Spacious heading, readable lists/grid, feature card only for a true highlight |
| Read a story or presentation | Constrained text column with deliberate section breaks | Generous whitespace, typographic hierarchy, sparse actions |
| Complete a focused task | Single column, labelled fields, one main action | Comfortable controls; modal only for a small interruption, page for long forms |
| Compare or monitor information | Summary above a structured list/grid, detail on demand | Use status text, Badge and determinate ProgressBar; avoid decorative dashboards unrelated to the brief |

These are starting options, not fixed templates. A narrow screen may replace a simultaneous detail pane with a separate view and a clear Back action. Never preserve desktop columns by making every column unreadably narrow. The preview's oversized hero and sidebar are presentation choices, not required brand elements.

## Density and responsive rules

Use 4/8/12px for local groups, 16/24px for controls and container interiors, 32/48/64/80px for progressively larger separation. Choose named tokens rather than arbitrary values. Comfortable list vertical padding is 16px and compact is 8px. Preserve the 16px body role; smaller labels are for metadata, not the entire interface.

Start with comfortable 44px controls. Compact 36px controls are useful for repeated desktop actions, not as a blanket phone style. Use 32px desktop page gutters and 16px phone gutters, a 1120px content container where suitable, and the existing 700/1100px responsive ranges as starting guidance. Wide workspaces may need a documented wider container; do not force every product into the portfolio max width.

On phones (700px or narrower), stack secondary regions and keep a clear primary task. Between 701 and 1100px simplify sidebars/columns. Above 1100px allow parallel regions when the task benefits. Let content needs refine these defaults. Test at least narrow and wide sizes, long names/titles and empty/error states.

## Surface, layout and type hierarchy

- Use the cool grey page canvas and one white shell with a subtle border for a cohesive page. Define groups inside it with spacing and section headings. Add a card when its content needs a clear boundary or an independent action.
- Make the lead region richer with a meaningful image or icon, stronger title, and one intentional tint. Use mint or lavender for distinct supporting groups. Keep most surfaces quiet so the lead region has contrast.
- Give the main region the width needed for the visitor’s task. Use a compact rail for timely context. Move long collections below the lead region at a readable width and stack sections in task order on phones.
- Use consistent media frames and align card footers within each row. Preserve image proportions and let titles wrap. Use the body role for prose, the title role for card headings, and small roles for dates, authors, and counts.
- Use the shared Phosphor aliases for recognizable section and action cues. Pair icons with visible headings or accessible action names. Use the rating token for gold stars, keep the numerical score neutral, and signal a selected reaction through shape and a pressed state.

## Action, search and review hierarchy

- Give each major view a clear leading action when the task calls for one. Use the existing dark primary Button for that action. Use the pale blue accent Button selectively for supporting emphasis. Use accent text selectively for a quiet action that advances the current section. Keep repeated row labels and utility actions in neutral text, with clear hover and focus cues. Use sentence case and a specific verb. Keep supporting controls visually quieter and preserve named states.
- Compose global search from a labelled search input, a decorative leading magnifier, and an adjacent submit action. Use a short placeholder that names searchable content, an accessible label, and `type="search"` with the search keyboard hint. Keep the submit action visible at narrow widths.
- For review collections, compose a recognisable item header (title and supporting identity, with a thumbnail when it helps), compact rating and date metadata, a readable excerpt, and a distinct footer for the full review and reactions. Use an accessible textual rating and pressed state for reactions. Emphasise the title over metadata, and reserve the body type role for reading-length content. Use this hierarchy in lists or cards according to density, and group the collection on a tinted surface only when it helps distinguish the section.

## Researching familiar patterns

Look at established products that solve the same interaction and at primary research when available. Identify the behavior worth carrying forward, then use Sangha primitives and tokens to compose it. For example, [Letterboxd reviews](https://letterboxd.com/film/parasite-2019/reviews/) separate review metadata from commentary, and [Baymard search research](https://baymard.com/research-articles/mobile-search-submit-button) supports a visible submit control next to a search field. Validate the resulting composition with realistic content, keyboard navigation, and narrow screens.

## Extending a missing pattern

1. Name the interaction need: choosing a date, viewing many columns, attaching a file, reordering items, etc. Product nouns alone do not justify a new base component.
2. Look for a composition of existing primitives. A summary tile can be Card + Badge + Button; a filter can be controlled Tag; a labelled multiline field is Textarea. Avoid extra cards around every list row.
3. If new behaviour is necessary, choose proper semantics and keyboard interaction first. A native select may be a better addition than turning the action DropdownMenu into a select. For genuinely complex widgets use a suitable accessible primitive rather than approximating the behaviour with styled divs.
4. Keep colour roles, Manrope, spacing, radius, focus and motion rules. Add a role token only when no existing one can express the need. Explain why; avoid product-specific tokens such as book-green or chat-padding in the shared system.
5. Put generic additions in design-system with usage/state documentation and meaningful tests. Product-specific compositions stay outside it and import shared components. Preserve old APIs or make migration explicit.
6. Label the result as an addition, with rationale and constraints. If a shared rule changes, update its documentation and portable snapshot rather than creating a second undocumented variant.

Do not invent new imagery/colours from embedded portfolio case-study screenshots. Product media (book covers, photographs, charts) may have its own content colours; the surrounding interface retains the Sangha roles.

## Limits that affect layout

- Modal supports one open instance and restores focus; long, multi-step tasks usually need a page.
- DropdownMenu is an anchored action list without collision repositioning, portals or submenus. Leave room below and avoid clipping ancestors. A complex overlay is a new pattern, not a token tweak.
- Tabs use immediate automatic activation, so their panels should be local and fast. Remote heavy content may need a separately documented manual-activation variant.
- Badge and static Tag are not buttons. Nav uses links, not tab semantics. ProgressBar is determinate only. Textarea Enter creates a newline.
- Reduced-motion rule loading has been verified; preference-on visual testing is still unverified in the original gallery. Re-test in the target environment and report the actual evidence.

## Handoff

Describe why the chosen structure helps the user's primary task. Name components reused and additions made. State how to run the result, which checks passed and which were unavailable. Do not claim the skill has been live-tested on an unfamiliar product merely because its metadata validated.
