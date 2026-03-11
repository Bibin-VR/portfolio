/**
 * AudioEngine — Soothing sci-fi Web Audio API synthesizer.
 * Warm sine chimes, glassy frequency sweeps, pentatonic boot sequence.
 */

let _ctx: AudioContext | null = null;
let _muted = false;

// Pre-baked 2-second pink-noise buffer — generated ONCE on first unlock,
// reused for every click and the background ambient. Zero per-click allocation.
let _pinkBuf: AudioBuffer | null = null;

// Background ambient refs — held so setMuted can smoothly fade without stopping nodes
let _bgMaster: GainNode | null = null;
let _bgRunning = false;
const BG_GAIN = 0.013;

export function getMuted() { return _muted; }
export function setMuted(v: boolean) {
  _muted = v;
  // Smoothly silence / restore background without stopping oscillators
  if (_bgMaster && _ctx) {
    const now = _ctx.currentTime;
    _bgMaster.gain.cancelScheduledValues(now);
    _bgMaster.gain.setValueAtTime(_bgMaster.gain.value, now);
    _bgMaster.gain.linearRampToValueAtTime(v ? 0 : BG_GAIN, now + 0.35);
  }
}
export function toggleMuted() { setMuted(!_muted); return _muted; }

function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

// Bake a 2-second pink-noise buffer once, cache in _pinkBuf.
// Paul Kellett's method — smooth spectral shape, no harsh transients.
function _ensurePinkBuf(): void {
  if (_pinkBuf || !_ctx) return;
  const sr = _ctx.sampleRate;
  const buf = _ctx.createBuffer(1, sr * 2, sr);
  const d = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
    d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.12; b6=w*0.115926;
  }
  _pinkBuf = buf;
}

// Unlock AudioContext on first user gesture.
// Plays a silent 1-frame buffer (cross-browser unlock), then bakes the
// shared noise buffer and starts the persistent background ambient.
export function unlockAudio(): void {
  try {
    const ctx = getCtx();
    const silentBuf = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = silentBuf;
    src.connect(ctx.destination);
    src.start(0);
    ctx.resume().then(() => {
      _ensurePinkBuf();
      _startBgIfNeeded();
    }).catch(() => {});
  } catch (_) {}
}

// ── Click — smooth sci-fi flow ──────────────────────────────────────────
// Reuses the pre-baked _pinkBuf — zero per-click buffer allocation.
// Sound: pink-noise whoosh through a rising bandpass + soft sine glide.
export function playClick() {
  if (_muted || !_pinkBuf) return;
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const dur = 0.20;

    // Layer 1: noise whoosh — random offset into the pre-baked buffer
    // so consecutive clicks never sound identical
    const maxOffset = Math.max(0, _pinkBuf.duration - dur - 0.02);
    const offset = Math.random() * maxOffset;

    const noise = ctx.createBufferSource();
    noise.buffer = _pinkBuf;
    noise.loop = false;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.6;
    bp.frequency.setValueAtTime(120, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + dur * 0.78);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, t);
    noiseGain.gain.linearRampToValueAtTime(0.026, t + 0.011); // soft attack
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(bp); bp.connect(noiseGain); noiseGain.connect(ctx.destination);
    noise.start(t, offset, dur + 0.02);

    // Layer 2: sine glide — upward tonal shimmer
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(175, t);
    osc.frequency.exponentialRampToValueAtTime(560, t + dur * 0.72);
    oscGain.gain.setValueAtTime(0, t);
    oscGain.gain.linearRampToValueAtTime(0.030, t + 0.010);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(t); osc.stop(t + dur + 0.01);
  } catch (_) { /* silent fail */ }
}

// ── Hover — whisper-quiet 528 Hz sine (solfège Mi) ──────────────────────
export function playHover() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = 528;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.022, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
    osc.start(t);
    osc.stop(t + 0.07);
  } catch (_) { /* silent fail */ }
}

