/**
 * AudioEngine — Soothing sci-fi Web Audio API synthesizer.
 * Warm sine chimes, glassy frequency sweeps, pentatonic boot sequence.
 */

let _ctx: AudioContext | null = null;
let _muted = false;

export function setMuted(v: boolean) { _muted = v; }
export function getMuted() { return _muted; }
export function toggleMuted() { _muted = !_muted; return _muted; }

function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume();
  }
  return _ctx;
}

// Unlock audio context — call on any early user signal (mousemove, keydown, etc).
// Plays a 1-frame silent buffer: the universal cross-browser unlock trick.
export function unlockAudio(): void {
  try {
    const ctx = getCtx();
    ctx.resume();
    const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch (_) {}
}

// ── Click — sci-fi metallic chime (4 inharmonic partials) ────────────────
// Ratios tuned to give crystalline interface ping, not a musical bell.
export function playClick() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    const partials = [
      { freq: 420,  vol: 0.072, decay: 0.38 },
      { freq: 1157, vol: 0.044, decay: 0.22 },
      { freq: 2270, vol: 0.026, decay: 0.13 },
      { freq: 3752, vol: 0.012, decay: 0.07 },
    ];

    partials.forEach(({ freq, vol, decay }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      // Slight rising glide on attack for the "ping" shape
      osc.frequency.setValueAtTime(freq * 0.96, t);
      osc.frequency.linearRampToValueAtTime(freq, t + 0.018);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.start(t);
      osc.stop(t + decay + 0.02);
    });
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

// ── Scroll — continuous warp-drive engine (persistent, not discrete) ──────
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
  return { playClick, playHover, playScroll, playBoot, playBootAmbient, stopBootAmbient, playSuccess, setMuted, getMuted, toggleMuted, unlockAudio };
}
