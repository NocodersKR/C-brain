# Shared Page Hero Design

## Goal

Provide one reusable hero component for the landing page and future user-facing subpages while preserving the current landing-page appearance.

## Figma Findings

- Figma nodes `51:664`, `33:3347`, `27:4116`, `41:8995`, and `41:5657` share the same badge, heading, description, content width, and left-aligned composition.
- The shared desktop typography is a `36px/48px` title and a `16px/24px` description with a maximum width of `538px`.
- The badge-to-heading gap is `20px`, and the title-to-description gap is `8px`.
- Subpages change the badge text, title, description, background image, and light or dark foreground tone.
- The landing page is a variant of the shared hero with highlighted title content, two description rows, and an action group separated from the copy by `52px`.

## Architecture

- Add a shared `PageHero` component under `apps/user/components`.
- `PageHero` owns the hero shell, background layer, directional readability overlay, responsive container, badge, title, description, and optional action area.
- The component accepts `variant="landing" | "subpage"`, `tone="light" | "dark"`, `badge`, `title`, `description`, `backgroundImage`, and optional `actions` props.
- Keep `Header` and `Footer` in the Next.js route-group layout so they persist across user-page navigation.
- Keep a thin landing `Hero` wrapper that supplies landing-specific content and buttons to `PageHero`. Future pages can supply their own text and image without duplicating the hero structure.
- Do not add route-name conditionals, client-side pathname checks, parallel routes, or new dependencies.

## Styling

- Move hero-only structural and responsive CSS from `page.module.css` into `PageHero.module.css`.
- Keep button-specific gradient-border styling in the landing `Hero` wrapper because future subpage heroes do not show the landing action group.
- Preserve the current landing background position, height, spacing, line breaks, and button appearance.
- Support a dark tone for designs such as the notice hero, where the badge, title, and description are light.

## Verification

- Run user-app lint, type checks, and the production build.
- At `1920px`, verify the landing hero retains its existing content, `1360px` content width, `632px` minimum height, and `52px` copy-to-action gap.
- Confirm the shared component exposes the subpage props without rendering unused actions.
- Confirm `/color` remains outside the site layout and does not receive the shared hero.
- Confirm no Figma asset URLs are committed to the repository.
