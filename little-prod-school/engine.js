/* Little Prod School: engine.
   1. music helpers  2. sound (Web Audio synth)  3. timers  4. stage drawing (SVG)
   5. player (narrated "video" lessons)  6. quiz  7. free-play keyboard  8. page UI
   Lessons live in lessons.js and only use the helpers defined here. */
'use strict';

/* ================= 1. Music helpers ================= */
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** Note name in scientific pitch ("C4" = middle C = MIDI 60) or a MIDI number -> MIDI number */
function M(n) {
  if (typeof n === 'number') return n;
  const r = /^([A-G])(#|b|♯|♭)?(-?\d)$/.exec(n);
  if (!r) throw new Error('Bad note: ' + n);
  let p = LETTER_PC[r[1]];
  if (r[2] === '#' || r[2] === '♯') p++; else if (r[2] === 'b' || r[2] === '♭') p--;
  return (Number(r[3]) + 1) * 12 + p;
}
const pcOf = m => ((M(m) % 12) + 12) % 12;
const isBlack = m => [1, 3, 6, 8, 10].includes(pcOf(m));
const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
const SOL_S = ['Do', 'Do♯', 'Ré', 'Ré♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
const SOL_F = ['Do', 'Ré♭', 'Ré', 'Mi♭', 'Mi', 'Fa', 'Sol♭', 'Sol', 'La♭', 'La', 'Si♭', 'Si'];
/* One crayon color per note (C red ... B purple); black keys blend their neighbours */
const NOTE_COL = ['#F25F5C', '#F7814D', '#FF9F1C', '#FFB830', '#FFD23F', '#3BB273', '#33BC94', '#2EC4B6', '#3DAFD3', '#4D9DE0', '#7581E3', '#9B5DE5'];
/* Chord-role colors, same code as the video: root green, third blue, fifth purple, 4th (sus) red */
const ROLE_COL = { root: '#3BB273', third: '#4D9DE0', fifth: '#9B5DE5', fourth: '#F25F5C', second: '#F25F5C', seventh: '#FF9F1C', ninth: '#FFD23F', eleventh: '#F7A1C4' };
const letter = (m, flat) => (flat ? FLAT : SHARP)[pcOf(m)];
const solf = (m, flat) => (flat ? SOL_F : SOL_S)[pcOf(m)];
/** FL Studio octave numbers: middle C is "C5" in FL Studio (books often say C4) */
const flName = (m, flat) => letter(m, flat) + Math.floor(M(m) / 12);
const MAJOR = [2, 2, 1, 2, 2, 2, 1];
const MINOR = [2, 1, 2, 2, 1, 2, 2];
/** 8 notes: root..octave following a step recipe */
function scaleNotes(root, steps) { const out = [M(root)]; for (const s of steps) out.push(out[out.length - 1] + s); return out; }
const CH = {
  maj: [0, 4, 7], min: [0, 3, 7], dim: [0, 3, 6], aug: [0, 4, 8],
  dom7: [0, 4, 7, 10], m7: [0, 3, 7, 10], maj7: [0, 4, 7, 11], mM7: [0, 3, 7, 11],
  sus4: [0, 5, 7], sus2: [0, 2, 7], m9: [0, 3, 7, 10, 14], m11: [0, 3, 7, 10, 14, 17], m9no5: [0, 3, 10, 14]
};
const chord = (root, q) => (Array.isArray(q) ? q : CH[q]).map(i => M(root) + i);
const rnd = a => a[Math.floor(Math.random() * a.length)];
const coin = () => Math.random() < 0.5;
function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

/* ================= 2. Sound ================= */
const Snd = (() => {
  let ctx = null, out = null, bus = null, fxIn = null, noiseBuf = null, vol = 0.8;
  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.2;
      out = ctx.createGain(); out.gain.value = vol; out.connect(comp); comp.connect(ctx.destination);
      /* a soft echo gives the toy synth a little room */
      const dl = ctx.createDelay(1); dl.delayTime.value = 0.24;
      const fb = ctx.createGain(); fb.gain.value = 0.22;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2400;
      const wet = ctx.createGain(); wet.gain.value = 0.14;
      fxIn = ctx.createGain(); fxIn.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(out);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      newBus();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function newBus() { bus = ctx.createGain(); bus.connect(out); const s = ctx.createGain(); s.gain.value = 0.9; bus.connect(s); s.connect(fxIn); }
  function stop() {
    if (!ctx || !bus) return;
    const old = bus;
    try { old.gain.cancelScheduledValues(ctx.currentTime); old.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch (e) { /* ignore */ }
    setTimeout(() => { try { old.disconnect(); } catch (e) { /* ignore */ } }, 400);
    newBus();
  }
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const at = t => ctx.currentTime + 0.05 + Math.max(0, t);
  const INST = {
    keys: { parts: [['triangle', 1, 1], ['sine', 2, 0.32], ['sine', 3, 0.1]], a: 0.004, d: 0.5, s: 0.3, r: 0.25, lp: 3400, gain: 0.32 },
    pad: { parts: [['sawtooth', 1, 0.45, -7], ['sawtooth', 1, 0.45, 7], ['triangle', 0.5, 0.35]], a: 0.04, d: 0.5, s: 0.75, r: 0.3, lp: 1500, gain: 0.11 },
    lead: { parts: [['square', 1, 0.42], ['triangle', 1, 0.8], ['sine', 2, 0.12]], a: 0.008, d: 0.25, s: 0.6, r: 0.1, lp: 2800, gain: 0.17 },
    bell: { parts: [['sine', 1, 1], ['sine', 2.76, 0.4], ['sine', 5.4, 0.15]], a: 0.002, d: 1.1, s: 0, r: 0.3, lp: 7000, gain: 0.24, once: true },
    bass: { parts: [['sine', 1, 1], ['triangle', 1, 0.5], ['sine', 2, 0.2]], a: 0.006, d: 0.5, s: 0.75, r: 0.12, lp: 1000, gain: 0.42 },
    pluck: { parts: [['triangle', 1, 1], ['square', 2, 0.07]], a: 0.002, d: 0.3, s: 0, r: 0.1, lp: 2600, gain: 0.3, once: true }
  };
  function note(n, t = 0, dur = 0.5, inst = 'keys', vel = 1) {
    if (!ensure()) return;
    const m = M(n), f = hz(m), p = INST[inst] || INST.keys, t0 = at(t);
    const g = ctx.createGain(), lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = p.lp; lp.Q.value = 0.4;
    g.connect(lp); lp.connect(bus);
    const peak = Math.max(0.0002, p.gain * vel);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + p.a);
    let stopAt;
    if (p.once) { g.gain.setTargetAtTime(0.0001, t0 + p.a, (p.d + dur * 0.3) / 4); stopAt = t0 + p.a + (p.d + dur * 0.3) * 1.4 + 0.1; }
    else { g.gain.setTargetAtTime(peak * p.s, t0 + p.a, p.d / 3); g.gain.setTargetAtTime(0.0001, t0 + Math.max(dur, p.a + 0.02), p.r / 3); stopAt = t0 + dur + p.r * 2 + 0.1; }
    for (const [type, mult, amp, det] of p.parts) {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = type; o.frequency.value = f * mult; if (det) o.detune.value = det;
      og.gain.value = amp; o.connect(og); og.connect(g); o.start(t0); o.stop(stopAt);
    }
  }
  function noise(t0, dur, type, freq, q, peak, decay) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = freq; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
    s.connect(fl); fl.connect(g); g.connect(bus); s.start(t0, Math.random() * 0.5); s.stop(t0 + dur);
  }
  function drum(kind, t = 0, vel = 1) {
    if (!ensure()) return;
    const t0 = at(t);
    if (kind === 'kick') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(155, t0); o.frequency.exponentialRampToValueAtTime(46, t0 + 0.13);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.95 * vel, t0 + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.42);
      o.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + 0.45);
      noise(t0, 0.03, 'highpass', 3000, 0.7, 0.12 * vel, 0.02);
    } else if (kind === 'clap') {
      [0, 0.011, 0.022].forEach((dt, i) => noise(t0 + dt, i === 2 ? 0.25 : 0.03, 'bandpass', 1400, 0.9, 0.5 * vel, i === 2 ? 0.2 : 0.025));
    } else if (kind === 'hat') {
      noise(t0, 0.07, 'highpass', 7500, 0.6, 0.22 * vel, 0.05);
    } else if (kind === 'tick' || kind === 'tock') {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = kind === 'tick' ? 1900 : 1250;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.4 * vel, t0 + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
      o.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + 0.07);
    }
  }
  function setVol(v) { vol = v; if (out) out.gain.setTargetAtTime(v, ctx.currentTime, 0.03); }
  function ding() { stop(); note('E5', 0, 0.25, 'bell', 0.8); note('A5', 0.1, 0.35, 'bell', 0.8); note('C#6', 0.2, 0.5, 'bell', 0.7); }
  function bonk() { stop(); note('E3', 0, 0.18, 'pluck', 0.9); note('C3', 0.14, 0.3, 'pluck', 0.9); }
  return { ensure, stop, note, drum, setVol, ding, bonk, get vol() { return vol; } };
})();

