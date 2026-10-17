// npm run dev を起動した状態で実行。サイトの部品から共有用カードを生成する。
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
    .header,.hero-facts,.hero-actions,.hero-edition,.marquee,main>section:not(.hero),.footer{display:none}
    .hero{padding:12px 36px 0;max-width:none}
    .hero-top{padding:20px 0 24px;border-top:0}
    .hero-top .eyebrow{font-size:15px}
    .hero-layout{grid-template-columns:1.1fr 1fr;gap:30px;padding:0}
    .hero h1{font-size:60px;line-height:1.25}
    .hero-description{font-size:15px;margin-top:25px}
    .hero-note{font-size:12px;margin-top:20px}
    .hero-art{aspect-ratio:1/1}
    .motion-toggle{display:none}
    .eighty-stack>span,.eighty-stack>.eighty-outline{font-size:310px}
  `,
  });
  await page.screenshot({
    path: fileURLToPath(new URL("../og-image.png", import.meta.url)),
  });
} finally {
  await browser.close();
}
