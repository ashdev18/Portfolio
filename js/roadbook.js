// Renders the roadbook (tools), the timing sheet and the co-driver's notes from js/data.js.
(() => {
  const el = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    n.innerHTML = html;
    return n;
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // A tulip diagram: enter at the dot, leave by the arrow. Severity 1 is a hairpin, 6 is nearly flat.
  function tulip([dir, sev]) {
    const turn = (7 - sev) * 26 * (dir === "L" ? -1 : 1);
    const a = ((turn - 90) * Math.PI) / 180;
    const ex = 30 + Math.cos(a) * 22, ey = 32 + Math.sin(a) * 22;
    const ah = a + Math.PI, s = 8;
    const p1 = [ex + Math.cos(ah - 0.5) * s, ey + Math.sin(ah - 0.5) * s];
    const p2 = [ex + Math.cos(ah + 0.5) * s, ey + Math.sin(ah + 0.5) * s];
    return `<svg class="tulip" viewBox="0 0 60 64" aria-hidden="true">
      <path d="M30 58 V32 L${ex.toFixed(1)} ${ey.toFixed(1)}" />
      <path class="tip" d="M${ex.toFixed(1)} ${ey.toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" />
      <circle cx="30" cy="58" r="4.5" />
    </svg>`;
  }

  const call = ([dir, sev, extra]) => `${dir}${sev}${extra ? ` <em>${esc(extra)}</em>` : ""}`;
  const stars = r => (r ? `${r[0].toFixed(1)} ★ <span class="dim">(${r[1]})</span>` : `<span class="dim">new</span>`);

  function sheet(t) {
    const links = [
      `<a class="btn" href="${t.store}">Asset Store${t.price ? ` · ${esc(t.price)}` : ""}</a>`,
      t.video && `<a class="btn ghost" href="${t.video}">Watch</a>`,
      t.demo && `<a class="btn ghost" href="${t.demo}">${esc(t.demoLabel || "Demo builds")}</a>`,
      t.source && `<a class="btn ghost" href="${t.source}">Source</a>`
    ].filter(Boolean).join("");
    return `<div class="sheet${t.thumb ? "" : " no-img"}">
      ${t.thumb ? `<img src="images/thumbs/${t.thumb}.jpg" alt="" loading="lazy" width="720" height="480">` : ""}
      <dl>
        <div><dt>Form no.</dt><dd>${t.id}</dd></div>
        <div><dt>Homologated</dt><dd>${t.first}</dd></div>
        <div><dt>Current evolution</dt><dd>v${t.version}${t.updated ? ` · ${t.updated}` : ""}</dd></div>
        <div><dt>Valid for</dt><dd>Unity ${esc(t.unity)}</dd></div>
      </dl>
      <ul class="specs">${t.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="links">${links}</div>
    </div>`;
  }

  const book = document.getElementById("roadbook");
  let box = 0;
  for (const g of window.ROADBOOK) {
    const section = el("section", { class: "leg" });
    section.append(el("header", { class: "leg-head" }, `<h3>${esc(g.group)}</h3>${g.note ? `<p>${esc(g.note)}</p>` : ""}`));
    for (const t of g.tools) {
      box++;
      const row = el("details", { class: "box", id: `t${t.id}` });
      row.innerHTML = `<summary>
          <span class="no">${String(box).padStart(2, "0")}</span>
          ${tulip(t.call)}
          <span class="call">${call(t.call)}</span>
          <span class="name">${esc(t.name)}</span>
          <span class="line">${esc(t.line)}</span>
          <span class="price">${t.price ? esc(t.price) : ""}</span>
          <span class="rating">${stars(t.rating)}</span>
        </summary>${sheet(t)}`;
      section.append(row);
    }
    book.append(section);
  }

  const tbody = document.querySelector("#timing tbody");
  window.TIMING.forEach(([date, what, note], i) => {
    const tr = el("tr");
    tr.innerHTML = `<td class="stg">SS${String(i + 1).padStart(2, "0")}</td><td class="date">${date}</td><td>${esc(what)}</td><td class="dim">${esc(note)}</td>`;
    tbody.append(tr);
  });

  const notes = document.getElementById("codriver");
  for (const [quote, who, what] of window.CODRIVER) {
    notes.append(el("figure", {}, `<blockquote>“${esc(quote)}”</blockquote><figcaption>${esc(who)} <span class="dim">on ${esc(what)}</span></figcaption>`));
  }
})();