/* ================= 3. Timers (cancellable visual sync) ================= */
const Timers = {
  set: new Set(),
  add(ms, fn) { const id = setTimeout(() => { this.set.delete(id); try { fn(); } catch (e) { console.error(e); } }, ms); this.set.add(id); return id; },
  clear() { this.set.forEach(clearTimeout); this.set.clear(); }
};
const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Play a list of events. e = {b: start beat, l: length in beats, n: note|notes, i: instrument, v: velocity,
 *  dr: drum name, sp: strum spread (s), el: svg element(s) to flash, fx: callback}. Returns seconds. */
function play(evts, o = {}) {
  const spb = 60 / (o.bpm || 100), off = o.at || 0; let end = 0;
  for (const e of evts) {
    const t = off + (e.b || 0) * spb, d = (e.l ?? 1) * spb;
    const ns = e.n == null ? [] : [].concat(e.n);
    if (e.dr) Snd.drum(e.dr, t, e.v ?? 1);
    const inst = e.i || o.inst || 'keys';
    const v = (e.v ?? 1) * (ns.length > 2 ? 0.62 : ns.length > 1 ? 0.8 : 1);
    ns.forEach((n, k) => Snd.note(n, t + (e.sp ? e.sp * k : 0), d * (e.g ?? 0.92), inst, v));
    Timers.add(t * 1000 + 50, () => {
      if (o.kb && !e.nokb) ns.forEach(n => o.kb.press(n, Math.max(0.12, d * 0.85)));
      if (e.el) [].concat(e.el).forEach(el => flash(el, Math.max(0.12, d * 0.85)));
      if (o.on) o.on(e);
      if (e.fx) e.fx();
    });
    end = Math.max(end, t + d);
  }
  if (o.roll) o.roll.playhead(o.from ?? 0, o.to ?? (end - off) / spb, (o.to != null ? (o.to - (o.from ?? 0)) * spb : end - off), off);
  return end + (o.tail ?? 0.35);
}
/** Simple sequence: list of notes (or arrays = chords), one per `gap` beats */
function seq(list, o = {}) {
  const gap = o.gap || 1;
  return play(list.map((n, k) => ({ b: k * gap, l: o.len || gap, n, i: o.inst, fx: o.each ? () => o.each(k, n) : null })), o);
}
function flash(el, dur = 0.3) { if (!el || !el.classList) return; el.classList.add('hit'); Timers.add(dur * 1000, () => el.classList.remove('hit')); }

/* ================= 4. Stage drawing (SVG 640 x 400) ================= */
const NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function txt(parent, x, y, s, attrs = {}) { const t = svg('text', Object.assign({ x, y }, attrs), parent); t.textContent = s; return t; }

const Stage = {
  el: null, g: null, refs: {}, gen: 0,
  init(el) { this.el = el; this.clear(); },
  clear() {
    this.gen++;
    this.el.innerHTML = '';
    this.g = svg('g', { class: 'scene' }, this.el);
    this.refs = {};
  },
  halt() { this.gen++; }
};
/** animate numeric attributes from a to b over secs (cancelled by Stage.clear / halt) */
function tween(el, attrs, from, to, secs, delay = 0, done) {
  const gen = Stage.gen, t0 = performance.now() + 50 + delay * 1000;
  const step = now => {
    if (gen !== Stage.gen || !el.isConnected) return;
    const p = Math.min(1, Math.max(0, (now - t0) / (secs * 1000)));
    const v = from + (to - from) * p;
    attrs.forEach(a => el.setAttribute(a, v));
    if (p < 1) requestAnimationFrame(step); else if (done) done();
  };
  requestAnimationFrame(step);
}

/* ---- Big text helpers ---- */
function Big(text, y = 70, cls = 'big', x = 320, anchor = 'middle') { return txt(Stage.g, x, y, text, { class: cls, 'text-anchor': anchor }); }
function Note(text, y = 392, x = 320, anchor = 'middle') { return txt(Stage.g, x, y, text, { class: 'snote', 'text-anchor': anchor }); }

/* ---- Piano keyboard ---- */
function Keyboard(parent, o = {}) {
  const lo = M(o.lo || 'C4'), hi = M(o.hi || 'B5');
  const x = o.x ?? 20, y = o.y ?? 200, w = o.w ?? 600, h = o.h ?? 170, flat = !!o.flat;
  const g = svg('g', { class: 'kb' + (o.onTap ? ' tappable' : '') }, parent);
  const gw = svg('g', {}, g), gb = svg('g', {}, g), gt = svg('g', { class: 'kbtext' }, g);
  const whites = []; for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites.push(m);
  const ww = w / whites.length, bw = ww * 0.6, bh = h * 0.6;
  const keys = new Map();
  const make = (m, kx, kw, kh, black) => {
    const grp = svg('g', { class: 'key ' + (black ? 'bk' : 'wk') }, black ? gb : gw);
    svg('rect', { x: kx, y, width: kw, height: kh, rx: black ? 4 : 7, class: 'kbase' }, grp);
    const ov = svg('rect', { x: kx, y, width: kw, height: kh, rx: black ? 4 : 7, class: 'kov', fill: NOTE_COL[pcOf(m)] }, grp);
    const k = { m, x: kx, cx: kx + kw / 2, w: kw, h: kh, black, grp, ov, mark: 0 };
    keys.set(m, k);
    if (o.onTap) {
      grp.setAttribute('tabindex', '0'); grp.setAttribute('role', 'button');
      grp.setAttribute('aria-label', letter(m, flat) + ' (' + solf(m, flat) + ')');
      grp.addEventListener('pointerdown', e => { e.preventDefault(); o.onTap(m); });
      grp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.onTap(m); } });
    }
    return k;
  };
  whites.forEach((m, i) => make(m, x + i * ww + 1, ww - 2, h, false));
  for (let m = lo; m <= hi; m++) if (isBlack(m) && keys.has(m - 1)) { const L = keys.get(m - 1); make(m, L.x + L.w + 1 - bw / 2, bw, bh, true); }
  const lab = o.labels ?? 'both';
  const fs = Math.min(20, ww * 0.4);
  whites.forEach(m => {
    if (lab === 'none') return;
    const k = keys.get(m);
    const main = lab === 'solf' ? solf(m) : lab === 'fl' ? flName(m) : letter(m);
    txt(gt, k.cx, y + h - 12, main, { class: 'klab', 'font-size': lab === 'fl' ? Math.min(14, ww * 0.34) : fs });
    if (lab === 'both' && ww > 24) txt(gt, k.cx, y + h - 14 - fs, solf(m), { class: 'ksol', 'font-size': Math.min(13, ww * 0.3) });
  });
  if (o.blackLabels) {
    keys.forEach(k => {
      if (!k.black) return;
      const bfs = Math.min(12, bw * 0.42);
      if (o.blackLabels === 'both') {
        txt(gt, k.cx, y + bh - 22, SHARP[pcOf(k.m)], { class: 'kblab', 'font-size': bfs });
        txt(gt, k.cx, y + bh - 8, FLAT[pcOf(k.m)], { class: 'kblab', 'font-size': bfs });
      } else txt(gt, k.cx, y + bh - 9, (o.blackLabels === 'flat' ? FLAT : SHARP)[pcOf(k.m)], { class: 'kblab', 'font-size': bfs });
    });
  }
  const api = {
    g, keys, x, y, w, h, ww,
    has: n => keys.has(M(n)),
    cx: n => keys.get(M(n)).cx,
    press(n, dur = 0.35) {
      const k = keys.get(M(n)); if (!k) return;
      k.ov.style.opacity = 1; k.grp.classList.add('down');
      Timers.add(dur * 1000, () => { k.ov.style.opacity = k.mark; k.grp.classList.remove('down'); });
    },
    mark(ns, lvl = 0.6) { [].concat(ns).forEach(n => { const k = keys.get(M(n)); if (k) { k.mark = lvl; k.ov.style.opacity = lvl; } }); return api; },
    unmark(ns) { (ns ? [].concat(ns).map(M) : [...keys.keys()]).forEach(m => { const k = keys.get(m); if (k) { k.mark = 0; k.ov.style.opacity = 0; } }); return api; },
    ring(ns, cls = 'kring') { return [].concat(ns).map(n => { const k = keys.get(M(n)); return k ? svg('rect', { x: k.x - 2, y: y - 2, width: k.w + 4, height: k.h + 4, rx: 8, class: cls }, gt) : null; }); },
    tag(n, text, cls = 'ktag', dy = 0) { const k = keys.get(M(n)); if (!k) return null; return txt(gt, k.cx, y - 10 - dy, text, { class: cls, 'text-anchor': 'middle' }); },
    arc(n1, n2, label, cls = 'karc', lift = 36) {
      const a = keys.get(M(n1)), b = keys.get(M(n2)); if (!a || !b) return null;
      const yy = y - 4, mx = (a.cx + b.cx) / 2;
      const p = svg('path', { d: `M${a.cx},${yy} Q${mx},${yy - lift} ${b.cx},${yy}`, class: cls }, gt);
      const t = label != null ? txt(gt, mx, yy - lift / 2 - 6, label, { class: cls + 't', 'text-anchor': 'middle' }) : null;
      return { p, t };
    },
    band(n1, n2, label, color, dy = 0) {
      const a = keys.get(M(n1)), b = keys.get(M(n2));
      const r = svg('rect', { x: a.x, y: y - 34 - dy, width: b.x + b.w - a.x, height: 26, rx: 8, fill: color, class: 'kband' }, gt);
      txt(gt, (a.x + b.x + b.w) / 2, y - 16 - dy, label, { class: 'kbandt', 'text-anchor': 'middle' });
      return r;
    }
  };
  return api;
}

