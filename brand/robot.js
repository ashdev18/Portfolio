// Draws the Ash Dev sprout robot as an SVG string, following the proportions of the original logo.
// Options: style ("soft" | "sticker" | "mark"), mood ("deadpan" | "happy" | "surprised" | "sleepy").
window.robot = function robot({ style = "soft", mood = "deadpan", ring = true, colors = {}, shadow = "soft", viewBox = null } = {}) {
  const sticker = style === "sticker", mark = style === "mark";
  const P = {
    ink: "#27302B", body: "#F5F6F2", shade: "#DCE0D7", deep: "#C3C9BD", seam: "#B9BFB3", slot: "#3A443D",
    hat: "#2F6E40", hatHi: "#3E8A52", hatUnder: "#1B4428", lime: "#9FD65B", limeHi: "#C9EE90",
    bgIn: "#D2F59A", bgOut: "#A6D466", drop: "#6E9F3C", eye: "#FFFFFF", ring: "#FFFFFF"
  };
  Object.assign(P, colors);
  const lw = sticker ? 8 : mark ? 7 : 3.6;
  const ol = (w = lw) => `stroke="${P.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const tilt = sticker ? 5 : 0;
  const hatLift = { surprised: -16, sleepy: 8 }[mood] || 0;
  const hatTilt = mood === "surprised" ? -4 : sticker ? -2 : 3;

  // ---- face ----------------------------------------------------------------
  const eye = (cx, cy) => {
    const ring = `<circle cx="${cx}" cy="${cy}" r="17" fill="${P.eye}" ${ol(lw * 0.85)}/>`;
    switch (mood) {
      case "happy":
        return ring + `<path d="M${cx - 9} ${cy + 3} Q${cx} ${cy - 8} ${cx + 9} ${cy + 3}" fill="none" stroke="${P.ink}" stroke-width="4.5" stroke-linecap="round"/>`;
      case "surprised":
        return ring + `<circle cx="${cx}" cy="${cy}" r="4.5" fill="${P.ink}"/>`;
      case "sleepy":
        return ring + `<path d="M${cx - 16.5} ${cy + 1} A16.5 16.5 0 0 1 ${cx + 16.5} ${cy + 1} Z" fill="${P.shade}"/>` +
          `<path d="M${cx - 16} ${cy + 1} H${cx + 16}" stroke="${P.ink}" stroke-width="4" stroke-linecap="round"/>` +
          `<rect x="${cx - 7}" y="${cy + 6}" width="14" height="2.6" rx="1.3" fill="${P.ink}"/>`;
      default: // deadpan: a heavy bar over a thin one
        return ring + `<rect class="pupil" x="${cx - 9}" y="${cy - 6}" width="18" height="6.5" rx="1.5" fill="${P.ink}"/>` +
          `<rect class="pupil" x="${cx - 7}" y="${cy + 3.5}" width="14" height="2.6" rx="1.3" fill="${P.ink}"/>`;
    }
  };
  const mouth = {
    deadpan: `<path d="M235 285 Q256 278 277 285 Q279 291 277 295 Q256 289 235 295 Q233 291 235 285 Z" fill="${P.shade}" ${ol(lw * 0.75)}/>
              <path d="M239 287 Q256 282 273 287" fill="none" stroke="${P.slot}" stroke-width="3" stroke-linecap="round"/>`,
    happy: `<path d="M238 284 Q256 300 274 284 Q256 292 238 284 Z" fill="${P.slot}" ${ol(lw * 0.75)}/>`,
    surprised: `<ellipse cx="256" cy="290" rx="7" ry="9" fill="${P.slot}" ${ol(lw * 0.75)}/>`,
    sleepy: `<path d="M242 290 Q256 287 270 290" fill="none" stroke="${P.ink}" stroke-width="4" stroke-linecap="round"/>`
  }[mood];

  const details = mark || sticker ? "" : `
    <g stroke="${P.seam}" stroke-width="1.8" stroke-linecap="round" fill="none">
      <path d="M256 222 V262"/><path d="M168 236 h18"/><path d="M330 236 v12 h14"/>
      <path d="M164 346 h20 l6 6"/><path d="M326 360 h22"/><path d="M300 226 h16"/>
    </g>
    <g fill="${P.seam}"><circle cx="178" cy="318" r="2.6"/><circle cx="342" cy="250" r="2.6"/><circle cx="336" cy="348" r="3.4"/>
      <rect x="166" y="300" width="2" height="12"/><rect x="170" y="300" width="1.2" height="12"/><rect x="173" y="300" width="2.4" height="12"/>
      <rect x="338" y="300" width="2.4" height="14"/><rect x="342" y="300" width="1.2" height="14"/><rect x="345" y="300" width="2.4" height="14"/><rect x="349" y="300" width="1.2" height="14"/></g>`;

  const head = `
    <g class="head">
      <rect x="122" y="262" width="24" height="40" rx="8" fill="${P.shade}" ${ol()}/>
      <circle cx="126" cy="282" r="8" fill="${P.body}" ${ol(lw * 0.8)}/>
      <path d="M170 208 Q256 202 342 208 Q374 210 375 240 L372 358 Q370 388 340 388 Q256 392 172 388 Q142 388 141 358 L137 240 Q138 210 170 208 Z" fill="${P.body}" ${ol()}/>
      <path d="M356 216 Q368 222 368 236 L366 362 Q365 380 346 381 H172 Q250 376 340 370 Q352 300 356 216 Z" fill="${P.shade}"/>
      <path d="M144 214 H369 V246 Q258 262 144 246 Z" fill="${P.shade}" opacity="${mark ? 0.6 : 0.95}"/>
      <path d="M300 214 H369 V246 Q336 252 300 250 Z" fill="${P.deep}" opacity=".55"/>
      ${details}
      ${eye(208, 276)}${eye(304, 276)}
      ${mouth}
      <rect x="244" y="318" width="24" height="4.5" rx="2.2" fill="${P.slot}"/>
      <rect x="235" y="330" width="42" height="30" rx="5" fill="${P.body}" ${ol(lw * 0.8)}/>
      <path d="M245 336 V354 M252 336 V354 M259 336 V354 M266 336 V354" stroke="${P.ink}" stroke-width="2.2" stroke-linecap="round"/>
    </g>`;

  // ---- the leaf hat: a thick saucer on a lime bracket and two wires -------------------
  const antPath = mood === "surprised"
    ? ["M209 102 C203 84 205 70 212 60", "M303 102 C309 84 307 70 300 60"]
    : ["M209 104 C194 72 204 48 236 44", "M303 104 C320 72 310 48 280 44"];
  const ant = d => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${24 + lw * 2}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${P.lime}" stroke-width="24" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${P.limeHi}" stroke-width="6" stroke-linecap="round" transform="translate(-4 -2)" opacity=".85"/>`;
  const antennae = `<g class="antennae">${antPath.map(ant).join("")}
      <rect x="196" y="96" width="26" height="20" rx="4" fill="${P.body}" ${ol(lw * 0.8)}/>
      <rect x="290" y="96" width="26" height="20" rx="4" fill="${P.body}" ${ol(lw * 0.8)}/></g>`;
  const hat = `
    <g class="hat">
      <path d="M168 190 V214 M344 190 V214" stroke="${P.ink}" stroke-width="${Math.max(2.4, lw * 0.6)}" stroke-linecap="round"/>
      <rect x="232" y="182" width="48" height="30" rx="4" fill="${P.lime}" ${ol(lw * 0.85)}/>
      <path d="M92 196 Q78 146 132 122 Q194 98 256 98 Q318 98 380 122 Q434 146 420 196 Q414 206 396 200 Q330 180 256 180 Q182 180 116 200 Q98 206 92 196 Z" fill="${P.hat}" ${ol()}/>
      <path d="M112 198 Q182 174 256 174 Q330 174 400 198 Q330 182 256 182 Q182 182 112 198 Z" fill="${P.hatUnder}"/>
      <path d="M96 158 Q170 192 410 172 Q190 204 104 180 Z" fill="${P.lime}"/>
      <path d="M146 126 Q200 108 256 106" fill="none" stroke="${P.hatHi}" stroke-width="7" stroke-linecap="round"/>
      <path d="M92 196 Q78 146 132 122 Q194 98 256 98 Q318 98 380 122 Q434 146 420 196 Q414 206 396 200 Q330 180 256 180 Q182 180 116 200 Q98 206 92 196 Z" fill="none" ${ol()}/>
      <g fill="${P.lime}">
        <ellipse cx="170" cy="144" rx="9" ry="6"/><circle cx="214" cy="128" r="3.5"/><ellipse cx="350" cy="148" rx="8" ry="6"/>
        <circle cx="388" cy="160" r="5"/><circle cx="318" cy="128" r="3"/>
        <rect x="262" y="134" width="11" height="11" rx="2" transform="rotate(32 267 139)"/>
      </g>
    </g>`;

  // ---- shoulders peeking out of a tub of rubble ---------------------------------
  const body = mark ? "" : `
    <g class="body">
      <rect x="224" y="380" width="16" height="44" rx="5" fill="${P.deep}" ${ol(lw * 0.8)}/>
      <rect x="272" y="380" width="16" height="44" rx="5" fill="${P.deep}" ${ol(lw * 0.8)}/>
      <path d="M234 400 H278" stroke="${P.ink}" stroke-width="${lw * 0.8}"/>
      <path d="M210 448 Q214 414 256 412 Q298 414 302 448 Z" fill="${P.body}" ${ol()}/>
      <ellipse cx="194" cy="442" rx="30" ry="24" fill="${P.body}" ${ol()}/>
      <ellipse cx="318" cy="442" rx="30" ry="24" fill="${P.body}" ${ol()}/>
      <path d="M176 432 Q190 424 206 428 M306 428 Q322 424 336 432" fill="none" stroke="${P.shade}" stroke-width="5" stroke-linecap="round"/>
      <path d="M232 428 H280" stroke="${P.seam}" stroke-width="2"/>
    </g>
    <g class="tub">
      <path d="M118 446 L132 428 L150 442 L140 450 Z M358 444 L374 426 L392 442 L380 450 Z M150 450 L160 438 L172 450 Z M340 450 L348 440 L358 450 Z" fill="${P.shade}" ${ol(lw * 0.75)}/>
      <path d="M30 450 Q256 436 482 450 L482 560 H30 Z" fill="${P.body}" ${ol()}/>
      <path d="M40 462 Q256 450 472 462" fill="none" stroke="${P.shade}" stroke-width="9" stroke-linecap="round"/>
    </g>`;

  const id = `r${Math.random().toString(36).slice(2, 8)}`;
  const turn = (inner, deg, cx, cy) => (deg ? `<g transform="rotate(${deg} ${cx} ${cy})">${inner}</g>` : inner);
  const character =
    body +
    turn(head + `<g transform="translate(0 ${hatLift}) rotate(${hatTilt} 256 170)">${hat}${antennae}</g>`, tilt, 256, 400);
  const defs = `<defs>
      <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%">
        ${shadow === "hard" ? `<feDropShadow dx="${mark ? 8 : 12}" dy="${mark ? 8 : 12}" stdDeviation="0" flood-color="${P.ink}" flood-opacity="1"/>` : shadow === "none" ? "" : `<feDropShadow dx="${mark ? 6 : 14}" dy="${mark ? 4 : 8}" stdDeviation="${mark ? 4 : 9}" flood-color="${P.drop}" flood-opacity=".7"/>`}
      </filter>
      <radialGradient id="${id}g" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="${P.bgIn}"/><stop offset="1" stop-color="${P.bgOut}"/></radialGradient>
      <clipPath id="${id}c"><circle cx="256" cy="256" r="236"/></clipPath>
    </defs>`;

  if (mark) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox || "76 26 360 360"}" role="img" aria-label="Ash Dev sprout robot">${defs}
      <g ${shadow === "none" ? "" : `filter="url(#${id}s)"`}>${character}</g></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Ash Dev sprout robot, ${mood}">${defs}
    ${ring ? `<circle cx="256" cy="256" r="236" fill="url(#${id}g)"/>` : ""}
    <g ${ring ? `clip-path="url(#${id}c)"` : ""}><g ${shadow === "none" ? "" : `filter="url(#${id}s)"`} transform="translate(256 256) scale(1.02) translate(-256 -244)">${character}</g></g>
    ${ring ? `<circle cx="256" cy="256" r="241" fill="none" stroke="${P.ring}" stroke-width="14"/>` : ""}
  </svg>`;
};
