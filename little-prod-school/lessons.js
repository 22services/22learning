/* Little Prod School: the 21 lessons.
   Each beat (scene): s = caption (also spoken), tts = optional spoken version, v = draws the scene,
   k = keep the previous drawing when playing straight through, t = sound demo after the narration (returns seconds).
   Content follows Vilmyllow's two videos: chapters 1-3 (video 1) and 4-6 (video 2). */
'use strict';

chapter({ n: 1, part: 1, title: 'Time: the grid', fr: 'Les temps' });
chapter({ n: 2, part: 1, title: 'Notes', fr: 'Les notes' });
chapter({ n: 3, part: 1, title: 'Scales', fr: 'Les gammes' });
chapter({ n: 4, part: 2, title: 'Chords', fr: 'Les accords' });
chapter({ n: 5, part: 2, title: 'Chord progressions', fr: 'Les progressions d’accords' });
chapter({ n: 6, part: 2, title: 'Melodies', fr: 'Les mélodies' });

/* ---------- small helpers ---------- */
const ref = () => Stage.refs;
const kb = o => (Stage.refs.kb = Keyboard(Stage.g, o || {}));
const rl = o => (Stage.refs.roll = Roll(Stage.g, o || {}));
const sameSet = (a, b) => a.length === b.length && [...new Set(a)].length === new Set(b).size && a.every(x => b.includes(x));
const AMIN = scaleNotes('A3', MINOR).slice(0, 7);
const CMAJ = scaleNotes('C4', MAJOR);
const BLUE = ROLE_COL.third, PINK = '#F7A1C4', YELLOW = '#FFD23F', ORANGE = ROLE_COL.seventh, GREEN = ROLE_COL.root;
function ab(q, good, bad, why) {
  const goodA = coin();
  return { q, hear: [['Sound A', goodA ? good : bad], ['Sound B', goodA ? bad : good]], c: ['Sound A', 'Sound B'], a: goodA ? 0 : 1, fixed: true, why };
}
/* drum patterns (beats) */
function drums(bars, o = {}) {
  const ev = [];
  for (let k = 0; k < bars; k++) {
    const s = (o.start || 0) + k * 4;
    ev.push({ b: s, l: 0.5, dr: 'kick' }, { b: s + 2.5, l: 0.5, dr: 'kick', v: 0.85 });
    if (k % 2) ev.push({ b: s + 1.75, l: 0.25, dr: 'kick', v: 0.6 });
    ev.push({ b: s + 1, l: 0.5, dr: 'clap', v: 0.8 }, { b: s + 3, l: 0.5, dr: 'clap', v: 0.8 });
    const tern = o.ternary || (o.rollLast && k % 4 === 3);
    for (let h = 0; h < 8; h++) {
      if (o.rollLast && k % 4 === 3 && h >= 6) continue;
      if (!o.ternary) ev.push({ b: s + h / 2, l: 0.25, dr: 'hat', v: h % 2 ? 0.35 : 0.6 });
    }
    if (o.ternary) for (let h = 0; h < 12; h++) ev.push({ b: s + h / 3, l: 0.25, dr: 'hat', v: h % 3 ? 0.35 : 0.6 });
    else if (tern) [3, 3 + 1 / 3, 3 + 2 / 3].forEach((b, i) => ev.push({ b: s + b, l: 0.2, dr: 'hat', v: 0.45 + i * 0.1 }));
  }
  return ev;
}
/* chords in A minor used across chapter 5 and 6 */
const V7 = { Am7: ['A3', 'C4', 'E4', 'G4'], Fmaj7: ['F3', 'A3', 'C4', 'E4'], Cmaj7: ['G3', 'B3', 'C4', 'E4'], G7: ['G3', 'B3', 'D4', 'F4'], Em7: ['G3', 'B3', 'D4', 'E4'] };
const TRI = { Am: ['A3', 'C4', 'E4'], F: ['F3', 'A3', 'C4'], C: ['E3', 'G3', 'C4'], G: ['G3', 'B3', 'D4'] };
const SEVENTH = { Am7: 'G4', Fmaj7: 'E4', Cmaj7: 'B3', G7: 'F4', Em7: 'D4' };
const ROOTS = { Am: 'A2', F: 'F2', C: 'C3', G: 'G2', Am7: 'A2', Fmaj7: 'F2', Cmaj7: 'C3', G7: 'G2', Em7: 'E2' };
/* melodic phrases in A minor (beats relative to the bar) */
const PH = {
  q1: [['A4', 1, 0.5], ['B4', 1.5, 0.5], ['C5', 2, 1], ['D#5', 3.375, 0.125, 'app'], ['E5', 3.5, 0.5]],
  q2: [['C5', 1, 0.5], ['D5', 1.5, 0.5], ['E5', 2, 1], ['F#5', 3.375, 0.125, 'app'], ['G5', 3.5, 0.5]],
  a1: [['D5', 0, 0.5], ['C5', 0.5, 0.5], ['B4', 1, 0.5], ['G4', 1.5, 0.5], ['B4', 2, 1], ['G#4', 3.875, 0.125, 'app'], ['A4', 4, 1.25]]
};
const VEL = [0.95, 0.6, 1, 0.5, 0.85, 0.7, 0.9];
function phrase(name, at = 0, o = {}) {
  return PH[name].map(([n, b, l, tag], k) => ({
    b: at + b + (o.human ? (Math.random() - 0.5) * 0.04 : 0), l, n: M(n) + (o.shift || 0), i: o.inst || 'lead',
    v: o.flat ? 0.85 : (tag ? 0.55 : VEL[k % VEL.length]), app: !!tag
  }));
}
function drawPhrase(R, evts, o = {}) {
  return evts.map(e => { e.el = R.add(e.n, e.b, e.l, { fill: e.app ? (o.appFill || BLUE) : (o.fill || PINK) }); return e; });
}
function chordEvts(names, o = {}) {
  const len = o.len || 4;
  return names.map((nm, k) => ({ nm, b: (o.start || 0) + k * len, l: o.l || len, n: (o.set || V7)[nm], i: 'pad', v: o.v ?? 0.9, sp: o.sp }));
}
function bassEvts(names, o = {}) {
  const len = o.len || 4;
  return names.map((nm, k) => ({ b: (o.start || 0) + k * len, l: (o.l || len) - 0.4, n: ROOTS[nm], i: 'bass', v: 0.9 }));
}
function drawChords(R, evts, fill = BLUE, op = 0.55) { evts.forEach(e => { e.el = R.chord(e.n, e.b, e.l, { fill, op }); }); return evts; }
/* the 8-bar mini beat that uses every idea */
function miniProd() {
  const names = ['Am7', 'Fmaj7', 'Cmaj7', 'G7', 'Am7', 'Fmaj7', 'Cmaj7', 'G7'];
  const ch = chordEvts(names, { sp: 0.018, v: 0.75 });
  const bass = bassEvts(names);
  const mel = [...phrase('q1', 0, { human: true }), ...phrase('q1', 8, { human: true }), ...phrase('a1', 12, { human: true }),
    ...phrase('q2', 16, { human: true }), ...phrase('q2', 24, { human: true }), ...phrase('a1', 28, { shift: -12, human: true })];
  return { ch, bass, mel, dr: drums(8, { rollLast: true }) };
}
function stepsList(cur) {
  const items = ['Choose a key', 'Find its 7 notes', 'Build 7 chords', 'Pick a start', 'Tell a story'];
  items.forEach((t, i) => {
    const y = 64 + i * 62, g = svg('g', { class: 'slist' + (i === cur ? ' cur' : '') + (i < cur ? ' done' : '') }, Stage.g);
    svg('rect', { x: 24, y, width: 280, height: 50, rx: 14, class: 'slbg' }, g);
    txt(g, 50, y + 33, String(i + 1), { class: 'sln', 'text-anchor': 'middle' });
    txt(g, 76, y + 32, t, { class: 'slt' });
  });
}
function house(cx, cy, s = 1) {
  const g = svg('g', { class: 'house' }, Stage.g);
  svg('path', { d: `M${cx - 70 * s},${cy - 20 * s} L${cx},${cy - 80 * s} L${cx + 70 * s},${cy - 20 * s} Z`, class: 'roof' }, g);
  svg('rect', { x: cx - 58 * s, y: cy - 20 * s, width: 116 * s, height: 96 * s, rx: 8, class: 'walls' }, g);
  return g;
}

/* ================= VIDEO 1 · CHAPTER 1 · TIME ================= */
function gBars() {
  const n = rnd([1, 2, 3]);
  return {
    q: 'Listen and count. How many bars do you hear? (The deep kick marks beat 1 of each bar.)',
    hear: [['Play the beat', () => play(Array.from({ length: n * 4 }, (_, i) => ({ b: i, l: 0.5, dr: i % 4 ? 'tock' : 'kick', v: i % 4 ? 0.7 : 1 })), { bpm: 100 })]],
    c: ['1 bar', '2 bars', '3 bars'], a: n - 1, fixed: true,
    why: `It was ${n} bar${n > 1 ? 's' : ''}: ${n * 4} beats, counted in groups of 4.`
  };
}
const lanes = () => {
  const x0 = 150, pxs = 128;
  const w70 = 4 * 60 / 70 * pxs, w140 = 4 * 60 / 140 * pxs;
  [[110, '70 BPM', w70], [240, '140 BPM', w140]].forEach(([y, label, w]) => {
    txt(Stage.g, 30, y + 40, label, { class: 'lane' });
    svg('rect', { x: x0, y, width: w, height: 64, rx: 14, class: 'laneb' }, Stage.g);
    for (let i = 1; i < 4; i++) svg('line', { x1: x0 + w * i / 4, y1: y + 10, x2: x0 + w * i / 4, y2: y + 54, class: 'lanel' }, Stage.g);
  });
  Object.assign(Stage.refs, { w70, w140, x0, d1: svg('circle', { cx: x0, cy: 142, r: 13, class: 'laned' }, Stage.g), d2: svg('circle', { cx: x0, cy: 272, r: 13, class: 'laned' }, Stage.g) });
  Note('One bar = 4 beats. Faster beats = a shorter bar.', 372);
};
lesson({
  id: 'beat', part: 1, ch: 1, title: 'Count to four', kid: 'Every song walks on a grid of beats.',
  words: [['Beat', 'temps', 'one tick of the music’s heartbeat'], ['Bar', 'mesure', 'a group of 4 beats'], ['4/4 time', 'signature 4/4', '4 beats in every bar'], ['BPM', 'BPM', 'beats per minute: the speed of the heartbeat']],
  grown: 'The video says 99% of today’s music is in 4/4. That is generous, but for trap, pop, drill and R&B it is close. Other meters exist: 3/4 (waltz) and 6/8 or 12/8 (many ballads and soul grooves). In “4/4”, the top number counts the beats in a bar and the bottom 4 says each beat is a quarter note.',
  beats: [
    { s: 'Before notes and chords, every song stands on a grid. It’s like the lines in your notebook that keep your letters straight.',
      v: () => { rl({ lo: 'C5', hi: 'C6', beats: 8, y: 40, h: 300 }); Note('Every note you place sits on this grid.', 378); },
      t: () => play(drums(2), { bpm: 92, roll: ref().roll, to: 8 }) },
    { s: 'Music has a heartbeat called the beat. Listen and count with me: one, two, three, four.',
      v: () => { ref().beats = Beats(Stage.g, { count: 4, y: 110, h: 150 }); Note('one box = one beat', 330); },
      t: () => play([0, 1, 2, 3].map(i => ({ b: i, l: 0.6, dr: 'kick', v: i ? 0.75 : 1, fx: () => ref().beats.light(i, 0.4) })), { bpm: 84 }) },
    { s: 'Four beats make one bar. Then we start again: one, two, three, four. That’s bar two!',
      v: () => { ref().beats = Beats(Stage.g, { count: 8, bpb: 4, y: 100, h: 120, gap: 10, barGap: 34 }); },
      t: () => play(Array.from({ length: 8 }, (_, i) => ({ b: i, l: 0.6, dr: i % 4 ? 'tock' : 'kick', v: i % 4 ? 0.8 : 1, fx: () => ref().beats.light(i, 0.4) })), { bpm: 96 }) },
    { s: 'This is called four-four time, written 4/4. It means 4 beats in every bar. Almost all the music you hear today uses it: trap, pop, drill, R&B.',
      tts: 'This is called four four time. It means four beats in every bar. Almost all the music you hear today uses it: trap, pop, drill, R and B.',
      v: () => {
        txt(Stage.g, 150, 190, '4', { class: 'tsig', 'text-anchor': 'middle' }); txt(Stage.g, 150, 300, '4', { class: 'tsig', 'text-anchor': 'middle' });
        txt(Stage.g, 150, 350, '4 beats in every bar', { class: 'snote', 'text-anchor': 'middle' });
        ref().cards = Cards([{ t: 'Trap' }, { t: 'Pop' }, { t: 'Drill' }, { t: 'R&B' }], { cols: 2, x: 300, w: 310, y: 90, h: 230 });
      },
      t: () => play(drums(2).map(e => Object.assign(e, { fx: e.dr === 'kick' && e.b % 4 === 0 ? () => ref().cards.forEach(c => flash(c.rect, 0.3)) : null })), { bpm: 92 }) },
    { s: 'In FL Studio, the little numbers on top count the bars, and the thick lines show the beats. Watch the line play through two bars.',
      tts: 'In F L Studio, the little numbers on top count the bars, and the thick lines show the beats. Watch the line play through two bars.',
      v: () => { rl({ lo: 'C5', hi: 'C6', beats: 8, y: 56, h: 270 }); Note('numbers on top = bars · thick lines = beats', 362); },
      t: () => play(drums(2), { bpm: 92, roll: ref().roll, to: 8 }) },
    { s: 'The speed of the heartbeat is the BPM: beats per minute. A higher BPM means faster beats, so each bar gets shorter.',
      tts: 'The speed of the heartbeat is the B P M: beats per minute. A higher B P M means faster beats, so each bar gets shorter.',
      v: lanes,
      t: () => {
        const R = ref(), four = [0, 1, 2, 3].map(i => ({ b: i, l: 0.5, dr: 'kick', v: i ? 0.8 : 1 }));
        const d1 = play(four, { bpm: 70, tail: 0 });
        tween(R.d1, ['cx'], R.x0, R.x0 + R.w70, 4 * 60 / 70);
        const d2 = play(four, { bpm: 140, at: d1 + 0.5 });
        tween(R.d2, ['cx'], R.x0, R.x0 + R.w140, 4 * 60 / 140, d1 + 0.5);
        return d2;
      } }
  ],
  quiz: [
    { q: 'How many beats are in one bar of 4/4?', c: ['2', '3', '4', '8'], a: 2, fixed: true, why: '4/4 means 4 beats in every bar: one, two, three, four. Then a new bar starts.' },
    { q: 'You change the BPM from 80 to 160. What happens to each bar?', c: ['It gets shorter: the beats go faster', 'It gets longer', 'It stays exactly the same length'], a: 0, why: 'BPM is the speed of the beats. At 160 BPM each bar lasts half as long as at 80 BPM.' },
    { gen: gBars }
  ]
});

