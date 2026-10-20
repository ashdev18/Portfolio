// Renders the PNG assets with a headless browser, from the SVGs export.js wrote.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

module.exports = async function render(M, OUT) {
  // CHROMIUM_PATH lets you use an already installed Chromium instead of Playwright's own download.
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  let n = 0;
  const shot = async (html, w, h, rel, transparent = false) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden">${html}</body></html>`);
    await page.screenshot({ path: path.join(OUT, rel), omitBackground: transparent });
    n++;
  };
  const read = rel => fs.readFileSync(path.join(OUT, rel), "utf8");
  const box = (bg, svg, pad, round = "0") => `<div style="width:100%;height:100%;display:grid;place-items:center;background:${bg};border-radius:${round}"><div style="width:${100 - pad * 2}%">${svg}</div></div>`;

  for (const fam of Object.values(M.FAMILIES)) {
    for (const pal of fam.palettes) {
      const dir = `${fam.id}/${pal.id}`;
      const mark = read(`${dir}/mark-neutral.svg`);
      const plate = M.plate(fam, pal);
      // Sprout Studio's mark is its own tile; Peek sits on its palette colour.
      const icon = fam.id === "studio" ? box("transparent", mark, 0) : box(plate, mark, 12, "22%");
      await shot(icon, 512, 512, `${dir}/icon-512.png`, true);
      await shot(icon, 32, 32, `${dir}/favicon-32.png`, true);
      // Avatars are cropped to a circle by YouTube and Discord, so the mark keeps inside it.
      await shot(box(fam.id === "studio" ? pal.mark.tile : plate, fam.id === "studio" ? M.standalone(fam.draw("neutral", { tile: false, live: false }), pal.mark) : mark, fam.id === "studio" ? 14 : 16), 800, 800, `${dir}/avatar-800.png`);
      // YouTube banner: 2560 x 1440 with everything inside the 1546 x 423 safe area.
      const logo = read(`${dir}/logo-horizontal${pal.ui.bg === "#0E120F" ? "-light" : ""}.svg`);
      const bannerBg = fam.id === "studio" ? pal.ui.bg : plate;
      await shot(`<div style="width:100%;height:100%;display:grid;place-items:center;background:${bannerBg}"><div style="width:1300px">${logo}</div></div>`, 2560, 1440, `${dir}/youtube-banner-2560x1440.png`);
      await shot(`<div style="padding:0">${read(`${dir}/logo-horizontal.svg`).replace("<svg ", '<svg style="display:block;width:1200px;height:auto" ')}</div>`, 1200, Math.round(1200 * 100 / parseFloat(read(`${dir}/logo-horizontal.svg`).match(/viewBox="0 0 ([\d.]+)/)[1])), `${dir}/logo-horizontal-1200.png`, true);
    }
  }
  await browser.close();
  return n;
};
