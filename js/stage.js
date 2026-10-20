// The test track in the masthead: a small top-down car with a slip model, written for this page.
// It drives itself round a figure-eight until someone takes over with the keys or the pointer.
(() => {
  const canvas = document.getElementById("track");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const trails = document.createElement("canvas");
  const tctx = trails.getContext("2d");
  const trace = document.getElementById("trace");
  const trc = trace.getContext("2d");
  const out = {
    spd: document.getElementById("t-spd"),
    slip: document.getElementById("t-slip"),
    steer: document.getElementById("t-steer"),
    mode: document.getElementById("t-mode")
  };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TUNE = { engine: 430, brake: 760, drag: 0.55, grip: 7.5, handbrakeGrip: 1.2, maxSteer: 0.62, wheelbase: 24 };

  let W = 0, H = 0, dpr = 1;
  const car = { x: 0, y: 0, h: 0, vx: 0, vy: 0, w: 0, steer: 0, rear: null };
  const input = { up: 0, down: 0, left: 0, right: 0, hb: 0, pointer: null };
  let mode = "AUTOPILOT", lastInput = -1e9, pathT = 0, running = false, visible = true;
  const history = [];

  const colors = () => {
    const s = getComputedStyle(document.documentElement);
    const v = n => s.getPropertyValue(n).trim();
    return { ink: v("--ink"), paper: v("--paper"), signal: v("--signal"), rule: v("--rule"), leaf: v("--leaf") };
  };
  let C = colors();
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { C = colors(); });

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    for (const c of [canvas, trails]) { c.width = W * dpr; c.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tr = trace.getBoundingClientRect();
    trace.width = tr.width * dpr; trace.height = tr.height * dpr;
    trc.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!car.x) { const p = lemniscate(0); car.x = p.x; car.y = p.y; car.h = Math.PI / 4; }
    if (!running) draw();
  }

  // Figure-eight that fits the canvas, used as the autopilot's racing line.
  function lemniscate(t) {
    const a = Math.min(W * 0.42, H * 0.95);
    const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s;
    return { x: W / 2 + (a * c) / d, y: H / 2 + (a * s * c) / d * 1.25 };
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const wrapAngle = a => Math.atan2(Math.sin(a), Math.cos(a));

  function driveTowards(tx, ty, throttle) {
    const want = Math.atan2(ty - car.y, tx - car.x);
    const diff = wrapAngle(want - car.h);
    const speed = Math.hypot(car.vx, car.vy);
    return {
      steer: clamp(diff * 1.6, -1, 1),
      throttle: Math.hypot(tx - car.x, ty - car.y) > 30 ? throttle : 0,
      brake: Math.abs(diff) > 2.2 && speed > 60 ? 1 : 0,
      hb: Math.abs(diff) > 0.85 && speed > 170 ? 1 : 0
    };
  }

  function controls(now) {
    if (input.pointer) return driveTowards(input.pointer.x, input.pointer.y, 1);
    const keys = input.up || input.down || input.left || input.right || input.hb;
    if (keys) return { steer: input.right - input.left, throttle: input.up, brake: input.down, hb: input.hb };
    if (now - lastInput < 5000) return { steer: 0, throttle: 0, brake: 0, hb: 0 };
    mode = "AUTOPILOT";
    // Pursue a point a little way along the figure-eight.
    for (let i = 0; i < 60; i++) {
      const p = lemniscate(pathT);
      if (Math.hypot(p.x - car.x, p.y - car.y) > 70) break;
      pathT += 0.03;
    }
    const p = lemniscate(pathT);
    return driveTowards(p.x, p.y, 0.6);
  }

  function step(dt, now) {
    const c = controls(now);
    car.steer += clamp(c.steer * TUNE.maxSteer - car.steer, -4 * dt, 4 * dt);

    const fx = Math.cos(car.h), fy = Math.sin(car.h);
    const rx = -fy, ry = fx;
    let vf = car.vx * fx + car.vy * fy;
    let vr = car.vx * rx + car.vy * ry;

    vf += c.throttle * TUNE.engine * dt;
    if (c.brake) vf = vf > 8 ? vf - TUNE.brake * dt : Math.max(vf - 220 * dt, -110);
    vf -= vf * TUNE.drag * dt;
    const grip = c.hb ? TUNE.handbrakeGrip : TUNE.grip;
    vr *= Math.exp(-grip * dt);

    // Bicycle-model yaw rate; with the rear loose the car rotates more than the front asks for.
    const yaw = (vf * Math.tan(car.steer)) / TUNE.wheelbase * (c.hb ? 1.35 : 1);
    car.w += (yaw - car.w) * clamp(9 * dt, 0, 1);
    car.h += car.w * dt;

    // Velocity stays in the old frame: the body turns under it, and that difference is the slip.
    car.vx = fx * vf + rx * vr;
    car.vy = fy * vf + ry * vr;
    car.x += car.vx * dt;
    car.y += car.vy * dt;

    const m = 20;
    if (car.x < -m) car.x = W + m; else if (car.x > W + m) car.x = -m;
    if (car.y < -m) car.y = H + m; else if (car.y > H + m) car.y = -m;

    const speed = Math.hypot(car.vx, car.vy);
    const slip = speed > 20 ? Math.atan2(Math.abs(vr), Math.abs(vf)) : 0;
    skid(slip, speed, c.hb);
    return { speed, slip };
  }

  function skid(slip, speed, hb) {
    const back = -10, half = 6;
    const fx = Math.cos(car.h), fy = Math.sin(car.h);
    const wheels = [-1, 1].map(s => ({ x: car.x + fx * back - fy * half * s, y: car.y + fy * back + fx * half * s }));
    const marking = (slip > 0.16 || hb) && speed > 60;
    if (marking && car.rear && Math.hypot(wheels[0].x - car.rear[0].x, wheels[0].y - car.rear[0].y) < 40) {
      tctx.strokeStyle = C.ink;
      tctx.globalAlpha = clamp(slip * 0.9, 0.12, 0.5);
      tctx.lineWidth = 2.2;
      tctx.lineCap = "round";
      wheels.forEach((w, i) => {
        tctx.beginPath(); tctx.moveTo(car.rear[i].x, car.rear[i].y); tctx.lineTo(w.x, w.y); tctx.stroke();
      });
      tctx.globalAlpha = 1;
    }
    car.rear = wheels;
  }

  function drawCar() {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.h);
    ctx.fillStyle = C.ink;
    for (const [x, y, front] of [[9, -8, 1], [9, 8, 1], [-10, -8, 0], [-10, 8, 0]]) {
      ctx.save(); ctx.translate(x, y); if (front) ctx.rotate(car.steer);
      ctx.fillRect(-4, -2, 8, 4); ctx.restore();
    }
    ctx.fillStyle = C.paper; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(-16, -8, 32, 16, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.signal;
    ctx.fillRect(-16, -2.5, 32, 5);
    ctx.fillStyle = C.ink;
    ctx.beginPath(); ctx.arc(-3, 0, 4.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function drawTrace() {
    const w = trace.width / dpr, h = trace.height / dpr;
    trc.clearRect(0, 0, w, h);
    trc.strokeStyle = C.rule; trc.lineWidth = 1;
    trc.beginPath(); trc.moveTo(0, h - 0.5); trc.lineTo(w, h - 0.5); trc.stroke();
    const plot = (key, max, color) => {
      trc.strokeStyle = color; trc.lineWidth = 1.5; trc.beginPath();
      history.forEach((s, i) => {
        const x = w - (history.length - 1 - i) * 2, y = h - 2 - Math.min(s[key] / max, 1) * (h - 6);
        i ? trc.lineTo(x, y) : trc.moveTo(x, y);
      });
      trc.stroke();
    };
    plot("speed", 800, C.ink);
    plot("slip", 1.2, C.signal);
  }

  function drawCourse() {
    ctx.save();
    ctx.strokeStyle = C.rule; ctx.lineWidth = 22; ctx.lineCap = "round";
    ctx.beginPath();
    for (let t = 0; t <= Math.PI * 2 + 0.05; t += 0.05) {
      const p = lemniscate(t);
      t ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.font = "500 11px 'IBM Plex Mono', monospace";
    ctx.fillStyle = C.ink;
    ctx.globalAlpha = 0.55;
    const s = lemniscate(0);
    ctx.fillText("START / FINISH", s.x - 130, s.y + 4);
    const l = lemniscate(Math.PI);
    ctx.fillText("L2 HAIRPIN", l.x + 22, l.y + 4);
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawCourse();
    ctx.drawImage(trails, 0, 0, W, H);
    drawCar();
    drawTrace();
  }

  let last = 0, fadeClock = 0;
  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    const s = step(dt, now);
    fadeClock += dt;
    if (fadeClock > 0.1) {
      fadeClock = 0;
      tctx.globalCompositeOperation = "destination-out";
      tctx.fillStyle = "rgba(0,0,0,0.035)";
      tctx.fillRect(0, 0, W, H);
      tctx.globalCompositeOperation = "source-over";
    }
    history.push(s);
    if (history.length > trace.width / dpr / 2) history.shift();
    draw();
    out.spd.textContent = String(Math.round(s.speed * 0.32)).padStart(3, "0");
    out.slip.textContent = String(Math.round((s.slip * 180) / Math.PI)).padStart(2, "0");
    out.steer.textContent = (car.steer >= 0 ? "R" : "L") + String(Math.round(Math.abs(car.steer) * 57.3)).padStart(2, "0");
    out.mode.textContent = mode;
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  const stop = () => { running = false; };

  function takeOver() {
    lastInput = performance.now();
    mode = "YOU";
    start();
  }

  const KEYS = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", Space: "hb" };
  canvas.addEventListener("keydown", e => {
    const k = KEYS[e.code];
    if (!k) return;
    e.preventDefault();
    input[k] = 1;
    takeOver();
  });
  canvas.addEventListener("keyup", e => { const k = KEYS[e.code]; if (k) { input[k] = 0; lastInput = performance.now(); } });
  canvas.addEventListener("blur", () => { for (const k of Object.values(KEYS)) input[k] = 0; });

  const point = e => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener("pointerdown", e => {
    canvas.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    input.pointer = point(e);
    takeOver();
  });
  canvas.addEventListener("pointermove", e => { if (input.pointer) { input.pointer = point(e); lastInput = performance.now(); } });
  const release = () => { input.pointer = null; lastInput = performance.now(); };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible && (!reduceMotion || mode === "YOU") ? start() : stop();
  }).observe(canvas);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : !reduceMotion && start()));
  new ResizeObserver(resize).observe(canvas);

  resize();
  if (!reduceMotion) start();
})();
