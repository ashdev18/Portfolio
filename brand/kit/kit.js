// Brand kit page: renders every section for the selected mark and palette.
(() => {
  const M = window.AshMarks;
  const $ = id => document.getElementById(id);
  const fams = M.FAMILIES;

  // Start from #family-palette in the address, e.g. #peek-ocean.
  const [hf, hp] = (location.hash.slice(1) || "").split("-");
  let fam = fams[hf] || fams.studio;
  let pal = fam.palettes.find(p => p.id === hp) || fam.palettes[0];

  const kebab = k => k.replace(/[A-Z]/g, c => "-" + c.toLowerCase());
  const lum = hex => {
    const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
  };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
  const dark = () => lum(pal.ui.bg) < .2;
  const dir = () => `assets/${fam.id}/${pal.id}/`;
  const draw = (s = "neutral", o = {}) => fam.draw(s, o);

  function apply() {
    const r = document.documentElement.style;
    for (const [k, v] of Object.entries(pal.ui)) r.setProperty(`--ad-${kebab(k)}`, v);
    for (const [k, v] of Object.entries(pal.mark)) r.setProperty(`--m-${k}`, v);
    r.setProperty("--plate", M.plate(fam, pal));
    r.setProperty("--display", `"${fam.type.display}", sans-serif`);
    r.setProperty("--display-track", `${fam.wordmark.tracking}em`);
    r.setProperty("--body", `"${fam.type.body}", system-ui, sans-serif`);
    r.setProperty("color-scheme", dark() ? "dark" : "light");
    document.body.classList.toggle("peek-fam", fam.id === "peek");
    history.replaceState(null, "", `#${fam.id}-${pal.id}`);
    render();
  }

  function controls() {
    document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.fam === fam.id)));
    $("pals").innerHTML = fam.palettes.map(p =>
      `<button type="button" id="pal-${p.id}" data-pal="${p.id}" aria-pressed="${p === pal}"><i><b style="background:${fam.id === "studio" ? p.mark.tile : p.mark.main}"></b><b style="background:${fam.id === "studio" ? p.mark.main : p.ui.ink}"></b><b style="background:${p.ui.bg}"></b></i>${p.name}</button>`).join("");
    $("palNote").textContent = pal.note;
  }

  function render() {
    controls();
    const d = dir(), light = dark() ? "-light" : "";
    const fileLink = (f, label = "SVG") => `<a href="${d}${f}" download>${label}</a>`;

    // 01 Logo
    $("logoMain").src = `${d}logo-horizontal${light}.svg`;
    const v = (bg, src, label, file, narrow) => `<figure class="variant"><div class="v" style="background:${bg}"><img src="${src}" alt="" class="${narrow ? "narrow" : ""}"></div><figcaption><span>${label}</span>${fileLink(file)}</figcaption></figure>`;
    $("variants").innerHTML = [
      v(pal.ui.surface, `${d}logo-stacked${light}.svg`, "Stacked", `logo-stacked${light}.svg`, true),
      v(pal.ui.surface, `${d}mark-neutral.svg`, "Mark", "mark-neutral.svg", true),
      v(pal.ui.surface, `${d}wordmark${light}.svg`, "Wordmark", `wordmark${light}.svg`),
      v(pal.ui.deep === pal.ui.bg ? pal.ui.surface : pal.ui.deep, `${d}logo-horizontal-light.svg`, "On dark", "logo-horizontal-light.svg"),
      v(fam.id === "studio" ? pal.ui.highlight : pal.ui.soft, `${d}logo-horizontal.svg`, "On a light colour", "logo-horizontal.svg"),
      v(pal.ui.bg, `${d}icon-512.png`, "App icon", "icon-512.png", true)
    ].join("");

    // 02 Space and size
    $("clearMark").innerHTML = `<div>${draw("neutral", { live: false })}</div>`;
    $("sizes").innerHTML = [16, 24, 32, 48, 72, 112].map(s =>
      `<figure><div style="width:${s}px;${fam.id === "peek" ? `background:var(--plate);border-radius:22%;padding:${s * .08}px` : ""}">${draw("neutral", { live: false })}</div><span>${s}px</span></figure>`).join("");

    // 03 Colour
    const roles = [
      ["brand", "Brand", "Buttons, headers, the mark's tile"],
      ["highlight", "Highlight", "The hat; small bursts of colour"],
      ["accent", "Accent", "Links and emphasis in text"],
      ["ink", "Ink", "Text and outlines"],
      ["bg", "Background", "Pages and thumbnails"]
    ];
    $("swatches").innerHTML = roles.map(([k, name, use]) => {
      const hex = pal.ui[k], t = lum(hex) > .35 ? "#141414" : "#FFFFFF";
      return `<div class="sw"><div class="chip" style="background:${hex};color:${t}">${name}</div><div class="meta"><b>${hex}</b>${use}</div></div>`;
    }).join("");
    const pair = (fg, bg, label) => {
      const r = ratio(fg, bg), grade = r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA large text only" : "Decoration only";
      return `<div class="pair" style="background:${bg};color:${fg}"><b>Aa</b><span>${label}</span><span>${r.toFixed(1)} : 1 · ${grade}</span></div>`;
    };
    $("contrast").innerHTML = pair(pal.ui.ink, pal.ui.bg, "Ink on background") + pair(pal.ui.onBrand, pal.ui.brand, "Button text on brand") + pair(pal.ui.accent, pal.ui.surface, "Accent on surface");

    // 04 Type
    const t = fam.type;
    $("typeGrid").innerHTML = `
      <div class="card spec-display"><span class="lab">Display · ${t.display} ${t.displayWeight}</span><div class="big">Aa Gg 18</div>
        <div class="scale">
          <div><span>H1 · 64/0.95</span><b style="font:var(--display-weight) 44px/1 var(--display);letter-spacing:var(--display-track)">Feel first</b></div>
          <div><span>H2 · 40/1</span><b style="font:var(--display-weight) 30px/1 var(--display);letter-spacing:var(--display-track)">Omni Vehicle AI</b></div>
          <div><span>H3 · 22/1.1</span><b style="font:var(--display-weight) 22px/1.1 var(--display);letter-spacing:var(--display-track)">Drift, hop, land</b></div>
        </div></div>
      <div class="type-side">
        <div class="card"><span class="lab">Text · ${t.body} 400 / 600</span><p>Arcade handling with suspension and friction you can actually tune. Two clicks to set up, then drive.</p><p style="font-weight:600">Body 16/1.55 · Small 14/1.5</p></div>
        <div class="card"><span class="lab">Labels and data · ${t.mono}</span><p style="font-family:var(--mono);font-size:14px">v1.8 · Unity 2020.3 → 6000.3<br>Built-in · URP · HDRP</p></div>
      </div>`;

    // 05 Emotions
    $("emoGrid").innerHTML = M.EMOTIONS.map(e => `<div class="card emo"><div class="art">${draw(e.id)}</div><div><h3>${e.name}</h3><p>${e.use}</p>${fileLink(`mark-${e.id}.svg`, "Still SVG")}${fileLink(`mark-${e.id}-animated.svg`, "Animated SVG")}</div></div>`).join("");

    // 06 Motion
    const words = fam.wordmark.text;
    $("introStage").innerHTML = `<div class="lk"><div class="m">${draw("neutral")}</div><b style="--wm-ink:${pal.ui.ink}">${words[0]}${words[1] ? `<em>${words[1]}</em>` : ""}</b></div>`;
    const tokens = [
      ["Snap", "120ms ease-out", "Hover and press feedback", "tok-move 1.2s ease-out infinite"],
      ["Move", "240ms cubic-bezier(.3, 0, .3, 1)", "Cards, panels, menus", "tok-move 1.6s cubic-bezier(.3,0,.3,1) infinite"],
      ["Land", "600ms cubic-bezier(.2, 1.4, .4, 1)", "Anything arriving: the mark, toasts, new items", "tok-move 2s cubic-bezier(.2,1.4,.4,1) infinite"],
      ["Squash", "160ms, scale 1.15 × 0.8, then Land", "Buttons and the character when pressed", "tok-press 1.4s cubic-bezier(.2,1.4,.4,1) infinite"]
    ];
    $("tokens").innerHTML = `<span class="lab">Motion tokens</span>` + tokens.map(([n, c, u, a]) => `<div class="tok"><div><b>${n}</b><code>${c}</code><small>${u}</small></div><div class="track"><i style="--anim:${a}"></i></div></div>`).join("");
    playIntro();

    // 07 In use
    $("webMark").innerHTML = draw("neutral");
    $("webBadge").innerHTML = draw("happy");
    $("webHead").innerHTML = fam.id === "studio" ? "Small mechanics. Big feel." : "Mechanics that feel good to play.";
    $("ytImg").src = `${d}youtube-banner-2560x1440.png`;
    $("kaMark").innerHTML = draw("surprised");
    $("avatars").innerHTML = [120, 72, 40].map(s => `<img src="${d}avatar-800.png" width="${s}" height="${s}" alt="">`).join("") + `<img src="${d}favicon-32.png" width="32" height="32" alt="" style="border-radius:6px">`;

    // 08 Don'ts
    const dont = (style, label) => `<figure class="dont"><div class="d"><div style="${style}">${draw("neutral", { live: false })}</div></div><figcaption>${label}</figcaption></figure>`;
    $("donts-grid").innerHTML = [
      dont("transform:scaleX(1.5)", "Stretch or squash it"),
      dont("filter:hue-rotate(150deg) saturate(1.6)", "Use colours from outside the palette"),
      dont("transform:rotate(-24deg)", "Rotate it"),
      dont("filter:drop-shadow(6px 8px 0 #000) blur(.6px)", "Add shadows, blur or effects")
    ].join("");

    // 09 Files
    const f = (file, use) => `<div><a href="${d}${file}" download>${file}</a><span>${use}</span></div>`;
    $("fileList").innerHTML = `<h3>${fam.name} · ${pal.name}</h3>` + [
      ["logo-horizontal.svg", "Main logo"], ["logo-horizontal-light.svg", "Main logo for dark backgrounds"],
      ["logo-stacked.svg", "Stacked logo"], ["wordmark.svg", "Lettering only"],
      ["mark-neutral.svg", "Mark, plus one file per emotion"], ["mark-happy-animated.svg", "Animated marks, one per emotion"],
      ["icon-512.png", "App and store icon"], ["avatar-800.png", "YouTube, Discord, X avatar"],
      ["favicon-32.png", "Browser tab icon"], ["youtube-banner-2560x1440.png", "Channel banner"],
      ["logo-horizontal-1200.png", "Logo as PNG with transparency"]
    ].map(([a, b]) => f(a, b)).join("") + `<h3>For code</h3><div><a href="tokens.css">tokens.css</a><span>Every palette as CSS variables</span></div><div><a href="tokens.json">tokens.json</a><span>Every palette as data</span></div>`;
  }

  function playIntro() {
    const stage = $("introStage");
    stage.classList.remove("go"); void stage.offsetWidth; stage.classList.add("go");
  }

  document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => {
    fam = fams[b.dataset.fam]; pal = fam.palettes[0]; apply();
  }));
  $("pals").addEventListener("click", e => {
    const b = e.target.closest("[data-pal]"); if (!b) return;
    pal = fam.palettes.find(p => p.id === b.dataset.pal); apply();
  });
  $("replay").addEventListener("click", playIntro);

  // Marks on the page take their colours from CSS variables.
  const style = document.createElement("style");
  style.textContent = M.VAR_CSS + M.MOTION_CSS;
  document.head.append(style);
  apply();
})();
