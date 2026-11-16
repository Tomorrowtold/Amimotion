// The explainer's sound. Fetched only after the visitor's first tap, click or key; there are no audio files, every sound is made here.
// The idea: you hear the place the picture shows. A hall's room tone and the hum of its lights; each beat arrives with one soft note
// of the same chord; a tab change is a quiet click and a note; the answer to the question resolves the chord.
window.SeeSound = function (AC) {
  const sr = AC.sampleRate, master = AC.createGain(), comp = AC.createDynamicsCompressor(), hall = AC.createConvolver(), hallG = AC.createGain();
  master.gain.value = 0; comp.threshold.value = -20; comp.knee.value = 18; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .22;
  master.connect(comp).connect(AC.destination);
  // the hall's echo: 2.6 s of noise that decays and darkens, a different take for each ear
  const irN = Math.floor(sr * 2.6), ir = AC.createBuffer(2, irN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); let lp = 0; for (let i = 0; i < irN; i++) { const t = i / irN; lp += ((Math.random() * 2 - 1) - lp) * (.55 - .47 * t); d[i] = lp * Math.pow(1 - t, 3.4) * Math.min(1, i / (sr * .01)); } }
  hall.buffer = ir; hallG.gain.value = .8; hall.connect(hallG).connect(master);
  // brown noise for the room
  const nN = sr * 3, noise = AC.createBuffer(2, nN, sr);
  for (let ch = 0; ch < 2; ch++) { const d = noise.getChannelData(ch); let l = 0; for (let i = 0; i < nN; i++) { l = (l + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } }
  const src = AC.createBufferSource(), lpf = AC.createBiquadFilter(), room = AC.createGain(); src.buffer = noise; src.loop = true; lpf.type = 'lowpass'; lpf.frequency.value = 420; room.gain.value = 0; src.connect(lpf).connect(room).connect(master); src.start();
  const hum = AC.createGain(); hum.gain.value = 0; hum.connect(master);
  [[100, .5], [200, .2], [300, .07]].forEach(([f, v]) => { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; g.gain.value = v; o.connect(g).connect(hum); o.start(); });
  const out = (node, vol, pan) => { const g = AC.createGain(), send = AC.createGain(); g.gain.value = vol; send.gain.value = .45; node.connect(g); let o = g; if (AC.createStereoPanner) { const p = AC.createStereoPanner(); p.pan.value = pan || 0; g.connect(p); o = p; } o.connect(master); o.connect(send).connect(hall); };
  const tone = (f, len, vol, pan, type) => { const o = AC.createOscillator(), e = AC.createGain(), t = AC.currentTime; o.type = type || 'sine'; o.frequency.value = f; e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(1, t + .008); e.gain.exponentialRampToValueAtTime(.0001, t + len); o.connect(e); out(e, vol, pan); o.start(t); o.stop(t + len + .05); };
  const click = (vol, pan) => { const s = AC.createBufferSource(), f = AC.createBiquadFilter(), e = AC.createGain(), t = AC.currentTime; s.buffer = noise; f.type = 'highpass'; f.frequency.value = 2600; e.gain.setValueAtTime(1, t); e.gain.exponentialRampToValueAtTime(.0001, t + .03); s.connect(f).connect(e); out(e, vol, pan); s.start(t, Math.random() * 2); s.stop(t + .08); };
  const CHORD = [392, 494, 587, 740, 880];   // one key for the whole section, so every note belongs to the same chord
  let on = false, inRoom = false;
  const beds = () => { const t = AC.currentTime, k = on && inRoom ? 1 : 0; room.gain.setTargetAtTime(.12 * k, t, .4); hum.gain.setTargetAtTime(.03 * k, t, .4); };
  return {
    set(v) { on = v; if (v) AC.resume(); master.gain.setTargetAtTime(v ? .6 : 0, AC.currentTime, .08); beds(); },
    room(v) { inRoom = v; beds(); },
    play(what, arg) {
      if (!on) return;
      if (what === 'beat') { tone(CHORD[arg % CHORD.length] / 2, 2.2, .08, 0, 'triangle'); tone(CHORD[(arg + 2) % CHORD.length], 1.6, .035); }
      if (what === 'cat') { click(.12, (arg - 2) * .3); tone(CHORD[arg % CHORD.length], 1.1, .05, (arg - 2) * .3); }
      if (what === 'told') { [392, 494, 587, 784].forEach((f, i) => setTimeout(() => tone(f, 1.9 - i * .2, .07, 0, i ? 'sine' : 'triangle'), i * 90)); tone(98, 2.2, .08); }
    }
  };
};
