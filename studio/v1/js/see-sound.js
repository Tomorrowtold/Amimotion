// The explainer's sound. Fetched only after the visitor's first tap, click or key. No audio files: every sound is made here,
// and every sound follows the scroll, so you hear what the picture does.
//   1  Sodium: the hall's room tone and the 100 Hz buzz of one-colour lamps, a low drone in D.
//   2  The buzz dies. A tag's pulse ticks, very short and high. Three anchors answer, one note each (D, F#, A) as their
//      colours arrive; when they agree, the trolley turns amber and the chord rings as a bell.
//   3  Full light: a wide pad opens like a filter sweep while the light pours in from the roof.
//   4  The map: the pad lifts an octave and thins to air; each answer arrives with a soft chime.
window.SeeSound = function (AC) {
  const sr = AC.sampleRate, now = () => AC.currentTime;
  const master = AC.createGain(), comp = AC.createDynamicsCompressor();
  master.gain.value = 0; comp.threshold.value = -18; comp.knee.value = 16; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .25;
  master.connect(comp).connect(AC.destination);

  // the hall: a long, dark echo, a different take for each ear
  const irN = Math.floor(sr * 4.2), ir = AC.createBuffer(2, irN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < irN; i++) { const t = i / irN; lp += ((Math.random() * 2 - 1) - lp) * (.5 - .44 * t); d[i] = lp * Math.pow(1 - t, 3) * Math.min(1, i / (sr * .02)); } }
  const hall = AC.createConvolver(), wet = AC.createGain(); hall.buffer = ir; wet.gain.value = .9; hall.connect(wet).connect(master);
  const bus = (vol, send, pan) => { const g = AC.createGain(), s = AC.createGain(); g.gain.value = vol; s.gain.value = send; let o = g; if (pan && AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = pan; g.connect(p); o = p; } o.connect(master); o.connect(s).connect(hall); return g; };
  const glide = (param, v, tc) => param.setTargetAtTime(v, now(), tc || .25);

  // room tone: brown noise, low
  const nN = sr * 4, noise = AC.createBuffer(2, nN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = noise.getChannelData(ch); let l = 0; for (let i = 0; i < nN; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } }
  const nsrc = AC.createBufferSource(), nlp = AC.createBiquadFilter(), room = AC.createGain();
  nsrc.buffer = noise; nsrc.loop = true; nlp.type = 'lowpass'; nlp.frequency.value = 380; room.gain.value = 0; nsrc.connect(nlp).connect(room).connect(master); nsrc.start();

  // sodium buzz: 100 Hz and its harmonics through a narrow band, with a slow beat, plus a D drone under it
  const buzz = AC.createGain(); buzz.gain.value = 0; buzz.connect(bus(1, .25));
  const bbp = AC.createBiquadFilter(); bbp.type = 'bandpass'; bbp.frequency.value = 300; bbp.Q.value = .8; bbp.connect(buzz);
  [[100, .5, 'sawtooth'], [100.6, .35, 'sawtooth'], [200, .18, 'square'], [73.4, .6, 'sine'], [36.7, .5, 'sine']].forEach(([f, v, ty]) => {
    const o = AC.createOscillator(), g = AC.createGain(); o.type = ty; o.frequency.value = f; g.gain.value = v * (ty === 'sine' ? 1 : .25); o.connect(g).connect(f < 80 ? buzz : bbp); o.start();
  });

  // the three anchors: one sustained note each, panned left, centre, right, with a slow shimmer
  const ANCH = [293.66, 369.99, 440];
  const anch = ANCH.map((f, i) => {
    const g = AC.createGain(), trem = AC.createGain(); g.gain.value = 0; trem.gain.value = .75; g.connect(trem).connect(bus(1, .7, (i - 1) * .6));
    [f, f * 1.003, f * 2].forEach((ff, j) => { const o = AC.createOscillator(), og = AC.createGain(); o.type = j === 2 ? 'sine' : 'triangle'; o.frequency.value = ff; og.gain.value = j === 2 ? .12 : .3; o.connect(og).connect(g); o.start(); });
    const lfo = AC.createOscillator(), lg = AC.createGain(); lfo.frequency.value = .3 + i * .11; lg.gain.value = .25; lfo.connect(lg).connect(trem.gain); lfo.start();
    return g;
  });

  // the pad: detuned saws in D major through a lowpass that opens with the light
  const pad = AC.createGain(), plp = AC.createBiquadFilter(); pad.gain.value = 0; plp.type = 'lowpass'; plp.frequency.value = 200; plp.Q.value = 2.5;
  plp.connect(pad).connect(bus(1, .8));
  const padOsc = [];
  [146.83, 220, 293.66, 369.99, 440, 554.37].forEach((f, i) => [-7, 7].forEach(dt => { const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = dt + (i % 2 ? 3 : -3); g.gain.value = .045; o.connect(g).connect(plp); o.start(); padOsc.push(o); }));

  // air: high filtered noise for the map
  const air = AC.createGain(), ahp = AC.createBiquadFilter(), asrc = AC.createBufferSource();
  asrc.buffer = noise; asrc.loop = true; ahp.type = 'bandpass'; ahp.frequency.value = 5200; ahp.Q.value = .6; air.gain.value = 0; asrc.connect(ahp).connect(air).connect(bus(1, .9)); asrc.start(0, 1.3);

  // one-shots
  const bell = (f, vol, pan, len) => {
    const t = now(), out = bus(vol, .9, pan);
    [[1, 1], [2.76, .35], [5.4, .12], [8.9, .05]].forEach(([m, v]) => { const o = AC.createOscillator(), e = AC.createGain(); o.frequency.value = f * m; e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(v, t + .006); e.gain.exponentialRampToValueAtTime(.0001, t + (len || 3) / m ** .4); o.connect(e).connect(out); o.start(t); o.stop(t + (len || 3) + .1); });
  };
  const tick = (vol, pan) => {
    const t = now(), s = AC.createBufferSource(), f = AC.createBiquadFilter(), e = AC.createGain(), out = bus(vol, .35, pan);
    s.buffer = noise; f.type = 'highpass'; f.frequency.value = 6000; e.gain.setValueAtTime(1, t); e.gain.exponentialRampToValueAtTime(.0001, t + .018);
    s.connect(f).connect(e).connect(out); s.start(t, Math.random() * 3); s.stop(t + .05);
    const o = AC.createOscillator(), oe = AC.createGain(); o.frequency.setValueAtTime(3800, t); o.frequency.exponentialRampToValueAtTime(1900, t + .04);
    oe.gain.setValueAtTime(.25, t); oe.gain.exponentialRampToValueAtTime(.0001, t + .05); o.connect(oe).connect(out); o.start(t); o.stop(t + .07);
  };

  // the tag's pulse: while scroll 2's pulse is live, a tick every 0.7 s, answered by each lit anchor a beat later
  let pulseOn = 0, lit = [0, 0, 0], timer = 0;
  const pulse = () => {
    if (!on || !inRoom || pulseOn < .05) return;
    tick(.22 * pulseOn, 0);
    lit.forEach((v, i) => { if (v > .5) setTimeout(() => tick(.08 * v, (i - 1) * .7), 60 + i * 35); });
  };

  let on = false, inRoom = false, seg = 0, last = { s: 0, t: 0 }, rang = false, chimed = [0, 0, 0], swell = false;
  const level = () => glide(master.gain, on && inRoom ? .7 : 0, .15);
  const cross = (s, t, a) => last.s === s && last.t < a && t >= a;

  return {
    set(v) { on = v; if (v) AC.resume(); level(); if (v && !timer) timer = setInterval(pulse, 700); },
    room(v) { inRoom = v; level(); },
    seg(s) {
      if (s === seg) return;
      if (s < seg) { rang = false; chimed = [0, 0, 0]; swell = false; }   // scrolling back lets the moments happen again
      seg = s;
    },
    time(s, t) {
      const R = (a, b) => { const x = Math.min(1, Math.max(0, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
      // beds follow the same timeline as the light in compose.py
      const sod = s === 1 ? .6 + .4 * R(0, .5) : s === 2 ? 1 - R(0, .35) : 0;
      glide(buzz.gain, .09 * sod); glide(room.gain, s === 1 ? .14 : s === 2 ? .06 + .08 * (1 - R(0, .35)) : .1);
      pulseOn = s === 2 ? R(.25, .4) : s === 3 ? 1 - R(0, .3) : 0;
      lit = s === 2 ? [R(.35, .55), R(.5, .7), R(.65, .85)] : s === 3 ? [1, 1, 1].map(v => v * (1 - R(0, .3))) : [0, 0, 0];
      lit.forEach((v, i) => glide(anch[i].gain, .05 * v, .15));
      const p = s === 3 ? R(0, .6) : s === 4 ? 1 : 0;
      glide(pad.gain, (s === 3 ? .07 : .05) * p, .4);
      glide(plp.frequency, s === 3 ? 200 + 2600 * R(0, .65) : s === 4 ? 1800 - 900 * R(0, 1) : 200, .3);
      padOsc.forEach((o, i) => glide(o.detune, (i % 2 ? 7 : -7) + (s === 4 ? 1200 * R(.1, .9) * (i % 3 === 0 ? 0 : 1) : 0), .6));
      glide(air.gain, s === 4 ? .05 * R(0, .5) : s === 3 ? .02 * R(.4, 1) : 0, .5);
      // moments, only going forward
      if (on && inRoom) {
        if (!rang && cross(2, t, .86)) { rang = true; [293.66, 369.99, 440, 587.33].forEach((f, i) => setTimeout(() => bell(f, .07, (i - 1.5) * .4, 4), i * 70)); bell(146.83, .08, 0, 5); }
        if (!swell && cross(3, t, .05)) { swell = true; bell(73.42, .06, 0, 6); }
        [.36, .52, .68].forEach((a, i) => { if (!chimed[i] && cross(4, t, a)) { chimed[i] = 1; bell([880, 1108.73, 1318.51][i], .05, (i - 1) * .5, 2.4); } });
      }
      last = { s, t };
    }
  };
};
