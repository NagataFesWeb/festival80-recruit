import { mkdir, copyFile } from "node:fs/promises";
const publicFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "config.js",
  "favicon.svg",
  "og-image.png",
  ".nojekyll",
];
await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
for (const file of publicFiles) {
  await copyFile(
    new URL(`../${file}`, import.meta.url),
    new URL(`../dist/${file}`, import.meta.url),
  );
}
console.log(`Built ${publicFiles.length} public files into dist/.`);