/* ---- Piano roll (like FL Studio's) ---- */
function Roll(parent, o = {}) {
  const lo = M(o.lo || 'C4'), hi = M(o.hi || 'C6');
  const beats = o.beats || 8, bpb = o.bpb || 4, sub = o.sub || 1;
  const x = o.x ?? 16, y = o.y ?? 40, w = o.w ?? 608, h = o.h ?? 330, kw = o.kw ?? 44;
  const g = svg('g', { class: 'roll' }, parent);
  const rows = hi - lo + 1, rh = h / rows, gx = x + kw, gw = w - kw, bw = gw / beats;
  const inScale = o.scale ? new Set(o.scale.map(pcOf)) : null;
  svg('rect', { x: gx, y, width: gw, height: h, class: 'rbg' }, g);
  for (let m = hi; m >= lo; m--) {
    const ry = y + (hi - m) * rh;
    let cls = isBlack(m) ? 'rrow rb' : 'rrow';
    if (inScale) cls += inScale.has(pcOf(m)) ? ' rin' : ' rout';
    if (o.root != null && pcOf(m) === pcOf(o.root)) cls += ' rroot';
    svg('rect', { x: gx, y: ry, width: gw, height: rh, class: cls }, g);
    svg('rect', { x, y: ry + 0.5, width: kw - 4, height: Math.max(1, rh - 1), rx: 2, class: isBlack(m) ? 'rkey rkb' : 'rkey' }, g);
    if ((pcOf(m) === 0 || o.allLabels) && rh >= 7) txt(g, x + kw - 8, ry + rh * 0.8, o.allLabels ? letter(m) : flName(m), { class: 'rklab', 'text-anchor': 'end', 'font-size': Math.min(12, rh * 0.9) });
  }
  for (let i = 0; i <= beats * sub; i++) {
    const b = i / sub, lx = gx + b * bw;
    const cls = (Math.abs(b % bpb) < 1e-6) ? 'gbar' : (Math.abs(b - Math.round(b)) < 1e-6 ? 'gbeat' : 'gsub');
    svg('line', { x1: lx, y1: y, x2: lx, y2: y + h, class: cls }, g);
    if (Math.abs(b % bpb) < 1e-6 && b < beats && !o.noNums) txt(g, lx + 4, y - 8, String(Math.round(b / bpb) + 1), { class: 'gnum' });
  }
  const notesG = svg('g', {}, g);
  const api = {
    g, rh, bw, gx, gw, y, h, beats, lo, hi,
    xOf: b => gx + b * bw,
    yOf: n => y + (hi - M(n)) * rh,
    add(n, b, l, o2 = {}) {
      const m = M(n);
      const r = svg('rect', {
        x: gx + b * bw + 1, y: y + (hi - m) * rh + 1, width: Math.max(3, l * bw - 2), height: Math.max(3, rh - 2),
        rx: Math.min(4, rh / 3), class: 'rnote ' + (o2.cls || ''), fill: o2.fill || NOTE_COL[pcOf(m)]
      }, notesG);
      if (o2.op != null) r.setAttribute('opacity', o2.op);
      if (o2.label && rh >= 9) txt(notesG, gx + b * bw + 5, y + (hi - m) * rh + rh * 0.78, o2.label, { class: 'rnlab', 'font-size': Math.min(12, rh * 0.85) });
      return r;
    },
    chord(ns, b, l, o2) { return ns.map(n => api.add(n, b, l, o2)); },
    playhead(fromB, toB, secs, delay = 0) {
      const ln = svg('line', { x1: gx + fromB * bw, y1: y - 2, x2: gx + fromB * bw, y2: y + h + 2, class: 'phead' }, g);
      tween(ln, ['x1', 'x2'], gx + fromB * bw, gx + toB * bw, Math.max(0.1, secs), delay, () => Timers.add(250, () => ln.remove()));
    },
    clear() { notesG.innerHTML = ''; }
  };
  return api;
}

/* ---- Beat boxes ---- */
function Beats(parent, o = {}) {
  const count = o.count || 4, bpb = o.bpb || 4, x = o.x ?? 40, y = o.y ?? 140, w = o.w ?? 560, h = o.h ?? 110;
  const gap = o.gap ?? 12, barGap = o.barGap ?? 26;
  const bars = Math.ceil(count / bpb);
  const bwid = (w - gap * (count - bars) - barGap * (bars - 1)) / count;
  const g = svg('g', { class: 'beats' }, parent);
  const boxes = [];
  let cx = x;
  for (let i = 0; i < count; i++) {
    if (i && i % bpb === 0) cx += barGap - gap;
    const strong = o.strong ? o.strong.includes(i % bpb) : false;
    const hh = o.sized ? (strong ? h : h * 0.62) : h;
    const by = y + (h - hh);
    const r = svg('rect', { x: cx, y: by, width: bwid, height: hh, rx: 14, class: 'bbox' + (strong ? ' strong' : '') + (o.sized && !strong ? ' weak' : '') }, g);
    const t = txt(g, cx + bwid / 2, by + hh / 2 + (o.sized && !strong ? 10 : 16), o.labels ? o.labels[i] : String(i % bpb + 1), { class: 'bnum' + (o.sized && !strong ? ' small' : ''), 'text-anchor': 'middle' });
    boxes.push({ r, t, x: cx, w: bwid });
    cx += bwid + gap;
  }
  if (bars > 1 || o.barLabels) for (let b = 0; b < bars; b++) {
    const a = boxes[b * bpb], z = boxes[Math.min(count - 1, b * bpb + bpb - 1)];
    const lx = a.x, rx = z.x + z.w;
    svg('path', { d: `M${lx},${y + h + 14} v8 H${rx} v-8`, class: 'bbrace' }, g);
    txt(g, (lx + rx) / 2, y + h + 44, (o.barWord || 'bar') + ' ' + (b + 1), { class: 'bbar', 'text-anchor': 'middle' });
  }
  return { g, boxes, light(i, dur = 0.3) { if (boxes[i]) { flash(boxes[i].r, dur); flash(boxes[i].t, dur); } } };
}