/* ---- Lesson 2: strong and weak beats ---- */
const MEL_GOOD = [['E5', 0, 1, 1], ['F5', 1, 1, 0], ['G5', 2, 1, 1], ['F5', 3, 1, 0], ['E5', 4, 1, 1], ['D5', 5, 1, 0], ['C5', 6, 2, 1]];
const MEL_BAD = [['F5', 0, 1, 0], ['E5', 1, 1, 1], ['A5', 2, 1, 0], ['G5', 3, 1, 1], ['D5', 4, 1, 0], ['E5', 5, 1, 1], ['B4', 6, 2, 0]];
function strongRoll(mel) {
  const R = rl({ lo: 'C4', hi: 'C6', beats: 8, y: 34, h: 316 });
  R.chord(['C4', 'E4', 'G4'], 0, 8, { fill: '#8D9BB8', op: 0.45 });
  Stage.refs.mel = mel.map(([n, b, l, isChord]) => ({ b, l, n, i: 'lead', el: R.add(n, b, l, { fill: isChord ? BLUE : YELLOW, label: letter(n) }) }));
  Note('gray = C chord (C E G) · blue = chord note · yellow = passing note', 384);
}
const playStrong = mel => play([{ b: 0, l: 8, n: ['C4', 'E4', 'G4'], i: 'pad', v: 0.7 }, ...mel.map(([n, b, l]) => ({ b, l, n, i: 'lead' }))], { bpm: 100 });
lesson({
  id: 'strong', part: 1, ch: 1, title: 'Strong and weak beats', kid: 'BOOM, tap, BOOM, tap.',
  words: [['Strong beat', 'temps fort', 'beats 1 and 3: the BOOM'], ['Weak beat', 'temps faible', 'beats 2 and 4: the tap'], ['Chord note', 'note de l’accord', 'a note that belongs to the chord that’s playing'], ['Passing note', 'note de passage', 'a quick in-between note that leads somewhere']],
  grown: 'In classical theory beat 3 is “medium strong”, a little weaker than beat 1. And don’t mix this up with drums: in trap and hip-hop the snare or clap usually lands on beats 2 and 4 (or on 3 in half-time). Strong and weak describe the weight of the grid, not which drum is loudest.',
  beats: [
    { s: 'Beats are not all the same. Some are strong, some are weak. In 4/4, beat 1 is strong, beat 2 is weak, beat 3 is strong, and beat 4 is weak.',
      v: () => { ref().beats = Beats(Stage.g, { count: 4, y: 100, h: 170, strong: [0, 2], sized: true }); Note('strong · weak · strong · weak', 330); },
      t: () => play([0, 1, 2, 3].map(i => ({ b: i, l: 0.6, dr: i % 2 ? 'tock' : 'kick', v: i % 2 ? 0.55 : 1, fx: () => ref().beats.light(i, 0.4) })), { bpm: 84 }) },
    { s: 'Say it out loud: BOOM, tap, BOOM, tap. Beat 1 is the strongest of all: it’s where every bar begins.',
      tts: 'Say it out loud: BOOM, tap, BOOM, tap. Beat one is the strongest of all: it is where every bar begins.',
      v: () => { ref().beats = Beats(Stage.g, { count: 8, bpb: 4, y: 100, h: 140, strong: [0, 2], sized: true, gap: 10, barGap: 34 }); },
      t: () => play(Array.from({ length: 8 }, (_, i) => ({ b: i, l: 0.6, dr: i % 2 ? 'tock' : 'kick', v: i % 4 === 0 ? 1 : i % 2 ? 0.5 : 0.8, fx: () => ref().beats.light(i, 0.4) })), { bpm: 96 }) },
    { s: 'Why care? Strong beats tell you where to put your best notes. On strong beats, a melody likes notes from the chord. They sound solid, like standing on both feet.',
      v: () => strongRoll(MEL_GOOD), t: () => playStrong(MEL_GOOD) },
    { s: 'On weak beats, you can use passing notes. They’re like stepping stones that lead to the next solid note.',
      v: () => strongRoll(MEL_GOOD), k: 1,
      t: () => play([{ b: 0, l: 8, n: ['C4', 'E4', 'G4'], i: 'pad', v: 0.7 }, ...ref().mel], { bpm: 100, roll: ref().roll, to: 8 }) },
    { s: 'Now the opposite: passing notes on the strong beats, chord notes on the weak ones. It feels wobbly, like standing on one foot.',
      v: () => strongRoll(MEL_BAD),
      t: () => play([{ b: 0, l: 8, n: ['C4', 'E4', 'G4'], i: 'pad', v: 0.7 }, ...ref().mel], { bpm: 100, roll: ref().roll, to: 8 }) }
  ],
  quiz: [
    { q: 'In 4/4, which beats are strong?', c: ['Beats 1 and 3', 'Beats 2 and 4', 'Only beat 4'], a: 0, why: 'Strong, weak, strong, weak: beats 1 and 3 are strong, and beat 1 is the strongest.' },
    { q: 'On a strong beat, which note is the safest choice for your melody?', c: ['A note of the chord that is playing', 'Any note at all', 'A note outside the scale'], a: 0, why: 'The video’s rule: chord notes on strong beats, passing notes on weak beats.' },
    { gen: () => ab('Which melody puts chord notes on the strong beats? It sounds more solid.', () => playStrong(MEL_GOOD), () => playStrong(MEL_BAD), 'The solid one lands on C, E or G (the C chord) on beats 1 and 3, with passing notes in between.') }
  ]
});

/* ---- Lesson 3: binary and ternary ---- */
function pizzas(n, y = 170, r = 54, o = {}) {
  const xs = [95, 235, 375, 515];
  return (Stage.refs.pz = xs.map((x, i) => Pizza(Stage.g, x, y, r, n, { label: o.labels === false ? null : 'beat ' + (i + 1) })));
}
function slicesPlay(n, bpm = 84, o = {}) {
  const ev = [];
  for (let b = 0; b < 4; b++) {
    ev.push({ b, l: 0.5, dr: 'kick', v: b % 2 ? 0.7 : 1 });
    for (let s = 0; s < n; s++) ev.push({ b: b + s / n, l: 1 / n, dr: 'hat', v: s ? 0.4 : 0.7, fx: () => (o.pz || ref().pz)[b].light(s, Math.min(0.2, 60 / bpm / n)) });
  }
  return play(ev, { bpm, at: o.at || 0 });
}
function gBinTer() {
  const tern = coin();
  return {
    q: 'Listen to the hi-hats. Are they binary or ternary?',
    hear: [['Play the beat', () => play(drums(2, { ternary: tern }), { bpm: 88 })]],
    c: ['Binary (beats cut in 2 or 4)', 'Ternary (beats cut in 3: bouncy)'], a: tern ? 1 : 0, fixed: true,
    why: tern ? 'Ternary: three hi-hats per beat. That rolling, bouncy feel.' : 'Binary: two hi-hats per beat. Straight and even.'
  };
}
lesson({
  id: 'slices', part: 1, ch: 1, title: 'Cut the beat like a pizza', kid: 'Same pizza, different slices.',
  words: [['Binary', 'binaire', 'each beat cut in 2 (or 4, 8…)'], ['Ternary', 'ternaire', 'each beat cut in 3 (or 6…): bouncier'], ['Step', 'step', 'a quarter of a beat in FL Studio'], ['Snap (the magnet)', 'magnétisme (l’aimant)', 'makes notes stick to the grid lines']],
  grown: 'FL Studio snap values: Beat, ½ beat, ¼ beat, Step, ½ step and ¼ step are binary; ⅓ beat, ⅙ beat, ⅓ step and ⅙ step are ternary. A ⅙ step gives 24 slots per beat, handy for fast trap hi-hat rolls. “None” turns snapping off and “Bar” snaps to whole bars. The Playlist (arranger) and the Piano roll each have their own setting.',
  beats: [
    { s: 'One beat is like a pizza. You can cut it into slices to fit in faster notes.',
      v: () => pizzas(1), t: () => slicesPlay(1) },
    { s: 'Cut every beat in 2: that’s binary. It’s the most common way in today’s music.',
      v: () => pizzas(2), t: () => slicesPlay(2) },
    { s: 'Cut it in 4 and you get 16 little slices in a bar. In FL Studio, each of those slices is called a step.',
      tts: 'Cut it in 4 and you get 16 little slices in a bar. In F L Studio, each of those slices is called a step.',
      v: () => { pizzas(4); Note('4 beats × 4 slices = 16 steps', 384); }, t: () => slicesPlay(4, 80) },
    { s: 'Now cut every beat in 3: that’s ternary. It gives the rhythm more bounce, more groove.',
      v: () => pizzas(3), t: () => slicesPlay(3, 84) },
    { s: 'Listen to the same beat twice: first with binary hi-hats, then with ternary ones. Feel the bounce?',
      v: () => {
        const xs = [190, 290, 390, 490];
        txt(Stage.g, 30, 128, 'binary', { class: 'lane' }); txt(Stage.g, 30, 278, 'ternary', { class: 'lane' });
        ref().top = xs.map(x => Pizza(Stage.g, x, 120, 40, 2)); ref().bot = xs.map(x => Pizza(Stage.g, x, 270, 40, 3));
      },
      t: () => { const a = slicesPlay(2, 88, { pz: ref().top }); play(drums(1).filter(e => e.dr !== 'hat'), { bpm: 88 }); const b = slicesPlay(3, 88, { pz: ref().bot, at: a }); play(drums(1).filter(e => e.dr !== 'hat'), { bpm: 88, at: a }); return b; } },
    { s: 'Big secret: cutting a pizza doesn’t change its size. The bar lasts exactly as long. Only the BPM changes the length of a bar. The slices only change the feel.',
      v: () => {
        const x0 = 150, w = 440;
        [[110, 'binary', 8], [240, 'ternary', 12]].forEach(([y, label, n]) => {
          txt(Stage.g, 30, y + 40, label, { class: 'lane' });
          svg('rect', { x: x0, y, width: w, height: 64, rx: 14, class: 'laneb' }, Stage.g);
          for (let i = 1; i < n; i++) svg('line', { x1: x0 + w * i / n, y1: y + (i % (n / 4) ? 18 : 8), x2: x0 + w * i / n, y2: y + (i % (n / 4) ? 46 : 56), class: 'lanel' }, Stage.g);
        });
        Object.assign(Stage.refs, { x0, w, d1: svg('circle', { cx: x0, cy: 142, r: 13, class: 'laned' }, Stage.g), d2: svg('circle', { cx: x0, cy: 272, r: 13, class: 'laned' }, Stage.g) });
        Note('Same bar length. Different slices.', 372);
      },
      t: () => {
        const R = ref(), secs = 4 * 60 / 88;
        play(Array.from({ length: 8 }, (_, i) => ({ b: i / 2, l: 0.25, dr: 'hat', v: i % 2 ? 0.4 : 0.7 })), { bpm: 88 });
        tween(R.d1, ['cx'], R.x0, R.x0 + R.w, secs);
        const d = play(Array.from({ length: 12 }, (_, i) => ({ b: i / 3, l: 0.25, dr: 'hat', v: i % 3 ? 0.4 : 0.7 })), { bpm: 88, at: secs + 0.5 });
        tween(R.d2, ['cx'], R.x0, R.x0 + R.w, secs, secs + 0.5);
        return d;
      } },
    { s: 'In FL Studio, the magnet button chooses the slices. A step is a quarter of a beat. Half, quarter and step sizes are binary. Thirds and sixths are ternary.',
      tts: 'In F L Studio, the magnet button chooses the slices. A step is a quarter of a beat. Half, quarter and step sizes are binary. Thirds and sixths are ternary.',
      v: () => {
        const col = (x, title, items, cls) => {
          txt(Stage.g, x + 130, 52, title, { class: 'coltitle ' + cls, 'text-anchor': 'middle' });
          items.forEach((t, i) => { const g = svg('g', { class: 'snapi ' + cls }, Stage.g); svg('rect', { x, y: 66 + i * 50, width: 260, height: 40, rx: 10, class: 'snapbg' }, g); txt(g, x + 18, 66 + i * 50 + 27, t, { class: 'snapt' }); });
        };
        col(40, 'Binary', ['Beat', '½ beat', '¼ beat', 'Step  (= ¼ beat)', '½ step', '¼ step'], 'bin');
        col(340, 'Ternary', ['⅓ beat', '⅙ beat', '⅓ step', '⅙ step'], 'ter');
      } }
  ],
  quiz: [
    { q: 'You cut each beat into 3 equal slices. That is…', c: ['Ternary', 'Binary', 'A new time signature'], a: 0, why: 'Cutting in 3 (or 6) is ternary. Cutting in 2 (or 4, 8) is binary. The bar stays 4/4 either way.' },
    { q: 'You switch the snap from ½ beat to ⅓ beat. What happens to the length of the bar?', c: ['Nothing: the bar keeps the same length', 'The bar gets longer', 'The bar gets shorter'], a: 0, why: 'Slices change the feel, not the size of the pizza. Only the BPM changes how long a bar lasts.' },
    { q: 'In FL Studio, one step equals…', c: ['A quarter of a beat', 'Half a bar', 'One whole beat'], a: 0, why: 'A step is ¼ of a beat, so a bar of 4/4 has 16 steps.' },
    { gen: gBinTer }
  ]
});

