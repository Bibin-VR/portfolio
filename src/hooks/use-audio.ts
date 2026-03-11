/**
 * AudioEngine — Web Audio API synthesizer for igloo.inc-style UI feedback.
 * Provides: click beeps, hover ticks, sci-fi scroll sweeps, boot sequence tones.
 */

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume();
  }
  return _ctx;
}

// ── Click — sharp digital beep (two-layered) ──────────────────────────────
export function playClick() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // High-pitched square click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1400, t);
    osc1.frequency.exponentialRampToValueAtTime(700, t + 0.07);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc1.start(t);
    osc1.stop(t + 0.07);

    // Sub thump
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(90, t);
    gain2.gain.setValueAtTime(0.25, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    osc2.start(t);
    osc2.stop(t + 0.04);
  } catch (_) { /* silent fail */ }
}

// ── Hover — ultra-subtle tick ─────────────────────────────────────────────
export function playHover() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    osc.start(t);
    osc.stop(t + 0.025);
  } catch (_) { /* silent fail */ }
}

// ── Scroll — sci-fi radar sweep, throttled ───────────────────────────────
let _lastScrollSound = 0;

export function playScroll() {
  const now = Date.now();
  if (now - _lastScrollSound < 180) return;
  _lastScrollSound = now;

  try {
    const ctx = getCtx();
    const t = ctx.currentTime;

    // Frequency-swept sawtooth through bandpass — radar/data scan feel
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(8, t);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(3200, t + 0.13);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);

    osc.start(t);
    osc.stop(t + 0.13);

    // Secondary digital glitch blip
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(2400, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(800, t + 0.12);
    gain2.gain.setValueAtTime(0.04, t + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.12);
  } catch (_) { /* silent fail */ }
}

// ── Boot sequence tones — rising pitch ladder ────────────────────────────
const BOOT_FREQUENCIES = [220, 277, 330, 415, 523, 659, 831, 1046, 1319, 1760];

export function playBoot(step: number, totalSteps: number) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const progress = step / Math.max(totalSteps - 1, 1);
    const baseFreq = BOOT_FREQUENCIES[Math.min(step, BOOT_FREQUENCIES.length - 1)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = progress > 0.8 ? 'sine' : 'square';
    osc.frequency.setValueAtTime(baseFreq, t);
    if (progress > 0.9) {
      // Final boot — ascending chord
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, t + 0.15);
    }

    const vol = 0.06 + progress * 0.06;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

    osc.start(t);
    osc.stop(t + 0.15);
  } catch (_) { /* silent fail */ }
}

// ── Success chime — ascending triad ─────────────────────────────────────
export function playSuccess() {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.09);
      gain.gain.setValueAtTime(0.1, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.09 + 0.2);
      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.25);
    });
  } catch (_) { /* silent fail */ }
}

// ── Hook wrapper (optional convenience) ─────────────────────────────────
export function useAudio() {
  return { playClick, playHover, playScroll, playBoot, playSuccess };
}