/* ---- Pizza (one beat cut into slices) ---- */
function Pizza(parent, cx, cy, r, n, o = {}) {
  const g = svg('g', { class: 'pizza' + (o.cls ? ' ' + o.cls : '') }, parent);
  svg('circle', { cx, cy, r: r + 5, class: 'crust' }, g);
  const slices = [];
  if (n <= 1) slices.push(svg('circle', { cx, cy, r, class: 'slice' }, g));
  else for (let i = 0; i < n; i++) {
    const a0 = (-90 + i * 360 / n) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / n) * Math.PI / 180;
    const p = svg('path', { d: `M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`, class: 'slice' }, g);
    slices.push(p);
  }
  [[-.35, -.3], [.3, -.15], [-.1, .35], [.35, .38], [-.4, .15]].forEach(([dx, dy]) => svg('circle', { cx: cx + dx * r, cy: cy + dy * r, r: r * 0.09, class: 'pep' }, g));
  if (o.label) txt(g, cx, cy + r + 30, o.label, { class: 'plab', 'text-anchor': 'middle' });
  return { g, slices, light(i, dur = 0.15) { flash(slices[i % slices.length], dur); } };
}

/* ---- Note friend (a round character) ---- */
function Friend(parent, cx, cy, r, n, o = {}) {
  const m = M(n);
  const g = svg('g', { class: 'friend', transform: `translate(${cx},${cy})` }, parent);
  const b = svg('g', { class: 'bob' }, g);
  svg('circle', { r, fill: o.fill || NOTE_COL[pcOf(m)], class: 'fbody' }, b);
  [-1, 1].forEach(s => { svg('circle', { cx: s * r * 0.33, cy: -r * 0.12, r: r * 0.2, class: 'feye' }, b); svg('circle', { cx: s * r * 0.33 + r * 0.04, cy: -r * 0.08, r: r * 0.1, class: 'fpup' }, b); });
  svg('path', { d: `M${-r * 0.28},${r * 0.28} Q0,${r * 0.55} ${r * 0.28},${r * 0.28}`, class: 'fmouth' }, b);
  if (o.label !== false) txt(g, 0, r + 22, o.label || letter(m, o.flat), { class: 'flab', 'text-anchor': 'middle' });
  if (o.sub) txt(g, 0, r + 40, o.sub, { class: 'fsub', 'text-anchor': 'middle' });
  return {
    g, x: cx, y: cy,
    hop() {
      if (reduceMotion()) { flash(b, 0.25); return; }
      try { b.animate([{ transform: 'translateY(0px)' }, { transform: `translateY(${-r * 0.55}px)` }, { transform: 'translateY(0px)' }], { duration: 320, easing: 'ease-out' }); } catch (e) { flash(b, 0.25); }
    },
    dim(on) { g.classList.toggle('dimmed', on); }
  };
}
function Friends(notes, o = {}) {
  const y = o.y ?? 190, r = o.r ?? 30, x0 = o.x0 ?? 60, x1 = o.x1 ?? 580;
  const n = notes.length, step = n > 1 ? (x1 - x0) / (n - 1) : 0;
  return notes.map((nt, i) => Friend(Stage.g, n > 1 ? x0 + i * step : 320, y, r, nt, { flat: o.flat, label: o.labels ? o.labels[i] : undefined, sub: o.subs ? o.subs[i] : (o.solf ? solf(nt, o.flat) : undefined) }));
}

/* ---- Snowman chord (bottom = root) ---- */
function Snowman(parent, cx, by, notes, roles, o = {}) {
  const g = svg('g', { class: 'snow' }, parent);
  const radii = o.radii || [44, 37, 31, 27];
  let yy = by; const balls = [];
  notes.forEach((n, i) => {
    const role = roles[i];
    if (role === 'seventh' && o.hat !== false) {
      const hg = svg('g', { class: 'ball' }, g), hy = yy - 2;
      svg('rect', { x: cx - 36, y: hy - 10, width: 72, height: 11, rx: 5, fill: ROLE_COL.seventh }, hg);
      const body = svg('rect', { x: cx - 23, y: hy - 52, width: 46, height: 44, rx: 7, fill: ROLE_COL.seventh }, hg);
      const t = txt(hg, cx, hy - 23, letter(n, o.flat), { class: 'ballt', 'text-anchor': 'middle' });
      balls.push({ g: hg, shape: body, t, cy: hy - 28, r: 26 }); yy = hy - 52; return;
    }
    const r = radii[i] || 24, cy = yy - r;
    const bg = svg('g', { class: 'ball' }, g);
    const c = svg('circle', { cx, cy, r, fill: ROLE_COL[role] || '#8892A8' }, bg);
    const t = txt(bg, cx, cy + 8, letter(n, o.flat), { class: 'ballt', 'text-anchor': 'middle' });
    balls.push({ g: bg, shape: c, t, cy, r }); yy = cy - r + 5;
  });
  const top = balls[balls.length - 1];
  if (o.face !== false && top && top.shape.tagName === 'circle') {
    /* tiny coal eyes so it reads as a snowman */
    [-1, 1].forEach(s => svg('circle', { cx: cx + s * top.r * 0.3, cy: top.cy - top.r * 0.68, r: 2.4, class: 'coal' }, g));
  }
  const side = o.side;
  if (side) balls.forEach((b, i) => { if (side[i]) txt(g, cx + (o.sideX ?? 58), b.cy + 6, side[i], { class: 'balls' }); });
  return {
    g, balls,
    set(i, n, role) { const b = balls[i]; b.t.textContent = letter(n, o.flat); if (role) b.shape.setAttribute('fill', ROLE_COL[role]); flash(b.g, 0.5); },
    light(i, d = 0.3) { if (balls[i]) flash(balls[i].g, d); }
  };
}

/* ---- Staircase of a scale (step height = half steps from the start) ---- */
function Stairs(parent, notes, o = {}) {
  const x = o.x ?? 50, base = o.base ?? 372, w = o.w ?? 540, unit = o.unit ?? 15, flat = !!o.flat;
  const ms = notes.map(M), n = ms.length, sw = w / n;
  const g = svg('g', { class: 'stairs' }, parent);
  const steps = ms.map((m, i) => {
    const hh = 60 + (m - ms[0]) * unit;
    const r = svg('rect', { x: x + i * sw + 3, y: base - hh, width: sw - 6, height: hh, rx: 8, fill: NOTE_COL[pcOf(m)], class: 'step' }, g);
    txt(g, x + i * sw + sw / 2, base - 12, letter(m, flat), { class: 'stepl', 'text-anchor': 'middle' });
    if (o.nums) txt(g, x + i * sw + sw / 2, base - hh + 24, o.nums[i], { class: 'stepn', 'text-anchor': 'middle' });
    return { r, top: base - hh, cx: x + i * sw + sw / 2 };
  });
  if (o.gaps) for (let i = 1; i < n; i++) {
    const d = ms[i] - ms[i - 1];
    txt(g, x + i * sw, steps[i].top - 12, d === 1 ? '½' : d === 2 ? 'T' : String(d), { class: 'stepg' + (d === 1 ? ' half' : ''), 'text-anchor': 'middle' });
  }
  const walker = svg('g', { class: 'walker' }, g);
  svg('circle', { r: 13, class: 'wbody' }, walker);
  [-1, 1].forEach(s => svg('circle', { cx: s * 4.5, cy: -2, r: 2.2, class: 'fpup' }, walker));
  const moveTo = i => { const s = steps[i]; walker.style.transform = `translate(${s.cx}px, ${s.top - 15}px)`; };
  moveTo(0);
  return { g, steps, hop(i) { moveTo(i); flash(steps[i].r, 0.3); } };
}

