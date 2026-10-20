// Ash Dev brand marks: one source for the kit page and for the exported asset files.
// Two candidate marks, Sprout Studio and Peek, each drawn on a 100 x 100 grid.
// Shapes carry colour classes (f-* fill, s-* stroke); a palette maps those classes to colours.
(function (root) {
  const EMOTIONS = [
    { id: "neutral", name: "Deadpan", use: "Default, avatars, logo" },
    { id: "happy", name: "Happy", use: "Releases, success, thank-you" },
    { id: "surprised", name: "Surprised", use: "New video, announcements" },
    { id: "sleepy", name: "Sleepy", use: "Loading, maintenance" },
    { id: "focused", name: "Focused", use: "Devlogs, tutorials" },
    { id: "oops", name: "Oops", use: "Errors, 404, known issues" }
  ];

  // ---------- faces ----------
  // Drawn around (0,0): eyes at x = ±9.5, mouth below. Used by Sprout Studio.
  function face(s, x, y, k = 1) {
    const f = "f-ink", st = "s-ink";
    const eyes = {
      neutral: `<rect class="${f}" x="-15" y="-3" width="11" height="4" rx="1.6"/><rect class="${f}" x="4" y="-3" width="11" height="4" rx="1.6"/><rect class="${f}" x="-13.5" y="3.5" width="8" height="1.8" rx=".9"/><rect class="${f}" x="5.5" y="3.5" width="8" height="1.8" rx=".9"/>`,
      happy: `<path class="${st} nf" d="M-15 2 Q-9.5 -5 -4 2 M4 2 Q9.5 -5 15 2" stroke-width="3.2" stroke-linecap="round"/>`,
      surprised: `<circle class="${f}" cx="-9.5" cy="0" r="4.4"/><circle class="${f}" cx="9.5" cy="0" r="4.4"/><circle class="f-body" cx="-8.2" cy="-1.4" r="1.3"/><circle class="f-body" cx="10.8" cy="-1.4" r="1.3"/>`,
      sleepy: `<path class="${st} nf" d="M-15 0 Q-9.5 3 -4 0 M4 0 Q9.5 3 15 0" stroke-width="2.8" stroke-linecap="round"/>`,
      focused: `<path class="${st}" d="M-16 -5 L-4 -2 M4 -2 L16 -5" stroke-width="3.2" stroke-linecap="round"/><circle class="${f}" cx="-8.5" cy="2" r="2.6"/><circle class="${f}" cx="10.5" cy="2" r="2.6"/>`,
      oops: `<path class="${st} nf" d="M-14 -3.5 L-6 0 L-14 3.5 M14 -3.5 L6 0 L14 3.5" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`
    }[s];
    const mouth = {
      neutral: `<rect class="${f}" x="-4.5" y="9" width="9" height="3" rx="1.5"/>`,
      happy: `<path class="${f}" d="M-6 8.5 Q0 15 6 8.5 Z"/>`,
      surprised: `<ellipse class="${f}" cx="0" cy="11.5" rx="3" ry="3.6"/>`,
      sleepy: `<path class="${st}" d="M-3.5 10.5 H3.5" stroke-width="2.2" stroke-linecap="round"/>`,
      focused: `<path class="${st}" d="M-5 10.5 L5 9.5" stroke-width="2.6" stroke-linecap="round"/>`,
      oops: `<path class="${st} nf" d="M-6.5 11 q1.6 -2 3.2 0 q1.6 2 3.3 0 q1.6 -2 3.3 0 q1.6 2 3.2 0" stroke-width="2" stroke-linecap="round"/>`
    }[s];
    return `<g transform="translate(${x} ${y}) scale(${k})"><g class="eyes">${eyes}</g>${mouth}</g>`;
  }

  // Small effects that ride along with some emotions.
  function fx(s, at = {}) {
    const c = at.cls || "f-main";
    if (s === "happy") {
      const [a, b] = [at.sp1 || [12, 30], at.sp2 || [84, 24]];
      return `<path class="spark f-main" d="M${a[0]} ${a[1]} l2 -6 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 z"/><path class="spark spark2 f-fx" d="M${b[0]} ${b[1]} l1.4 -4 l1.4 4 l4 1.4 l-4 1.4 l-1.4 4 l-1.4 -4 l-4 -1.4 z"/>`;
    }
    if (s === "surprised") { const x = at.ex || 83, y = at.ey || 14; return `<g class="${c}"><rect x="${x}" y="${y}" width="4.5" height="13" rx="2.2"/><circle cx="${x + 2.2}" cy="${y + 18}" r="2.6"/></g>`; }
    if (s === "sleepy") {
      const x = at.zx || 76, y = at.zy || 30;
      const z = (zx, zy, k, extra) => `<path class="z ${extra} ${c.replace("f-", "s-")} nf" d="M${zx} ${zy} h${4 * k} l${-4 * k} ${4 * k} h${4 * k}" stroke-width="${1.6 * k}" stroke-linecap="round" stroke-linejoin="round"/>`;
      return z(x, y - 4, 1.2, "") + z(x + 8, y - 13, .9, "z2");
    }
    if (s === "oops") { const x = at.dx || 76, y = at.dy || 44; return `<path class="drop f-fx" d="M${x} ${y} q-4 6 0 8 q4 -2 0 -8 z"/>`; }
    return "";
  }

  // Antenna angles (left, right) per emotion.
  const POSE = { neutral: [0, 0], happy: [-16, 16], surprised: [9, -9], sleepy: [-60, 60], focused: [16, -16], oops: [-34, 6] };

  // ---------- Sprout Studio: the robot as a flat app-icon ----------
  function studio(s = "neutral", { tile = true, live = true } = {}) {
    const [aL, aR] = POSE[s];
    const ant = (x, tip, a, cls) => `<g transform="rotate(${a} ${x} 30)"><g class="ant ${cls}" style="transform-origin:${x}px 30px"><path class="s-main" d="M${x} 30 L${tip} 16" stroke-width="5" stroke-linecap="round"/><circle class="f-main" cx="${tip}" cy="15" r="4.5"/></g></g>`;
    const hatY = s === "surprised" ? -4 : s === "sleepy" ? 2 : 0;
    const tilt = s === "oops" ? 6 : s === "focused" ? -4 : 0;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="${live ? "live " : ""}s-${s}" role="img" aria-label="Ash Dev, ${s}">
  ${tile ? `<rect class="tile f-tile" width="100" height="100" rx="24"/>` : ""}
  <g class="chr"><g transform="rotate(${tilt} 50 82)">
    <g transform="translate(0 ${hatY})">${ant(40, 35, aL, "antL")}${ant(60, 65, aR, "antR")}</g>
    <g class="head"><rect class="f-body" x="26" y="40" width="48" height="42" rx="11"/><path class="f-shade" d="M30 40 H70 V48 Q50 54 30 48 Z"/>${face(s, 50, 61)}</g>
    <g transform="translate(0 ${hatY})"><g class="hatg"><path class="f-main" d="M12 41 Q50 16 88 41 Q50 50 12 41 Z"/><path class="f-maind" d="M20 42.5 Q50 49 80 42.5 Q50 46.5 20 42.5 Z"/></g></g>
  </g></g>
  <g class="fx">${fx(s, { cls: tile ? "f-main" : "f-ink" })}</g>
</svg>`;
  }

  // ---------- Peek: only the leaf hat and the eyes under it ----------
  function peek(s = "neutral", { live = true } = {}) {
    const [aL, aR] = POSE[s];
    const white = (cx, ry = 7) => `<ellipse class="f-white" cx="${cx}" cy="64" rx="8" ry="${ry}"/>`;
    const eyes = {
      neutral: `${white(39)}${white(61)}<circle class="f-ink" cx="40" cy="66" r="3.6"/><circle class="f-ink" cx="62" cy="66" r="3.6"/><rect class="f-ink" x="29" y="55" width="42" height="7.5"/>`,
      happy: `<path class="s-white nf" d="M32 67 Q39 59 46 67 M54 67 Q61 59 68 67" stroke-width="3.6" stroke-linecap="round"/>`,
      surprised: `${white(39, 9)}${white(61, 9)}<circle class="f-ink" cx="39" cy="65" r="2.6"/><circle class="f-ink" cx="61" cy="65" r="2.6"/>`,
      sleepy: `<path class="s-white nf" d="M32 65 Q39 69 46 65 M54 65 Q61 69 68 65" stroke-width="3.2" stroke-linecap="round"/>`,
      focused: `${white(39, 6)}${white(61, 6)}<circle class="f-ink" cx="43" cy="65" r="3.2"/><circle class="f-ink" cx="65" cy="65" r="3.2"/><path class="f-ink" d="M29 57 L49 62 L49 55 Z M71 57 L51 62 L51 55 Z"/>`,
      oops: `${white(39)}${white(61)}<circle class="f-ink" cx="36" cy="63" r="3"/><circle class="f-ink" cx="64" cy="67" r="3"/>`
    }[s];
    const ant = (x, tip, a, cls) => `<g transform="rotate(${a} ${x} 38)"><g class="ant ${cls}" style="transform-origin:${x}px 38px"><path class="s-line nf" d="M${x} 38 Q${(x + tip) / 2 + (tip < 50 ? 4 : -4)} 22 ${tip} 12" stroke-width="3.6" stroke-linecap="round"/><circle class="f-main s-line" cx="${tip}" cy="11" r="5" stroke-width="3"/></g></g>`;
    const hatY = s === "surprised" ? -5 : s === "sleepy" ? 3 : 0;
    const tilt = s === "oops" ? 7 : s === "focused" ? -3 : 0;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="${live ? "live " : ""}s-${s}" role="img" aria-label="Ash Dev, ${s}">
  <g class="chr"><g transform="rotate(${tilt} 50 60)">
    <path class="f-ink" d="M17 54 Q50 48 83 54 Q80 77 50 78 Q20 77 17 54 Z"/>
    <g class="eyes">${eyes}</g>
    <g transform="translate(0 ${hatY})"><g class="hatg">
      ${ant(40, 30, aL, "antL")}${ant(60, 70, aR, "antR")}
      <path class="f-main s-line" d="M6 56 Q8 40 30 34 Q50 28 70 34 Q92 40 94 56 Q94 60 88 59 Q70 54 50 54 Q30 54 12 59 Q6 60 6 56 Z" stroke-width="3.4" stroke-linejoin="round"/>
      <path class="s-maind nf" d="M14 56 Q32 51 50 51 Q68 51 86 56" stroke-width="3" stroke-linecap="round"/>
      <ellipse class="f-spot" cx="34" cy="42" rx="5" ry="3"/><circle class="f-spot" cx="62" cy="38" r="2.4"/><circle class="f-spot" cx="74" cy="45" r="3"/>
    </g></g>
  </g></g>
  <g class="fx">${fx(s, { sp1: [10, 72], sp2: [86, 72], ex: 85, ey: 6, cls: "f-line", zx: 78, zy: 30, dx: 80, dy: 50 })}</g>
</svg>`;
  }

  // ---------- palettes ----------
  // ui: colours for pages, thumbnails and documents. mark: colours for the drawing itself.
  const FAMILIES = {
    studio: {
      id: "studio", name: "Sprout Studio", draw: studio,
      wordmark: { text: ["ash", "dev"], font: "Bricolage Grotesque", weight: 800, tracking: -0.045, file: "BricolageGrotesque-ExtraBold.ttf" },
      type: { display: "Bricolage Grotesque", displayWeight: 800, body: "Instrument Sans", mono: "IBM Plex Mono" },
      tagline: "Mechanics that feel good",
      palettes: [
        { id: "forest", name: "Forest", note: "The default. Deep greens with the lime hat.",
          ui: { bg: "#F2F4EE", surface: "#FFFFFF", ink: "#13291B", muted: "#5F6E62", brand: "#1E4A2C", onBrand: "#F2F4EE", accent: "#377948", highlight: "#A9D86A", deep: "#13291B", soft: "#DDE6D3" },
          mark: { tile: "#1E4A2C", main: "#A9D86A", maind: "#7FB04A", body: "#F2F4EE", shade: "#D6DCCC", ink: "#13291B", fx: "#9FD8FF" } },
        { id: "midnight", name: "Midnight", note: "Navy instead of green. Calmer, more technical.",
          ui: { bg: "#EEF1F6", surface: "#FFFFFF", ink: "#0F1626", muted: "#5D6779", brand: "#1B2740", onBrand: "#EEF1F6", accent: "#3966C9", highlight: "#A9D86A", deep: "#0F1626", soft: "#D9E0EC" },
          mark: { tile: "#1B2740", main: "#A9D86A", maind: "#7FB04A", body: "#EEF1F6", shade: "#C9D1DF", ink: "#0F1626", fx: "#9FD8FF" } },
        { id: "citrus", name: "Citrus", note: "Warm and loud. Stands out in a feed.",
          ui: { bg: "#FFF6EA", surface: "#FFFFFF", ink: "#2B1A10", muted: "#7A6658", brand: "#FF7A3D", onBrand: "#2B1A10", accent: "#BD4A13", highlight: "#FFD66B", deep: "#2B1A10", soft: "#FBE6CF" },
          mark: { tile: "#FF7A3D", main: "#FFD66B", maind: "#E0A93A", body: "#FFF6EA", shade: "#F1DCC4", ink: "#2B1A10", fx: "#7FD0FF" } },
        { id: "limepop", name: "Lime pop", note: "Lime tile, dark hat. The brightest of the set.",
          ui: { bg: "#F3F9EA", surface: "#FFFFFF", ink: "#13291B", muted: "#566650", brand: "#A9D86A", onBrand: "#13291B", accent: "#3D7C29", highlight: "#A9D86A", deep: "#13291B", soft: "#E3F2CC" },
          mark: { tile: "#A9D86A", main: "#13291B", maind: "#0B1A10", body: "#FFFFFF", shade: "#DCE8CF", ink: "#13291B", fx: "#3E8A52" } }
      ]
    },
    peek: {
      id: "peek", name: "Peek", draw: peek,
      wordmark: { text: ["ashdev"], font: "Gabarito", weight: 800, tracking: -0.04, file: "Gabarito-ExtraBold.ttf" },
      type: { display: "Gabarito", displayWeight: 800, body: "Gabarito", mono: "IBM Plex Mono" },
      tagline: "Mechanics that feel good",
      palettes: [
        { id: "leaf", name: "Leaf", note: "The default. Your lime, with ink and a sky-blue spark.",
          ui: { bg: "#F4F7EF", surface: "#FFFFFF", ink: "#17201A", muted: "#5F6A62", brand: "#17201A", onBrand: "#FFFFFF", accent: "#397C15", highlight: "#B4E05F", deep: "#17201A", soft: "#EAF5D6" },
          mark: { main: "#B4E05F", maind: "#8CBF3A", spot: "#CFEE8F", ink: "#17201A", line: "#17201A", white: "#FFFFFF", fx: "#5BB8FF" } },
        { id: "ocean", name: "Ocean", note: "Blue hat, sunny accent. Fresh and friendly.",
          ui: { bg: "#EEF7FB", surface: "#FFFFFF", ink: "#0E2233", muted: "#566B7A", brand: "#0E2233", onBrand: "#FFFFFF", accent: "#1675AA", highlight: "#5BC8F5", deep: "#0E2233", soft: "#DDF1FB" },
          mark: { main: "#5BC8F5", maind: "#2E9FD1", spot: "#A8E4FB", ink: "#0E2233", line: "#0E2233", white: "#FFFFFF", fx: "#FFD23F" } },
        { id: "sunny", name: "Sunny", note: "Yellow hat. Warm, very readable on thumbnails.",
          ui: { bg: "#FFF9E6", surface: "#FFFFFF", ink: "#1E1A10", muted: "#6F6650", brand: "#1E1A10", onBrand: "#FFFFFF", accent: "#976800", highlight: "#FFD23F", deep: "#1E1A10", soft: "#FFF0B8" },
          mark: { main: "#FFD23F", maind: "#E5B520", spot: "#FFE88A", ink: "#1E1A10", line: "#1E1A10", white: "#FFFFFF", fx: "#5BB8FF" } },
        { id: "bubblegum", name: "Bubblegum", note: "Pink hat, mint spark. The most playful.",
          ui: { bg: "#FFF3F8", surface: "#FFFFFF", ink: "#2A1520", muted: "#73606B", brand: "#2A1520", onBrand: "#FFFFFF", accent: "#B8326F", highlight: "#FF8FC0", deep: "#2A1520", soft: "#FFE3EF" },
          mark: { main: "#FF8FC0", maind: "#E0679D", spot: "#FFC2DD", ink: "#2A1520", line: "#2A1520", white: "#FFFFFF", fx: "#6FD3B5" } },
        { id: "night", name: "Night", note: "Dark pages, lime hat with a light outline.",
          ui: { bg: "#0E120F", surface: "#161C17", ink: "#EEF2EA", muted: "#97A398", brand: "#B4E05F", onBrand: "#0E120F", accent: "#B4E05F", highlight: "#B4E05F", deep: "#0E120F", soft: "#1D251E" },
          mark: { main: "#B4E05F", maind: "#8CBF3A", spot: "#CFEE8F", ink: "#070908", line: "#EEF2EA", white: "#FFFFFF", fx: "#5BB8FF" } }
      ]
    }
  };

  // Which surface a family's mark sits on by default.
  const plate = (fam, p) => fam.id === "studio" ? p.ui.bg : (p.ui.bg === "#0E120F" ? p.ui.surface : p.mark.main);

  // ---------- CSS ----------
  const CLASS_MAP = {
    "f-tile": ["fill", "tile"], "f-main": ["fill", "main"], "f-maind": ["fill", "maind"], "f-body": ["fill", "body"], "f-shade": ["fill", "shade"],
    "f-ink": ["fill", "ink"], "f-white": ["fill", "white"], "f-spot": ["fill", "spot"], "f-fx": ["fill", "fx"], "f-line": ["fill", "line"],
    "s-main": ["stroke", "main"], "s-maind": ["stroke", "maind"], "s-ink": ["stroke", "ink"], "s-line": ["stroke", "line"], "s-white": ["stroke", "white"]
  };
  const DEFAULTS = { white: "#FFFFFF", body: "#FFFFFF", line: "#17201A", spot: "#FFFFFF", tile: "transparent", shade: "#DDDDDD", fx: "#5BB8FF" };
  // For pages: classes read CSS variables, so a palette switch is just new variables.
  const VAR_CSS = Object.entries(CLASS_MAP).map(([c, [prop, k]]) => `.${c}{${prop}:var(--m-${k},${DEFAULTS[k] || "#000"})}`).join("") + ".nf{fill:none}";
  // For standalone files: classes get the palette's hex values directly.
  const hexCss = mark => Object.entries(CLASS_MAP).map(([c, [prop, k]]) => `.${c}{${prop}:${mark[k] || DEFAULTS[k] || "#000"}}`).join("") + ".nf{fill:none}";
  const vars = mark => Object.entries(mark).map(([k, v]) => `--m-${k}:${v}`).join(";");

  const MOTION_CSS = `
.ant,.chr,.hatg,.head{transform-box:view-box}.eyes{transform-box:fill-box;transform-origin:center}
.live .chr{animation:ad-bob 3.2s ease-in-out infinite;transform-origin:50px 90px}
.live .eyes{animation:ad-blink 4.6s infinite}
.live .ant{animation:ad-sway 3.2s ease-in-out infinite}.live .antR{animation-delay:-.4s}
@keyframes ad-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.6px)}}
@keyframes ad-blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes ad-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
.live.s-happy .chr{animation:ad-hop 1.3s cubic-bezier(.3,0,.3,1) infinite}
.live.s-happy .ant{animation:ad-flick 1.3s ease-out infinite}
.live.s-happy .spark{animation:ad-twinkle 1.3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}.live.s-happy .spark2{animation-delay:-.6s}
@keyframes ad-hop{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.06,.92)}40%{transform:translateY(-9px) scale(.97,1.04)}70%{transform:translateY(0) scale(1.04,.95)}82%{transform:translateY(0) scale(1,1)}}
@keyframes ad-flick{0%,30%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}75%{transform:rotate(6deg)}}
@keyframes ad-twinkle{0%,100%{transform:scale(.4);opacity:.4}50%{transform:scale(1);opacity:1}}
.live.s-surprised .hatg{animation:ad-pop 2.4s cubic-bezier(.2,.9,.3,1.4) infinite;transform-origin:50px 45px}
.live.s-surprised .ant{animation:ad-buzz .12s linear infinite}
.live.s-surprised .chr{animation:ad-jolt 2.4s ease-out infinite}
@keyframes ad-pop{0%,100%{transform:translateY(0)}8%{transform:translateY(-9px) rotate(-4deg)}30%{transform:translateY(-3px)}60%{transform:translateY(0)}}
@keyframes ad-buzz{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes ad-jolt{0%,100%{transform:translateY(0)}6%{transform:translateY(-4px)}20%{transform:translateY(0)}}
.live.s-sleepy .chr{animation:ad-breathe 4.2s ease-in-out infinite}.live.s-sleepy .eyes{animation:none}
.live.s-sleepy .ant{animation:ad-droop 4.2s ease-in-out infinite}
.live.s-sleepy .z{animation:ad-zz 3s ease-out infinite;opacity:0;transform-box:fill-box}.live.s-sleepy .z2{animation-delay:1.5s}
@keyframes ad-breathe{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(1px) scale(1.02,.98)}}
@keyframes ad-droop{0%,100%{transform:rotate(0)}50%{transform:rotate(5deg)}}
@keyframes ad-zz{0%{opacity:0;transform:translate(0,4px) scale(.7)}25%{opacity:1}100%{opacity:0;transform:translate(6px,-12px) scale(1.1)}}
.live.s-focused .chr{animation:ad-lean 2.6s ease-in-out infinite}
.live.s-focused .ant{animation:ad-twitch 2.6s ease-in-out infinite}
.live.s-focused .eyes{animation:ad-scan 2.6s ease-in-out infinite}
@keyframes ad-lean{0%,100%{transform:rotate(0)}50%{transform:rotate(-2.5deg)}}
@keyframes ad-twitch{0%,70%,100%{transform:rotate(0)}78%{transform:rotate(-6deg)}86%{transform:rotate(2deg)}}
@keyframes ad-scan{0%,100%{transform:translateX(0)}40%,60%{transform:translateX(2px)}}
.live.s-oops .chr{animation:ad-shake 2.6s ease-in-out infinite}
.live.s-oops .drop{animation:ad-drip 2.6s ease-in infinite;transform-box:fill-box}
@keyframes ad-shake{0%,60%,100%{transform:translateX(0) rotate(0)}64%{transform:translateX(-2px) rotate(-3deg)}68%{transform:translateX(2px) rotate(3deg)}72%{transform:translateX(-1.5px) rotate(-2deg)}76%{transform:translateX(1px)}}
@keyframes ad-drip{0%,20%{transform:translateY(0);opacity:0}30%{opacity:1}90%{transform:translateY(10px);opacity:1}100%{transform:translateY(12px);opacity:0}}
@media (prefers-reduced-motion:reduce){.live *{animation:none!important}}`;

  // A drawing as a self-contained SVG file in one palette, still or animated.
  function standalone(svg, mark, { animated = false } = {}) {
    const css = hexCss(mark) + (animated ? MOTION_CSS : "");
    const out = svg.replace(/(<svg[^>]*>)/, `$1<style>${css}</style>`);
    return animated ? out : out.replace(/class="live /, 'class="');
  }

  const api = { EMOTIONS, FAMILIES, studio, peek, plate, VAR_CSS, MOTION_CSS, standalone, vars, hexCss };
  root.AshMarks = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);
