import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL(
  "../app/(site)/about/page.module.css",
  import.meta.url,
);

test("about intro heading follows the responsive type scale", async () => {
  const stylesSource = await readFile(stylesUrl, "utf8");

  assert.match(
    stylesSource,
    /\.introCopy h2\s*\{[^}]*font-size:\s*28px[^}]*font-style:\s*normal[^}]*font-weight:\s*700[^}]*line-height:\s*36px[^}]*letter-spacing:\s*-0\.015em/s,
  );
  assert.match(
    stylesSource,
    /@media \(max-width:\s*1080px\)[\s\S]*?\.introCopy h2\s*\{[^}]*font-size:\s*24px[^}]*line-height:\s*32px/s,
  );
});