/* ---- Cards (summaries) ---- */
function Cards(items, o = {}) {
  const cols = o.cols || items.length, y = o.y ?? 120, h = o.h ?? 150, x0 = o.x ?? 24, w = o.w ?? 592, gap = o.gap ?? 14;
  const rowsN = Math.ceil(items.length / cols), cw = (w - gap * (cols - 1)) / cols, ch = (h - gap * (rowsN - 1)) / rowsN;
  return items.map((it, i) => {
    const c = i % cols, r = Math.floor(i / cols), cx = x0 + c * (cw + gap), cy = y + r * (ch + gap);
    const g = svg('g', { class: 'card' }, Stage.g);
    const rect = svg('rect', { x: cx, y: cy, width: cw, height: ch, rx: 16, class: 'cardbg' }, g);
    if (it.color) svg('rect', { x: cx, y: cy, width: cw, height: 8, rx: 4, fill: it.color }, g);
    txt(g, cx + cw / 2, cy + ch / 2 - (it.sub ? 4 : -8), it.t, { class: 'cardt', 'text-anchor': 'middle', 'font-size': it.fs || Math.min(30, cw / Math.max(4, it.t.length) * 1.5) });
    if (it.sub) txt(g, cx + cw / 2, cy + ch / 2 + 22, it.sub, { class: 'cards', 'text-anchor': 'middle', 'font-size': it.sfs || Math.min(14, cw / Math.max(8, it.sub.length) * 1.9) });
    return { g, rect };
  });
}

/* ---- Speech bubble ---- */
function Bubble(x, y, w, h, text, tail = 'left', cls = '') {
  const g = svg('g', { class: 'bubble ' + cls }, Stage.g);
  svg('rect', { x, y, width: w, height: h, rx: 18, class: 'bubbg' }, g);
  const tx = tail === 'left' ? x + 30 : x + w - 30;
  svg('path', { d: `M${tx - 10},${y + h - 1} L${tx + (tail === 'left' ? -14 : 14)},${y + h + 18} L${tx + 12},${y + h - 1} Z`, class: 'bubbg' }, g);
  txt(g, x + w / 2, y + h / 2 + 7, text, { class: 'bubt', 'text-anchor': 'middle' });
  return g;
}

/* ---- Chips row (e.g. a scale recipe) ---- */
function Chips(list, o = {}) {
  const y = o.y ?? 60, h = o.h ?? 46, x0 = o.x ?? 30, w = o.w ?? 580, gap = o.gap ?? 8;
  const cw = (w - gap * (list.length - 1)) / list.length;
  return list.map((c, i) => {
    const g = svg('g', { class: 'chip ' + (c.cls || '') }, Stage.g);
    const r = svg('rect', { x: x0 + i * (cw + gap), y, width: cw, height: h, rx: 12, class: 'chipbg' }, g);
    if (c.fill) r.setAttribute('fill', c.fill);
    txt(g, x0 + i * (cw + gap) + cw / 2, y + h / 2 + 8, c.t, { class: 'chipt', 'text-anchor': 'middle', 'font-size': c.fs || Math.min(24, cw * 0.45) });
    return g;
  });
}

/* ================= 5. Player ================= */
const LESSONS = [];
const CHAPTERS = [];
function lesson(L) { L.idx = LESSONS.length; LESSONS.push(L); }
function chapter(c) { CHAPTERS.push(c); }

