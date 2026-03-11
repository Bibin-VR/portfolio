import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!$%^&*+=<>?/|~_.:;{}[]\\';
const NAME   = 'Bibin V R';
const WORDS  = ['Robotics', 'AI', 'Web'];
const DESC   = 'Building intelligent autonomous systems at the intersection of robotics, AI, and embedded systems. Specializing in ROS/ROS2, computer vision, and LLM-powered applications.';
const BAR_L  = 'ROS: Humble · Python 3.10 · CUDA 12.1';
const BAR_R  = 'init_system';
const SEC_IDX = '00 / INTRO';
const SYS_ON  = 'SYSTEM ONLINE';
const STATUS_ITEMS = [
  { label: 'AI Systems', status: 'ONLINE' },
  { label: 'Robotics',   status: 'ACTIVE' },
  { label: 'Embedded',   status: 'READY'  },
];

/** color: transparent → accent (scrambling) → doneColor (settled) */
const sc = (state: string, real: string, doneColor: string) =>
  !state ? 'transparent' : state === real ? doneColor : '#B0C8E0';

const Hero = ({ startAnim = false }: { startAnim?: boolean }) => {
  const [displayText,  setDisplayText]  = useState('');
  const [wordStates,   setWordStates]   = useState(['', '', '']);
  const [isScrambling, setIsScrambling] = useState(true);
  const [secIdx,    setSecIdx]   = useState('');
  const [sysOnline, setSysOnline] = useState('');
  const [sLabels,   setSLabels]  = useState(['', '', '']);
  const [sValues,   setSValues]  = useState(['', '', '']);
  const [desc,  setDesc]  = useState('');
  const [barL,  setBarL]  = useState('');
  const [barR,  setBarR]  = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startAnim) return;

    const rc = () => CHARS[Math.floor(Math.random() * CHARS.length)];

    /** char-by-char scramble; spaces / · / — preserved */
    const scramble = (
      text: string,
      setter: (s: string) => void,
      delay: number,
      step = 0.5,
      tickMs = 35,
      onDone?: () => void,
    ) => {
      setTimeout(() => {
        let it = 0;
        const iv = setInterval(() => {
          setter(text.split('').map((c, i) =>
            /[\s·\-]/.test(c) ? c : i < it ? c : rc()
          ).join(''));
          if (it >= text.length) { clearInterval(iv); setter(text); onDone?.(); }
          it += step;
        }, tickMs);
      }, delay);
    };

    /** rapid full-string scramble for `dur`ms then snap */
    const blitz = (text: string, setter: (s: string) => void, delay: number, dur: number) => {
      setTimeout(() => {
        const rnd = () => text.split('').map(c => /[\s,.]/.test(c) ? c : rc()).join('');
        setter(rnd());
        const t0 = Date.now();
        const iv = setInterval(() => {
          if (Date.now() - t0 >= dur) { clearInterval(iv); setter(text); }
          else setter(rnd());
        }, 40);
      }, delay);
    };

    const scrambleWord = (idx: number, delay: number, onDone?: () => void) => {
      setTimeout(() => {
        const w = WORDS[idx];
        let it = 0;
        const iv = setInterval(() => {
          setWordStates(p => {
            const n = [...p];
            n[idx] = w.split('').map((_, i) => i < it ? w[i] : rc()).join('');
            return n;
          });
          if (it >= w.length) { clearInterval(iv); onDone?.(); }
          it += 0.5;
        }, 38);
      }, delay);
    };

    let it = 0;
    const ni = setInterval(() => {
      setDisplayText(NAME.split('').map((_, i) => i < it ? NAME[i] : rc()).join(''));
      if (it >= NAME.length) {
        clearInterval(ni);
        setDisplayText(NAME);
        scrambleWord(0, 0);
        scrambleWord(1, 210);
        scrambleWord(2, 420, () => {
          setIsScrambling(false);
          // cascade all remaining elements
          scramble(SEC_IDX,  setSecIdx,    0);
          scramble(SYS_ON,   setSysOnline, 120);
          STATUS_ITEMS.forEach(({ label }, i) =>
            scramble(label,  v => setSLabels(p => { const n=[...p]; n[i]=v; return n; }), 200 + i * 130)
          );
          STATUS_ITEMS.forEach(({ status }, i) =>
            scramble(status, v => setSValues(p => { const n=[...p]; n[i]=v; return n; }), 250 + i * 130)
          );
          blitz(DESC, setDesc, 350, 700);
          scramble(BAR_L, setBarL, 700, 1, 28);
          scramble(BAR_R, setBarR, 850, 0.5, 35);
        });
      }
      it += 0.5;
    }, 45);
    return () => clearInterval(ni);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAnim]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center overflow-hidden"
    >
      {/* Faint grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
        <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-20">

          {/* LEFT — Image */}
          <div className="flex-shrink-0 w-full max-w-[280px] sm:max-w-xs lg:max-w-sm order-1">
            <div
              className="relative w-full overflow-hidden"
              style={{ aspectRatio: '3/4', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <img
                src="/profile-hero.png"
                alt="Bibin V R"
                className="w-full h-full object-cover object-top"
                style={{ filter: 'grayscale(15%) contrast(1.05)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(9,9,9,0.5) 0%, transparent 60%)' }}
              />
              <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[rgba(176,200,224,0.4)]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[rgba(176,200,224,0.4)]" />
            </div>

            {/* Status row below image */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-1.5 h-1.5 rounded-full status-pulse bg-[#B0C8E0]" />
              <span
                className="mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: sc(sysOnline, SYS_ON, 'rgba(240,240,240,0.35)') }}
              >
                {sysOnline || SYS_ON}
              </span>
            </div>
          </div>

          {/* RIGHT — Text */}
          <div className="flex-1 flex flex-col items-start order-2 pt-2">

            {/* Section index */}
            <div className="flex items-center gap-3 mb-8">
              <span
                className="mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: sc(secIdx, SEC_IDX, 'rgba(240,240,240,0.25)') }}
              >
                {secIdx || SEC_IDX}
              </span>
              <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Name — huge */}
            <h1
              className="font-bold mb-4 leading-none"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', letterSpacing: '-0.03em' }}
            >
              <span
                className="mono block"
                style={{ color: isScrambling ? '#B0C8E0' : '#F0F0F0', transition: 'color 0.4s ease' }}
              >
                {displayText || '\u00A0'}
              </span>
            </h1>

            {/* Subtitle — per-word shuffle */}
            <p className="mono mb-8" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.06em' }}>
              {WORDS.map((word, i) => (
                <span key={word}>
                  <span style={{
                    color: wordStates[i] === word
                      ? 'rgba(240,240,240,0.45)'
                      : wordStates[i] ? '#B0C8E0' : 'transparent',
                    transition: 'color 0.35s ease',
                    display: 'inline-block',
                    minWidth: `${word.length}ch`,
                  }}>
                    {wordStates[i] || word}
                  </span>
                  {i < WORDS.length - 1 && (
                    <span style={{ color: 'rgba(240,240,240,0.2)', margin: '0 0.35em' }}>·</span>
                  )}
                </span>
              ))}
            </p>

            {/* Ruled separator */}
            <div className="w-full ig-rule mb-8" />

            {/* Description — blitz reveal */}
            <p
              className="mono text-sm leading-relaxed mb-10 max-w-lg"
              style={{
                color: !desc ? 'transparent' : desc === DESC ? 'rgba(240,240,240,0.5)' : '#B0C8E0',
                lineHeight: '1.9',
              }}
            >
              {desc || DESC}
            </p>

            {/* Status chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {STATUS_ITEMS.map(({ label, status }, i) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-1.5 mono text-[10px] tracking-[0.12em] uppercase"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span style={{ color: sc(sLabels[i], label, 'rgba(240,240,240,0.4)') }}>
                    {sLabels[i] || label}
                  </span>
                  <span style={{ color: sc(sValues[i], status, '#B0C8E0') }}>
                    {sValues[i] || status}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA — not scrambled */}
            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="ig-btn ig-btn-primary">View Projects</a>
              <a href="#contact" className="ig-btn">Get in Touch</a>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(9,9,9,0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <span
            className="mono text-[10px] tracking-[0.12em] uppercase"
            style={{ color: sc(barL, BAR_L, 'rgba(240,240,240,0.3)') }}
          >
            {barL || BAR_L}
          </span>
          <span
            className="mono text-[10px] typing-cursor"
            style={{ color: sc(barR, BAR_R, 'rgba(176,200,224,0.6)') }}
          >
            {barR || BAR_R}
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5" style={{ color: 'rgba(240,240,240,0.2)' }} />
      </div>
    </section>
  );
};

export default Hero;

