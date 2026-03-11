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

// ── Click — soft sine chime with harmonic shimmer ────────────────────────
export function playClick() {
  if (_muted) return;
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Fundamental — warm 660 Hz sine
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.value = 660;
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.08, t + 0.008);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc1.start(t);
    osc1.stop(t + 0.25);

    // Octave shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.value = 1320;
    gain2.gain.setValueAtTime(0, t + 0.005);
    gain2.gain.linearRampToValueAtTime(0.028, t + 0.012);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc2.start(t + 0.005);
    osc2.stop(t + 0.2);
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

// ── Scroll — glassy sine sweep through rising lowpass, throttled ─────────
let _lastScrollSound = 0;

export function playScroll() {
  if (_muted) return;
  const now = Date.now();
  if (now - _lastScrollSound < 200) return;
  _lastScrollSound = now;

  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Sine gliding upward through a gentle lowpass — calm, airy, spatial
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.linearRampToValueAtTime(2200, t + 0.22);
    filter.Q.value = 2.5;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.linearRampToValueAtTime(380, t + 0.22);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.042, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

    osc.start(t);
    osc.stop(t + 0.32);
  } catch (_) { /* silent fail */ }
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

export function playBootAmbient() {
  if (_muted) return;
  try {
    stopBootAmbient(); // clear any existing
    const ctx = getCtx();
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
  } catch (_) { /* silent fail */ }
}

export function stopBootAmbient() {
  _ambientNodes.forEach(n => n.stop());
  _ambientNodes = [];
}

// ── Hook wrapper ─────────────────────────────────────────────────────────
export function useAudio() {
  return { playClick, playHover, playScroll, playBoot, playBootAmbient, stopBootAmbient, playSuccess, setMuted, getMuted, toggleMuted };
}
