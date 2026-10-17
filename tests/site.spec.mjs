import { test, expect } from "@playwright/test";

test("recruitment, keyboard navigation, game completion and replay", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/config.js", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: "window.RECRUIT_CONFIG={googleFormUrl:'',lineOpenChatUrl:''};",
    }),
  );
  await page.goto("/");
  await expect(page).toHaveTitle(/第80代文化祭/);
  await page
    .getByRole("link", { name: "開発班に参加する", exact: false })
    .click();
  await expect(page).toHaveURL(/#join$/);
  await page
    .getByRole("link", { name: "Googleフォームで参加する", exact: false })
    .click();
  await expect(page.locator("#link-status")).toContainText(
    "Googleフォームのリンクは準備中",
  );
  const motion = page.getByRole("button", { name: "動きを止める" });
  await motion.click();
  await expect(
    page.getByRole("button", { name: "動きを再生する" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByText("プログラミングをしたことがなくても入れますか？", {
      exact: false,
    })
    .click();
  await expect(page.locator("details").first()).toHaveAttribute("open", "");
  await page.clock.install();
  await page.getByRole("button", { name: "あそんでみる" }).click();
  await page.getByRole("button", { name: "ひらめきをキャッチ" }).press("Enter");
  await expect(page.locator("#game-score")).toHaveText("01");
  await page.clock.fastForward(15100);
  await expect(page.locator("#final-score")).toHaveText("1");
  await expect(page.locator("#best-score")).toHaveText("01");
  await expect(
    page.getByRole("button", { name: "もう一度あそぶ" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "もう一度あそぶ" }).click();
  await expect(page.locator("#game-score")).toHaveText("00");
  await expect(page.locator("#game-target")).toBeVisible();
  await page.reload();
  await expect(page.locator("#best-score")).toHaveText("01");
  expect(errors).toEqual([]);
});

test("configured destinations link to the supplied services", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('[data-join="form"]')).toHaveAttribute(
    "href",
    "https://forms.gle/K3Dv2pyDCgGowLHS9",
  );
  await expect(page.locator('[data-join="line"]')).toHaveAttribute(
    "href",
    "https://line.me/ti/g2/EqxCJzpGziyE70LRw105mZcsFbgGJ-V2h0IkcQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default",
  );
  for (const service of ["form", "line"]) {
    await expect(page.locator(`[data-join="${service}"]`)).toHaveAttribute("target", "_blank");
    await expect(page.locator(`[data-join="${service}"]`)).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(page.locator("#link-status")).not.toContainText("準備中");
});

for (const width of [320, 390, 760, 1024, 1440]) {
  test(`layout and visuals at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
    await page.locator("#game-start").click();
    await page.locator("#game-target").click();
    await expect(page.locator("#game-score")).toHaveText("01");
    if (width === 390 || width === 1440) {
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `artifacts/home-${width}.png`,
        fullPage: true,
      });
      await page.screenshot({ path: `artifacts/hero-${width}.png` });
    }
  });
}