/* ================= VIDEO 1 · CHAPTER 2 · NOTES ================= */
function gOctave() {
  const n = rnd(['C4', 'D4', 'E4', 'F4', 'G4', 'A4']), up = coin();
  const lowF = () => seq([n], { gap: 1.4, inst: 'keys', bpm: 90 }), highF = () => seq([M(n) + 12], { gap: 1.4, inst: 'keys', bpm: 90 });
  return {
    q: 'Same note, two different octaves. Which sound is higher?', hear: [['Sound A', up ? highF : lowF], ['Sound B', up ? lowF : highF]],
    c: ['Sound A', 'Sound B'], a: up ? 0 : 1, fixed: true,
    why: `Both are ${letter(n)} (${solf(n)}). The higher one is 12 half steps up: one octave.`
  };
}
lesson({
  id: 'twelve', part: 1, ch: 2, title: 'Only 12 notes', kid: '7 white + 5 black, and then it repeats.',
  words: [['Octave', 'octave', 'the same note, 12 keys higher or lower'], ['High', 'aigu', 'a bigger octave number'], ['Low', 'grave', 'a smaller octave number'], ['Note + octave number (C5)', 'nom de note + numéro d’octave', 'which note, and which floor of the piano']],
  grown: 'FL Studio calls middle C “C5”. Many books and other apps call the same key “C4” (Cubase even says C3). Same key, different label, so don’t panic when two tutorials disagree. A full piano has 88 keys, but they are only these 12 notes repeated.',
  beats: [
    { s: 'Look at a piano. Count the white keys: seven. Now the black keys: five. Together that makes 12 notes.',
      v: () => kb({ lo: 'C4', hi: 'B4', x: 100, w: 440, y: 160, h: 200, labels: 'letter' }),
      t: () => {
        const K = ref().kb, wh = [60, 62, 64, 65, 67, 69, 71], bl = [61, 63, 66, 68, 70];
        return play([...wh.map((m, i) => ({ b: i, l: 0.8, n: m, fx: () => K.tag(m, String(i + 1), 'ktag num') })),
          ...bl.map((m, i) => ({ b: 8 + i, l: 0.8, n: m, fx: () => K.tag(m, String(i + 1), 'ktag numb', 22) }))], { bpm: 150, kb: K });
      } },
    { s: 'After those 12, the same pattern starts again, higher. And again, and again. A piano looks huge, but it only has 12 different notes.',
      v: () => { const K = kb({ lo: 'C3', hi: 'B5', y: 170, h: 190, labels: 'none' }); K.band('C3', 'B3', 'pattern', '#4D9DE0'); K.band('C4', 'B4', 'same pattern', '#9B5DE5'); K.band('C5', 'B5', 'same again', '#3BB273'); },
      t: () => seq(['C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'C5', 'E5', 'G5', ['C3', 'C4', 'C5']], { gap: 0.5, bpm: 110, kb: ref().kb, len: 0.6 }) },
    { s: 'Each copy is called an octave. Moving a note up one octave means moving it 12 keys to the right. Same name, just higher.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 200, h: 170, labels: 'both' }); K.arc('C4', 'C5', '12 keys = 1 octave', 'karc', 70); K.mark(['C4', 'C5'], 0.6); },
      t: () => seq(['C4', 'C5', ['C4', 'C5']], { gap: 1.2, bpm: 90, kb: ref().kb }) },
    { s: 'In FL Studio, a number tells you the octave: C4, C5, C6. A bigger number sounds higher, “aigu” in French. A smaller number sounds lower, “grave”.',
      tts: 'In F L Studio, a number tells you the octave: C 4, C 5, C 6. A bigger number sounds higher. A smaller number sounds lower.',
      v: () => { const R = rl({ lo: 'C3', hi: 'C6', beats: 8, y: 30, h: 330, noNums: true }); ref().ns = ['C3', 'C4', 'C5', 'C6'].map((n, i) => R.add(n, i * 2, 1.6, { label: flName(n) })); Note('FL Studio octave numbers', 390); },
      t: () => play(['C3', 'C4', 'C5', 'C6'].map((n, i) => ({ b: i * 2, l: 1.6, n, el: ref().ns[i] })), { bpm: 120, roll: ref().roll, to: 8 }) },
    { s: 'Shortcut from the video: select your notes and press Control and the Up arrow. They jump one octave higher. Control and Down brings them back down.',
      tts: 'Shortcut from the video: select your notes and press Control and the Up arrow. They jump one octave higher. Control and Down brings them back down.',
      v: () => {
        const R = rl({ lo: 'C4', hi: 'C6', beats: 8, y: 30, h: 330 });
        const mel = [['E4', 0, 1], ['G4', 1, 1], ['A4', 2, 1], ['G4', 3, 1], ['E4', 4, 2], ['D4', 6, 1], ['C4', 7, 1]];
        ref().mel = mel.map(([n, b, l]) => ({ n, b, l, el: R.add(n, b, l) }));
        Note('Ctrl + ↑ = one octave up · Ctrl + ↓ = one octave down', 392);
      },
      t: () => {
        const R = ref(), roll = R.roll;
        const d1 = play(R.mel.map(e => ({ b: e.b, l: e.l, n: e.n, el: e.el })), { bpm: 120, roll, to: 8 });
        Timers.add(d1 * 1000, () => R.mel.forEach(e => { const y0 = +e.el.getAttribute('y'); tween(e.el, ['y'], y0, y0 - 12 * roll.rh, 0.45); }));
        return play(R.mel.map(e => ({ b: e.b, l: e.l, n: M(e.n) + 12, el: e.el })), { bpm: 120, at: d1 + 0.7, roll, to: 8 });
      } }
  ],
  quiz: [
    { q: 'How many different notes are there on a piano before the pattern repeats?', c: ['7', '12', '88'], a: 1, fixed: true, why: '7 white + 5 black = 12. A piano has 88 keys, but they are just those 12 notes repeated in different octaves.' },
    { q: 'You move a note up one octave. How many keys (half steps) does it move?', c: ['12', '7', '1'], a: 0, why: 'An octave is 12 half steps: the whole pattern of 7 white and 5 black keys.' },
    { gen: gOctave },
    { q: 'In FL Studio, which note sounds higher?', c: ['C6', 'C4', 'They sound the same'], a: 0, why: 'A bigger octave number is higher (aigu). C6 is two octaves above C4.' }
  ]
});

lesson({
  id: 'names', part: 1, ch: 2, title: 'Do is C', kid: 'Two names for the same 7 friends.',
  words: [['C D E F G A B', 'Do Ré Mi Fa Sol La Si', 'the 7 note names, in English and in French'], ['Natural notes', 'notes naturelles', 'the white keys'], ['Group of 2 / group of 3', 'groupe de 2 / de 3 touches noires', 'the black-key landmarks that help you find notes']],
  grown: 'Letter names are used in English-speaking countries, Germany and nearly all music software. Do-Ré-Mi names are used in France, Italy, Spain and Latin America. Fun fact: in German, B is called H.',
  beats: [
    { s: 'In French we sing Do, Ré, Mi, Fa, Sol, La, Si. In English, and in FL Studio, the same notes are letters: C, D, E, F, G, A, B.',
      tts: 'In French we sing: Doh, Ray, Mee, Fah, Sol, Lah, See. In English, and in F L Studio, the same notes are letters: C, D, E, F, G, A, B.',
      v: () => { ref().fr = Friends(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], { y: 170, r: 32, x0: 60, x1: 580, solf: true }); },
      t: () => seq(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], { gap: 1, bpm: 110, each: k => ref().fr[k].hop() }) },
    { s: 'So Do is C, Ré is D, Mi is E, Fa is F, Sol is G, La is A, and Si is B. Learn both: tutorials use both!',
      tts: 'So Doh is C, Ray is D, Mee is E, Fah is F, Sol is G, Lah is A, and See is B. Learn both: tutorials use both!',
      v: () => { ref().cards = Cards(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'].map(n => ({ t: letter(n), sub: solf(n), color: NOTE_COL[pcOf(n)], fs: 40, sfs: 18 })), { cols: 7, y: 120, h: 160, gap: 10 }); },
      t: () => seq(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], { gap: 0.8, bpm: 110, each: k => flash(ref().cards[k].rect, 0.4) }) },
    { s: 'The white keys are called natural notes. Now a trick to find them fast: look at the black keys. They come in a group of 2, then a group of 3.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 190, h: 180, labels: 'none' }); K.band('C4', 'E4', 'group of 2', '#4D9DE0'); K.band('F4', 'B4', 'group of 3', '#F25F5C'); K.band('C5', 'E5', 'group of 2', '#4D9DE0'); K.band('F5', 'B5', 'group of 3', '#F25F5C'); },
      t: () => seq([['C#4', 'D#4'], ['F#4', 'G#4', 'A#4'], ['C#5', 'D#5'], ['F#5', 'G#5', 'A#5']], { gap: 1, bpm: 90, kb: ref().kb }) },
    { s: 'The white key just left of the group of 2 is always Do, C. That part holds Do, Ré, Mi.',
      tts: 'The white key just left of the group of 2 is always C, Doh. That part holds C, D, E: Doh, Ray, Mee.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 190, h: 180, labels: 'both' }); K.band('C4', 'E4', 'group of 2', '#4D9DE0'); K.band('C5', 'E5', 'group of 2', '#4D9DE0'); K.mark(['C4', 'D4', 'E4', 'C5', 'D5', 'E5'], 0.55); K.ring(['C4', 'C5']); },
      t: () => seq(['C4', 'D4', 'E4', 'C5', 'D5', 'E5'], { gap: 0.7, bpm: 100, kb: ref().kb }) },
    { s: 'The white key just left of the group of 3 is Fa, F. That part holds Fa, Sol, La, Si. And Sol, G, is the white key just left of the middle black key.',
      tts: 'The white key just left of the group of 3 is F, Fah. That part holds F, G, A, B: Fah, Sol, Lah, See. And G, Sol, is the white key just left of the middle black key.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 190, h: 180, labels: 'both' }); K.band('F4', 'B4', 'group of 3', '#F25F5C'); K.band('F5', 'B5', 'group of 3', '#F25F5C'); K.mark(['F4', 'G4', 'A4', 'B4', 'F5', 'G5', 'A5', 'B5'], 0.55); K.ring(['F4', 'G4', 'F5', 'G5']); },
      t: () => seq(['F4', 'G4', 'A4', 'B4', 'F5', 'G5', 'A5', 'B5'], { gap: 0.6, bpm: 100, kb: ref().kb }) }
  ],
  quiz: [
    { q: 'What is Sol called in letter names?', c: ['G', 'S', 'A', 'F'], a: 0, why: 'Do Ré Mi Fa Sol La Si = C D E F G A B. Sol is the 5th one, so G.' },
    { q: 'What is “A” called in French?', c: ['La', 'Do', 'Ré', 'Si'], a: 0, why: 'A is La. Count C D E F G A → Do Ré Mi Fa Sol La.' },
    { q: 'Tap a C (Do). Hint: just left of a group of 2 black keys.', key: { lo: 'C4', hi: 'B5', labels: 'none', ok: ms => pcOf(ms[0]) === 0, show: ['C4', 'C5'] }, why: 'Every C sits just left of a group of 2 black keys.' },
    { q: 'Tap an F (Fa). Hint: just left of a group of 3 black keys.', key: { lo: 'C4', hi: 'B5', labels: 'none', ok: ms => pcOf(ms[0]) === 5, show: ['F4', 'F5'] }, why: 'Every F sits just left of a group of 3 black keys.' }
  ]
});

const kb1 = (o = {}) => kb(Object.assign({ lo: 'C4', hi: 'B4', x: 100, w: 440, y: 170, h: 200, labels: 'both' }, o));
lesson({
  id: 'black', part: 1, ch: 2, title: 'Black keys have two names', kid: 'Sharp means up, flat means down.',
  words: [['Sharp ♯', 'dièse', 'one half step up from the white key on the left'], ['Flat ♭', 'bémol', 'one half step down from the white key on the right'], ['Enharmonic', 'enharmonique', 'one key, two names (C♯ = D♭)'], ['Half step', 'demi-ton', 'from one key to the very next key']],
  grown: 'Which name to use depends on the key you are in. Each letter appears once in a scale, so F major is written with B♭ (not A♯), and E major with D♯ (not E♭).',
  beats: [
    { s: 'Black keys have two names. Each name comes from one of its white neighbors.',
      v: () => { const K = kb1(); K.mark('C#4', 0.8); K.ring(['C4', 'D4']); }, t: () => seq(['C4', 'C#4', 'D4'], { gap: 1, bpm: 90, kb: ref().kb }) },
    { s: 'Start on Do and go up one tiny step: you land on Do sharp, C♯. The sharp sign ♯ looks like a hashtag.',
      tts: 'Start on C, Doh, and go up one tiny step: you land on C sharp. The sharp sign looks like a hashtag.',
      v: () => { const K = kb1(); K.arc('C4', 'C#4', '+½ = ♯', 'karc', 46); K.mark('C#4', 0.8); Big('♯', 112, 'sym', 590); }, t: () => seq(['C4', 'C#4'], { gap: 1.2, bpm: 90, kb: ref().kb }) },
    { s: 'Or start on Ré and go down one tiny step: Ré flat, D♭. The flat sign ♭ looks like a little b. Same key, two names!',
      tts: 'Or start on D, Ray, and go down one tiny step: D flat. The flat sign looks like a little b. Same key, two names!',
      v: () => { const K = kb1(); K.arc('D4', 'C#4', '−½ = ♭', 'karc', 46); K.mark('C#4', 0.8); Big('♭', 112, 'sym', 590); }, t: () => seq(['D4', 'Db4'], { gap: 1.2, bpm: 90, kb: ref().kb }) },
    { s: 'All five black keys: C♯ or D♭, D♯ or E♭, F♯ or G♭, G♯ or A♭, A♯ or B♭. You pick the name that fits the music.',
      v: () => kb1({ blackLabels: 'both', labels: 'letter' }), t: () => seq(['C#4', 'D#4', 'F#4', 'G#4', 'A#4'], { gap: 1, bpm: 100, kb: ref().kb }) },
    { s: 'Look: there’s no black key between Mi and Fa, or between Si and Do. They’re already just a half step apart, so there’s no room for one!',
      tts: 'Look: there is no black key between E and F, or between B and C. They are already just a half step apart, so there is no room for one!',
      v: () => { const K = kb({ lo: 'C4', hi: 'C5', x: 70, w: 500, y: 170, h: 200, labels: 'both' }); K.arc('E4', 'F4', '½', 'karc', 40); K.arc('B4', 'C5', '½', 'karc', 40); K.mark(['E4', 'F4', 'B4', 'C5'], 0.6); },
      t: () => seq(['E4', 'F4', 'B4', 'C5'], { gap: 1, bpm: 90, kb: ref().kb }) },
    { s: 'Memory trick from the video: the two French note names ending in “i”, Mi and Si, have no black key after them.',
      tts: 'Memory trick from the video: the two French note names ending in the letter i, Mee and See, have no black key after them.',
      v: () => { ref().cards = Cards([{ t: 'Mi → Fa', sub: 'E → F · no black key', color: NOTE_COL[4] }, { t: 'Si → Do', sub: 'B → C · no black key', color: NOTE_COL[11] }], { y: 110, h: 170 }); },
      t: () => { seq(['E4', 'F4'], { gap: 0.8, bpm: 100, each: () => flash(ref().cards[0].rect, 0.4) }); return seq(['B4', 'C5'], { gap: 0.8, bpm: 100, at: 1.4, each: () => flash(ref().cards[1].rect, 0.4) }); } }
  ],
  quiz: [
    { q: 'C♯ and D♭ are…', c: ['The same key with two names', 'Two different keys', 'Not real notes'], a: 0, why: 'C♯ is one half step up from C, D♭ is one half step down from D. It is the same black key.' },
    { q: 'Tap the black key called E♭ (Mi bémol).', key: { lo: 'C4', hi: 'B4', labels: 'both', ok: ms => pcOf(ms[0]) === 3, show: ['Eb4'] }, why: 'E♭ is one half step below E. It is also called D♯.' },
    { q: 'Between which white keys is there NO black key?', c: ['E–F and B–C (Mi–Fa, Si–Do)', 'C–D and F–G', 'G–A and A–B'], a: 0, why: 'E–F and B–C are already only a half step apart.' },
    { q: 'Tap F♯ (Fa dièse).', key: { lo: 'C4', hi: 'B4', labels: 'both', ok: ms => pcOf(ms[0]) === 6, show: ['F#4'] }, why: 'F♯ is one half step above F: the first black key of the group of 3.' }
  ]
});

/* ================= VIDEO 1 · CHAPTER 3 · SCALES ================= */
function moodPlay(minor, root = 'C4', at = 0) {
  const r = M(root), third = r + (minor ? 3 : 4);
  return play([
    { b: 0, l: 4, n: chord(r - 12, minor ? 'min' : 'maj'), i: 'pad', v: 0.8 },
    ...[r + 12, third + 12, r + 19, third + 12, r + 14, r + 12].map((n, k) => ({ b: k * 0.5, l: k === 5 ? 1.5 : 0.5, n, i: 'lead' })),
    { b: 4, l: 3, n: chord(r - 12, minor ? 'min' : 'maj'), i: 'pad', v: 0.8 },
    { b: 4, l: 3, n: r + 12, i: 'lead' }
  ], { bpm: 100, at });
}
function gMood() {
  const minor = coin(), root = rnd(['C4', 'D4', 'F4', 'G4']);
  return {
    q: 'Happy or sad? Is this major or minor?', hear: [['Play', () => moodPlay(minor, root)]],
    c: ['Major (bright, happy)', 'Minor (dark, sad)'], a: minor ? 1 : 0, fixed: true,
    why: minor ? 'Minor: the 3rd note is only 3 half steps above home. That small third sounds darker.' : 'Major: the 3rd note is 4 half steps above home. That big third sounds bright.'
  };
}
lesson({
  id: 'teams', part: 1, ch: 3, title: 'Scales are teams', kid: '7 notes that get along.',
  words: [['Scale', 'gamme', 'a team of notes that sound good together'], ['Diatonic scale', 'gamme diatonique', 'a 7-note scale (one key)'], ['Chromatic scale', 'gamme chromatique', 'all 12 notes'], ['Major / minor', 'majeur / mineur', 'bright and happy / dark and sad']],
  grown: 'The video says producers won’t use the chromatic scale. As a home base, that’s true. But single chromatic notes show up all the time as decoration: the approach notes in chapter 6 often slide in from a half step away, even from outside the scale.',
  beats: [
    { s: 'A scale is a team of notes that sound good together. Melodies and chords are built from it.',
      v: () => { const ns = []; for (let m = 60; m < 72; m++) ns.push(m); ref().fr = Friends(ns, { y: 180, r: 19, x0: 40, x1: 600, flat: false }); },
      t: () => {
        const R = ref(), team = [0, 2, 4, 5, 7, 9, 11];
        R.fr.forEach((f, k) => f.dim(!team.includes(k)));
        return seq([60, 62, 64, 65, 67, 69, 71, 72], { gap: 0.6, bpm: 100, each: k => k < 7 && R.fr[team[k]].hop() });
      } },
    { s: 'The team you learned at school, Do Ré Mi Fa Sol La Si Do, is called the C major scale.',
      tts: 'The team you learned at school, Doh, Ray, Mee, Fah, Sol, Lah, See, Doh, is called the C major scale.',
      v: () => { const K = kb({ lo: 'C4', hi: 'C5', x: 60, w: 520, y: 180, h: 190, labels: 'both' }); K.mark(CMAJ, 0.55); },
      t: () => seq(CMAJ, { gap: 0.7, bpm: 100, kb: ref().kb }) },
    { s: 'A scale with 7 notes, like this one, is called diatonic. The scale with all 12 notes is called chromatic. It’s used much less, mostly to add tension.',
      v: () => { const K = kb({ lo: 'C4', hi: 'C5', x: 60, w: 520, y: 180, h: 190, labels: 'letter' }); K.mark(CMAJ, 0.55); Note('diatonic: 7 colored keys · chromatic: all 12', 60); },
      t: () => { const K = ref().kb; const d = seq(CMAJ, { gap: 0.5, bpm: 120, kb: K }); Timers.add(d * 1000, () => K.mark(Array.from({ length: 13 }, (_, i) => 60 + i), 0.55)); return seq(Array.from({ length: 13 }, (_, i) => 60 + i), { gap: 0.4, bpm: 120, kb: K, at: d + 0.3 }); } },
    { s: 'Today’s music mostly uses two kinds of scales. Major sounds bright and happy, like a party. Minor sounds dark, sad and emotional, like rain on the window.',
      v: () => { ref().cards = Cards([{ t: 'Major', sub: 'bright · happy · festive', color: YELLOW, fs: 42 }, { t: 'Minor', sub: 'dark · sad · emotional', color: BLUE, fs: 42 }], { y: 100, h: 190 }); },
      t: () => { flash(ref().cards[0].rect, 3); const d = moodPlay(false); Timers.add(d * 1000, () => flash(ref().cards[1].rect, 3)); return moodPlay(true, 'C4', d) ; } },
    { s: 'Your ears already know this! Make a sad beat and your fingers find a minor scale on their own. Theory just lets you choose on purpose, instead of by luck.',
      v: () => { const R = rl({ lo: 'E3', hi: 'E5', beats: 16, y: 34, h: 320 }); ref().ch = drawChords(R, chordEvts(['Am', 'F', 'C', 'G'], { set: TRI }), BLUE, 0.6); Note('a minor loop: A minor, F, C, G', 388); },
      t: () => play([...ref().ch, ...drums(4)], { bpm: 96, roll: ref().roll, to: 16 }) }
  ],
  quiz: [
    { q: 'How many notes does a diatonic scale have?', c: ['7', '12', '5'], a: 0, fixed: true, why: 'Diatonic = 7 notes, like Do Ré Mi Fa Sol La Si. The chromatic scale has all 12.' },
    { gen: gMood },
    { q: 'The chromatic scale uses…', c: ['All 12 notes', 'Only the white keys', 'Only 3 notes'], a: 0, why: 'Chromatic = every key, white and black: 12 notes.' }
  ]
});

const RECIPE_MAJ = ['T', 'T', '½', 'T', 'T', 'T', '½'], RECIPE_MIN = ['T', '½', 'T', 'T', '½', 'T', 'T'];
const recipeChips = (r, y = 140, h = 64) => (Stage.refs.chips = Chips(r.map(t => ({ t, cls: t === '½' ? 'half' : 'whole', fs: 30 })), { y, h }));
function walkScale(root, steps, o = {}) {
  const K = ref().kb, ns = scaleNotes(root, steps), chips = ref().chips;
  return play(ns.map((n, k) => ({ b: k, l: 0.9, n, fx: () => { if (k) { K.arc(ns[k - 1], n, steps[k - 1] === 1 ? '½' : 'T', steps[k - 1] === 1 ? 'karc half' : 'karc', 30); if (chips) flash(chips[k - 1], 0.6); } if (o.markAll) K.mark(n, 0.6); } })), { bpm: o.bpm || 92, kb: K });
}
function gRealMajor() {
  const root = rnd(['C4', 'D4', 'F4', 'G4']), ns = scaleNotes(root, MAJOR), bad = ns.slice();
  const which = rnd([2, 3, 5]); bad[which] += which === 3 ? 1 : -1;
  return ab('Which one is a real major scale?', () => seq(ns, { gap: 0.6, bpm: 110 }), () => seq(bad, { gap: 0.6, bpm: 110 }),
    `The real one follows whole, whole, half, whole, whole, whole, half. The other one has a wrong note: note ${which + 1} was moved by a half step.`);
}
lesson({
  id: 'major', part: 1, ch: 3, title: 'The major recipe', kid: 'Whole, whole, half, whole, whole, whole, half.',
  words: [['Half step', 'demi-ton', 'the very next key, black or white'], ['Whole step', 'ton', 'two half steps: skip one key'], ['Major scale', 'gamme majeure', 'recipe W W H W W W H'], ['Interval pattern', 'schéma d’intervalles', 'T T ½ T T T ½ in French']],
  grown: 'You can repeat the pattern up or down as far as you like: every C, D, E, F, G, A and B in every octave belongs to C major. In French the recipe is “ton, ton, demi-ton, ton, ton, ton, demi-ton”.',
  beats: [
    { s: 'To build a scale, we measure the gaps between notes. The smallest gap is the half step: from one key to the very next one, black or white. In French: demi-ton.',
      tts: 'To build a scale, we measure the gaps between notes. The smallest gap is the half step: from one key to the very next one, black or white.',
      v: () => { const K = kb1(); K.arc('F4', 'F#4', 'half step = ½', 'karc half', 46); K.mark(['F4', 'F#4'], 0.6); }, t: () => seq(['F4', 'F#4'], { gap: 1.2, bpm: 90, kb: ref().kb }) },
    { s: 'Two half steps make a whole step. In French: un ton. Skip one key and land on the next one.',
      tts: 'Two half steps make a whole step. Skip one key and land on the next one.',
      v: () => { const K = kb1(); K.arc('E4', 'F#4', 'whole step = T', 'karc', 52); K.tag('F4', 'skip', 'ktag'); K.mark(['E4', 'F#4'], 0.6); }, t: () => seq(['E4', 'F#4'], { gap: 1.2, bpm: 90, kb: ref().kb }) },
    { s: 'The major scale recipe is: whole, whole, half, whole, whole, whole, half.',
      v: () => { recipeChips(RECIPE_MAJ); Note('W W H W W W H · in French: T T ½ T T T ½', 250); },
      t: () => play(RECIPE_MAJ.map((r, k) => ({ b: k, l: 0.5, dr: r === '½' ? 'tick' : 'tock', fx: () => flash(ref().chips[k], 0.5) })), { bpm: 110 }) },
    { s: 'Let’s follow it from C. Whole: D. Whole: E. Half: F. Whole: G. Whole: A. Whole: B. Half: back to C!',
      v: () => { recipeChips(RECIPE_MAJ, 24, 42); kb({ lo: 'C4', hi: 'C5', x: 60, w: 520, y: 190, h: 180, labels: 'both' }); }, t: () => walkScale('C4', MAJOR, { markAll: true }) },
    { s: 'C major lands only on white keys. But the recipe works from any note! Start on G, follow it, and you need one black key: F♯.',
      tts: 'C major lands only on white keys. But the recipe works from any note! Start on G, follow it, and you need one black key: F sharp.',
      v: () => { recipeChips(RECIPE_MAJ, 24, 42); kb({ lo: 'C4', hi: 'B5', y: 190, h: 180, labels: 'both' }); }, t: () => walkScale('G4', MAJOR, { markAll: true }) },
    { s: 'Here it is as a staircase. Most steps are big, but two are tiny: between notes 3 and 4, and between notes 7 and 8.',
      v: () => { ref().st = Stairs(Stage.g, CMAJ, { nums: ['1', '2', '3', '4', '5', '6', '7', '8'], gaps: true }); },
      t: () => seq(CMAJ, { gap: 0.8, bpm: 96, each: k => ref().st.hop(k) }) }
  ],
  quiz: [
    { q: 'What is the major scale recipe?', c: ['W W H W W W H (T T ½ T T T ½)', 'W H W W H W W (T ½ T T ½ T T)', 'H H W W W W W'], a: 0, why: 'Major = whole, whole, half, whole, whole, whole, half.' },
    { q: 'A whole step (un ton) equals…', c: ['2 half steps', '12 half steps', '7 keys'], a: 0, why: 'One whole step = two half steps: skip one key, land on the next.' },
    { q: 'G major needs one black key. G is marked. Tap the black key!', key: { lo: 'C4', hi: 'B5', labels: 'both', start: ['G4'], ok: ms => pcOf(ms[0]) === 6, show: ['F#4', 'F#5'] }, why: 'G A B C D E F♯ G. From E, the recipe needs a whole step, which lands on F♯.' },
    { gen: gRealMajor }
  ]
});

lesson({
  id: 'minor', part: 1, ch: 3, title: 'The minor recipe and the twins', kid: 'Same notes, different home.',
  words: [['Natural minor', 'mineur naturel', 'recipe W H W W H W W'], ['Relative scales', 'gammes relatives', 'twins: same notes, different home'], ['Relative minor', 'relatif mineur', 'starts on the 6th note of a major scale'], ['Relative major', 'relatif majeur', 'starts on the 3rd note of a minor scale']],
  grown: 'Twins feel different because of which note feels like home. Your bassline and chords tell the ear where home is. The video’s full chart of relative pairs is in Vilmyllow’s free e-book.',
  beats: [
    { s: 'The natural minor recipe is: whole, half, whole, whole, half, whole, whole.',
      v: () => { recipeChips(RECIPE_MIN); Note('W H W W H W W · in French: T ½ T T ½ T T', 250); },
      t: () => play(RECIPE_MIN.map((r, k) => ({ b: k, l: 0.5, dr: r === '½' ? 'tick' : 'tock', fx: () => flash(ref().chips[k], 0.5) })), { bpm: 110 }) },
    { s: 'Start on La, A, and follow it: La, Si, Do, Ré, Mi, Fa, Sol, La. That’s A minor!',
      tts: 'Start on A, Lah, and follow it: A, B, C, D, E, F, G, A. That is A minor!',
      v: () => { recipeChips(RECIPE_MIN, 24, 42); kb({ lo: 'A3', hi: 'B4', y: 190, h: 180, labels: 'both' }); }, t: () => walkScale('A3', MINOR, { markAll: true }) },
    { s: 'Wait... A minor uses only white keys, exactly like C major! Same notes, different home. These are relative scales: twins who share one house.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', x: 70, w: 540, y: 200, h: 170, labels: 'both' }); for (let m = 60; m < 84; m++) if (!isBlack(m)) K.mark(m, 0.35); K.tag('C4', 'home of C major', 'ktag home'); K.tag('A4', 'home of A minor', 'ktag home'); },
      t: () => { const d = seq(scaleNotes('C4', MAJOR), { gap: 0.5, bpm: 120, kb: ref().kb }); return seq(scaleNotes('A4', MINOR), { gap: 0.5, bpm: 120, kb: ref().kb, at: d + 0.3 }); } },
    { s: 'Every major scale has a minor twin, so you only need to learn half as many scales.',
      v: () => { ref().cards = Cards([{ t: 'C major', sub: 'twin: A minor' }, { t: 'G major', sub: 'twin: E minor' }, { t: 'F major', sub: 'twin: D minor' }, { t: 'F♯ major', sub: 'twin: D♯ minor' }], { cols: 2, y: 70, h: 260 }); } },
    { s: 'To find a twin: in a major scale, the minor twin starts on note 6. In a minor scale, the major twin starts on note 3.',
      v: () => {
        txt(Stage.g, 20, 100, 'C major', { class: 'lane' }); txt(Stage.g, 20, 270, 'A minor', { class: 'lane' });
        ref().r1 = Friends(['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], { y: 100, r: 22, x0: 170, x1: 610, labels: ['1', '2', '3', '4', '5', '6', '7'] });
        ref().r2 = Friends(['A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'], { y: 270, r: 22, x0: 170, x1: 610, labels: ['1', '2', '3', '4', '5', '6', '7'] });
        ref().r1.forEach((f, k) => f.dim(k !== 5)); ref().r2.forEach((f, k) => f.dim(k !== 2));
      },
      t: () => { const R = ref(); R.r1[5].hop(); seq(['A4'], { gap: 1, bpm: 90 }); Timers.add(1100, () => R.r2[2].hop()); return seq(['C4'], { gap: 1, bpm: 90, at: 1.1 }); } },
    { s: 'The video’s example: F♯ major and D♯ minor are twins. Same notes, with lots of black keys!',
      tts: 'The video example: F sharp major and D sharp minor are twins. Same notes, with lots of black keys!',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 200, h: 170, labels: 'letter', blackLabels: 'sharp' }); const fs = scaleNotes('F#4', MAJOR).slice(0, 7).map(pcOf); for (let m = 60; m < 84; m++) if (fs.includes(pcOf(m))) K.mark(m, 0.45); K.tag('F#4', 'F♯ major home', 'ktag home'); K.tag('D#5', 'D♯ minor home', 'ktag home'); },
      t: () => { const d = seq(scaleNotes('F#4', MAJOR), { gap: 0.5, bpm: 120, kb: ref().kb }); return seq(scaleNotes('D#4', MINOR), { gap: 0.5, bpm: 120, kb: ref().kb, at: d + 0.3 }); } }
  ],
  quiz: [
    { q: 'What is the natural minor recipe?', c: ['W H W W H W W (T ½ T T ½ T T)', 'W W H W W W H (T T ½ T T T ½)', 'H W H W H W W'], a: 0, why: 'Minor = whole, half, whole, whole, half, whole, whole.' },
    { q: 'C major and A minor…', c: ['Use exactly the same notes', 'Share no notes at all', 'Are the same scale with the same home note'], a: 0, why: 'They are relative twins: the same 7 white keys, but home is C for one and A for the other.' },
    { q: 'What is the relative minor of G major? Hint: the 6th note of G major.', c: ['E minor', 'D minor', 'B minor'], a: 0, why: 'G A B C D E: the 6th note is E, so E minor.' },
    { q: 'What is the relative major of D minor? Hint: the 3rd note of D minor.', c: ['F major', 'A major', 'C major'], a: 0, why: 'D E F: the 3rd note is F, so F major. Both use one B♭.' }
  ]
});

