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

// ── Hook wrapper ─────────────────────────────────────────────────────────
export function useAudio() {
  return { playClick, playHover, playScroll, playBoot, playSuccess, setMuted, getMuted, toggleMuted };
}
