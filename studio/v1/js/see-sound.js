// The sound of "Can you see it?". Fetched only after the visitor's first touch, and there are no audio files:
// every sound is made here. The idea is that you hear the place the picture shows.
//   The white model is silent, only air moving past as the camera backs away.
//   When the floor turns real, the hall arrives: room tone, and the 100 Hz hum of the high-bay lights.
//   The lights go off in three banks, far to near. Each breaker takes a third of the hum with it.
//   In the quiet, every tag answers from where it stands: left or right, near and dry or far and echoing.
// One reverb models the hall, so every sound sits in the same room.
window.SeeSound = function (AC) {
  AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const sr = AC.sampleRate;
  const master = AC.createGain(), comp = AC.createDynamicsCompressor(), hall = AC.createConvolver(), hallG = AC.createGain();
  master.gain.value = 0; comp.threshold.value = -20; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .22;
  master.connect(comp).connect(AC.destination);

  // the hall's echo: 2.8 s of noise that decays and darkens, a different take for each ear
  const irN = Math.floor(sr * 2.8), ir = AC.createBuffer(2, irN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < irN; i++) { const t = i / irN; lp += ((Math.random() * 2 - 1) - lp) * (.55 - .47 * t); d[i] = lp * Math.pow(1 - t, 3.4) * Math.min(1, i / (sr * .01)); } }
  hall.buffer = ir; hallG.gain.value = .85; hall.connect(hallG).connect(master);

  // brown noise, two ears, for the room and for air
  const nN = sr * 3, noise = AC.createBuffer(2, nN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = noise.getChannelData(ch); let l = 0; for (let i = 0; i < nN; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } }
  const bed = (type, freq, q) => { const src = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); src.buffer = noise; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0; src.connect(f).connect(g).connect(master); src.start(); return { g: g.gain, f: f.frequency }; };
  const room = bed('lowpass', 420, .4), air = bed('bandpass', 700, .9);
  const hum = AC.createGain(); hum.gain.value = 0; hum.connect(master);
  [[100, .5], [200, .2], [300, .07]].forEach(([f, v]) => { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; g.gain.value = v; o.connect(g).connect(hum); o.start(); });

  // every one-off sound is placed: pan from where it is on screen, and distance as level, dullness and how much hall it gets
  const place = (node, vol, at) => {
    const pan = at ? Math.max(-1, Math.min(1, (at[0] - .5) * 1.7)) : 0, far = at ? Math.max(0, Math.min(1, 1.15 - at[1] * 1.3)) : .3;
    const lp = AC.createBiquadFilter(), g = AC.createGain(), send = AC.createGain(); lp.type = 'lowpass'; lp.frequency.value = 11000 - 7500 * far; g.gain.value = vol * (1 - .45 * far); send.gain.value = .22 + .7 * far;
    node.connect(lp).connect(g); let o = g; if (AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = pan; g.connect(p); o = p; }
    o.connect(master); o.connect(send).connect(hall);
  };
  const tone = (f, len, vol, at, type, f2) => { const o = AC.createOscillator(), e = AC.createGain(), t = AC.currentTime; o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(1, t + .006); e.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(e); place(e, vol, at); o.start(t); o.stop(t + len + .05); };
  const tick = (freq, len, vol, at) => { const src = AC.createBufferSource(), f = AC.createBiquadFilter(), e = AC.createGain(), t = AC.currentTime; src.buffer = noise; f.type = 'highpass'; f.frequency.value = freq; e.gain.setValueAtTime(1, t); e.gain.exponentialRampToValueAtTime(.0001, t + len); src.connect(f).connect(e); place(e, vol, at); src.start(t, Math.random() * 2); src.stop(t + len + .05); };

  const SCALE = [1047, 1175, 1319, 1568, 1760, 2093];   // the tags answer in one key, so a floor of them is a chord, not noise
  let was = null, lastPing = 0;
  return {
    set(on) { if (on) AC.resume(); master.gain.setTargetAtTime(on ? .62 : 0, AC.currentTime, .08); was = null; },
    // st is where the story is now. A sound plays when the scroll carries the story forward past its moment; the beds follow it both ways.
    hear(st) {
      const p0 = was || st, t = AC.currentTime, here = st.near ? 1 : 0; was = st;
      room.g.setTargetAtTime((.018 + .15 * (1 - st.dip)) * st.real * here, t, .15);
      hum.gain.setTargetAtTime(.045 * st.real * (1 - st.bank / 3) * here, t, .05);
      const moving = (st.fly > 0 && st.fly < 1) || (st.rise > 0 && st.rise < 1);
      air.g.setTargetAtTime(moving ? Math.min(.24, st.vel * 30) : 0, t, .09);
      air.f.setTargetAtTime(st.rise > 0 ? 380 + 1500 * st.rise : 1900 - 1300 * st.fly, t, .1);
      if (st.real > .03 && p0.real <= .03) { tone(110, 2.6, .13, [.5, .2]); tone(165, 2.6, .06, [.5, .2]); }                 // the world arrives
      if (st.bank > p0.bank) { const at = [.5, .25 * st.bank]; tone(88 - 9 * st.bank, .42, .55, at, 'sine', 38); tick(650, .07, .32, at); }   // a breaker, each one nearer
      if (st.lit > p0.lit && st.litAt && performance.now() - lastPing > 34) { lastPing = performance.now(); tone(SCALE[st.lit % SCALE.length], .7, .055, st.litAt); }
      if (st.amber > p0.amber && st.amberAt) tone([392, 330][st.amber % 2], 1.1, .1, st.amberAt, 'triangle');
      if (st.hero && !p0.hero) { tone(196, 2.0, .16, st.heroAt, 'triangle'); tone(98, 2.0, .09, st.heroAt); }
      if (st.mins > p0.mins && st.mins % 3 === 0) tick(3400, .016, .05, st.heroAt);
      if (st.typed > p0.typed) tick(2500, .028, .15, [.5, .95]);
      if (st.told && !p0.told) { tone(587, 1.5, .11, [.5, .5]); setTimeout(() => tone(880, 2.0, .11, st.heroAt), 140); }
      // scroll 1, the game: each trolley's light comes on with a soft note of one chord; the light under the cursor answers with
      // the faintest tick; a miss is a muted knock where it was picked; the hit (or the answer) is the chord resolving
      if (st.bankOff > p0.bankOff) { const at = [.5, .2 + .25 * st.bankOff]; tone(84 - 8 * st.bankOff, .5, .5, at, 'sine', 36); tick(620, .08, .3, at); }   // a breaker for each bank of lights
      if (st.pkLit > p0.pkLit && st.pickAt) tone(SCALE[st.pkLit % SCALE.length] / 2, 1.1, .045, st.pickAt);
      if (st.hotN > p0.hotN && st.pickAt) tick(5200, .014, .05, st.pickAt);
      const g = st.guess - p0.guess;
      if (g > 0 && g < 50) { tick(1100, .06, .22, st.pickAt); tone(150, .45, .14, st.pickAt, 'sine', 96); }
      if (g >= 50) { const at = st.heroAt; [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 1.8 - i * .2, g >= 100 ? .09 : .06, at, i ? 'sine' : 'triangle'), i * 85)); tone(131, 2.2, .1, at); }
    }
  };
};
