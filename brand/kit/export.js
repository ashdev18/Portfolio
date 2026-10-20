// Writes every brand asset into brand/kit/assets/<family>/<palette>/.
//   node export.js          SVG files (marks, emotions, lockups with outlined lettering)
//   node export.js --png    also PNG files (needs Playwright with a Chromium browser)
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const M = require("./marks.js");

const OUT = path.join(__dirname, "assets");
const withPng = process.argv.includes("--png");

// ---------- lettering as outlines ----------
const fonts = {};
const font = file => (fonts[file] ||= opentype.loadSync(path.join(__dirname, "fonts", file)));

// Lays the text out glyph by glyph so tracking matches the CSS letter-spacing of the wordmark.
function outline(wm, text, size, x, baseline) {
  const f = font(wm.file), scale = size / f.unitsPerEm;
  const glyphs = f.stringToGlyphs(text);
  const p = new opentype.Path();
  let pen = x;
  glyphs.forEach((g, i) => {
    p.commands.push(...g.getPath(pen, baseline, size).commands);
    pen += g.advanceWidth * scale + wm.tracking * size;
    if (glyphs[i + 1]) pen += f.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return { d: p.toPathData(2), box: p.getBoundingBox(), advance: pen - x };
}

// The wordmark as one or two coloured paths (Sprout Studio colours the "dev").
function wordmark(fam, pal, size, x, baseline, light) {
  const ink = light ? "#FFFFFF" : pal.ui.ink;
  const second = fam.id === "studio" ? (light ? pal.ui.highlight : pal.ui.accent) : ink;
  let pen = x, parts = [], box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
  fam.wordmark.text.forEach((t, i) => {
    const o = outline(fam.wordmark, t, size, pen, baseline);
    parts.push(`<path fill="${i ? second : ink}" d="${o.d}"/>`);
    box = { x1: Math.min(box.x1, o.box.x1), y1: Math.min(box.y1, o.box.y1), x2: Math.max(box.x2, o.box.x2), y2: Math.max(box.y2, o.box.y2) };
    pen += o.advance + fam.wordmark.tracking * size;
  });
  return { svg: parts.join(""), box };
}

const inner = svg => svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const file = (vb, body, label) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(n => +n.toFixed(2)).join(" ")}" role="img" aria-label="${label}">${body}</svg>\n`;

function lockups(fam, pal, light) {
  const markSvg = fam.draw("neutral", { live: false });
  // On dark backgrounds Peek's outline turns white so the hat and antennae stay visible.
  const markColours = light && fam.id === "peek" ? { ...pal.mark, line: "#FFFFFF" } : pal.mark;
  const style = `<style>${M.hexCss(markColours)}</style>`;
  const markG = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${inner(markSvg)}</g>`;
  const out = {};

  // Horizontal: mark at 100 units, lettering centred on the mark.
  const size = fam.id === "studio" ? 76 : 78;
  const probe = wordmark(fam, pal, size, 0, 0, light);
  const capMid = (probe.box.y1 + probe.box.y2) / 2;
  const gap = fam.id === "studio" ? 20 : 8;
  const h = wordmark(fam, pal, size, 100 + gap, 50 - capMid, light);
  out.horizontal = file([0, 0, h.box.x2 + 2, 100], style + markG(0, 0, 1) + h.svg, "Ash Dev logo");

  // Stacked: mark centred above the lettering.
  const w = probe.box.x2 - probe.box.x1;
  const markSize = fam.id === "studio" ? 100 : 130;
  const top = markSize + (fam.id === "studio" ? 16 : -18);
  const s = wordmark(fam, pal, size, -probe.box.x1, top - probe.box.y1, light);
  const width = Math.max(w, markSize);
  out.stacked = file([0, 0, width, s.box.y2 + 2], style + markG((width - markSize) / 2 + (w > markSize ? 0 : 0), 0, markSize / 100) + s.svg.replace(/<path /g, `<path transform="translate(${(width - w) / 2} 0)" `), "Ash Dev logo");

  // Lettering on its own.
  const o = wordmark(fam, pal, size, -probe.box.x1, -probe.box.y1, light);
  out.wordmark = file([0, 0, w, probe.box.y2 - probe.box.y1], o.svg, "Ash Dev");
  return out;
}

const written = [];
const write = (rel, data) => {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data);
  written.push(rel);
};

for (const fam of Object.values(M.FAMILIES)) {
  for (const pal of fam.palettes) {
    const dir = `${fam.id}/${pal.id}`;
    for (const e of M.EMOTIONS) {
      const svg = fam.draw(e.id);
      write(`${dir}/mark-${e.id}.svg`, M.standalone(svg, pal.mark) + "\n");
      write(`${dir}/mark-${e.id}-animated.svg`, M.standalone(svg, pal.mark, { animated: true }) + "\n");
    }
    for (const light of [false, true]) {
      const l = lockups(fam, pal, light);
      const suf = light ? "-light" : "";
      write(`${dir}/logo-horizontal${suf}.svg`, l.horizontal);
      write(`${dir}/logo-stacked${suf}.svg`, l.stacked);
      write(`${dir}/wordmark${suf}.svg`, l.wordmark);
    }
  }
}

// Palettes as data, for anyone building a page, a thumbnail template or a Unity UI theme.
const tokens = {};
for (const fam of Object.values(M.FAMILIES)) {
  tokens[fam.id] = { name: fam.name, type: fam.type, palettes: Object.fromEntries(fam.palettes.map(p => [p.id, { name: p.name, ui: p.ui, mark: p.mark }])) };
}
fs.writeFileSync(path.join(__dirname, "tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
const css = Object.values(M.FAMILIES).flatMap(fam => fam.palettes.map((p, i) => {
  const sel = `[data-brand="${fam.id}"][data-palette="${p.id}"]` + (i === 0 ? `, [data-brand="${fam.id}"]:not([data-palette])` : "");
  const ui = Object.entries(p.ui).map(([k, v]) => `  --ad-${k.replace(/[A-Z]/g, c => "-" + c.toLowerCase())}: ${v};`).join("\n");
  const mk = Object.entries(p.mark).map(([k, v]) => `  --m-${k}: ${v};`).join("\n");
  return `/* ${fam.name} · ${p.name} */\n${sel} {\n${ui}\n${mk}\n}`;
})).join("\n\n");
fs.writeFileSync(path.join(__dirname, "tokens.css"), `/* Generated by export.js from marks.js. Set data-brand and data-palette on any element. */\n\n${css}\n`);

console.log(`${written.length} SVG files written`);

if (withPng) require("./render-png.js")(M, OUT).then(n => console.log(`${n} PNG files written`));
