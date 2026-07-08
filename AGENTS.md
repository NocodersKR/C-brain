# Agent Instructions

Before implementing or modifying UI, read `design.md` and follow the current design-system rules for typography, icons, assets, and component behavior.

## Figma MCP Asset Handling

When implementing UI from Figma MCP, never keep MCP asset URLs in source code.

Forbidden in app/source code:
- `https://www.figma.com/api/mcp/asset/*`
- `https://www.figma.com/api/*`

Required workflow:
- Download MCP asset URLs into `apps/user/public/figma-assets/`.
- Reference downloaded assets with local public paths, e.g. `/figma-assets/logo.svg`.
- Use stable filenames that describe the asset.
- Do not add `figma.com` to Next.js remote image config just to make MCP asset URLs work.
- For simple UI icons, avoid remote assets. Use inline SVG/component code or the local project icon pattern.

Required final check after Figma UI implementation:

```bash
rg "figma.com/api/mcp/asset|https://www.figma.com/api" apps packages
```

The command must return no matches before the task is considered complete.
