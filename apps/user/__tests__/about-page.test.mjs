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

test("about hero title uses the mobile line break before the compact mobile breakpoint", async () => {
  const stylesSource = await readFile(stylesUrl, "utf8");
  const mobileStart = stylesSource.indexOf("@media (max-width: 699px)");
  const compactMobileStart = stylesSource.indexOf(
    "@media (max-width: 480px)",
    mobileStart,
  );

  assert.notEqual(mobileStart, -1);
  assert.notEqual(compactMobileStart, -1);

  assert.match(
    stylesSource.slice(mobileStart, compactMobileStart),
    /\.heroTitleMobileBreak\s*\{[\s\S]*?display:\s*block;/,
  );
});

test("about hero mobile description can wrap inside narrow screens", async () => {
  const stylesSource = await readFile(stylesUrl, "utf8");
  const mobileStart = stylesSource.indexOf("@media (max-width: 699px)");
  const compactMobileStart = stylesSource.indexOf(
    "@media (max-width: 480px)",
    mobileStart,
  );
  const mobileStyles = stylesSource.slice(mobileStart, compactMobileStart);

  assert.notEqual(mobileStart, -1);
  assert.notEqual(compactMobileStart, -1);
  assert.match(
    mobileStyles,
    /\.heroDescriptionLine\s*\{[\s\S]*?white-space:\s*normal;/,
  );
  assert.match(
    mobileStyles,
    /\.heroDescriptionLineDesktop\s*\{[\s\S]*?display:\s*none;/,
  );
  assert.match(
    mobileStyles,
    /\.heroDescriptionLineMobile\s*\{[\s\S]*?display:\s*block;/,
  );
});