function gHome() {
  const good = ['E4', 'D4', 'F4', 'E4', 'D4', 'B3', 'C4'], bad = ['E4', 'D4', 'F4', 'E4', 'D4', 'C4', 'B3'];
  const run = ns => play([{ b: 0, l: 4, n: ['C3', 'G3'], i: 'pad', v: 0.6 }, { b: 4, l: 2, n: ['G2', 'D3'], i: 'pad', v: 0.6 }, { b: 6, l: 2, n: ns === good ? ['C3', 'G3'] : ['G2', 'D3'], i: 'pad', v: 0.6 }, ...ns.map((n, k) => ({ b: k < 6 ? k : 6, l: k < 6 ? 1 : 2, n, i: 'lead' }))], { bpm: 110 });
  return ab('Which ending feels finished, like coming home?', () => run(good), () => run(bad), 'The finished one ends on C, the tonic (degree 1). The other stops on B, degree 7: it still wants to climb home.');
}
lesson({
  id: 'degrees', part: 1, ch: 3, title: 'Degrees: every note has a job', kid: 'Numbers and nicknames for each note.',
  words: [['Degree', 'degré', 'a note’s number in the scale (1 to 7)'], ['Tonic (1)', 'tonique', 'home; gives the scale its name'], ['Mediant (3)', 'médiante', 'decides major or minor'], ['Subdominant (4)', 'sous-dominante', 'gets things ready for degree 5'], ['Dominant (5)', 'dominante', 'tension that wants to go home'], ['Leading note (7)', 'sensible', 'a half step below home: pulls up hard']],
  grown: 'A careful correction. The video calls degree 7 the leading note (“sensible”) in minor too. Strictly, the sensible sits a half step below the tonic (B → C in C major). In natural minor, degree 7 is a whole step below (G → A in A minor) and is called the subtonic (“sous-tonique”), which pulls less. That’s why classical music often raises it to G♯ in A minor (the “harmonic minor”). The other names: degree 2 is the supertonic (sus-tonique), degree 6 the submediant (sus-dominante).',
  beats: [
    { s: 'In a scale, every note gets a number called a degree: 1, 2, 3, 4, 5, 6, 7. Then it’s 1 again.',
      v: () => { ref().st = Stairs(Stage.g, CMAJ, { nums: ['1', '2', '3', '4', '5', '6', '7', '1'] }); }, t: () => seq(CMAJ, { gap: 0.8, bpm: 96, each: k => ref().st.hop(k) }) },
    { s: 'Degree 1 is the tonic. It’s home, and it gives the scale its name. In C major, home is C.',
      v: () => { house(320, 250, 1.3); ref().f = Friend(Stage.g, 320, 285, 40, 'C4', { label: false }); Note('C is home: the tonic, degree 1', 386); }, t: () => { ref().f.hop(); return play([{ b: 0, l: 3, n: ['C3', 'E3', 'G3'], i: 'pad' }, { b: 0, l: 3, n: 'C5', i: 'bell' }], { bpm: 90 }); } },
    { s: 'Degree 3 is the mediant. It decides the mood: 4 half steps above home sounds major, 3 half steps sounds minor.',
      v: () => { const K = kb1(); K.arc('C4', 'E4', '+4 → major', 'karc', 70); K.arc('C4', 'Eb4', '+3 → minor', 'karc half', 36); K.mark(['C4', 'E4', 'Eb4'], 0.55); },
      t: () => play([{ b: 0, l: 1, n: 'C4' }, { b: 1, l: 1, n: 'E4' }, { b: 2, l: 2, n: ['C4', 'E4'] }, { b: 4.5, l: 1, n: 'C4' }, { b: 5.5, l: 1, n: 'Eb4' }, { b: 6.5, l: 2, n: ['C4', 'Eb4'] }], { bpm: 100, kb: ref().kb }) },
    { s: 'Degree 5 is the dominant. It makes tension, like a question: “Can we go home now?” Degree 4, the subdominant, gets things ready for it.',
      v: () => { ref().fr = Friends(['F4', 'G4', 'C5'], { y: 170, r: 40, x0: 130, x1: 510, labels: ['F · degree 4', 'G · degree 5', 'C · degree 1'], subs: ['subdominant', 'dominant', 'tonic: home!'] }); },
      t: () => { const F = ref().fr; return play([{ b: 0, l: 2, n: chord('F3', 'maj'), i: 'pad', fx: () => F[0].hop() }, { b: 2, l: 2, n: chord('G3', 'maj'), i: 'pad', fx: () => F[1].hop() }, { b: 4, l: 3, n: chord('C4', 'maj'), i: 'pad', fx: () => F[2].hop() }, { b: 0, l: 2, n: 'F2', i: 'bass' }, { b: 2, l: 2, n: 'G2', i: 'bass' }, { b: 4, l: 3, n: 'C3', i: 'bass' }], { bpm: 84 }); } },
    { s: 'Degree 7 is the leading note. In major it sits just a half step below home, so it really wants to climb up. Listen to it itch!',
      v: () => { ref().st = Stairs(Stage.g, CMAJ, { nums: ['1', '2', '3', '4', '5', '6', '7', '1'], gaps: true }); },
      t: () => play(CMAJ.map((n, k) => ({ b: k < 7 ? k * 0.6 : 7 * 0.6 + 2.2, l: k === 6 ? 2.6 : 0.6, n, fx: () => ref().st.hop(k) })), { bpm: 92 }) },
    { s: 'These names are the same in major and minor. And here’s why they matter: in video 2, we build chords on these degrees!',
      v: () => { Cards([{ t: '1', sub: 'tonic · home', color: NOTE_COL[0], fs: 44 }, { t: '3', sub: 'mediant · mood', color: NOTE_COL[4], fs: 44 }, { t: '4', sub: 'subdominant', color: NOTE_COL[5], fs: 44 }, { t: '5', sub: 'dominant · tension', color: NOTE_COL[7], fs: 44 }, { t: '7', sub: 'leading note', color: NOTE_COL[11], fs: 44 }], { cols: 5, y: 110, h: 170, gap: 10 }); } }
  ],
  quiz: [
    { q: 'Degree 1 of a scale is called…', c: ['The tonic', 'The dominant', 'The octave'], a: 0, why: 'The tonic is home. It gives the scale its name.' },
    { q: 'Which degree creates tension that wants to go back home?', c: ['Degree 5, the dominant', 'Degree 1, the tonic', 'Degree 3, the mediant'], a: 0, why: 'The dominant (5) pulls back to the tonic (1). In C major, G wants to go to C.' },
    { q: 'In C major, which note is the dominant (degree 5)?', c: ['G', 'F', 'E'], a: 0, why: 'C D E F G: the 5th note is G.' },
    { gen: gHome }
  ]
});

