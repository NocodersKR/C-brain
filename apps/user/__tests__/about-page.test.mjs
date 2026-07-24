import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const stylesUrl = new URL(
  "../app/(site)/about/page.module.css",
  import.meta.url,
);
const pageUrl = new URL("../app/(site)/about/page.tsx", import.meta.url);
const companyUrl = new URL("../app/_content/company.ts", import.meta.url);

function cssBlock(source, selector) {
  const start = source.indexOf(selector);
  assert.notEqual(start, -1);

  const openBrace = source.indexOf("{", start);
  assert.notEqual(openBrace, -1);

  let depth = 0;
  for (let index = openBrace; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openBrace + 1, index);
      }
    }
  }

  assert.fail(`Missing closing brace for ${selector}`);
}

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

test("about mobile timeline keeps title fragments on the same line", async () => {
  const [stylesSource, pageSource, companySource] = await Promise.all([
    readFile(stylesUrl, "utf8"),
    readFile(pageUrl, "utf8"),
    readFile(companyUrl, "utf8"),
  ]);
  const mobileStart = stylesSource.indexOf("@media (max-width: 699px)");
  const compactMobileStart = stylesSource.indexOf(
    "@media (max-width: 480px)",
    mobileStart,
  );
  const mobileStyles = stylesSource.slice(mobileStart, compactMobileStart);

  assert.notEqual(mobileStart, -1);
  assert.notEqual(compactMobileStart, -1);
  const timelineTextStyles = cssBlock(mobileStyles, ".timelineBody p");

  assert.doesNotMatch(timelineTextStyles, /display:\s*flex;/);
  assert.doesNotMatch(timelineTextStyles, /flex-direction:/);
  assert.doesNotMatch(timelineTextStyles, /flex-wrap:/);
  assert.match(
    cssBlock(stylesSource, ".timelineDetailBreak"),
    /display:\s*block;/,
  );
  assert.doesNotMatch(
    mobileStyles,
    /\.timelineDetail\s*\{[\s\S]*?display:\s*block/,
  );
  assert.match(pageSource, /className=\{styles\.timelineTitle\}/);
  assert.match(pageSource, /styles\.timelineDetailBreak/);
  assert.match(companySource, /year:\s*"2010"[\s\S]*?detailLineBreak:\s*true/);
  assert.match(companySource, /year:\s*"2011"[\s\S]*?detailLineBreak:\s*true/);
  assert.match(
    companySource,
    /year:\s*"2015"[\s\S]*?detailPrefix:\s*" \/ "/,
  );
});