// ── Background ambient — persistent pink-noise breath ─────────────────────
// Reuses _pinkBuf. Gain ~0.013 — barely perceptible, just enough texture.
// Keeps AudioContext 'running' so it can't re-suspend between interactions.
// setMuted() fades _bgMaster gain without stopping nodes — no restart glitch.
function _startBgIfNeeded(): void {
  if (_bgRunning || _muted || !_ctx || !_pinkBuf) return;
  const ctx = _ctx;
  const t = ctx.currentTime;

  const src = ctx.createBufferSource();
  src.buffer = _pinkBuf;
  src.loop = true;
  // Tiny playback-rate offset makes the loop seam inaudible
  src.playbackRate.value = 0.998 + Math.random() * 0.004;

  // Lowpass at 300 Hz — removes all harshness, leaves only deep texture
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 300;
  lp.Q.value = 0.4;

  // Extremely slow LFO (0.05 Hz ≈20 s cycle) breathes the filter slightly
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 40; // ±40 Hz around 300
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, t);
  master.gain.linearRampToValueAtTime(BG_GAIN, t + 5.0); // very slow fade-in

  src.connect(lp); lp.connect(master); master.connect(ctx.destination);
  src.start();

  _bgMaster = master;
  _bgRunning = true;

  src.onended = () => {
    _bgRunning = false;
    // Auto-restart if something killed it unexpectedly
    if (!_muted && _ctx?.state === 'running') _startBgIfNeeded();
  };
}

export function startBgAmbient() {
  if (_muted || _bgRunning) return;
  try {
    const ctx = getCtx();
    if (ctx.state === 'running' && _pinkBuf) {
      _startBgIfNeeded();
    } else {
      const onState = () => {
        if (ctx.state === 'running') {
          ctx.removeEventListener('statechange', onState);
          _ensurePinkBuf();
          _startBgIfNeeded();
        }
      };
      ctx.addEventListener('statechange', onState);
    }
  } catch (_) {}
}

export function stopBgAmbient() {
  if (!_bgMaster || !_ctx) return;
  const now = _ctx.currentTime;
  _bgMaster.gain.cancelScheduledValues(now);
  _bgMaster.gain.setValueAtTime(_bgMaster.gain.value, now);
  _bgMaster.gain.linearRampToValueAtTime(0, now + 1.2);
  setTimeout(() => { _bgRunning = false; _bgMaster = null; }, 1300);
}

// Stops all running audio immediately — called on page hide / tab switch.
export function stopAllAudio() {
  try {
    // Kill bg ambient instantly
    if (_bgMaster && _ctx) {
      const now = _ctx.currentTime;
      _bgMaster.gain.cancelScheduledValues(now);
      _bgMaster.gain.setValueAtTime(0, now);
      _bgRunning = false;
      _bgMaster = null;
    }
    // Kill scroll engine instantly
    if (_scrollEndTimer) { clearTimeout(_scrollEndTimer); _scrollEndTimer = null; }
    if (_scrollEngine) { _scrollEngine.stop(); }
    // Kill boot ambient
    stopBootAmbient();
    // Suspend the AudioContext so the OS releases audio hardware
    _ctx?.suspend();
  } catch (_) {}
} — continuous warp-drive engine (persistent, not discrete) ──────
// Fades in when scrolling starts, fades out 150 ms after last scroll event.
// Sound: two detuned sawtooths through a slowly sweeping bandpass +
//        a low sub-sine for body = spaceship engine / data-stream feel.
interface ScrollEngine {
  masterGain: GainNode;
  filterFreq: AudioParam;
  stop: () => void;
}
let _scrollEngine: ScrollEngine | null = null;
let _scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