/* ================= VIDEO 2 · CHAPTER 4 · CHORDS ================= */
function dyads(R, list) { /* list: [notes, beat, label, colour of the top note] */ return list.map(([ns, b, label, col]) => ({ b, l: 3, n: ns, els: ns.map((n, k) => R.add(n, b, 3, { fill: k ? col : GREEN, label: k ? label : 'root' })) })); }
const playDy = ev => play(ev.flatMap(e => [{ b: e.b, l: 1, n: e.n[0], el: e.els[0] }, { b: e.b + 1, l: 1, n: e.n[1], el: e.els[1] }, { b: e.b + 2, l: 1.4, n: e.n, el: e.els }]), { bpm: 100, roll: ref().roll, to: 8 });
function gThird() {
  const maj = coin(), r = M(rnd(['C4', 'D4', 'F4', 'G4'])), t = r + (maj ? 4 : 3);
  return { q: 'Listen to these two notes. Big (major) third or small (minor) third?', hear: [['Play', () => play([{ b: 0, l: 1, n: r }, { b: 1, l: 1, n: t }, { b: 2, l: 2, n: [r, t] }], { bpm: 96 })]],
    c: ['Major third (4 half steps, brighter)', 'Minor third (3 half steps, darker)'], a: maj ? 0 : 1, fixed: true,
    why: maj ? `${letter(r)} to ${letter(t)} is 4 half steps: a major third.` : `${letter(r)} to ${letter(t, true)} is 3 half steps: a minor third.` };
}
lesson({
  id: 'intervals', part: 2, ch: 4, title: 'Intervals: measuring gaps', kid: 'Count the tiny steps between two notes.',
  words: [['Interval', 'intervalle', 'the distance between two notes'], ['Minor third', 'tierce mineure', '3 half steps'], ['Major third', 'tierce majeure', '4 half steps'], ['Perfect fifth', 'quinte juste', '7 half steps: very stable'], ['Minor / major 7th', '7e mineure / majeure', '10 / 11 half steps'], ['Octave (interval)', 'octave', '12 half steps']],
  grown: 'There are more intervals (2nds, 4ths, 6ths…), but these are the bricks of nearly every chord in pop, trap and R&B. The rule “major = minor + one half step” works for 2nds, 3rds, 6ths and 7ths.',
  beats: [
    { s: 'An interval is the distance between two notes. We measure it in half steps, like counting hops.',
      v: () => { const K = kb1(); K.mark(['C4', 'E4'], 0.6); },
      t: () => { const K = ref().kb; return play([...[61, 62, 63, 64].map((m, k) => ({ b: k * 0.8, l: 0.6, n: m, v: 0.6, fx: () => K.tag(m, String(k + 1), 'ktag num') })), { b: 4, l: 2, n: ['C4', 'E4'] }], { bpm: 100, kb: K }); } },
    { s: 'Four intervals matter most for producers. First, the thirds. A minor third is 3 half steps. A major third is 4. They decide sad or happy.',
      v: () => { const R = rl({ lo: 'C4', hi: 'C5', beats: 8, y: 34, h: 320, noNums: true }); ref().ev = dyads(R, [[['C4', 'Eb4'], 0, 'minor 3rd · +3', BLUE], [['C4', 'E4'], 4, 'major 3rd · +4', BLUE]]); },
      t: () => playDy(ref().ev) },
    { s: 'The fifth: 7 half steps. It sounds super stable, like a strong table. It holds chords together.',
      v: () => { const R = rl({ lo: 'C4', hi: 'C5', beats: 8, y: 34, h: 320, noNums: true }); ref().ev = dyads(R, [[['C4', 'G4'], 0, 'fifth · +7', ROLE_COL.fifth], [['F4', 'C5'], 4, 'fifth · +7', ROLE_COL.fifth]]); },
      t: () => playDy(ref().ev) },
    { s: 'The sevenths: a minor seventh is 10 half steps, a major seventh is 11. They add color.',
      v: () => { const R = rl({ lo: 'C4', hi: 'C5', beats: 8, y: 34, h: 320, noNums: true }); ref().ev = dyads(R, [[['C4', 'Bb4'], 0, 'minor 7th · +10', ORANGE], [['C4', 'B4'], 4, 'major 7th · +11', ORANGE]]); },
      t: () => playDy(ref().ev) },
    { s: 'And the octave: 12 half steps. The same note, just higher.',
      v: () => { const R = rl({ lo: 'C4', hi: 'G5', beats: 8, y: 34, h: 320, noNums: true }); ref().ev = dyads(R, [[['C4', 'C5'], 0, 'octave · +12', GREEN], [['G4', 'G5'], 4, 'octave · +12', GREEN]]); },
      t: () => playDy(ref().ev) },
    { s: 'Notice: a major interval is always one half step bigger than its minor brother. Minor third 3, major third 4. Minor seventh 10, major seventh 11.',
      v: () => { ref().cards = Cards([{ t: '3', sub: 'minor third' }, { t: '4', sub: 'major third' }, { t: '7', sub: 'perfect fifth' }, { t: '10', sub: 'minor seventh' }, { t: '11', sub: 'major seventh' }, { t: '12', sub: 'octave' }].map(c => Object.assign(c, { fs: 44 })), { cols: 3, y: 50, h: 300 }); },
      t: () => play([3, 4, 7, 10, 11, 12].map((iv, k) => ({ b: k * 1.5, l: 1.3, n: [60, 60 + iv], el: ref().cards[k].rect })), { bpm: 100 }) }
  ],
  quiz: [
    { q: 'How many half steps are in a major third?', c: ['3', '4', '7'], a: 1, fixed: true, why: 'Major third = 4 half steps (C to E). Minor third = 3 (C to E♭).' },
    { q: 'Which interval is 7 half steps and sounds very stable?', c: ['The perfect fifth', 'The minor third', 'The major seventh'], a: 0, why: 'The fifth (C to G) is 7 half steps. It stabilizes chords.' },
    { q: 'C is marked. Tap the note a minor third above it: 3 half steps up.', key: { lo: 'C4', hi: 'B4', labels: 'both', start: ['C4'], ok: ms => ms[0] === 63, show: ['Eb4'] }, why: 'C → C♯ → D → E♭: three half steps. The minor third above C is E♭.' },
    { gen: gThird }
  ]
});

