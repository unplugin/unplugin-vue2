import type puppeteer from "puppeteer";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import {
  expectByPolling,
  getComputedColor,
  getEl,
  getText,
  killServer,
  postTest,
  preTest,
  startServer,
  updateFile,
} from "./util";

const TIMEOUT = 1_000_000;

beforeAll(async () => {
  await preTest();
}, TIMEOUT);

afterAll(postTest, TIMEOUT);

describe("unplugin-vue2", () => {
  describe("dev", () => {
    declareTests(false);
  });

  describe("build", () => {
    declareTests(true);
  });
});

export function declareTests(isBuild: boolean) {
  let page: puppeteer.Page = undefined!;

  beforeAll(async () => {
    page = await startServer(isBuild);
  }, TIMEOUT);

  afterAll(async () => {
    await killServer();
  }, TIMEOUT);

  test("sFC <script setup>", async () => {
    const el = (await page.$(".script-setup"))!;

    // custom directive
    await expect(getComputedColor(el)).resolves.toBe("rgb(255, 0, 0)");
    // defineProps
    await expect(getText((await page.$(".prop"))!)).resolves.toMatch(
      "prop from parent",
    );

    // state
    const button = (await page.$(".script-setup button"))!;

    await expect(getText(button)).resolves.toMatch("0");

    // click
    await page.click(".script-setup button");

    await expect(getText(button)).resolves.toMatch("1");

    if (!isBuild) {
      // hmr
      await updateFile("ScriptSetup.vue", (content) =>
        content.replace("{{ count }}", "{{ count }}!"),
      );
      await expectByPolling(() => getText(button), "1!");
    }
  });

  if (!isBuild) {
    test("hmr (vue re-render)", async () => {
      const button = (await page.$(".hmr-increment"))!;
      await button.click();

      await expect(getText(button)).resolves.toMatch(">>> 1 <<<");

      await updateFile("hmr/TestHmr.vue", (content) =>
        content.replace("{{ count }}", "count is {{ count }}"),
      );
      // note: using the same button to ensure the component did only re-render
      // if it's a reload, it would have replaced the button with a new one.
      await expectByPolling(() => getText(button), "count is 1");
    });

    test("hmr (vue reload)", async () => {
      await updateFile("hmr/TestHmr.vue", (content) =>
        content.replace("count: 0", "count: 1337"),
      );
      await expectByPolling(() => getText(".hmr-increment"), "count is 1337");
    });
  }

  test("sFC <style scoped>", async () => {
    const el = (await page.$(".style-scoped"))!;

    await expect(getComputedColor(el)).resolves.toBe("rgb(138, 43, 226)");

    if (!isBuild) {
      await updateFile("css/TestScopedCss.vue", (content) =>
        content.replace("rgb(138, 43, 226)", "rgb(0, 0, 0)"),
      );
      await expectByPolling(() => getComputedColor(el), "rgb(0, 0, 0)");
    }
  });

  test("sFC <style module>", async () => {
    const el = (await page.$(".css-modules-sfc"))!;

    await expect(getComputedColor(el)).resolves.toBe("rgb(0, 0, 255)");

    if (!isBuild) {
      await updateFile("css/TestCssModules.vue", (content) =>
        content.replace("color: blue;", "color: rgb(0, 0, 0);"),
      );
      // css module results in component reload so must use fresh selector
      await expectByPolling(
        () => getComputedColor(".css-modules-sfc"),
        "rgb(0, 0, 0)",
      );
    }
  });

  test("sFC <custom>", async () => {
    await expect(getText(".custom-block")).resolves.toMatch("Custom Block");
    await expect(getText(".custom-block-lang")).resolves.toMatch(
      "Custom Block",
    );
    await expect(getText(".custom-block-src")).resolves.toMatch("Custom Block");
  });

  test("sFC src imports", async () => {
    await expect(getText(".src-imports-script")).resolves.toMatch(
      'src="./script.ts"',
    );

    const el = (await getEl(".src-imports-style"))!;

    await expect(getComputedColor(el)).resolves.toBe("rgb(119, 136, 153)");

    if (!isBuild) {
      // test style first, should not reload the component
      await updateFile("src-import/style.css", (c) =>
        c.replace("rgb(119, 136, 153)", "rgb(0, 0, 0)"),
      );
      await expectByPolling(() => getComputedColor(el), "rgb(0, 0, 0)");
      // script
      await updateFile("src-import/script.ts", (c) =>
        c.replace("hello", "bye"),
      );
      await expectByPolling(() => getText(".src-imports-script"), "bye from");
      // template
      // todo fix test, file change is only triggered one event.
      // src/node/server/serverPluginHmr.ts is not triggered, maybe caused by chokidar
      // await updateFile('src-import/template.html', (c) =>
      //   c.replace('gray', 'red')
      // )
      // await expectByPolling(
      //   () => getText('.src-imports-style'),
      //   'This should be light red'
      // )
    }
  });

  test("sFC Recursive Component", async () => {
    await expect(getText(".test-recursive-item")).resolves.toMatch(
      /name-1-1-1/,
    );
  });

  test("sFC Async Component", async () => {
    await expect(getText(".async-component-a")).resolves.toMatch(
      "This is componentA",
    );
    await expect(getText(".async-component-b")).resolves.toMatch(
      "This is componentB",
    );
  });

  test("css v-bind", async () => {
    const el = (await getEl(".css-v-bind"))!;

    await expect(getComputedColor(el)).resolves.toBe("rgb(255, 0, 0)");

    await el.click();

    await expect(getComputedColor(el)).resolves.toBe("rgb(0, 128, 0)");
  });
}
