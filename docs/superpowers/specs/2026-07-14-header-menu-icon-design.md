# Header Menu Icon Design

## Scope

Update only the shared header menu button's visual styling. Preserve the
existing button behavior, accessible label, header layout, and responsive
visibility rules.

## Figma Source

- File: `qZcNE6of4hWidBcayhacSI`
- Node: `27:3896`
- Icon name: `menu-04`

## Visual Specification

- Render the visible icon at `24px` by `24px`.
- Use stroke color `#F8FAFC` (`W_텍스트_1000`).
- Use a `2px` round-capped stroke.
- Match the Figma path exactly: `M13.5 18H4M20 12H4M20 6H4`.
- Remove the current visible border and translucent background from the menu
  button.
- Keep a `40px` by `40px` transparent click target for usability.

## Implementation

- Replace the three CSS-generated bars in
  `apps/user/app/_components/Header.tsx` with an inline SVG so the unequal
  lower line matches the Figma asset exactly.
- Update `apps/user/app/page.module.css` to remove the old bordered button and
  bar styles while retaining centering and the existing responsive display
  behavior.

## Verification

- Confirm the SVG renders at `24px` by `24px` and the button remains `40px` by
  `40px`.
- Confirm the path stroke resolves to `#F8FAFC`, has a `2px` width, and uses
  round line caps.
- Run the user app lint and type checks.
- Verify the header visually at a viewport where the menu button is visible.