const snow = (cx, notes, roles, side, o = {}) => Snowman(Stage.g, cx, o.by ?? 360, notes.map(M), roles, Object.assign({ side, sideX: o.sideX }, o));
const arpBlock = (ns, o = {}) => play([...ns.map((n, k) => ({ b: k * 0.6, l: 0.6, n, fx: o.sm ? () => o.sm.light(k, 0.4) : null })), { b: ns.length * 0.6 + 0.2, l: 2.2, n: ns, i: o.inst || 'keys', fx: o.sm ? () => o.sm.balls.forEach((b, k) => o.sm.light(k, 1.4)) : null }], { bpm: 100, at: o.at || 0 });
function gChordMood() {
  const minor = coin(), r = rnd(['C4', 'D4', 'E4', 'F4', 'G4', 'A3']);
  const ns = chord(r, minor ? 'min' : 'maj');
  return { q: 'Major chord (happy) or minor chord (sad)?', hear: [['Play', () => arpBlock(ns)]], c: ['Major chord', 'Minor chord'], a: minor ? 1 : 0, fixed: true,
    why: minor ? `${letter(r)} minor: the middle note is a minor third (3) above the root.` : `${letter(r)} major: the middle note is a major third (4) above the root.` };
}
lesson({
  id: 'triads', part: 2, ch: 4, title: 'Triads: the snowman chord', kid: 'Three balls stacked by thirds.',
  words: [['Chord', 'accord', 'several notes played together'], ['Dyad / triad', 'diade / triade', '2 notes / 3 notes'], ['Root', 'fondamentale', 'the bottom note; it names the chord'], ['Major triad', 'triade majeure', 'root + 4 + 7'], ['Minor triad', 'triade mineure', 'root + 3 + 7'], ['Diminished / augmented', 'diminué / augmenté', 'two small thirds / two big thirds']],
  grown: 'Colors follow the video: root green, third blue, fifth purple (and the 4th of a sus chord red). Stacked as thirds, major = big third (4) then small third (3); minor = small (3) then big (4).',
  beats: [
    { s: 'A chord is several notes played at the same time. Two notes make a dyad. Three notes make a triad.',
      v: () => { const R = rl({ lo: 'C4', hi: 'C6', beats: 8, y: 34, h: 320, noNums: true }); ref().a = R.chord(['C4', 'G4'], 0, 3, { fill: GREEN }); ref().b = [R.add('C4', 4, 3, { fill: GREEN, label: 'root' }), R.add('E4', 4, 3, { fill: BLUE, label: '3rd' }), R.add('G4', 4, 3, { fill: ROLE_COL.fifth, label: '5th' })]; txt(Stage.g, 150, 380, 'dyad: 2 notes', { class: 'snote', 'text-anchor': 'middle' }); txt(Stage.g, 450, 380, 'triad: 3 notes', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => play([{ b: 0, l: 3, n: ['C4', 'G4'], el: ref().a }, { b: 4, l: 3, n: ['C4', 'E4', 'G4'], el: ref().b }], { bpm: 100, roll: ref().roll, to: 8 }) },
    { s: 'A triad is like a snowman: three balls stacked by thirds. The bottom ball is the root. It gives the chord its name.',
      v: () => { ref().sm = snow(240, ['C4', 'E4', 'G4'], ['root', 'third', 'fifth'], ['root: C (gives the name)', 'third: E (+4)', 'fifth: G (+7)'], { sideX: 60 }); },
      t: () => arpBlock(chord('C4', 'maj'), { sm: ref().sm }) },
    { s: 'For C major: start on the root, C. Go up a major third, 4 half steps: E. Then the fifth, 7 half steps above the root: G.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 200, h: 170, labels: 'both' }); K.arc('C4', 'E4', '+4', 'karc', 40); K.arc('C4', 'G4', '+7', 'karc', 84); K.mark(['C4', 'E4', 'G4'], 0.65); },
      t: () => arpBlock(chord('C4', 'maj')) },
    { s: 'For C minor, lower the middle ball by one half step: E becomes E♭. That’s a minor third. Now it sounds sad.',
      tts: 'For C minor, lower the middle ball by one half step: E becomes E flat. That is a minor third. Now it sounds sad.',
      v: () => { ref().s1 = snow(170, ['C4', 'E4', 'G4'], ['root', 'third', 'fifth'], null); ref().s2 = snow(470, ['C4', 'Eb4', 'G4'], ['root', 'third', 'fifth'], null, { flat: true }); txt(Stage.g, 170, 392, 'C major', { class: 'snote', 'text-anchor': 'middle' }); txt(Stage.g, 470, 392, 'C minor', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => { const d = arpBlock(chord('C4', 'maj'), { sm: ref().s1 }); return arpBlock(chord('C4', 'min'), { sm: ref().s2, at: d }); } },
    { s: 'So: major is a big third, then a small third. Minor is a small third, then a big third. The middle ball decides the mood!',
      v: () => { ref().cards = Cards([{ t: 'Major = 4 + 3', sub: 'big third, then small third', color: BLUE, fs: 34 }, { t: 'Minor = 3 + 4', sub: 'small third, then big third', color: BLUE, fs: 34 }], { y: 100, h: 190 }); },
      t: () => play([0, 1, 2, 3].map(k => ({ b: k * 2, l: 1.8, n: chord('C4', k % 2 ? 'min' : 'maj'), el: ref().cards[k % 2].rect })), { bpm: 100 }) },
    { s: 'Two special snowmen. Stack two minor thirds: diminished. Its fifth shrinks to 6. Stack two major thirds: augmented. Its fifth grows to 8. They sound tense and strange, but they’re real chords.',
      v: () => { ref().s1 = snow(170, ['C4', 'Eb4', 'Gb4'], ['root', 'third', 'fifth'], null, { flat: true }); ref().s2 = snow(470, ['C4', 'E4', 'G#4'], ['root', 'third', 'fifth'], null); txt(Stage.g, 170, 392, 'diminished · 3 + 3', { class: 'snote', 'text-anchor': 'middle' }); txt(Stage.g, 470, 392, 'augmented · 4 + 4', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => { const d = arpBlock(chord('C4', 'dim'), { sm: ref().s1 }); return arpBlock(chord('C4', 'aug'), { sm: ref().s2, at: d }); } }
  ],
  quiz: [
    { q: 'Build C major: tap C, E and G, then press Check.', key: { lo: 'C4', hi: 'B5', labels: 'both', pick: 3, ok: ms => sameSet(ms.map(pcOf), [0, 4, 7]), show: ['C4', 'E4', 'G4'] }, why: 'C major = root C, major third E (+4), fifth G (+7).' },
    { gen: gChordMood },
    { q: 'A minor triad is…', c: ['Root + 3 half steps + 7 half steps', 'Root + 4 + 7', 'Root + 4 + 8'], a: 0, why: 'Minor triad: minor third (3) and fifth (7). Root + 4 + 7 is major. Root + 4 + 8 is augmented.' },
    { q: 'Two major (big) thirds stacked make…', c: ['An augmented chord', 'A diminished chord', 'A minor chord'], a: 0, why: '4 + 4 = augmented (the fifth becomes 8). 3 + 3 = diminished (the fifth becomes 6).' }
  ]
});

function gTriadOr7() {
  const pick = rnd([['C4', 'maj', 'maj7', 'C', 'Cmaj7'], ['A3', 'min', 'm7', 'Am', 'Am7'], ['F4', 'maj', 'maj7', 'F', 'Fmaj7'], ['D4', 'min', 'm7', 'Dm', 'Dm7']]);
  const seventh = coin(), ns = chord(pick[0], seventh ? pick[2] : pick[1]);
  return { q: 'Count the notes. Plain triad or seventh chord?', hear: [['Play', () => arpBlock(ns)]], c: ['Triad (3 notes)', 'Seventh chord (4 notes, richer)'], a: seventh ? 1 : 0, fixed: true,
    why: seventh ? `That was ${pick[4]}: 4 notes, with a 7th on top.` : `That was ${pick[3]}: 3 notes (root, third, fifth).` };
}
const sevenSnow = (q, side, flat) => { ref().sm = snow(220, chord('C4', q), ['root', 'third', 'fifth', 'seventh'], side, { sideX: 70, flat }); };
lesson({
  id: 'sevenths', part: 2, ch: 4, title: 'Seventh chords: give it a hat', kid: 'A fourth note on top makes it richer.',
  words: [['Seventh chord', 'accord de septième', 'a triad + a 7th on top (4 notes)'], ['Dominant 7th (C7)', '7e de dominante', 'major third + minor 7th'], ['Minor 7th (Cm7)', 'accord mineur 7', 'minor third + minor 7th'], ['Major 7th (Cmaj7)', 'accord 7e majeure', 'major third + major 7th'], ['Minor-major 7th', 'mineur 7e majeure', 'minor third + major 7th: crunchy']],
  grown: 'Every one of these is thirds stacked on thirds: C7 = 4+3+3, Cm7 = 3+4+3, Cmaj7 = 4+3+4, Cm(maj7) = 3+4+4.',
  beats: [
    { s: 'A seventh chord is a triad with one more note on top: the seventh. Four notes! Think of it as giving the snowman a hat.',
      v: () => sevenSnow('dom7', ['root', 'third', 'fifth', 'seventh: the hat!'], true), t: () => { const d = arpBlock(chord('C4', 'maj')); return arpBlock(chord('C4', 'dom7'), { sm: ref().sm, at: d }); } },
    { s: 'Major third, fifth, and a minor seventh, 10 half steps: that’s a dominant seventh chord, like C7. Richer than a plain triad.',
      tts: 'Major third, fifth, and a minor seventh, 10 half steps: that is a dominant seventh chord, like C 7. Richer than a plain triad.',
      v: () => sevenSnow('dom7', ['root C', 'major 3rd +4', 'fifth +7', 'minor 7th +10'], true), t: () => arpBlock(chord('C4', 'dom7'), { sm: ref().sm }) },
    { s: 'Minor third and minor seventh: a minor seventh chord, Cm7. Soft and smooth, perfect for R&B.',
      tts: 'Minor third and minor seventh: a minor seventh chord, C minor 7. Soft and smooth, perfect for R and B.',
      v: () => sevenSnow('m7', ['root C', 'minor 3rd +3', 'fifth +7', 'minor 7th +10'], true), t: () => arpBlock(chord('C4', 'm7'), { sm: ref().sm }) },
    { s: 'Major third and major seventh, 11 half steps: a major seventh chord, Cmaj7. Dreamy!',
      tts: 'Major third and major seventh, 11 half steps: a major seventh chord, C major 7. Dreamy!',
      v: () => sevenSnow('maj7', ['root C', 'major 3rd +4', 'fifth +7', 'major 7th +11']), t: () => arpBlock(chord('C4', 'maj7'), { sm: ref().sm }) },
    { s: 'Minor third with a major seventh: a minor-major seventh. A bit crunchy, but cool in the right place.',
      v: () => sevenSnow('mM7', ['root C', 'minor 3rd +3', 'fifth +7', 'major 7th +11'], true), t: () => arpBlock(chord('C4', 'mM7'), { sm: ref().sm }) },
    { s: 'Look closely: all of these are thirds stacked on thirds, like LEGO bricks. Big, small, big... you can build anything.',
      v: () => { ref().cards = Cards([{ t: 'C7', sub: '4 + 3 + 3' }, { t: 'Cm7', sub: '3 + 4 + 3' }, { t: 'Cmaj7', sub: '4 + 3 + 4' }, { t: 'Cm(maj7)', sub: '3 + 4 + 4' }].map(c => Object.assign(c, { fs: 32, sfs: 18, color: ORANGE })), { cols: 2, y: 60, h: 280 }); },
      t: () => play(['dom7', 'm7', 'maj7', 'mM7'].map((q, k) => ({ b: k * 2.2, l: 2, n: chord('C4', q), el: ref().cards[k].rect })), { bpm: 100 }) }
  ],
  quiz: [
    { q: 'How many notes are in a seventh chord?', c: ['4', '3', '7'], a: 0, fixed: true, why: 'A triad (3 notes) + the 7th = 4 notes.' },
    { q: 'Major third + fifth + minor seventh (10 half steps) gives…', c: ['A dominant seventh chord (C7)', 'A major seventh chord (Cmaj7)', 'A minor seventh chord (Cm7)'], a: 0, why: 'C7 = C E G B♭: major third, fifth, minor seventh.' },
    { gen: gTriadOr7 },
    { q: 'Build Cmaj7: tap C, E, G and B, then press Check.', key: { lo: 'C4', hi: 'B5', labels: 'both', pick: 4, ok: ms => sameSet(ms.map(pcOf), [0, 4, 7, 11]), show: ['C4', 'E4', 'G4', 'B4'] }, why: 'Cmaj7 = C (root), E (+4), G (+7), B (+11).' }
  ]
});

function gSus() {
  const r = rnd(['C4', 'D4', 'F4', 'G4']), sus = coin(), ns = chord(r, sus ? 'sus4' : 'maj');
  return { q: 'Normal major chord, or a floating sus4 chord?', hear: [['Play', () => arpBlock(ns)]], c: ['Normal major chord', 'Sus4 chord (no third, floating)'], a: sus ? 1 : 0, fixed: true,
    why: sus ? `${letter(r)}sus4: the third was pushed up to the 4th, so it floats.` : `${letter(r)} major: root, major third, fifth.` };
}
lesson({
  id: 'sus', part: 2, ch: 4, title: 'Sus chords and big chords', kid: 'Swap the middle ball, or stack even more.',
  words: [['Suspended chord', 'accord suspendu', 'the third is swapped for a 2nd or a 4th'], ['Sus4', 'sus4', 'third → fourth (5 half steps)'], ['Sus2', 'sus2', 'third → second (2 half steps)'], ['Extended chord', 'accord étendu', 'keeps stacking thirds: 9th, 11th, 13th']],
  grown: 'A sus chord has no third, so it is neither major nor minor. That is why Csus4 is the same chord whether you started from C or from Cm. Sus chords love to resolve: Csus4 → C sounds like a sigh of relief.',
  beats: [
    { s: 'Suspended chords swap the third for another note. No third means no happy and no sad. The chord floats in the air.',
      v: () => { ref().s1 = snow(170, ['C4', 'E4', 'G4'], ['root', 'third', 'fifth'], null); ref().s2 = snow(470, ['C4', 'F4', 'G4'], ['root', 'fourth', 'fifth'], null); txt(Stage.g, 170, 392, 'C major', { class: 'snote', 'text-anchor': 'middle' }); txt(Stage.g, 470, 392, 'Csus4', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => { const d = arpBlock(chord('C4', 'maj'), { sm: ref().s1 }); return arpBlock(chord('C4', 'sus4'), { sm: ref().s2, at: d }); } },
    { s: 'Sus4: push the third up to the 4th note. From C major, E moves up one half step to F. It sounds very trap, especially right after a normal chord.',
      v: () => { const K = kb({ lo: 'C4', hi: 'B5', y: 200, h: 170, labels: 'both' }); K.arc('E4', 'F4', '+½', 'karc half', 40); K.mark(['C4', 'F4', 'G4'], 0.65); K.mark('E4', 0.25); },
      t: () => play([{ b: 0, l: 2, n: chord('C4', 'maj'), i: 'pad' }, { b: 2, l: 2, n: chord('C4', 'sus4'), i: 'pad' }, { b: 4, l: 3, n: chord('C4', 'maj'), i: 'pad' }, { b: 0, l: 7, n: 'C3', i: 'bass' }, ...drums(2)], { bpm: 90, kb: ref().kb }) },
    { s: 'Sus2: pull the third down to the 2nd note. From C minor, E♭ moves down one half step to D.',
      tts: 'Sus 2: pull the third down to the 2nd note. From C minor, E flat moves down one half step to D.',
      v: () => { ref().s1 = snow(170, ['C4', 'Eb4', 'G4'], ['root', 'third', 'fifth'], null, { flat: true }); ref().s2 = snow(470, ['C4', 'D4', 'G4'], ['root', 'second', 'fifth'], null); txt(Stage.g, 170, 392, 'C minor', { class: 'snote', 'text-anchor': 'middle' }); txt(Stage.g, 470, 392, 'Csus2', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => { const d = arpBlock(chord('C4', 'min'), { sm: ref().s1 }); return arpBlock(chord('C4', 'sus2'), { sm: ref().s2, at: d }); } },
    { s: 'Extended chords keep stacking thirds past the seventh: ninths, elevenths, thirteenths. The more you add, the richer it sounds.',
      v: () => { const R = rl({ lo: 'C4', hi: 'G5', beats: 9, y: 34, h: 320, noNums: true }); const cols = [GREEN, BLUE, ROLE_COL.fifth, ORANGE, YELLOW, PINK];
        ref().ch = [['m7', 0, 'Cm7'], ['m9', 3, 'Cm9'], ['m11', 6, 'Cm11']].map(([q, b, nm]) => ({ b, l: 2.6, n: chord('C4', q), el: chord('C4', q).map((n, k) => R.add(n, b, 2.6, { fill: cols[k] })) }));
        [['Cm7', 0], ['Cm9 (+9th)', 3], ['Cm11 (+11th)', 6]].forEach(([nm, b]) => txt(Stage.g, R.xOf(b) + 4, 380, nm, { class: 'snote' })); },
      t: () => play(ref().ch, { bpm: 90, roll: ref().roll, to: 9 }) },
    { s: 'Too much? Remove the fifth, or even the seventh, to make room. Try, listen, and keep what you like.',
      v: () => { const R = rl({ lo: 'C4', hi: 'G5', beats: 8, y: 34, h: 320, noNums: true }); const cols = [GREEN, BLUE, ROLE_COL.fifth, ORANGE, YELLOW];
        ref().ch = [[CH.m9, 0, 'Cm9 full'], [CH.m9no5, 4, 'Cm9 without the 5th']].map(([q, b, nm]) => ({ b, l: 3.4, n: chord('C4', q), el: chord('C4', q).map((n, k) => R.add(n, b, 3.4, { fill: q.length === 5 ? cols[k] : [GREEN, BLUE, ORANGE, YELLOW][k] })) }));
        [['Cm9: 5 notes', 0], ['Cm9 without the 5th', 4]].forEach(([nm, b]) => txt(Stage.g, R.xOf(b) + 4, 380, nm, { class: 'snote' })); },
      t: () => play(ref().ch, { bpm: 90, roll: ref().roll, to: 8 }) },
    { s: 'Remember three things and you know 80% of chords: the third sets the emotion, the fifth makes it stable, and the 7th, 9th, 11th and 13th add color.',
      tts: 'Remember three things and you know 80 percent of chords: the third sets the emotion, the fifth makes it stable, and the seventh, ninth, eleventh and thirteenth add color.',
      v: () => { ref().cards = Cards([{ t: 'Third', sub: 'emotion: major or minor', color: BLUE, fs: 34 }, { t: 'Fifth', sub: 'stability', color: ROLE_COL.fifth, fs: 34 }, { t: '7 · 9 · 11 · 13', sub: 'color and richness', color: ORANGE, fs: 26 }], { y: 100, h: 190 }); },
      t: () => play([{ b: 0, l: 1.8, n: chord('C4', 'min'), el: ref().cards[0].rect }, { b: 2, l: 1.8, n: ['C4', 'G4'], el: ref().cards[1].rect }, { b: 4, l: 2.5, n: chord('C4', 'm9'), el: ref().cards[2].rect }], { bpm: 100 }) }
  ],
  quiz: [
    { q: 'In a sus4 chord, the third is replaced by…', c: ['The 4th', 'The 7th', 'The octave'], a: 0, why: 'Sus4 = root, 4th, 5th. Csus4 = C F G.' },
    { q: 'Which note decides whether a chord sounds happy or sad?', c: ['The third', 'The fifth', 'The root'], a: 0, why: 'Big third (4) = major, small third (3) = minor. The fifth just stabilizes.' },
    { q: 'What do 7ths, 9ths and 11ths mainly add?', c: ['Color and richness', 'Speed', 'Stability'], a: 0, why: 'Extensions add color. The fifth is the one that adds stability.' },
    { gen: gSus }
  ]
});

/* ================= VIDEO 2 · CHAPTER 5 · PROGRESSIONS ================= */
const PROG_C = [chord('C4', 'maj'), chord('G3', 'maj'), chord('A3', 'min'), chord('F3', 'maj')];
const PROG_A = [chord('A3', 'maj'), chord('E3', 'maj'), chord('F#3', 'min'), chord('D3', 'maj')];
lesson({
  id: 'talk-degrees', part: 2, ch: 5, title: 'Talk in degrees', kid: 'Numbers work in every key.',
  words: [['Chord progression', 'progression d’accords', 'chords in a chosen order'], ['Degree of a chord', 'degré', 'the scale number of the chord’s root'], ['Transpose', 'transposer', 'move everything into another key'], ['Roman numerals', 'chiffres romains', 'I V vi IV: capital = major, small = minor']],
  grown: 'With Roman numerals, the video’s example is I–V–vi–IV. It is so common that it’s nicknamed the “Axis progression”, after a comedy medley of pop hits built on it. Careful: many songs in that medley really use rotations of it, or other keys.',
  beats: [
    { s: 'A chord progression is a list of chords in a chosen order. Like a little story, it gives emotion, tension and direction.',
      v: () => { const R = rl({ lo: 'C3', hi: 'C5', beats: 16, y: 34, h: 320 }); ref().ch = PROG_C.map((n, k) => ({ b: k * 4, l: 3.8, n, i: 'pad', el: R.chord(n, k * 4, 3.8, { fill: BLUE, op: 0.75, label: '' }) })); ['C', 'G', 'Am', 'F'].forEach((nm, k) => txt(Stage.g, R.xOf(k * 4) + 8, 380, nm, { class: 'snote' })); },
      t: () => play([...ref().ch, ...drums(4)], { bpm: 100, roll: ref().roll, to: 16 }) },
    { s: 'Producers name chords by degrees: the number of the root in the scale. In C major: C is 1, G is 5, A minor is 6, and F is 4.',
      tts: 'Producers name chords by degrees: the number of the root in the scale. In C major: C is one, G is five, A minor is six, and F is four.',
      v: () => { ref().cards = Cards([{ t: 'I', sub: 'C' }, { t: 'V', sub: 'G' }, { t: 'vi', sub: 'Am' }, { t: 'IV', sub: 'F' }].map(c => Object.assign(c, { fs: 48, sfs: 22, color: BLUE })), { cols: 4, y: 90, h: 200 }); Note('capital = major chord · small = minor chord', 340); },
      t: () => play(PROG_C.map((n, k) => ({ b: k * 2, l: 1.9, n, i: 'pad', el: ref().cards[k].rect })), { bpm: 100 }) },
    { s: 'Why numbers? Move the song to A major and every name changes: A, E, F♯ minor, D. But the numbers stay the same: 1, 5, 6, 4!',
      tts: 'Why numbers? Move the song to A major and every name changes: A, E, F sharp minor, D. But the numbers stay the same: one, five, six, four!',
      v: () => {
        txt(Stage.g, 20, 118, 'in C', { class: 'lane' }); txt(Stage.g, 20, 268, 'in A', { class: 'lane' });
        ref().c1 = Cards([['C', 'I'], ['G', 'V'], ['Am', 'vi'], ['F', 'IV']].map(([t, sub]) => ({ t, sub, fs: 34, sfs: 18 })), { cols: 4, x: 110, w: 510, y: 70, h: 100 });
        ref().c2 = Cards([['A', 'I'], ['E', 'V'], ['F♯m', 'vi'], ['D', 'IV']].map(([t, sub]) => ({ t, sub, fs: 34, sfs: 18 })), { cols: 4, x: 110, w: 510, y: 220, h: 100 });
        Note('same numbers, same feeling, different key', 372);
      },
      t: () => { const d = play(PROG_C.map((n, k) => ({ b: k * 2, l: 1.9, n, i: 'pad', el: ref().c1[k].rect })), { bpm: 100 }); return play(PROG_A.map((n, k) => ({ b: k * 2, l: 1.9, n, i: 'pad', el: ref().c2[k].rect })), { bpm: 100, at: d }); } }
  ],
  quiz: [
    { q: 'In C major, which chord is degree 5?', c: ['G major', 'F major', 'A minor'], a: 0, why: 'C D E F G: the 5th note is G, so the degree-5 chord is G major.' },
    { q: 'Why talk in degrees instead of chord names?', c: ['The numbers stay the same in every key', 'It makes the music louder', 'FL Studio only understands numbers'], a: 0, why: '1–5–6–4 is C G Am F in C major and A E F♯m D in A major. Same shape, any key.' },
    { q: 'In C major, degrees 1–5–6–4 are C, G, Am, F. What are they in A major?', c: ['A, E, F♯m, D', 'C, G, Am, F', 'A, D, E, F♯m'], a: 0, why: 'A major: A B C♯ D E F♯ G♯. Degree 1 = A, 5 = E, 6 = F♯m, 4 = D.' }
  ]
});

const AMIN_TRIADS = [['Am', 'min'], ['B°', 'dim'], ['C', 'maj'], ['Dm', 'min'], ['Em', 'min'], ['F', 'maj'], ['G', 'maj']];
function gLoopHome() {
  const home = [TRI.Am, TRI.F, TRI.C, TRI.G, TRI.Am], away = [TRI.Am, TRI.F, TRI.C, TRI.Am, TRI.G];
  const run = list => play(list.map((n, k) => ({ b: k * 2, l: k === 4 ? 3 : 1.9, n, i: 'pad' })), { bpm: 100 });
  return ab('Which progression ends back home, on A minor?', () => run(home), () => run(away), 'The finished one goes Am, F, C, G and lands on Am: G pulls back home. The other one stops on G and hangs in the air.');
}
lesson({
  id: 'build-prog', part: 2, ch: 5, title: 'Build a progression in 5 steps', kid: 'Key, notes, chords, start, story.',
  words: [['Key', 'tonalité', 'a scale + its home note'], ['Scale highlighting', 'surbrillance de gamme', 'FL Studio: View › Scale highlighting'], ['Natural minor (Aeolian)', 'mineur naturel (éolien)', 'FL Studio’s name for the minor scale'], ['Major (Ionian)', 'majeur (ionien)', 'FL Studio’s name for the major scale']],
  grown: 'Moving a whole chord up or down an octave keeps the same chord and the same degree (Ctrl+↑ or ↓ in FL Studio). In A minor, the G chord (degree 7) pulls home more gently than a true dominant: classical music would use E major (with G♯) for a stronger pull. Also, key-finder sites like Tunebat use algorithms, so check with your ears.',
  beats: [
    { s: 'Let’s build a progression in 5 steps, like the video. Step 1: choose a key. Let your ears decide, or copy the key of a song you love. Sites like Tunebat show a song’s key and BPM. We pick A minor.',
      tts: 'Let us build a progression in 5 steps, like the video. Step 1: choose a key. Let your ears decide, or copy the key of a song you love. Sites like Tunebat show a song key and B P M. We pick A minor.',
      v: () => { stepsList(0); txt(Stage.g, 470, 200, 'A minor', { class: 'bigkey', 'text-anchor': 'middle' }); txt(Stage.g, 470, 240, 'the key', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => play([{ b: 0, l: 3, n: TRI.Am, i: 'pad' }, { b: 0, l: 3, n: 'A4', i: 'bell' }], { bpm: 90 }) },
    { s: 'Step 2: find its 7 notes. In FL Studio’s piano roll, open View, then Scale highlighting, and pick natural minor on A. The notes of the scale light up.',
      tts: 'Step 2: find its 7 notes. In F L Studio piano roll, open View, then Scale highlighting, and pick natural minor on A. The notes of the scale light up.',
      v: () => { const R = rl({ lo: 'A3', hi: 'A5', beats: 8, y: 34, h: 320, scale: AMIN, root: 'A3', allLabels: true }); ref().ns = scaleNotes('A3', MINOR).map((n, k) => ({ b: k, l: 0.9, n, el: R.add(n, k, 0.9) })); Note('striped rows = notes of A minor · A B C D E F G', 388); },
      t: () => play(ref().ns, { bpm: 110, roll: ref().roll, to: 8 }) },
    { s: 'Step 3: build a triad on each of the 7 notes, using only notes of the scale. In A minor you get: A minor, B diminished, C major, D minor, E minor, F major and G major.',
      v: () => { const R = rl({ lo: 'A3', hi: 'E5', beats: 14, y: 34, h: 316, scale: AMIN, root: 'A3', noNums: true });
        ref().ch = AMIN_TRIADS.map(([nm, q], k) => ({ b: k * 2, l: 1.8, n: chord(AMIN[k], q), i: 'pad', el: R.chord(chord(AMIN[k], q), k * 2, 1.8, { fill: q === 'maj' ? YELLOW : q === 'min' ? BLUE : '#F25F5C', op: 0.85 }) }));
        AMIN_TRIADS.forEach(([nm], k) => txt(Stage.g, R.xOf(k * 2) + 4, 380, nm + ' ' + ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'][k], { class: 'snote small' })); },
      t: () => play(ref().ch, { bpm: 100, roll: ref().roll, to: 14 }) },
    { s: 'Step 4: choose where to start. Often it’s degree 1, A minor, but there’s no strict rule.',
      v: () => { stepsList(3); txt(Stage.g, 470, 200, 'Am', { class: 'bigkey', 'text-anchor': 'middle' }); txt(Stage.g, 470, 240, 'degree 1 (i)', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => play([{ b: 0, l: 3, n: TRI.Am, i: 'pad' }, { b: 0, l: 3, n: 'A2', i: 'bass' }], { bpm: 90 }) },
    { s: 'Step 5: add chords that tell a story. A minor, then F, moved down an octave so it falls, then C, then G. The G makes us want to fall back home to A minor.',
      v: () => { const R = rl({ lo: 'E3', hi: 'E5', beats: 16, y: 34, h: 316 }); ref().ch = drawChords(R, chordEvts(['Am', 'F', 'C', 'G'], { set: TRI }), BLUE, 0.75); ['Am', 'F', 'C', 'G'].forEach((nm, k) => txt(Stage.g, R.xOf(k * 4) + 8, 380, nm, { class: 'snote' })); },
      t: () => play([...ref().ch, ...bassEvts(['Am', 'F', 'C', 'G']), ...drums(4), { b: 16, l: 3, n: TRI.Am, i: 'pad' }, { b: 16, l: 3, n: 'A2', i: 'bass' }], { bpm: 96, roll: ref().roll, to: 16 }) },
    { s: 'That’s degrees 1, 6, 3, 7. It’s used in tons of styles, and it loops beautifully.',
      tts: 'That is degrees one, six, three, seven. It is used in tons of styles, and it loops beautifully.',
      v: () => { ref().cards = Cards([{ t: 'i', sub: 'Am' }, { t: 'VI', sub: 'F' }, { t: 'III', sub: 'C' }, { t: 'VII', sub: 'G' }].map(c => Object.assign(c, { fs: 48, sfs: 22, color: BLUE })), { cols: 4, y: 100, h: 200 }); },
      t: () => play([...['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'].map((nm, k) => ({ b: k * 2, l: 1.9, n: TRI[nm], i: 'pad', el: ref().cards[k % 4].rect })), ...bassEvts(['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'G'], { len: 2 }), ...drums(4)], { bpm: 100 }) }
  ],
  quiz: [
    { q: 'In A minor, which chords sit on degrees 1, 6, 3 and 7?', c: ['Am, F, C, G', 'Am, Dm, Em, Am', 'A, F♯m, C♯m, G♯'], a: 0, why: 'A minor = A B C D E F G. Degree 1 = Am, 6 = F, 3 = C, 7 = G.' },
    { q: 'In A minor, the chord on degree 2 (B) is…', c: ['B diminished', 'B minor', 'B major'], a: 0, why: 'Using only A-minor notes: B D F. That is two minor thirds: diminished.' },
    { q: 'What is step 1 of building a progression?', c: ['Choose a key', 'Add velocity', 'Export the beat'], a: 0, why: 'Key first: it gives you the 7 notes, and the 7 notes give you the 7 chords.' },
    { gen: gLoopHome }
  ]
});

lesson({
  id: 'tricks', part: 2, ch: 5, title: 'Five tricks for richer chords', kid: 'Same chords, new magic.',
  words: [['Added seventh', '7e ajoutée', 'count two scale notes above the fifth'], ['Doubled root', 'fondamentale doublée', 'the root copied an octave lower'], ['Inversion', 'renversement', 'move chord notes up or down an octave'], ['Velocity', 'vélocité', 'how hard a note is hit: loud or soft']],
  grown: 'In A minor the added 7ths stay in the scale: Am7 (A C E G), Fmaj7 (F A C E), Cmaj7 (C E G B), G7 (G B D F). Doubling roots an octave down is also why many producers run an 808 or sub bass that follows the chord roots.',
  beats: [
    { s: 'Five tricks to make chords richer. Trick 1: add sevenths. Count two scale notes above the fifth. A minor becomes A minor 7, F becomes F major 7, C becomes C major 7, and G becomes G7. All still in the scale!',
      tts: 'Five tricks to make chords richer. Trick 1: add sevenths. Count two scale notes above the fifth. A minor becomes A minor 7, F becomes F major 7, C becomes C major 7, and G becomes G 7. All still in the scale!',
      v: () => { const R = rl({ lo: 'E3', hi: 'G4', beats: 16, y: 34, h: 316 });
        const tri = chordEvts(['Am', 'F', 'C', 'G'], { set: TRI, len: 2 }), sev = chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { len: 2, start: 8 });
        drawChords(R, tri, BLUE, 0.7);
        sev.forEach(e => { e.el = e.n.map(n => R.add(n, e.b, e.l, { fill: n === SEVENTH[e.nm] ? ORANGE : BLUE, op: 0.8 })); });
        ref().ev = [...tri, ...sev];
        txt(Stage.g, R.xOf(0) + 6, 380, 'triads', { class: 'snote' }); txt(Stage.g, R.xOf(8) + 6, 380, 'with sevenths (orange)', { class: 'snote' }); },
      t: () => play(ref().ev, { bpm: 92, roll: ref().roll, to: 16 }) },
    { s: 'Trick 2: copy the root notes one octave lower. It fills the low end, so the chords feel deeper.',
      v: () => { const R = rl({ lo: 'E2', hi: 'G4', beats: 16, y: 34, h: 316 });
        const a = chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { len: 2 }), b = chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { len: 2, start: 8 }), bs = bassEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { len: 2, start: 8 });
        drawChords(R, a, BLUE, 0.7); drawChords(R, b, BLUE, 0.7); bs.forEach(e => { e.el = R.add(e.n, e.b, e.l, { fill: GREEN }); });
        ref().ev = [...a, ...b, ...bs]; txt(Stage.g, R.xOf(8) + 6, 380, '+ roots one octave lower (green)', { class: 'snote' }); },
      t: () => play(ref().ev, { bpm: 92, roll: ref().roll, to: 16 }) },
    { s: 'Trick 3: inversions. Move some chord notes up or down an octave. Same notes, a new shape, and a slightly different sound.',
      v: () => { const R = rl({ lo: 'E3', hi: 'C5', beats: 16, y: 34, h: 316 });
        const a = chordEvts(['Am7', 'Fmaj7'], { len: 4 }), b = [{ b: 8, l: 4, n: ['C4', 'E4', 'G4', 'A4'], i: 'pad' }, { b: 12, l: 4, n: ['A3', 'C4', 'E4', 'F4'], i: 'pad' }];
        drawChords(R, a, BLUE, 0.75); drawChords(R, b, YELLOW, 0.85); ref().ev = [...a, ...b];
        txt(Stage.g, R.xOf(0) + 6, 380, 'Am7 · Fmaj7', { class: 'snote' }); txt(Stage.g, R.xOf(8) + 6, 380, 'same chords, inverted', { class: 'snote' }); },
      t: () => play(ref().ev, { bpm: 96, roll: ref().roll, to: 16 }) },
    { s: 'Trick 4: change the rhythm without changing a single note. Here some chords last 2 beats instead of 4. Try to keep the pattern symmetric over 2, 4 or 8 bars.',
      v: () => { const R = rl({ lo: 'E3', hi: 'G4', beats: 16, y: 34, h: 316 });
        const ev = [['Am7', 0, 2], ['Fmaj7', 2, 2], ['Cmaj7', 4, 4], ['Am7', 8, 2], ['Fmaj7', 10, 2], ['G7', 12, 4]].map(([nm, b, l]) => ({ b, l: l - 0.1, n: V7[nm], i: 'pad' }));
        drawChords(R, ev, BLUE, 0.75); ref().ev = ev; Note('2 beats, 2 beats, 4 beats · then the same rhythm again', 388); },
      t: () => play([...ref().ev, ...drums(4)], { bpm: 96, roll: ref().roll, to: 16 }) },
    { s: 'Trick 5: swap a chord you don’t love for another chord from the scale. Bonus: play with velocity, how hard each note is hit.',
      v: () => { const R = rl({ lo: 'E3', hi: 'G4', beats: 16, y: 34, h: 316 });
        const a = chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { len: 2 }), b = chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'Em7'], { len: 2, start: 8 });
        drawChords(R, a, BLUE, 0.7); drawChords(R, b.slice(0, 3), BLUE, 0.7); drawChords(R, b.slice(3), PINK, 0.95);
        b.forEach((e, k) => { e.v = [1, 0.55, 0.85, 0.7][k]; }); ref().ev = [...a, ...b];
        txt(Stage.g, R.xOf(14) - 6, 380, 'G7 → Em7', { class: 'snote', 'text-anchor': 'middle' }); },
      t: () => play(ref().ev, { bpm: 92, roll: ref().roll, to: 16 }) },
    { s: 'Two producers can use the exact same chords and still make totally different beats. These little choices are your style!',
      v: () => { Cards([{ t: '+ 7ths' }, { t: 'Low roots' }, { t: 'Inversions' }, { t: 'Rhythm' }, { t: 'Swap' }].map(c => Object.assign(c, { fs: 22, color: ORANGE })), { cols: 5, y: 120, h: 130, gap: 10 }); Note('bonus: velocity', 300); },
      t: () => { const p = miniProd(); return play([...p.ch, ...p.bass, ...p.dr].filter(e => e.b < 16), { bpm: 90 }); } }
  ],
  quiz: [
    { q: 'In A minor, adding a seventh to the F chord gives…', c: ['Fmaj7 (F A C E)', 'F7 (F A C E♭)', 'Fm7 (F A♭ C E♭)'], a: 0, why: 'Count two scale notes above C: D, then E. E is 11 half steps above F, so the chord is Fmaj7, and E is in A minor.' },
    { q: 'An inversion means…', c: ['Moving chord notes up or down an octave', 'Playing the chords backwards in time', 'Changing the key of the song'], a: 0, why: 'Same notes, different order from bottom to top.' },
    { q: 'Copying the root notes one octave lower mainly adds…', c: ['Depth in the low end', 'More high notes', 'A faster tempo'], a: 0, why: 'Lower roots fill the bottom of the frequency spectrum.' },
    { q: 'Trick 4 changes…', c: ['Only the rhythm, not the notes', 'Only the notes, not the rhythm', 'The key'], a: 0, why: 'Same chords, new rhythm: the progression already feels different.' }
  ]
});

/* ================= VIDEO 2 · CHAPTER 6 · MELODIES ================= */
const RIFF = [['E5', 0, 0.5], ['E5', 0.75, 0.25], ['G5', 1, 0.5], ['E5', 1.5, 0.5], ['D5', 2, 0.75], ['C5', 2.75, 0.25], ['A4', 3, 1]];
function riffEv(at = 0, R) { return RIFF.map(([n, b, l], k) => ({ b: at + b, l, n, i: 'lead', v: VEL[k % 7], el: R ? R.add(n, at + b, l, { fill: PINK }) : null })); }
function gApproach() {
  const withA = phrase('q1', 0), without = withA.filter(e => !e.app);
  const run = list => play([{ b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.7 }, ...list], { bpm: 92 });
  return ab('Which melody has an approach note (a tiny note sliding into the last note)?', () => run(withA), () => run(without), 'The approach note is the tiny D♯ just before the final E. It slides in from a half step below.');
}
lesson({
  id: 'ingredients', part: 2, ch: 6, title: 'Melody ingredients', kid: 'Scale, chords, rhythm… and the gimmick!',
  words: [['Gimmick', 'gimmick', 'the tiny catchy idea people recognize'], ['Pillar effects', 'effets piliers', '6 tools, like words for building phrases'], ['Chord notes (in a melody)', 'notes d’accord', 'melody notes taken from the chord'], ['Approach note', 'note d’approche', 'a very short note just before the main note'], ['Rhythmic repetition', 'répétition rythmique', 'a little rhythm repeated as a hook']],
  grown: 'The video’s trick: cut a chord into small pieces with FL Studio’s slice tool, then pick melody ideas from those chord notes. Approach notes are often chromatic: a half step below the target (D♯ before E), even when that note is outside the scale. That is where the chromatic scale sneaks back in.',
  beats: [
    { s: 'A great melody isn’t luck. It comes from four things: the scale, the chords, the rhythm, and the gimmick.',
      v: () => { ref().cards = Cards([{ t: 'Scale' }, { t: 'Chords' }, { t: 'Rhythm' }, { t: 'Gimmick', color: PINK }].map(c => Object.assign(c, { fs: 30 })), { cols: 4, y: 120, h: 160 }); },
      t: () => play([0, 1, 2, 3].map(k => ({ b: k, l: 0.8, n: ['A4', 'C5', 'E5', 'A5'][k], i: 'bell', el: ref().cards[k].rect })), { bpm: 100 }) },
    { s: 'The gimmick is the tiny catchy thing that makes people recognize a song in one second. For the video, it’s the most important ingredient!',
      v: () => { const R = rl({ lo: 'A4', hi: 'A5', beats: 8, y: 34, h: 316 }); ref().ev = [...riffEv(0, R), ...riffEv(4, R)]; Note('a gimmick: short, simple, repeated', 388); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Fmaj7'], { v: 0.6 }), ...drums(2)], { bpm: 92, roll: ref().roll, to: 8 }) },
    { s: 'To build melodies, the video uses six “pillar effects”. Think of them as words. Later, we’ll put the words together to make sentences.',
      v: () => { Cards(['Chord notes', 'Approach notes', 'Repetition', 'Velocity', 'Micro-timing', 'Silence'].map((t, k) => ({ t: (k + 1) + '. ' + t, fs: 20, color: [BLUE, BLUE, PINK, ORANGE, GREEN, '#8D9BB8'][k] })), { cols: 3, y: 80, h: 240 }); } },
    { s: 'Pillar 1: chord notes. Use notes from the chord that’s playing. The melody melts into the chords and sounds natural and stable.',
      v: () => { const R = rl({ lo: 'E3', hi: 'E5', beats: 8, y: 34, h: 316 }); R.chord(TRI.Am, 0, 4, { fill: BLUE, op: 0.6 }); R.chord(TRI.F, 4, 4, { fill: BLUE, op: 0.6 });
        const mel = [['A4', 0, 1, 1], ['C5', 1, 0.5, 1], ['B4', 1.5, 0.5, 0], ['A4', 2, 1, 1], ['E4', 3, 1, 1], ['F4', 4, 1, 1], ['A4', 5, 1, 1], ['G4', 6, 0.5, 0], ['C5', 6.5, 1.5, 1]];
        ref().ev = mel.map(([n, b, l, isC]) => ({ b, l, n, i: 'lead', el: R.add(n, b, l, { fill: isC ? PINK : YELLOW }) })); Note('blue = chords · pink = melody chord notes · yellow = in-between notes', 388); },
      t: () => play([...ref().ev, { b: 0, l: 4, n: TRI.Am, i: 'pad', v: 0.7 }, { b: 4, l: 4, n: TRI.F, i: 'pad', v: 0.7 }], { bpm: 92, roll: ref().roll, to: 8 }) },
    { s: 'Pillar 2: approach notes. A very short note right before the main note, from just below or just above. It adds movement and a human touch. You hear it a lot in R&B, soul and jazz.',
      tts: 'Pillar 2: approach notes. A very short note right before the main note, from just below or just above. It adds movement and a human touch. You hear it a lot in R and B, soul and jazz.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 8, y: 34, h: 316 }); const a = phrase('q1', 0).filter(e => !e.app), b = phrase('q1', 4);
        ref().ev = [...drawPhrase(R, a), ...drawPhrase(R, b)]; txt(Stage.g, R.xOf(0) + 6, 380, 'without', { class: 'snote' }); txt(Stage.g, R.xOf(4) + 6, 380, 'with an approach note (blue)', { class: 'snote' }); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Am7'], { v: 0.6 })], { bpm: 88, roll: ref().roll, to: 8 }) },
    { s: 'Pillar 3: rhythmic repetition. Repeat a cool little rhythm. You don’t need many notes: the repetition itself becomes the hook.',
      v: () => { const R = rl({ lo: 'A4', hi: 'A5', beats: 8, y: 34, h: 316, sub: 4 }); const pat = [0, 0.75, 1.5, 2, 2.75];
        ref().ev = [0, 4].flatMap(bar => pat.map((b, k) => { const n = bar ? (k % 2 ? 'A4' : 'C5') : (k % 2 ? 'C5' : 'E5'); return { b: bar + b, l: 0.5, n, i: 'lead', v: VEL[k], el: R.add(n, bar + b, 0.5, { fill: PINK }) }; }));
        Note('same rhythm twice, only 2 notes each time', 388); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Fmaj7'], { v: 0.6 }), ...drums(2)], { bpm: 92, roll: ref().roll, to: 8 }) }
  ],
  quiz: [
    { q: 'According to the video, a good melody comes from…', c: ['Scale, chords, rhythm and the gimmick', 'Volume, reverb, delay and EQ', 'Drums, bass, vocals and mixing'], a: 0, why: 'Scale, chords, rhythm, and the gimmick: the small catchy element.' },
    { q: 'An approach note is…', c: ['A very short note placed just before the main note', 'The last note of the song', 'A drum sound'], a: 0, why: 'It leans into the main note from just above or below, like a quick slide.' },
    { gen: gApproach },
    { q: 'What is a gimmick?', c: ['The small catchy element that makes a song recognizable', 'A mistake to avoid', 'A kind of chord'], a: 0, why: 'The gimmick is the tiny hook people remember.' }
  ]
});

function gHuman() {
  const robot = () => play([...phrase('q1', 0, { flat: true }), ...phrase('a1', 4, { flat: true }), { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.7 }, { b: 4, l: 4, n: V7.G7, i: 'pad', v: 0.7 }, { b: 8, l: 2, n: V7.Am7, i: 'pad', v: 0.7 }], { bpm: 92 });
  const human = () => play([...phrase('q1', 0, { human: true }), ...phrase('a1', 4, { human: true }), { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.7, sp: 0.03 }, { b: 4, l: 4, n: V7.G7, i: 'pad', v: 0.6, sp: 0.03 }, { b: 8, l: 2, n: V7.Am7, i: 'pad', v: 0.7, sp: 0.03 }], { bpm: 92 });
  return ab('Which version sounds more human and less like a robot?', human, robot, 'The human one has changing velocities, strummed chords and tiny timing moves. The robot one hits every note exactly together, at the same loudness.');
}
function velLane(R, evs) {
  const y = 300, h = 70;
  svg('rect', { x: R.gx, y, width: R.gw, height: h, rx: 6, class: 'vlbg' }, Stage.g);
  txt(Stage.g, R.gx - 8, y + 40, 'vel', { class: 'rklab', 'text-anchor': 'end', 'font-size': 12 });
  return evs.map(e => { const bar = svg('rect', { x: R.xOf(e.b) + 2, width: 8, y: y + h - e.v * (h - 8), height: e.v * (h - 8), rx: 2, class: 'vbar' }, Stage.g); e.vb = bar; return e; });
}
lesson({
  id: 'feel', part: 2, ch: 6, title: 'Velocity, micro-timing, silence', kid: 'Loud and soft, a tiny bit late, and quiet.',
  words: [['Velocity (in a melody)', 'vélocité', 'how hard each note is hit'], ['Micro-timing', 'micro-timing', 'tiny early or late moves for a human feel'], ['Strumizer', 'Strumizer (FL Studio)', 'spreads a chord’s notes like a hand rolling the keys'], ['Swing', 'swing', 'pushes every other small note late, for groove'], ['Silence', 'silence', 'rests that let the melody breathe']],
  grown: 'FL Studio tools from the video: the Randomizer (Alt+R in the piano roll, per the official manual) can vary velocities; the Strumizer (Alt+S) spreads chord notes; Main swing in the Channel rack swings the whole project, drums included.',
  beats: [
    { s: 'Pillar 4: velocity. It’s how hard each note is hit. High velocity is loud. Low velocity is soft.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 8, y: 30, h: 250 }); ref().ev = velLane(R, drawPhrase(R, [...phrase('q1', 0), ...phrase('q1', 4)])); },
      t: () => play([...ref().ev.map(e => Object.assign({}, e, { el: [e.el, e.vb] })), ...chordEvts(['Am7', 'Am7'], { v: 0.6 })], { bpm: 88, roll: ref().roll, to: 8 }) },
    { s: 'Listen: first every note at the same velocity, then with changes. Flat like a robot, then alive! Louder notes shine and add tension.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 8, y: 30, h: 250, noNums: true }); const a = phrase('q1', 0, { flat: true }), b = phrase('q1', 4); ref().ev = velLane(R, drawPhrase(R, [...a, ...b])); txt(Stage.g, R.xOf(0) + 6, 22, 'all the same', { class: 'snote small', 'text-anchor': 'start' }); txt(Stage.g, R.xOf(4) + 6, 22, 'with velocity changes', { class: 'snote small', 'text-anchor': 'start' }); },
      t: () => play([...ref().ev.map(e => Object.assign({}, e, { el: [e.el, e.vb] })), ...chordEvts(['Am7', 'Am7'], { v: 0.6 })], { bpm: 88, roll: ref().roll, to: 8 }) },
    { s: 'Pillar 5: micro-timing. Move notes a tiny bit early or late, so it sounds human and less like a computer.',
      v: () => { const R = rl({ lo: 'E3', hi: 'G4', beats: 8, y: 34, h: 316, sub: 4 }); R.chord(V7.Am7, 0, 3.5, { fill: BLUE, op: 0.8 }); V7.Am7.forEach((n, k) => R.add(n, 4 + k * 0.12, 3.5 - k * 0.12, { fill: GREEN, op: 0.85 }));
        txt(Stage.g, R.xOf(0) + 6, 380, 'exactly together', { class: 'snote' }); txt(Stage.g, R.xOf(4) + 6, 380, 'strummed (tiny delays)', { class: 'snote' }); },
      t: () => play([{ b: 0, l: 3.5, n: V7.Am7, i: 'keys' }, { b: 4, l: 3.5, n: V7.Am7, i: 'keys', sp: 0.05 }], { bpm: 80, roll: ref().roll, to: 8 }) },
    { s: 'In FL Studio, the Strumizer spreads a chord’s notes a little, like a hand rolling over the keys. You can also nudge notes by hand, or add swing to the whole project.',
      tts: 'In F L Studio, the Strumizer spreads a chord notes a little, like a hand rolling over the keys. You can also nudge notes by hand, or add swing to the whole project.',
      v: () => { const R = rl({ lo: 'E3', hi: 'G4', beats: 16, y: 34, h: 316 }); ref().ev = drawChords(R, chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { sp: 0.035 }), GREEN, 0.8); },
      t: () => play([...ref().ev.map(e => Object.assign({}, e, { i: 'keys' })), ...drums(4)], { bpm: 92, roll: ref().roll, to: 16 }) },
    { s: 'Pillar 6: silence. A melody that never stops tires the ears. Little rests let it breathe, build tension, and make the next notes hit harder.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 18, y: 34, h: 316 });
        const busy = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5].map((b, k) => ({ b, l: 0.5, n: ['A4', 'C5', 'E5', 'C5', 'B4', 'D5', 'E5', 'G5'][k % 8], i: 'lead', v: VEL[k % 7] }));
        const calm = [...phrase('q1', 8), ...phrase('a1', 12)];
        ref().ev = [...drawPhrase(R, busy, { fill: '#8D9BB8' }), ...drawPhrase(R, calm)];
        txt(Stage.g, R.xOf(0) + 6, 380, 'no breathing', { class: 'snote' }); txt(Stage.g, R.xOf(8) + 6, 380, 'with silences', { class: 'snote' }); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'G7', 'Am7', 'G7'], { v: 0.55 }), { b: 16, l: 2, n: V7.Am7, i: 'pad', v: 0.55 }], { bpm: 92, roll: ref().roll, to: 18 }) }
  ],
  quiz: [
    { q: 'High velocity makes a note…', c: ['Louder', 'Higher in pitch', 'Longer'], a: 0, why: 'Velocity is how hard the key is hit. It changes loudness (and often brightness), not the pitch.' },
    { gen: gHuman },
    { q: 'Why leave silence in a melody?', c: ['To let it breathe and make the next notes hit harder', 'Because 4/4 requires silence', 'To change the key'], a: 0, why: 'Controlled silence creates tension and gives value to the notes around it.' }
  ]
});

function gQorA() {
  const q = coin();
  const run = () => q
    ? play([...phrase('q1', 0), { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 92 })
    : play([...phrase('a1', 0), { b: 0, l: 4, n: V7.G7, i: 'pad', v: 0.6 }, { b: 4, l: 2, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 92 });
  return { q: 'Listen to this phrase. Does it sound like a question or an answer?', hear: [['Play', run]], c: ['A question: it goes up and stays open', 'An answer: it comes down and lands home'], a: q ? 0 : 1, fixed: true,
    why: q ? 'It climbs and stops on E, away from home: a question.' : 'It falls and lands on A, the home note of A minor: an answer.' };
}
lesson({
  id: 'qa', part: 2, ch: 6, title: 'Question and answer', kid: 'One phrase asks, the next one answers.',
  words: [['Phrase', 'phrase', 'a little group of notes, like a sentence'], ['Question / answer', 'question / réponse', 'one phrase asks, the next replies'], ['Ascending phrase', 'phrase ascendante', 'goes up: creates expectation'], ['Descending phrase', 'phrase descendante', 'goes down: feels like a conclusion']],
  grown: 'This matches research on real songs: a study of more than 9,000 folk songs from 32 places around the world found that phrases most often have arch or descending shapes and end on longer notes (Tierney, Russo & Patel, PNAS 2011). Falling = “finished” is not just a producer habit. The video credits part of this chapter to another YouTuber’s video.',
  beats: [
    { s: 'Now we use our words to build sentences, called phrases. The most famous trick is question and answer.',
      v: () => { Bubble(40, 90, 270, 90, 'Are we there yet?', 'left'); Bubble(330, 220, 270, 90, 'Yes, we’re home!', 'right', 'ans'); } },
    { s: 'An ascending phrase goes up. It feels like lifting off, waiting for something. Like a question: “Are we there yet?”',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 4, y: 34, h: 316 }); ref().ev = drawPhrase(R, phrase('q1', 0)); },
      t: () => play([...ref().ev, { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 88, roll: ref().roll, to: 4 }) },
    { s: 'A descending phrase goes down. It feels like relaxing and concluding. Like an answer: “Yes, we’re home.”',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 6, y: 34, h: 316 }); ref().ev = drawPhrase(R, phrase('a1', 0)); },
      t: () => play([...ref().ev, { b: 0, l: 4, n: V7.G7, i: 'pad', v: 0.6 }, { b: 4, l: 2, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 88, roll: ref().roll, to: 6 }) },
    { s: 'Put them together: question, then answer. A little musical conversation!',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 10, y: 34, h: 316 }); ref().ev = [...drawPhrase(R, phrase('q1', 0)), ...drawPhrase(R, phrase('a1', 4))]; },
      t: () => play([...ref().ev, { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.6 }, { b: 4, l: 4, n: V7.G7, i: 'pad', v: 0.6 }, { b: 8, l: 2, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 92, roll: ref().roll, to: 10 }) },
    { s: 'Give the answer some space. In the video, the answer only comes at the end of four bars, after some silence. The silence makes it shine.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 17, y: 34, h: 316 }); ref().ev = [...drawPhrase(R, phrase('q1', 0)), ...drawPhrase(R, phrase('q1', 8)), ...drawPhrase(R, phrase('a1', 12))]; Note('question · silence · question · answer', 388); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { v: 0.55 }), { b: 16, l: 2, n: V7.Am7, i: 'pad', v: 0.55 }, ...drums(4)], { bpm: 92, roll: ref().roll, to: 17 }) },
    { s: 'There are no strict rules: a falling phrase can ask a question too. Listen to songs you love and ask: which part asks, and which part answers?',
      v: () => { Cards([{ t: 'Going up', sub: 'often a question', color: PINK }, { t: 'Going down', sub: 'often an answer', color: BLUE }, { t: 'No strict rules', sub: 'trust your ears', color: YELLOW }].map(c => Object.assign(c, { fs: 26 })), { y: 110, h: 170 }); } }
  ],
  quiz: [
    { q: 'A phrase that goes up usually feels like…', c: ['A question, waiting for more', 'The end of the song', 'A drum fill'], a: 0, why: 'Rising phrases create expectation. Falling phrases feel like a conclusion.' },
    { gen: gQorA },
    { q: 'Where did the video place its answer?', c: ['At the end of the 4 bars, after some silence', 'On every beat', 'Before the question'], a: 0, why: 'He left space so the single answer would stand out.' }
  ]
});

function gTwinCousin() {
  const twin = coin();
  const run = () => play([...phrase('q1', 0), ...phrase(twin ? 'q1' : 'q2', 4), ...chordEvts(['Am7', 'Cmaj7'], { v: 0.55 })], { bpm: 92 });
  return { q: 'Listen to the two phrases. Twins or cousins?', hear: [['Play', run]], c: ['Twins: exactly the same', 'Cousins: same rhythm, different notes'], a: twin ? 0 : 1, fixed: true,
    why: twin ? 'Both phrases had the same notes and the same rhythm: twins.' : 'Same rhythm, but the second phrase used higher notes: cousins.' };
}
lesson({
  id: 'twins', part: 2, ch: 6, title: 'Twins, cousins and octaves', kid: 'Repeat it, change it, move it up or down.',
  words: [['Twin phrases', 'phrases jumelles', 'the same phrase repeated at the same spot'], ['Cousin phrases', 'phrases cousines', 'same rhythm, different notes'], ['Octave up / down', 'monter / descendre d’une octave', 'brighter and more intense / heavier and calmer'], ['Preset', 'preset', 'a ready-made sound in a synth']],
  grown: 'The video says there are really only two kinds of phrases, rising and falling. Twins, cousins and octave moves are ways to use them. Some songs have no question and answer at all, and that’s fine too.',
  beats: [
    { s: 'Twin phrases: the exact same phrase, repeated at the same spot every 2 bars. Repetition makes a melody stick in your head.',
      v: () => { const R = rl({ lo: 'G4', hi: 'G5', beats: 16, y: 34, h: 316 }); ref().ev = [...drawPhrase(R, phrase('q1', 0)), ...drawPhrase(R, phrase('q1', 8))]; Note('bar 1 and bar 3: twins', 388); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { v: 0.55 }), ...drums(4)], { bpm: 96, roll: ref().roll, to: 16 }) },
    { s: 'Cousin phrases: almost the same rhythm, but different notes. It adds variety, so the melody doesn’t get boring.',
      v: () => { const R = rl({ lo: 'G4', hi: 'A5', beats: 16, y: 34, h: 316 }); ref().ev = [...drawPhrase(R, phrase('q1', 0)), ...drawPhrase(R, phrase('q2', 8), { fill: YELLOW })]; Note('pink and yellow: same rhythm, different notes', 388); },
      t: () => play([...ref().ev, ...chordEvts(['Am7', 'Fmaj7', 'Cmaj7', 'G7'], { v: 0.55 }), ...drums(4)], { bpm: 96, roll: ref().roll, to: 16 }) },
    { s: 'Play with octaves. Move a question up an octave: brighter, more open, more intense. Move an answer down: heavier, calmer, more finished.',
      v: () => { const R = rl({ lo: 'G3', hi: 'G6', beats: 20, y: 34, h: 316, noNums: true }); ref().ev = [...drawPhrase(R, phrase('q1', 0)), ...drawPhrase(R, phrase('q1', 4, { shift: 12 }), { fill: YELLOW }), ...drawPhrase(R, phrase('a1', 8)), ...drawPhrase(R, phrase('a1', 14, { shift: -12 }), { fill: YELLOW })];
        txt(Stage.g, R.xOf(4), 380, 'question, octave up', { class: 'snote small' }); txt(Stage.g, R.xOf(14), 380, 'answer, octave down', { class: 'snote small' }); },
      t: () => play(ref().ev, { bpm: 100, roll: ref().roll, to: 20 }) },
    { s: 'You can even give the question and the answer different sounds, like two characters talking.',
      v: () => { Bubble(40, 90, 270, 90, 'lead synth asks…', 'left'); Bubble(330, 220, 270, 90, '…bell answers', 'right', 'ans'); },
      t: () => play([...phrase('q1', 0, { inst: 'lead' }), ...phrase('a1', 4, { inst: 'bell' }), { b: 0, l: 4, n: V7.Am7, i: 'pad', v: 0.55 }, { b: 4, l: 4, n: V7.G7, i: 'pad', v: 0.55 }, { b: 8, l: 2, n: V7.Am7, i: 'pad', v: 0.55 }], { bpm: 92 }) },
    { s: 'Now a mini beat that uses every idea from both videos: a 4/4 grid, a minor key, seventh chords, low roots, approach notes, velocity, silence, twins, cousins, and question and answer.',
      tts: 'Now a mini beat that uses every idea from both videos: a four four grid, a minor key, seventh chords, low roots, approach notes, velocity, silence, twins, cousins, and question and answer.',
      v: () => { const R = rl({ lo: 'E2', hi: 'G5', beats: 34, y: 34, h: 316 }); const p = miniProd();
        drawChords(R, p.ch, BLUE, 0.45); p.bass.forEach(e => { e.el = R.add(e.n, e.b, e.l, { fill: GREEN }); }); drawPhrase(R, p.mel); ref().p = p;
        Note('pink: melody · blue: chords · green: low roots', 388); },
      t: () => { const p = ref().p; return play([...p.ch, ...p.bass, ...p.mel, ...p.dr, { b: 32, l: 3, n: V7.Am7, i: 'pad', v: 0.7 }, { b: 32, l: 3, n: 'A2', i: 'bass' }, { b: 32, l: 0.5, dr: 'kick' }], { bpm: 90, roll: ref().roll, to: 34 }); } },
    { s: 'You did it! The grid, notes, scales, degrees, chords, progressions and melodies. Now open your music app and try one idea at a time.',
      v: () => { txt(Stage.g, 320, 80, 'You did it!', { class: 'bigkey', 'text-anchor': 'middle' }); Cards(['Grid', 'Notes', 'Scales', 'Chords', 'Progressions', 'Melodies'].map((t, k) => ({ t, sub: 'chapter ' + (k + 1), fs: 22, color: NOTE_COL[[0, 2, 4, 5, 9, 11][k]] })), { cols: 3, y: 120, h: 220 }); },
      t: () => play([{ b: 0, l: 0.5, n: 'A4', i: 'bell' }, { b: 0.5, l: 0.5, n: 'C5', i: 'bell' }, { b: 1, l: 0.5, n: 'E5', i: 'bell' }, { b: 1.5, l: 2, n: 'A5', i: 'bell' }, { b: 1.5, l: 3, n: V7.Am7, i: 'pad', v: 0.6 }], { bpm: 100 }) }
  ],
  quiz: [
    { q: 'Twin phrases are…', c: ['The same phrase repeated at the same spot', 'Two phrases with different rhythms', 'Two songs in the same key'], a: 0, why: 'Twins repeat exactly, in a symmetric pattern (for example every 2 bars).' },
    { q: 'Cousin phrases have…', c: ['Almost the same rhythm, but different notes', 'Exactly the same notes and rhythm', 'No rhythm at all'], a: 0, why: 'The same rhythm keeps them related. New notes add variation.' },
    { q: 'Moving a phrase one octave up usually makes it feel…', c: ['Brighter and more intense', 'Heavier and calmer', 'Slower'], a: 0, why: 'Higher = brighter and more open. Lower = heavier and more settled.' },
    { gen: gTwinCousin }
  ]
});