export function playScroll() {
  if (_muted) { _teardownScrollEngine(); return; }

  const ctx = getCtx();
  const now = ctx.currentTime;

  // ── Start engine if not running ───────────────────────────────────────
  if (!_scrollEngine) {
    try {
      // Sawtooth pair — slightly detuned for that phasing chorus texture
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      // Sub sine for body
      const sub  = ctx.createOscillator();

      const filter = ctx.createBiquadFilter();
      const masterGain = ctx.createGain();

      osc1.connect(filter); osc2.connect(filter);
      sub.connect(masterGain);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.type = 'sawtooth'; osc1.frequency.value = 72;
      osc2.type = 'sawtooth'; osc2.frequency.value = 75.4; // +3.4 Hz detune
      sub.type  = 'sine';    sub.frequency.value  = 36;

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(280, now);
      filter.Q.value = 3.5;

      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.055, now + 0.12); // soft fade-in

      osc1.start(); osc2.start(); sub.start();

      // Slow filter sweep loop — creates organic warp movement
      const sweepFilter = () => {
        if (!_scrollEngine) return;
        const n = ctx.currentTime;
        filter.frequency.setValueAtTime(filter.frequency.value, n);
        filter.frequency.linearRampToValueAtTime(180 + Math.random() * 520, n + 0.9);
        setTimeout(sweepFilter, 900);
      };
      sweepFilter();

      _scrollEngine = {
        masterGain,
        filterFreq: filter.frequency,
        stop: () => {
          try {
            const n = ctx.currentTime;
            masterGain.gain.setValueAtTime(masterGain.gain.value, n);
            masterGain.gain.linearRampToValueAtTime(0, n + 0.28); // soft fade-out
            setTimeout(() => {
              try { osc1.stop(); osc2.stop(); sub.stop(); } catch (_) {}
              _scrollEngine = null;
            }, 350);
          } catch (_) {}
        },
      };
    } catch (_) { /* silent fail */ }
  } else {
    // Engine already running — keep gain from decaying
    _scrollEngine.masterGain.gain.cancelScheduledValues(now);
    _scrollEngine.masterGain.gain.setValueAtTime(_scrollEngine.masterGain.gain.value, now);
    _scrollEngine.masterGain.gain.linearRampToValueAtTime(0.055, now + 0.05);
  }

  // ── Debounce scroll-end: stop engine 150 ms after last event ─────────────
  if (_scrollEndTimer) clearTimeout(_scrollEndTimer);
  _scrollEndTimer = setTimeout(() => {
    _scrollEngine?.stop();
    _scrollEndTimer = null;
  }, 150);
}

function _teardownScrollEngine() {
  if (_scrollEndTimer) { clearTimeout(_scrollEndTimer); _scrollEndTimer = null; }
  _scrollEngine?.stop();
}

// ── Boot sequence — pentatonic ascending sine arpeggio ───────────────────
const C_PENTATONIC = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

export function playBoot(step: number, totalSteps: number) {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const idx = Math.min(
      Math.floor((step / Math.max(totalSteps - 1, 1)) * (C_PENTATONIC.length - 1)),
      C_PENTATONIC.length - 1
    );
    const freq = C_PENTATONIC[idx];
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);

    osc.start(t);
    osc.stop(t + 0.45);
  } catch (_) { /* silent fail */ }
}

// ── Success — warm C major ascending arpeggio ─────────────────────────────
export function playSuccess() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.55);
    });
  } catch (_) { /* silent fail */ }
}

// ── Boot ambient — layered drone that plays during the loading screen ──────
// Three layers:
//   1. Sub-bass sine drone at 55 Hz (deep rumble)
//   2. Slowly LFO-modulated mid sine at 110 Hz (pulsing heartbeat)
//   3. Periodic high-frequency sweep (scanner ping every ~1.4 s)
let _ambientNodes: { stop: () => void }[] = [];
let _ambientPending = false; // true while waiting for suspended ctx to resume

