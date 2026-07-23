import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sectionPath = new URL(
  "../app/_components/ServicesSection.tsx",
  import.meta.url,
);

test("landing services always render the nine design QA fixtures", async () => {
  const source = await readFile(sectionPath, "utf8");

  assert.doesNotMatch(source, /@repo\/supabase/);
  assert.doesNotMatch(source, /createUserSupabaseClient/);
  assert.doesNotMatch(source, /listPublishedProducts/);
  assert.doesNotMatch(source, /loadLandingServices/);
  assert.match(source, /const services = \[/);
  assert.match(source, /\{services\.map\(\(service\) =>/);

  const fixtureBlock = source.slice(
    source.indexOf("const services"),
    source.indexOf("const textButtonStyle"),
  );
  assert.equal(fixtureBlock.match(/title: /g)?.length, 9);
});
