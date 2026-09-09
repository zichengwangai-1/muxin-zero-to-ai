**Comparison Target**

- Source visual truth path: `/Users/wangzicheng/Desktop/截屏2026-09-05 13.24.03.png`
- Implementation: `http://127.0.0.1:5175/` in the Codex in-app browser
- Reference size: `2408 x 1194` px; implementation desktop viewport: `1204 x 597` CSS px
- Responsive validation viewport: `390 x 844` CSS px
- State: homepage, default theme, no search term, no interaction state

**Full-view Comparison Evidence**

- The existing two-column hero, headline lockup, learning-principle cards, time-value card, and outcome panel retain the approved visual direction.
- The desktop hero now uses one shared vertical grid: the left time-value card and right outcome panel finish on the same bottom line.
- The page container uses a consistent 1180px maximum width and 20px desktop gutters; mobile uses 14px gutters.
- Mobile collapses to one column without horizontal overflow (`bodyScrollWidth = viewportWidth = 390`).

**Focused Region Comparison Evidence**

- All three homepage feature cards now use the same 48px icon rail, 14px icon-to-copy gap, and 18px card padding.
- Measured copy offsets are identical: `81px / 81px / 81px` from each card's left edge.
- Measured desktop hero bottom difference is `2.1px`, within the 3px visual QA tolerance.
- The right outcome cards use the same icon/copy grid and consistent title/description hierarchy.

**Required Fidelity Surfaces**

- Fonts and typography: rounded display headings and system-body text are retained; card descriptions are normalized to 12px/1.65.
- Spacing and layout rhythm: 4px spacing base, shared card padding, and standardized 14/18/22/30px radius roles are implemented as tokens.
- Colors and visual direction: the existing light-blue background, dark ink cards, violet/blue accents, and champagne-gold time card are unchanged.
- Content and routes: no learning content, route, card order, or interaction behavior was changed.
- Shared pages: AI Product Job Search hub, article, and search-result pages were visually sampled at 390px and showed no overflow.

**Findings**

- No actionable P0, P1, or P2 differences found in the changed region.

**Open Questions**

- None.

**Implementation Checklist**

- [x] Document the layout and typography standard in `docs/design-system.md`.
- [x] Convert shared layout values into reusable CSS variables.
- [x] Align the three feature-card copy rails.
- [x] Align the homepage hero's left and right bottom edges.
- [x] Normalize shared cards, search results, module cards, article cards, and tables.
- [x] Verify desktop and mobile layouts in the in-app browser.
- [x] Confirm no browser console warnings or errors on the inspected mobile pages.

**Comparison History**

- Initial source review: P2 alignment issues found in the three feature-card copy rails and in the hero's left/right bottom edges.
- Correction pass: introduced shared icon rails, copy gaps, card padding, font roles, and stretch-based desktop hero alignment.
- Final comparison: desktop offsets and bottom edge measured, then homepage, hub, article, and search pages checked at mobile width.

**Follow-up Polish**

- None required for this scoped change.

final result: passed
