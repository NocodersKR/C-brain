import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const headerUrl = new URL("../app/_components/Header.tsx", import.meta.url);
const heroUrl = new URL("../app/_components/Hero.tsx", import.meta.url);

test("landing price buttons navigate to the order page", async () => {
  const [headerSource, heroSource] = await Promise.all([
    readFile(headerUrl, "utf8"),
    readFile(heroUrl, "utf8"),
  ]);

  for (const source of [headerSource, heroSource]) {
    assert.match(source, /useRouter/);
    assert.match(source, /router\.push\("\/order"\)/);
    assert.match(
      source,
      /<Button[\s\S]*?onClick=\{handlePriceButtonClick\}[\s\S]*?>[\s\S]*?정찰제 가격 보기[\s\S]*?<\/Button>/,
    );
  }
});