const Store = {
  get(k, d) { try { const v = localStorage.getItem('lps:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('lps:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked: progress just isn't remembered */ } }
};

const Voice = {
  list: [], pick: null, on: true, rate: 1,
  ok() { return 'speechSynthesis' in window && this.list.length > 0; },
  load() {
    if (!('speechSynthesis' in window)) return;
    const all = speechSynthesis.getVoices();
    const vs = all.filter(v => /^en([-_]|$)/i.test(v.lang));
    this.list = vs;
    const saved = Store.get('voice', null);
    const prefs = [/Google US English/i, /Samantha/i, /Aria/i, /Jenny/i, /Natural/i, /Google UK English Female/i, /Karen/i, /Serena/i, /Daniel/i, /Microsoft Zira/i];
    this.pick = vs.find(v => v.name === saved) || prefs.map(r => vs.find(v => r.test(v.name))).find(Boolean) || vs.find(v => /en-US/i.test(v.lang)) || vs[0] || null;
    UI.fillVoices();
  }
};
function speechText(s) {
  return s.replace(/♯/g, ' sharp').replace(/♭/g, ' flat').replace(/½/g, 'half').replace(/→/g, ', then ').replace(/[“”"]/g, '').replace(/\s*·\s*/g, ', ');
}
function readSecs(s) { const words = s.split(/\s+/).length; return Math.max(1.8, words / 2.6) / Voice.rate; }

const Player = {
  li: 0, bi: 0, playing: false, token: 0, continuing: false,
  get L() { return LESSONS[this.li]; },
  open(li, o = {}) {
    this.stop();
    this.li = Math.max(0, Math.min(LESSONS.length - 1, li)); this.bi = 0; this.continuing = false;
    Store.set('last', this.li);
    Quiz.hide();
    UI.lessonChanged();
    this.preview(0);
    UI.cover(true);
    if (o.autoplay) this.play();
  },
  preview(bi) { /* draw a beat without playing it */
    this.bi = bi; const b = this.L.beats[bi];
    Stage.clear(); try { b.v && b.v(Stage); } catch (e) { console.error(e); }
    UI.caption(b.s); UI.dots();
  },
  play() {
    Snd.ensure();
    if (this.playing) return;
    UI.cover(false); Quiz.hide();
    if (this.bi >= this.L.beats.length) this.bi = 0;
    this.run();
  },
  async run() {
    const my = ++this.token; this.playing = true; UI.playState();
    while (this.bi < this.L.beats.length) {
      const b = this.L.beats[this.bi];
      Snd.stop(); Timers.clear();
      if (!(b.k && this.continuing)) { Stage.clear(); try { b.v && b.v(Stage); } catch (e) { console.error(e); } }
      this.continuing = true;
      UI.caption(b.s); UI.dots();
      await this.say(b.tts || b.s, my, !b.tts);
      if (my !== this.token) return;
      let dur = 0;
      if (b.t) { try { dur = b.t(Stage) || 0; } catch (e) { console.error(e); } }
      await new Promise(r => setTimeout(r, dur * 1000 + (b.t ? 500 : 350)));
      if (my !== this.token) return;
      this.bi++;
    }
    this.playing = false; this.continuing = false; UI.playState();
    Quiz.offer(this.li);
  },
  say(text, my, sameAsCaption) {
    return new Promise(res => {
      const base = readSecs(text);
      if (!Voice.on || !Voice.ok()) { setTimeout(res, base * 1000 + 300); return; }
      const u = new SpeechSynthesisUtterance(speechText(text));
      if (Voice.pick) { u.voice = Voice.pick; u.lang = Voice.pick.lang; } else u.lang = 'en-US';
      u.rate = 0.97 * Voice.rate; u.pitch = 1.05;
      let done = false;
      const fin = () => { if (done) return; done = true; clearTimeout(guard); res(); };
      u.onend = fin; u.onerror = fin;
      if (sameAsCaption) u.onboundary = e => { if (my === this.token && e.name === 'word') UI.wordAt(e.charIndex, speechText(text)); };
      const guard = setTimeout(fin, base * 2200 + 4000);
      try { speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { fin(); }
    });
  },
  pause() { this.stop(); UI.playState(); },
  stop() {
    this.token++; this.playing = false; this.continuing = false;
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { /* ignore */ }
    Snd.stop(); Timers.clear(); Stage.halt(); UI.playState();
  },
  toggle() { this.playing ? this.pause() : this.play(); },
  step(d) {
    const was = this.playing; this.stop(); UI.cover(false); Quiz.hide();
    const nb = this.bi + d;
    if (nb < 0) { this.preview(0); if (was) this.play(); return; }
    if (nb >= this.L.beats.length) { this.bi = this.L.beats.length; Quiz.offer(this.li); return; }
    this.bi = nb; this.preview(nb); if (was) this.play();
  },
  jump(bi) { this.stop(); UI.cover(false); Quiz.hide(); this.preview(bi); this.play(); }
};

/* ================= 6. Quiz ================= */
const Quiz = {
  el: null, qs: [], i: 0, score: 0, mode: 'lesson', li: 0, answered: false, picks: [],
  init(el) { this.el = el; },
  hide() { if (this.el) this.el.hidden = true; UI.stageVisible(true); },
  show() { this.el.hidden = false; UI.stageVisible(false); },
  build(list) { return list.map(q => { const c = q.gen ? q.gen() : q; return Object.assign({ li: q.li }, c); }); },
  offer(li) {
    this.li = li; this.mode = 'lesson'; this.show(); UI.cover(false);
    const L = LESSONS[li], n = L.quiz.length;
    this.el.innerHTML = `<div class="qwrap qintro">
      <p class="qeyebrow">Lesson ${li + 1} done</p>
      <h3 class="qtitle">Quiz time: ${n} questions</h3>
      <p class="qlead">Some questions ask you to listen. Turn your sound on.</p>
      <div class="qbtns"><button class="btn primary" id="qGo">Start the quiz</button><button class="btn" id="qAgain">Watch again</button></div></div>`;
    this.el.querySelector('#qGo').onclick = () => this.start(L.quiz.map(q => Object.assign({ li }, q)), 'lesson');
    this.el.querySelector('#qAgain').onclick = () => Player.open(li, { autoplay: true });
    UI.focusQuiz();
  },
  start(list, mode) {
    Snd.ensure(); Player.stop();
    this.mode = mode; this.qs = this.build(list); this.i = 0; this.score = 0; this.wrong = [];
    this.show(); this.render();
  },
  bigQuiz() {
    const pool = [];
    LESSONS.forEach(L => L.quiz.forEach(q => pool.push(Object.assign({ li: L.idx }, q))));
    /* one question per lesson, then 15 of them */
    const byLesson = LESSONS.map(L => shuffle(pool.filter(q => q.li === L.idx))[0]);
    this.start(shuffle(byLesson).slice(0, 15), 'big');
    UI.scrollToPlayer();
  },
  render() {
    const q = this.qs[this.i]; this.answered = false; this.picks = [];
    const total = this.qs.length;
    const head = this.mode === 'big' ? `Big quiz · question ${this.i + 1} of ${total}` : `Lesson ${q.li + 1} quiz · question ${this.i + 1} of ${total}`;
    let html = `<div class="qwrap"><p class="qeyebrow">${head}</p><h3 class="qtitle">${q.q}</h3>`;
    if (q.hear) html += `<div class="qhear">${q.hear.map((h, k) => `<button class="btn listen" data-h="${k}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>${h[0]}</button>`).join('')}</div>`;
    if (q.key) html += `<div class="qkb"><svg viewBox="0 0 640 ${q.key.h ? q.key.h + 60 : 220}" role="group" aria-label="Piano keyboard"></svg></div>`;
    if (q.c) {
      const order = shuffle(q.c.map((c, k) => k));
      if (q.fixed) order.sort((a, b) => a - b);
      html += `<div class="qchoices">${order.map(k => `<button class="choice" data-k="${k}">${q.c[k]}</button>`).join('')}</div>`;
    }
    if (q.key && q.key.pick > 1) html += `<div class="qbtns"><button class="btn primary" id="qCheck" disabled>Check</button><button class="btn" id="qClear">Clear</button><span class="qpicked" id="qPicked"></span></div>`;
    html += `<div class="qfeed" hidden></div></div>`;
    this.el.innerHTML = html;
    this.el.querySelectorAll('[data-h]').forEach(b => b.onclick = () => { Snd.stop(); Timers.clear(); q.hear[+b.dataset.h][1](); flash(b, 0.4); });
    this.el.querySelectorAll('.choice').forEach(b => b.onclick = () => this.answer(+b.dataset.k === q.a, b));
    if (q.key) this.mountKeys(q);
    UI.focusQuiz();
  },
  mountKeys(q) {
    const s = this.el.querySelector('.qkb svg');
    const k = q.key;
    this.kb = Keyboard(s, {
      lo: k.lo || 'C4', hi: k.hi || 'B5', x: 10, y: 40, w: 620, h: k.h || 170, labels: k.labels ?? 'both', blackLabels: k.blackLabels,
      onTap: m => {
        if (this.answered) { Snd.note(m, 0, 0.4); this.kb.press(m, 0.3); return; }
        Snd.note(m, 0, 0.45); this.kb.press(m, 0.3);
        if ((k.pick || 1) === 1) { this.answer(k.ok([m]), null, [m]); return; }
        const at = this.picks.indexOf(m);
        if (at >= 0) { this.picks.splice(at, 1); this.kb.unmark(m); } else if (this.picks.length < k.pick) { this.picks.push(m); this.kb.mark(m, 0.85); }
        this.el.querySelector('#qCheck').disabled = this.picks.length !== k.pick;
        this.el.querySelector('#qPicked').textContent = this.picks.length ? 'Picked: ' + this.picks.slice().sort((a, b) => a - b).map(p => letter(p, k.flat)).join(' · ') : '';
      }
    });
    if (k.start) this.kb.mark(k.start, 0.45);
    const chk = this.el.querySelector('#qCheck');
    if (chk) {
      chk.onclick = () => { const ms = this.picks.slice().sort((a, b) => a - b); play([{ b: 0, l: 2, n: ms }], { kb: this.kb }); this.answer(k.ok(ms), null, ms); };
      this.el.querySelector('#qClear').onclick = () => { this.picks = []; this.kb.unmark(); if (k.start) this.kb.mark(k.start, 0.45); chk.disabled = true; this.el.querySelector('#qPicked').textContent = ''; };
    }
  },
  answer(ok, btn, ms) {
    if (this.answered) return; this.answered = true;
    const q = this.qs[this.i];
    if (ok) this.score++; else this.wrong.push(q);
    if (!ms) { ok ? Snd.ding() : Snd.bonk(); }
    else Timers.add(ms.length > 1 ? 900 : 350, () => ok ? Snd.ding() : Snd.bonk());
    this.el.querySelectorAll('.choice').forEach(b => { b.disabled = true; if (+b.dataset.k === q.a) b.classList.add('right'); });
    if (btn && !ok) btn.classList.add('wrong');
    if (q.key && !ok && q.key.show) { this.kb.unmark(); this.kb.mark(q.key.show, 0.9); }
    const chk = this.el.querySelector('#qCheck'); if (chk) chk.disabled = true;
    const f = this.el.querySelector('.qfeed');
    const last = this.i === this.qs.length - 1;
    f.innerHTML = `<p class="qverdict ${ok ? 'ok' : 'no'}">${ok ? 'Yes! Well done.' : 'Not quite.'}</p><p class="qwhy">${q.why}</p>
      <div class="qbtns"><button class="btn primary" id="qNext">${last ? 'See my result' : 'Next question'}</button>${q.hear ? '<span class="qhint">You can still press the sound buttons.</span>' : ''}</div>`;
    f.hidden = false;
    f.querySelector('#qNext').onclick = () => { if (last) this.finish(); else { this.i++; this.render(); } };
    f.querySelector('#qNext').focus({ preventScroll: true });
    UI.keepInView(f);
  },
  finish() {
    const n = this.qs.length, s = this.score, pct = s / n;
    const stars = pct >= 0.99 ? 3 : pct >= 0.66 ? 2 : pct >= 0.33 ? 1 : 0;
    let html;
    if (this.mode === 'lesson') {
      const best = Progress.save(this.li, stars);
      const next = this.li + 1 < LESSONS.length;
      html = `<div class="qwrap qintro"><p class="qeyebrow">Lesson ${this.li + 1} result</p>
        <div class="qstars" aria-label="${stars} of 3 stars">${[0, 1, 2].map(k => `<span class="${k < stars ? 'on' : ''}">★</span>`).join('')}</div>
        <h3 class="qtitle">${s} of ${n} right</h3>
        <p class="qlead">${stars === 3 ? 'Perfect! You really get it.' : stars === 2 ? 'Great job. Watch the lesson again to catch the last bit.' : 'Good try. Watch the lesson once more, then try again: that is how pros learn.'}${best > stars ? ` Your best is still ${best} stars.` : ''}</p>
        <div class="qbtns">${next ? '<button class="btn primary" id="qNextL">Next lesson</button>' : '<button class="btn primary" id="qBig">Take the big quiz</button>'}
        <button class="btn" id="qRetry">Try the quiz again</button><button class="btn" id="qWatch">Watch again</button></div></div>`;
      this.el.innerHTML = html;
      const nl = this.el.querySelector('#qNextL'); if (nl) nl.onclick = () => Player.open(this.li + 1, { autoplay: true });
      const bq = this.el.querySelector('#qBig'); if (bq) bq.onclick = () => this.bigQuiz();
      this.el.querySelector('#qRetry').onclick = () => this.start(LESSONS[this.li].quiz.map(q => Object.assign({ li: this.li }, q)), 'lesson');
      this.el.querySelector('#qWatch').onclick = () => Player.open(this.li, { autoplay: true });
      if (stars === 3) Snd.ding();
    } else {
      const lessonsToReview = [...new Set(this.wrong.map(q => q.li))].sort((a, b) => a - b);
      Store.set('big', Math.max(Store.get('big', 0), s));
      html = `<div class="qwrap qintro"><p class="qeyebrow">Big quiz result</p>
        <h3 class="qtitle">${s} of ${n} right</h3>
        <p class="qlead">${s === n ? 'Every single one. You understood both videos!' : 'Here is what to rewatch:'}</p>
        ${lessonsToReview.length ? `<div class="qreview">${lessonsToReview.map(li => `<button class="btn" data-li="${li}">Lesson ${li + 1}: ${LESSONS[li].title}</button>`).join('')}</div>` : ''}
        <div class="qbtns"><button class="btn primary" id="qBig">New big quiz</button></div></div>`;
      this.el.innerHTML = html;
      this.el.querySelectorAll('[data-li]').forEach(b => b.onclick = () => Player.open(+b.dataset.li, { autoplay: true }));
      this.el.querySelector('#qBig').onclick = () => this.bigQuiz();
    }
    UI.focusQuiz(); UI.renderMap();
  }
};

const Progress = {
  all() { return Store.get('stars', {}); },
  get(li) { return this.all()[LESSONS[li].id] || 0; },
  save(li, stars) { const a = this.all(); const id = LESSONS[li].id; const best = Math.max(a[id] || 0, stars); a[id] = best; Store.set('stars', a); UI.renderMap(); return best; },
  total() { return LESSONS.reduce((s, L) => s + (this.all()[L.id] || 0), 0); }
};

/* ================= 7. Free-play keyboard ================= */
const KEYSETS = {
  none: { name: 'Any note', root: null },
  Cmaj: { name: 'C major (all white keys)', root: 'C4', steps: MAJOR },
  Gmaj: { name: 'G major (one F♯)', root: 'G4', steps: MAJOR },
  Fmaj: { name: 'F major (one B♭)', root: 'F4', steps: MAJOR, flat: true },
  Amin: { name: 'A minor (all white keys)', root: 'A4', steps: MINOR },
  Emin: { name: 'E minor (one F♯)', root: 'E4', steps: MINOR },
  Dmin: { name: 'D minor (one B♭)', root: 'D4', steps: MINOR, flat: true }
};
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const FreePlay = {
  kb: null, set: 'Cmaj', chords: false,
  mount(svgEl) {
    this.svgEl = svgEl; this.draw();
    const sel = document.getElementById('fpKey'); sel.innerHTML = Object.entries(KEYSETS).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join(''); sel.value = this.set;
    sel.onchange = () => { this.set = sel.value; this.draw(); };
    const ch = document.getElementById('fpChord'); ch.onchange = () => { this.chords = ch.checked; this.info(''); };
    const map = 'awsedftgyhujkolp;'.split(''); // C4 .. E5
    document.addEventListener('keydown', e => {
      if (!this.active() || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = map.indexOf(e.key.toLowerCase()); if (k < 0) return;
      e.preventDefault(); this.hit(60 + k);
    });
  },
  active() { const r = this.svgEl.getBoundingClientRect(); const tag = (document.activeElement || {}).tagName; return r.top < innerHeight && r.bottom > 0 && !['INPUT', 'SELECT', 'TEXTAREA'].includes(tag); },
  scale() { const s = KEYSETS[this.set]; return s.root ? scaleNotes(s.root, s.steps).slice(0, 7).map(pcOf) : null; },
  draw() {
    this.svgEl.innerHTML = '';
    const s = KEYSETS[this.set];
    this.kb = Keyboard(this.svgEl, { lo: 'C4', hi: 'B5', x: 10, y: 34, w: 620, h: 180, labels: 'both', flat: !!s.flat, onTap: m => this.hit(m) });
    const sc = this.scale();
    if (sc) {
      const all = []; for (let m = 60; m <= 83; m++) if (sc.includes(pcOf(m))) all.push(m);
      this.kb.mark(all, 0.42);
      for (let m = 60; m <= 83; m++) if (pcOf(m) === pcOf(s.root)) this.kb.tag(m, 'home', 'ktag home');
    }
    this.info(sc ? 'Colored keys belong to the scale. "home" marks the tonic.' : 'Every key is allowed. Pick a scale to light up its 7 notes.');
  },
  hit(m) {
    Snd.ensure();
    const s = KEYSETS[this.set], sc = this.scale();
    if (this.chords && sc && sc.includes(pcOf(m))) {
      /* stack two thirds inside the scale: degree, degree+2, degree+4 */
      const deg = sc.indexOf(pcOf(m));
      const ns = [0, 2, 4].map(k => { const d = deg + k; const pcN = sc[d % 7]; let n = m + ((pcN - pcOf(m) + 12) % 12); if (k && n <= m) n += 12; return n; });
      for (let i = 1; i < 3; i++) while (ns[i] <= ns[i - 1]) ns[i] += 12;
      const i3 = ns[1] - ns[0], i5 = ns[2] - ns[0];
      const q = i3 === 4 && i5 === 7 ? '' : i3 === 3 && i5 === 7 ? 'm' : i3 === 3 && i5 === 6 ? '°' : '+';
      const qName = q === '' ? 'major' : q === 'm' ? 'minor' : q === '°' ? 'diminished' : 'augmented';
      const isMinorKey = s.steps === MINOR;
      let rn = ROMAN[deg]; if (q === 'm' || q === '°') rn = rn.toLowerCase(); if (q === '°') rn += '°';
      Snd.stop(); play([{ b: 0, l: 1.6, n: ns }], { kb: this.kb, bpm: 100 });
      this.info(`${letter(ns[0], s.flat)}${q} · ${qName} chord · degree ${deg + 1} (${rn}) of ${s.name.split(' (')[0]}${isMinorKey && deg === 0 ? ' · home chord' : ''}${!isMinorKey && deg === 0 ? ' · home chord' : ''} · notes ${ns.map(n => letter(n, s.flat)).join(' ')}`);
    } else {
      Snd.note(m, 0, 0.6); this.kb.press(m, 0.4);
      const inS = sc ? (sc.includes(pcOf(m)) ? ' · in the scale' : ' · outside the scale (spicy!)') : '';
      this.info(`${letter(m, s.flat)} · ${solf(m, s.flat)} · FL Studio name ${flName(m, s.flat)}${inS}${sc && sc.includes(pcOf(m)) ? ' · degree ' + (sc.indexOf(pcOf(m)) + 1) : ''}`);
    }
  },
  info(t) { const el = document.getElementById('fpInfo'); if (el && t) el.textContent = t; }
};

/* ================= 8. Page UI ================= */
const UI = {
  $(s) { return document.querySelector(s); },
  init() {
    Stage.init(this.$('#stage'));
    Quiz.init(this.$('#quiz'));
    this.$('#btnPlay').onclick = () => Player.toggle();
    this.$('#btnPrev').onclick = () => Player.step(-1);
    this.$('#btnNext').onclick = () => Player.step(1);
    this.$('#cover').onclick = () => Player.play();
    this.$('#btnQuizNow').onclick = e => { e.stopPropagation(); Player.stop(); Quiz.offer(Player.li); };
    const vt = this.$('#btnVoice');
    Voice.on = Store.get('voiceOn', true);
    vt.onclick = () => { Voice.on = !Voice.on; Store.set('voiceOn', Voice.on); this.voiceState(); if (!Voice.on) try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
    this.voiceState();
    const sp = this.$('#selSpeed'); Voice.rate = Store.get('rate', 1); sp.value = String(Voice.rate);
    sp.onchange = () => { Voice.rate = parseFloat(sp.value); Store.set('rate', Voice.rate); };
    const vs = this.$('#selVoice'); vs.onchange = () => { Voice.pick = Voice.list.find(v => v.name === vs.value) || null; Store.set('voice', vs.value); };
    const vol = this.$('#rngVol'); vol.value = Store.get('vol', 0.8); Snd.setVol(+vol.value);
    vol.oninput = () => { Snd.setVol(+vol.value); Store.set('vol', +vol.value); };
    if ('speechSynthesis' in window) { Voice.load(); speechSynthesis.onvoiceschanged = () => Voice.load(); } else this.fillVoices();
    this.$('#btnBig').onclick = () => Quiz.bigQuiz();
    document.addEventListener('keydown', e => {
      const tag = (document.activeElement || {}).tagName;
      if (['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(tag) && e.key === ' ') return;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return;
      if (FreePlay.active() && !this.inPlayerView()) return;
      if (e.key === ' ' && this.inPlayerView()) { e.preventDefault(); Player.toggle(); }
      else if (e.key === 'ArrowRight' && this.inPlayerView()) Player.step(1);
      else if (e.key === 'ArrowLeft' && this.inPlayerView()) Player.step(-1);
    });
    this.renderMap(); this.renderGlossary(); this.renderXylo();
    FreePlay.mount(this.$('#fpKeys'));
    const last = Math.min(Store.get('last', 0), LESSONS.length - 1);
    Player.open(last);
  },
  inPlayerView() { const r = this.$('#player').getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.3; },
  voiceState() { const b = this.$('#btnVoice'); b.setAttribute('aria-pressed', String(Voice.on)); b.querySelector('span').textContent = Voice.on ? 'Narrator on' : 'Narrator off'; },
  fillVoices() {
    const vs = this.$('#selVoice');
    if (!Voice.list.length) { vs.innerHTML = '<option>Captions only (no voice found)</option>'; vs.disabled = true; return; }
    vs.disabled = false;
    vs.innerHTML = Voice.list.map(v => `<option value="${v.name.replace(/"/g, '&quot;')}">${v.name} (${v.lang})</option>`).join('');
    if (Voice.pick) vs.value = Voice.pick.name;
  },
  lessonChanged() {
    const L = Player.L, ch = CHAPTERS.find(c => c.n === L.ch);
    this.$('#epMeta').textContent = `Video ${L.part} · Chapter ${L.ch}: ${ch.title} · Lesson ${L.idx + 1} of ${LESSONS.length}`;
    this.$('#epTitle').textContent = L.title;
    this.$('#coverNum').textContent = `Lesson ${L.idx + 1}`;
    this.$('#coverTitle').textContent = L.title;
    this.$('#coverKid').textContent = L.kid;
    this.$('#words').innerHTML = L.words.map(w => `<li><b>${w[0]}</b><span lang="fr">${w[1]}</span></li>`).join('');
    const gc = this.$('#grownup');
    gc.hidden = !L.grown; this.$('#grownText').innerHTML = L.grown || '';
    this.$('#transcript').innerHTML = L.beats.map((b, k) => `<li><button class="linkish" data-b="${k}">${b.s}</button></li>`).join('');
    this.$('#transcript').querySelectorAll('[data-b]').forEach(b => b.onclick = () => { Player.jump(+b.dataset.b); this.scrollToPlayer(); });
    this.renderMap();
  },
  cover(on) { this.$('#cover').hidden = !on; },
  stageVisible(on) { this.$('#stage').toggleAttribute('hidden', !on); this.$('.stagebox').classList.toggle('quizmode', !on); this.$('.screen').classList.toggle('quizzing', !on); if (!on) this.cover(false); },
  caption(s) { this.$('#caption').innerHTML = s.split(/(\s+)/).map(w => /\s+/.test(w) ? w : `<span>${w}</span>`).join(''); },
  wordAt(charIndex, spoken) {
    const idx = spoken.slice(0, charIndex).split(/\s+/).filter(Boolean).length;
    const spans = this.$('#caption').querySelectorAll('span');
    spans.forEach((s, k) => s.classList.toggle('now', k === idx));
  },
  dots() {
    const L = Player.L, wrap = this.$('#dots');
    if (wrap.childElementCount !== L.beats.length || wrap.dataset.li !== String(L.idx)) {
      wrap.dataset.li = String(L.idx);
      wrap.innerHTML = L.beats.map((b, k) => `<button class="dot" data-b="${k}" aria-label="Scene ${k + 1} of ${L.beats.length}"></button>`).join('');
      wrap.querySelectorAll('.dot').forEach(d => d.onclick = () => Player.jump(+d.dataset.b));
    }
    wrap.querySelectorAll('.dot').forEach((d, k) => { d.classList.toggle('done', k < Player.bi); d.classList.toggle('now', k === Player.bi); });
    this.$('#sceneNum').textContent = `Scene ${Math.min(Player.bi + 1, L.beats.length)} / ${L.beats.length}`;
  },
  playState() {
    const b = this.$('#btnPlay');
    b.setAttribute('aria-label', Player.playing ? 'Pause' : 'Play');
    b.innerHTML = Player.playing ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  },
  focusQuiz() { const h = this.$('#quiz .qtitle'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } },
  keepInView(el) { const r = el.getBoundingClientRect(); if (r.bottom > innerHeight) el.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' }); },
  scrollToPlayer() { this.$('#player').scrollIntoView({ block: 'start', behavior: reduceMotion() ? 'auto' : 'smooth' }); },
  renderMap() {
    const wrap = this.$('#map'); if (!wrap) return;
    const parts = [
      { n: 1, title: 'Video 1 · The basics', sub: 'La théorie musicale expliquée', url: 'https://youtu.be/pUXneU5dww8' },
      { n: 2, title: 'Video 2 · Chords, progressions, melodies', sub: 'Tes mélodies vont changer, après cette vidéo', url: 'https://youtu.be/HZH2dqoXZhA' }
    ];
    wrap.innerHTML = parts.map(p => `<section class="mpart"><h3>${p.title}</h3><p class="msub"><a href="${p.url}" target="_blank" rel="noopener">${p.sub}</a></p>
      ${CHAPTERS.filter(c => c.part === p.n).map(c => `<div class="mch"><h4>Chapter ${c.n} · ${c.title} <span lang="fr">${c.fr}</span></h4><ol class="mlist" start="${LESSONS.find(L => L.ch === c.n).idx + 1}">
        ${LESSONS.filter(L => L.ch === c.n).map(L => { const st = Progress.get(L.idx); return `<li><button class="mles${L.idx === Player.li ? ' cur' : ''}" data-li="${L.idx}" ${L.idx === Player.li ? 'aria-current="true"' : ''}>
          <span class="mnum">${L.idx + 1}</span><span class="mtxt"><b>${L.title}</b><small>${L.kid}</small></span>
          <span class="mstars" aria-label="${st} of 3 stars">${[0, 1, 2].map(k => `<i class="${k < st ? 'on' : ''}">★</i>`).join('')}</span></button></li>`; }).join('')}</ol></div>`).join('')}</section>`).join('');
    wrap.querySelectorAll('[data-li]').forEach(b => b.onclick = () => { Player.open(+b.dataset.li); this.scrollToPlayer(); });
    const tot = Progress.total(), max = LESSONS.length * 3;
    this.$('#starCount').textContent = `${tot} / ${max}`;
    this.$('#starBar').style.width = (tot / max * 100) + '%';
  },
  renderGlossary() {
    const rows = [];
    LESSONS.forEach(L => L.words.forEach(w => { if (!rows.find(r => r[0] === w[0])) rows.push([w[0], w[1], w[2], L.idx]); }));
    this.$('#gloss').innerHTML = rows.map(r => `<tr><th scope="row">${r[0]}</th><td lang="fr">${r[1]}</td><td>${r[2]}</td><td><button class="linkish" data-li="${r[3]}">Lesson ${r[3] + 1}</button></td></tr>`).join('');
    this.$('#gloss').querySelectorAll('[data-li]').forEach(b => b.onclick = () => { Player.open(+b.dataset.li); this.scrollToPlayer(); });
  },
  renderXylo() {
    const notes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
    const wrap = this.$('#xylo');
    wrap.innerHTML = notes.map((n, i) => `<button class="bar" style="--c:${NOTE_COL[pcOf(n)]};--h:${100 - i * 6}%" data-n="${n}" aria-label="Play ${letter(n)} (${solf(n)})"><span>${letter(n)}</span><small>${solf(n)}</small></button>`).join('');
    wrap.querySelectorAll('.bar').forEach(b => b.onclick = () => { Snd.note(b.dataset.n, 0, 0.5, 'bell', 0.9); flash(b, 0.25); });
  }
};
