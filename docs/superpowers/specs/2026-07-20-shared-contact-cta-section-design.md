# Shared Contact CTA Section Design

## Goal

Use one reusable `CtaSection` for the contact sections on the landing, portfolio,
customer review, FAQ, and product type pages while preserving each Figma screen's
content and button differences.

The component owns the shared background, spacing, typography, responsive layout,
and button presentation. Pages provide only the content that actually differs.

## Figma Comparison

| Page | Figma node | Badge | Title | Description | Secondary action |
| --- | --- | --- | --- | --- | --- |
| Landing | `22:2128` | Present | Two lines with brand emphasis | 16px | Pricing |
| Portfolio | `27:5034` | None | One line | 16px | Pricing |
| Customer review | `41:9161` | None | Two lines | None | Pricing |
| FAQ | `51:1412` | Business hours | One line | 14px | None |
| Product type | `177:1620` | None | One line | 14px | FAQ |

All five designs share the same background artwork, centered layout, 104px desktop
vertical padding, 52px content-to-action gap, and 164x52px action buttons.

## Component API

Keep the existing `CtaSection` and narrow its props to the confirmed variations:

```tsx
type CtaSectionProps = {
  id?: string;
  badge?: string;
  titleLines: readonly ReactNode[];
  description?: string;
  descriptionSize?: "sm" | "md";
  secondaryAction?: {
    label: string;
    href: string;
  };
};
```

- `titleLines` preserves intentional Figma line breaks and allows the landing page
  to emphasize `씨브레인` without introducing a one-page-only highlight prop.
- `descriptionSize` maps the confirmed 14px and 16px description styles. It defaults
  to `sm`; landing and portfolio pass `md` explicitly.
- The Kakao consultation action is always rendered and remains internal because it
  is identical in every design.
- `secondaryAction` renders the brand-colored second action when supplied. FAQ omits
  it, while product type supplies the FAQ label and URL.
- The shared background is fixed inside the component because every supplied design
  uses the same artwork. Do not keep a speculative `backgroundImage` prop.

## Structure And Styling

Move CTA-only styles from `app/page.module.css` into
`app/_components/CtaSection.module.css`. This keeps the reusable component independent
from the landing page stylesheet.

The shared component renders:

1. Semantic `section` with an optional `id`.
2. Decorative background marked `aria-hidden`.
3. Optional badge.
4. Heading lines and optional description.
5. Kakao action and optional secondary action.

Responsive behavior is defined once in the component stylesheet. Pages must not add
page-specific CTA width variables or duplicate the shared CTA layout CSS.

Reuse the existing `Button`, `Icon`, and `createGradientBorderButtonStyle` utilities.
Do not introduce another button abstraction or dependency.

## Page Configuration

- Landing: badge, two title lines, highlighted brand text, `md` description, pricing.
- Portfolio: one title line, `md` description, pricing.
- Customer review: two title lines, no description, pricing.
- FAQ: business-hours badge, one title line, `sm` description, no secondary action.
- Product type: one title line, `sm` description, FAQ secondary action.

Only pages present on `main` are migrated in the shared CTA branch. Feature-only
pages merge the completed shared component from `main` and replace their duplicate
section in their own branch.

## Verification

- Unit-level source checks cover optional badge, description size, title lines, and
  optional secondary action rendering.
- Type checking and linting must pass for the user app.
- Production build must include all routes available on `main`.
- Visual checks cover desktop and mobile widths for the landing and FAQ variants;
  page feature branches verify their own content after adopting the component.

## Rollout

1. Implement and verify on `feat/shared-cta-section` after merging latest `main`.
2. Merge the shared CTA branch into `main`.
3. Merge latest `main` into portfolio, customer review, and product type branches.
4. Replace each branch's duplicate contact markup and styles with `CtaSection`.