export function playBootAmbient() {
  if (_muted) return;
  try {
    stopBootAmbient(); // clear any existing
    const ctx = getCtx();

    const startAmbient = () => {
      _ambientPending = false;
      const t = ctx.currentTime;

    // ── Layer 1: deep sub drone ──────────────────────────────────────────
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.type = 'sine';
    subOsc.frequency.value = 55;
    subGain.gain.setValueAtTime(0, t);
    subGain.gain.linearRampToValueAtTime(0.09, t + 1.2);
    subOsc.start(t);

    // ── Layer 2: pulsing LFO-modulated mid sine ──────────────────────────
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.connect(lfoGain);
    lfo.type = 'sine';
    lfo.frequency.value = 0.35;     // 0.35 Hz — slow pulse
    lfoGain.gain.value = 0.025;

    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    lfoGain.connect(midGain.gain);  // LFO modulates gain
    midOsc.connect(midGain);
    midGain.connect(ctx.destination);
    midOsc.type = 'sine';
    midOsc.frequency.value = 110;
    midGain.gain.setValueAtTime(0, t);
    midGain.gain.linearRampToValueAtTime(0.035, t + 0.8);
    midOsc.start(t);
    lfo.start(t);

    // ── Layer 3: periodic scanner ping ──────────────────────────────────
    let pingActive = true;
    function schedulePing(delay: number) {
      if (!pingActive) return;
      const pt = ctx.currentTime + delay;
      const pingOsc = ctx.createOscillator();
      const pingFilter = ctx.createBiquadFilter();
      const pingGain = ctx.createGain();
      pingOsc.connect(pingFilter);
      pingFilter.connect(pingGain);
      pingGain.connect(ctx.destination);

      pingFilter.type = 'bandpass';
      pingFilter.frequency.setValueAtTime(900, pt);
      pingFilter.Q.value = 12;

      pingOsc.type = 'sine';
      pingOsc.frequency.setValueAtTime(320, pt);
      pingOsc.frequency.linearRampToValueAtTime(1800, pt + 0.55);

      pingGain.gain.setValueAtTime(0, pt);
      pingGain.gain.linearRampToValueAtTime(0.055, pt + 0.04);
      pingGain.gain.exponentialRampToValueAtTime(0.0001, pt + 0.7);

      pingOsc.start(pt);
      pingOsc.stop(pt + 0.75);

      if (pingActive) setTimeout(() => schedulePing(1.35), delay * 1000 + 200);
    }
    schedulePing(0.6);

    _ambientNodes = [{
      stop: () => {
        pingActive = false;
        try {
          const now = ctx.currentTime;
          subGain.gain.setValueAtTime(subGain.gain.value, now);
          subGain.gain.linearRampToValueAtTime(0, now + 0.6);
          midGain.gain.setValueAtTime(midGain.gain.value, now);
          midGain.gain.linearRampToValueAtTime(0, now + 0.6);
          setTimeout(() => { subOsc.stop(); midOsc.stop(); lfo.stop(); }, 700);
        } catch (_) {}
      }
    }];
    }; // end startAmbient

    if (ctx.state === 'running') {
      startAmbient();
    } else {
      // AudioContext suspended (browser autoplay policy).
      // Register a one-shot statechange listener — fires the instant
      // unlockAudio() resumes the context on the first user gesture.
      _ambientPending = true;
      const onStateChange = () => {
        if (ctx.state === 'running') {
          ctx.removeEventListener('statechange', onStateChange);
          if (_ambientPending) startAmbient();
        }
      };
      ctx.addEventListener('statechange', onStateChange);
    }
  } catch (_) { /* silent fail */ }
}

export function stopBootAmbient() {
  _ambientPending = false;
  _ambientNodes.forEach(n => n.stop());
  _ambientNodes = [];
}

// ── Hook wrapper ─────────────────────────────────────────────────────────
export function useAudio() {
  return { playClick, playHover, playScroll, playBoot, playBootAmbient, stopBootAmbient, playSuccess, setMuted, getMuted, toggleMuted, unlockAudio, startBgAmbient, stopBgAmbient, stopAllAudio };
}
